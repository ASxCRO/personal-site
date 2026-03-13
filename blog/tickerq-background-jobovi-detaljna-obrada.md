---
title: "TickerQ za Background Jobove u .NET-u: Detaljna Obrada s Primjerima"
date: 2026-03-13
description: "Detaljan praktični vodič kroz TickerQ za background jobove u .NET-u: TimeTicker, CronTicker, retries, chaining, EF persistence i dashboard."
tags: [".NET", "TickerQ", "Background Jobs", "Scheduling", "Architecture"]
author: "Antonio Supan"
---

# TickerQ za Background Jobove u .NET-u: Detaljna Obrada s Primjerima

TickerQ je moderni scheduler za .NET koji rješava klasične background scenarije: delayed execution, periodičke (cron) jobove, retry logiku i orkestraciju više koraka.

U ovom postu prolazimo kroz praktičan setup i produkcijske patterne koje možeš odmah koristiti.

## Zašto TickerQ

Najvažnije karakteristike:

- Reflection-free execution (source generator pristup)
- `TimeTicker` za jednokratne/delayed jobove
- `CronTicker` za periodičke jobove (6-part cron sa sekundama)
- Retry i status lifecycle out-of-the-box
- Parent-child chaining za workflowe
- EF Core persistence i dashboard za observability

## 1. Instalacija i verzioniranje

TickerQ major verzija prati .NET major:

- `TickerQ 8.x` za .NET 8
- `TickerQ 9.x` za .NET 9
- `TickerQ 10.x` za .NET 10

Uvijek drži sve TickerQ pakete na istom major/minor levelu (`TickerQ`, `TickerQ.EntityFrameworkCore`, `TickerQ.Dashboard`, itd.).

```bash
dotnet add package TickerQ --version 10.*
dotnet add package TickerQ.EntityFrameworkCore --version 10.*
dotnet add package TickerQ.Dashboard --version 10.*
```

## 2. Osnovna konfiguracija (`Program.cs`)

Minimalni setup je doslovno `AddTickerQ()` + `UseTickerQ()`, ali za realni projekt ima smisla odmah definirati scheduler opcije.

```csharp
using TickerQ.DependencyInjection;
using TickerQ.Dashboard.DependencyInjection;
using TickerQ.EntityFrameworkCore.DependencyInjection;
using TickerQ.EntityFrameworkCore.DbContextFactory;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddTickerQ(options =>
{
    options.ConfigureScheduler(scheduler =>
    {
        scheduler.MaxConcurrency = 8;
        scheduler.NodeIdentifier = $"api-node-{Environment.MachineName}";
        scheduler.IdleWorkerTimeOut = TimeSpan.FromMinutes(1);
        scheduler.FallbackIntervalChecker = TimeSpan.FromSeconds(30);
        scheduler.SchedulerTimeZone = TimeZoneInfo.Utc;
    });

    options.AddOperationalStore(efOptions =>
    {
        efOptions.UseTickerQDbContext<TickerQDbContext>(db =>
        {
            db.UseNpgsql(builder.Configuration.GetConnectionString("TickerQ"));
        });

        efOptions.SetDbContextPoolSize(34);
    });

    options.AddDashboard(dashboard =>
    {
        dashboard.SetBasePath("/tickerq/dashboard");
        dashboard.WithHostAuthentication();
    });
});

var app = builder.Build();
app.UseTickerQ();
app.Run();
```

## 3. Definiranje job funkcija

Funkcija se registrira atributom `[TickerFunction("ImeFunkcije")]`.

```csharp
using TickerQ.Utilities.Base;

public class EmailJobs
{
    private readonly ILogger<EmailJobs> _logger;

    public EmailJobs(ILogger<EmailJobs> logger)
    {
        _logger = logger;
    }

    [TickerFunction("SendWelcomeEmail")]
    public async Task SendWelcomeEmail(
        TickerFunctionContext<WelcomeEmailRequest> context,
        CancellationToken cancellationToken)
    {
        var request = context.Request;

        _logger.LogInformation("Sending welcome email to {Email}, JobId: {JobId}",
            request.Email, context.Id);

        await Task.Delay(200, cancellationToken);
    }
}

public sealed class WelcomeEmailRequest
{
    public string Email { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
}
```

## 4. Primjer: jednokratni (TimeTicker) job

Ovo je tipičan delayed workflow, npr. "poslati welcome email 5 minuta nakon registracije".

```csharp
using TickerQ.Utilities.Entities;
using TickerQ.Utilities.Helpers;
using TickerQ.Utilities.Interfaces.Managers;

public class UserOnboardingService
{
    private readonly ITimeTickerManager<TimeTickerEntity> _timeTickerManager;

    public UserOnboardingService(ITimeTickerManager<TimeTickerEntity> timeTickerManager)
    {
        _timeTickerManager = timeTickerManager;
    }

    public async Task QueueWelcomeEmailAsync(Guid userId, string email, string name)
    {
        var result = await _timeTickerManager.AddAsync(new TimeTickerEntity
        {
            Function = "SendWelcomeEmail",
            ExecutionTime = DateTime.UtcNow.AddMinutes(5),
            Request = TickerHelper.CreateTickerRequest(new WelcomeEmailRequest
            {
                Email = email,
                Name = name
            }),
            Retries = 3,
            RetryIntervals = new[] { 30, 120, 300 },
            Description = $"Welcome email for user {userId}"
        });

        if (!result.IsSucceeded)
        {
            throw result.Exception ?? new InvalidOperationException("TickerQ AddAsync failed");
        }
    }
}
```

## 5. Primjer: periodički (CronTicker) job

Cron u TickerQ koristi **6-part format** (sekunde su obavezne).

```csharp
using TickerQ.Utilities.Entities;
using TickerQ.Utilities.Interfaces.Managers;

public class ReportingScheduler
{
    private readonly ICronTickerManager<CronTickerEntity> _cronTickerManager;

    public ReportingScheduler(ICronTickerManager<CronTickerEntity> cronTickerManager)
    {
        _cronTickerManager = cronTickerManager;
    }

    public async Task ScheduleDailyReportAsync()
    {
        var result = await _cronTickerManager.AddAsync(new CronTickerEntity
        {
            Function = "GenerateDailyReport",
            Expression = "0 0 9 * * *", // Svaki dan u 09:00:00
            Retries = 2,
            RetryIntervals = new[] { 300, 900 },
            Description = "Daily report job"
        });

        if (!result.IsSucceeded)
        {
            throw result.Exception ?? new InvalidOperationException("Cron AddAsync failed");
        }
    }
}
```

Alternativa je cron direktno na atributu:

```csharp
[TickerFunction("GenerateDailyReport", cronExpression: "0 0 9 * * *")]
public async Task GenerateDailyReport(
    TickerFunctionContext context,
    CancellationToken cancellationToken)
{
    await Task.CompletedTask;
}
```

## 6. Retry i error-handling pattern

Praktičan pattern je: domenski neispravan input ne retryaš, transijentne error-e retryaš (`throw`).

```csharp
[TickerFunction("ProcessPayment")]
public async Task ProcessPayment(
    TickerFunctionContext<PaymentRequest> context,
    CancellationToken cancellationToken)
{
    try
    {
        await _paymentService.ProcessAsync(context.Request, cancellationToken);
    }
    catch (InvalidOperationException ex)
    {
        _logger.LogWarning(ex, "Business validation failed for order {OrderId}", context.Request.OrderId);
        return; // završi bez retrya
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Transient failure, retry count: {RetryCount}", context.RetryCount);
        throw; // TickerQ će odraditi retry po RetryIntervals
    }
}
```

## 7. Workflow orchestration (chaining)

`TimeTicker` podržava parent-child chain i `RunCondition` (npr. `OnSuccess`, `OnFailure`, `InProgress`).

```csharp
using TickerQ.Utilities.Entities;
using TickerQ.Utilities.Enums;

public async Task CreateOrderWorkflowAsync(OrderRequest request)
{
    var parent = new TimeTickerEntity
    {
        Function = "ValidateOrder",
        ExecutionTime = DateTime.UtcNow,
    };

    parent.Children.Add(new TimeTickerEntity
    {
        Function = "ProcessPayment",
        ParentId = parent.Id,
        RunCondition = RunCondition.OnSuccess
    });

    parent.Children.Add(new TimeTickerEntity
    {
        Function = "NotifyOps",
        ParentId = parent.Id,
        RunCondition = RunCondition.OnFailure
    });

    await _timeTickerManager.AddAsync(parent);
}
```

Za kompleksnije grafove koristi `FluentChainTickerBuilder<TimeTickerEntity>`.

## 8. Timezone i produkcijski detalji

Najčešće greške u produkciji:

- Nije pozvan `app.UseTickerQ()`
- Mismatch imena funkcije između `[TickerFunction("X")]` i `Function = "X"`
- Cron je u 5-part formatu umjesto 6-part
- Nedefiniran timezone (onda dobiješ neočekivana pokretanja tijekom DST promjena)

Preporuka:

- Drži `SchedulerTimeZone = TimeZoneInfo.Utc`
- Postavi smislen `NodeIdentifier` u multi-node okruženju
- Koristi dashboard i logove za status lifecycle (`Idle -> Queued -> InProgress -> Done/Failed/...`)
- Uvedi redovni cleanup starih `TimeTicker` i `CronTickerOccurrence` zapisa

## 9. Kada koristiti TimeTicker, a kada CronTicker

- `TimeTicker`: delayed one-off akcije (email nakon registracije, timeout cleanup, deferred processing)
- `CronTicker`: periodični batch/procesi (sync, maintenance, reports)

Ako imaš više ovisnih koraka, idi na `TimeTicker` chain umjesto monolitnog "mega joba".

## Zaključak

TickerQ je jak izbor kad želiš scheduler koji je blizak modernom .NET stacku: type-safe API, EF persistence, dashboard i dobar workflow model za business procese.

Ako tek uvodiš background jobove, kreni s minimalnim setupom (`AddTickerQ` + `UseTickerQ`) i jednim `TimeTicker` scenarijem, pa postupno uvedi cron, retry strategije i chaining.
