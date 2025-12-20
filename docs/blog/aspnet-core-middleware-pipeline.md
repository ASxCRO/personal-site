---
title: "Understanding the ASP.NET Core Middleware Pipeline"
date: 2025-01-10
description: "Deep dive into the ASP.NET Core middleware pipeline. Learn how requests flow through your application and how to build custom middleware for cross-cutting concerns."
tags: [".NET", "ASP.NET Core", "Middleware", "Architecture"]
author: "Antonio Supan"
---

# Understanding the ASP.NET Core Middleware Pipeline

The middleware pipeline is the backbone of ASP.NET Core's request processing. Every HTTP request flows through a series of middleware components, each having the opportunity to process the request and response. Understanding this pipeline is crucial for building efficient web applications.

## How the Pipeline Works

The middleware pipeline follows a Russian doll model. Each middleware:
1. Can process the incoming request
2. Can call the next middleware in the pipeline
3. Can process the outgoing response

```
Request  →  [Middleware 1]  →  [Middleware 2]  →  [Middleware 3]  →  Endpoint
Response ←  [Middleware 1]  ←  [Middleware 2]  ←  [Middleware 3]  ←  Endpoint
```

## The RequestDelegate

At its core, a middleware is just a function that takes `HttpContext` and returns a `Task`:

```csharp
public delegate Task RequestDelegate(HttpContext context);
```

Each middleware receives a `RequestDelegate` representing the next middleware in the pipeline.

## Building Custom Middleware

### Inline Middleware

The simplest way to add middleware is inline using `Use`:

```csharp
app.Use(async (context, next) =>
{
    // Before the next middleware
    var stopwatch = Stopwatch.StartNew();

    await next(context); // Call the next middleware

    // After the next middleware
    stopwatch.Stop();
    context.Response.Headers["X-Response-Time"] = $"{stopwatch.ElapsedMilliseconds}ms";
});
```

### Class-Based Middleware

For reusable middleware, create a class:

```csharp
public class RequestTimingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestTimingMiddleware> _logger;

    public RequestTimingMiddleware(
        RequestDelegate next,
        ILogger<RequestTimingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();

        try
        {
            await _next(context);
        }
        finally
        {
            stopwatch.Stop();
            _logger.LogInformation(
                "Request {Method} {Path} completed in {ElapsedMs}ms",
                context.Request.Method,
                context.Request.Path,
                stopwatch.ElapsedMilliseconds);
        }
    }
}

// Extension method for clean registration
public static class RequestTimingMiddlewareExtensions
{
    public static IApplicationBuilder UseRequestTiming(
        this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<RequestTimingMiddleware>();
    }
}
```

## Middleware Order Matters

The order in which you register middleware is critical. Here's a typical order:

```csharp
var app = builder.Build();

// 1. Exception handling (first to catch all errors)
app.UseExceptionHandler("/error");

// 2. HTTPS redirection
app.UseHttpsRedirection();

// 3. Static files (short-circuit for static content)
app.UseStaticFiles();

// 4. Routing
app.UseRouting();

// 5. CORS (after routing, before authentication)
app.UseCors();

// 6. Authentication (who are you?)
app.UseAuthentication();

// 7. Authorization (what can you do?)
app.UseAuthorization();

// 8. Custom middleware
app.UseRequestTiming();

// 9. Endpoints
app.MapControllers();
```

## Short-Circuiting the Pipeline

Middleware can short-circuit the pipeline by not calling `next`:

```csharp
public class MaintenanceModeMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfiguration _config;

    public MaintenanceModeMiddleware(RequestDelegate next, IConfiguration config)
    {
        _next = next;
        _config = config;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (_config.GetValue<bool>("MaintenanceMode"))
        {
            context.Response.StatusCode = 503;
            await context.Response.WriteAsJsonAsync(new
            {
                Message = "Service is under maintenance",
                RetryAfter = "3600"
            });
            return; // Don't call next - short circuit!
        }

        await _next(context);
    }
}
```

## Branching the Pipeline

Use `Map` and `MapWhen` to create pipeline branches:

```csharp
// Branch based on path
app.Map("/api", apiApp =>
{
    apiApp.UseAuthentication();
    apiApp.UseAuthorization();
    apiApp.UseRateLimiting();
});

// Branch based on condition
app.MapWhen(
    context => context.Request.Headers.ContainsKey("X-Custom-Header"),
    customApp =>
    {
        customApp.UseCustomProcessor();
    });
```

## Real-World Middleware Examples

### Global Exception Handler

```csharp
public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(
        RequestDelegate next,
        ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception occurred");

            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/json";

            var response = new
            {
                Error = "An error occurred",
                TraceId = Activity.Current?.Id ?? context.TraceIdentifier
            };

            await context.Response.WriteAsJsonAsync(response);
        }
    }
}
```

### Request/Response Logging

```csharp
public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(
        RequestDelegate next,
        ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Log request
        _logger.LogInformation(
            "HTTP {Method} {Path} started",
            context.Request.Method,
            context.Request.Path);

        var originalBodyStream = context.Response.Body;
        using var responseBody = new MemoryStream();
        context.Response.Body = responseBody;

        await _next(context);

        // Log response
        _logger.LogInformation(
            "HTTP {Method} {Path} completed with {StatusCode}",
            context.Request.Method,
            context.Request.Path,
            context.Response.StatusCode);

        await responseBody.CopyToAsync(originalBodyStream);
    }
}
```

### Correlation ID Middleware

```csharp
public class CorrelationIdMiddleware
{
    private readonly RequestDelegate _next;
    private const string CorrelationIdHeader = "X-Correlation-ID";

    public CorrelationIdMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var correlationId = context.Request.Headers[CorrelationIdHeader].FirstOrDefault()
            ?? Guid.NewGuid().ToString();

        context.Items["CorrelationId"] = correlationId;
        context.Response.Headers[CorrelationIdHeader] = correlationId;

        using (_logger.BeginScope(new Dictionary<string, object>
        {
            ["CorrelationId"] = correlationId
        }))
        {
            await _next(context);
        }
    }
}
```

## Performance Considerations

1. **Order matters for performance** - Put fast, short-circuiting middleware early
2. **Avoid allocations** - Reuse objects where possible
3. **Use async properly** - Don't block with `.Result` or `.Wait()`
4. **Consider pooling** - Use `ObjectPool<T>` for expensive objects

## Conclusion

The middleware pipeline is a powerful abstraction that makes ASP.NET Core flexible and extensible. By understanding how requests flow through the pipeline and how to create custom middleware, you can implement cross-cutting concerns cleanly and efficiently.

Remember: the order of middleware registration determines the order of execution. Plan your pipeline carefully, and always consider both the request and response phases when designing middleware.
