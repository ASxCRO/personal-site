---
title: "Dependency Injection in .NET: A Deep Dive"
date: 2025-01-15
description: "Master the built-in dependency injection container in .NET. Learn about service lifetimes, advanced patterns, and best practices for building maintainable applications."
tags: [".NET", "Dependency Injection", "Architecture", "Best Practices"]
author: "Antonio Supan"
---

# Dependency Injection in .NET: A Deep Dive

Dependency Injection (DI) is a fundamental pattern in modern .NET development. While the basics are straightforward, mastering DI requires understanding its nuances, pitfalls, and advanced patterns. This article explores the built-in DI container in depth.

## Understanding Service Lifetimes

The .NET DI container supports three service lifetimes, and choosing the right one is crucial for application correctness and performance.

### Transient Services

Transient services are created each time they're requested. Use them for lightweight, stateless services.

```csharp
services.AddTransient<IEmailSender, SmtpEmailSender>();
```

**When to use:**
- Stateless services
- Services that don't hold expensive resources
- Services where each consumer needs a fresh instance

### Scoped Services

Scoped services are created once per scope. In ASP.NET Core, a scope corresponds to an HTTP request.

```csharp
services.AddScoped<IUserContext, HttpUserContext>();
services.AddScoped<IUnitOfWork, EfUnitOfWork>();
```

**When to use:**
- Database contexts (Entity Framework DbContext)
- Services that should share state within a request
- Unit of Work pattern implementations

### Singleton Services

Singleton services are created once and reused for the application's lifetime.

```csharp
services.AddSingleton<ICacheService, MemoryCacheService>();
services.AddSingleton<IConfiguration>(Configuration);
```

**When to use:**
- Caching services
- Configuration objects
- Thread-safe stateless services

## The Captive Dependency Problem

One of the most common DI mistakes is the captive dependency problem. This occurs when a longer-lived service captures a shorter-lived dependency.

```csharp
// WRONG: Singleton capturing a Scoped service
public class MySingleton
{
    private readonly IDbContext _dbContext; // Scoped!

    public MySingleton(IDbContext dbContext)
    {
        _dbContext = dbContext; // This will cause issues!
    }
}
```

This leads to:
- Disposed DbContext being reused
- Memory leaks
- Thread safety issues

### Solution: Use IServiceScopeFactory

```csharp
public class MySingleton
{
    private readonly IServiceScopeFactory _scopeFactory;

    public MySingleton(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public async Task DoWorkAsync()
    {
        using var scope = _scopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<IDbContext>();
        // Use dbContext safely
    }
}
```

## Keyed Services in .NET 8

.NET 8 introduced keyed services, allowing multiple implementations of the same interface with different keys.

```csharp
// Registration
services.AddKeyedSingleton<INotificationService, EmailNotificationService>("email");
services.AddKeyedSingleton<INotificationService, SmsNotificationService>("sms");
services.AddKeyedSingleton<INotificationService, PushNotificationService>("push");

// Injection
public class OrderService
{
    public OrderService(
        [FromKeyedServices("email")] INotificationService emailService,
        [FromKeyedServices("sms")] INotificationService smsService)
    {
        // Use specific implementations
    }
}
```

## Factory Pattern with DI

Sometimes you need to create services dynamically or with runtime parameters. Use factory delegates.

```csharp
services.AddTransient<Func<string, IPaymentProcessor>>(sp => key =>
{
    return key switch
    {
        "stripe" => sp.GetRequiredService<StripeProcessor>(),
        "paypal" => sp.GetRequiredService<PayPalProcessor>(),
        _ => throw new ArgumentException($"Unknown payment processor: {key}")
    };
});
```

## Decorator Pattern

Decorators add behavior to existing services. While .NET DI doesn't support this natively, you can implement it manually.

```csharp
// Register the base service
services.AddScoped<IOrderRepository, SqlOrderRepository>();

// Decorate it
services.Decorate<IOrderRepository, CachingOrderRepository>();
services.Decorate<IOrderRepository, LoggingOrderRepository>();
```

For the `Decorate` method, you can use Scrutor or implement it yourself:

```csharp
public static IServiceCollection Decorate<TInterface, TDecorator>(
    this IServiceCollection services)
    where TDecorator : TInterface
{
    var descriptor = services.FirstOrDefault(s => s.ServiceType == typeof(TInterface));
    if (descriptor == null) throw new InvalidOperationException();

    services.Remove(descriptor);

    services.Add(new ServiceDescriptor(
        typeof(TInterface),
        sp =>
        {
            var inner = (TInterface)ActivatorUtilities.CreateInstance(
                sp,
                descriptor.ImplementationType!);
            return ActivatorUtilities.CreateInstance<TDecorator>(sp, inner);
        },
        descriptor.Lifetime));

    return services;
}
```

## Validation at Startup

.NET 8 added built-in validation to catch DI configuration errors early.

```csharp
var builder = WebApplication.CreateBuilder(args);

// Enable validation
builder.Host.UseDefaultServiceProvider(options =>
{
    options.ValidateScopes = true;
    options.ValidateOnBuild = true;
});
```

This catches:
- Missing service registrations
- Captive dependencies
- Scope validation issues

## Best Practices

1. **Prefer constructor injection** - It makes dependencies explicit and testable.

2. **Avoid service locator pattern** - Don't inject `IServiceProvider` directly unless necessary.

3. **Keep constructors simple** - Don't do work in constructors; just assign dependencies.

4. **Use interfaces for testability** - Register interfaces, not concrete types.

5. **Validate on build** - Enable validation in development to catch errors early.

6. **Consider lifetime carefully** - Match the lifetime to the service's actual requirements.

## Conclusion

Mastering dependency injection is essential for building maintainable .NET applications. Understanding service lifetimes, avoiding common pitfalls like captive dependencies, and leveraging advanced patterns like decorators will help you write cleaner, more testable code.

The built-in DI container in .NET is surprisingly capable for most scenarios. Before reaching for third-party containers like Autofac or Ninject, make sure you've explored all the features the built-in container offers.
