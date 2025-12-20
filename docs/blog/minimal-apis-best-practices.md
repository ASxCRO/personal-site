---
title: "Minimal APIs in .NET: Best Practices and Patterns"
date: 2025-01-05
description: "Learn how to build production-ready APIs using .NET Minimal APIs. Explore organization patterns, validation, error handling, and advanced features."
tags: [".NET", "Minimal APIs", "REST", "Best Practices"]
author: "Antonio Supan"
---

# Minimal APIs in .NET: Best Practices and Patterns

Minimal APIs, introduced in .NET 6 and enhanced in subsequent versions, offer a lightweight approach to building HTTP APIs. While they start simple, production applications need structure. This guide covers patterns and practices for building maintainable Minimal APIs.

## Why Minimal APIs?

Minimal APIs provide:
- Less ceremony than MVC controllers
- Faster startup time
- Native AOT support
- Great for microservices and simple APIs

## Basic Structure

A simple Minimal API looks like this:

```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Hello World!");

app.Run();
```

But real applications need more structure.

## Organizing Endpoints

### The Problem with a Giant Program.cs

As your API grows, keeping everything in `Program.cs` becomes unmanageable. Here are patterns to organize your code.

### Pattern 1: Extension Methods

Create extension methods for endpoint groups:

```csharp
// Endpoints/ProductEndpoints.cs
public static class ProductEndpoints
{
    public static IEndpointRouteBuilder MapProductEndpoints(
        this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/products")
            .WithTags("Products");

        group.MapGet("/", GetAllProducts);
        group.MapGet("/{id:int}", GetProductById);
        group.MapPost("/", CreateProduct);
        group.MapPut("/{id:int}", UpdateProduct);
        group.MapDelete("/{id:int}", DeleteProduct);

        return app;
    }

    private static async Task<IResult> GetAllProducts(
        IProductRepository repository,
        CancellationToken ct)
    {
        var products = await repository.GetAllAsync(ct);
        return Results.Ok(products);
    }

    private static async Task<IResult> GetProductById(
        int id,
        IProductRepository repository,
        CancellationToken ct)
    {
        var product = await repository.GetByIdAsync(id, ct);
        return product is null
            ? Results.NotFound()
            : Results.Ok(product);
    }

    // ... other handlers
}

// Program.cs
app.MapProductEndpoints();
app.MapOrderEndpoints();
app.MapCustomerEndpoints();
```

### Pattern 2: Carter-Style Modules

Create endpoint modules using an interface:

```csharp
public interface IEndpointModule
{
    void MapEndpoints(IEndpointRouteBuilder app);
}

public class ProductModule : IEndpointModule
{
    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/products", GetProducts);
        app.MapPost("/api/products", CreateProduct);
    }

    private static async Task<IResult> GetProducts(
        IProductService service) => Results.Ok(await service.GetAllAsync());

    private static async Task<IResult> CreateProduct(
        CreateProductRequest request,
        IProductService service)
    {
        var product = await service.CreateAsync(request);
        return Results.Created($"/api/products/{product.Id}", product);
    }
}

// Auto-register all modules
public static class EndpointExtensions
{
    public static IEndpointRouteBuilder MapEndpointModules(
        this IEndpointRouteBuilder app)
    {
        var moduleType = typeof(IEndpointModule);
        var modules = AppDomain.CurrentDomain.GetAssemblies()
            .SelectMany(a => a.GetTypes())
            .Where(t => moduleType.IsAssignableFrom(t) && !t.IsInterface);

        foreach (var module in modules)
        {
            var instance = Activator.CreateInstance(module) as IEndpointModule;
            instance?.MapEndpoints(app);
        }

        return app;
    }
}
```

## Validation with FluentValidation

Add robust validation using FluentValidation:

```csharp
// Install FluentValidation.DependencyInjectionExtensions

public class CreateProductRequest
{
    public string Name { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public string Category { get; init; } = string.Empty;
}

public class CreateProductValidator : AbstractValidator<CreateProductRequest>
{
    public CreateProductValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.Price)
            .GreaterThan(0)
            .LessThan(1_000_000);

        RuleFor(x => x.Category)
            .NotEmpty()
            .MaximumLength(50);
    }
}

// Validation filter
public class ValidationFilter<T> : IEndpointFilter where T : class
{
    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context,
        EndpointFilterDelegate next)
    {
        var validator = context.HttpContext
            .RequestServices.GetService<IValidator<T>>();

        if (validator is null)
            return await next(context);

        var entity = context.Arguments.OfType<T>().FirstOrDefault();

        if (entity is null)
            return Results.BadRequest("Invalid request body");

        var validation = await validator.ValidateAsync(entity);

        if (!validation.IsValid)
        {
            return Results.ValidationProblem(
                validation.ToDictionary());
        }

        return await next(context);
    }
}

// Usage
app.MapPost("/api/products", CreateProduct)
    .AddEndpointFilter<ValidationFilter<CreateProductRequest>>();
```

## Error Handling with Problem Details

Implement consistent error responses:

```csharp
public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext context,
        Exception exception,
        CancellationToken ct)
    {
        _logger.LogError(exception, "Exception occurred: {Message}",
            exception.Message);

        var problemDetails = exception switch
        {
            ValidationException validationEx => new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Validation Error",
                Detail = validationEx.Message,
                Extensions = { ["errors"] = validationEx.Errors }
            },
            NotFoundException notFoundEx => new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Not Found",
                Detail = notFoundEx.Message
            },
            _ => new ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Title = "Server Error",
                Detail = "An unexpected error occurred"
            }
        };

        context.Response.StatusCode = problemDetails.Status!.Value;
        await context.Response.WriteAsJsonAsync(problemDetails, ct);

        return true;
    }
}

// Register in Program.cs
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

app.UseExceptionHandler();
```

## Authentication and Authorization

Secure your endpoints:

```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireRole("Admin"));
});

// Apply to endpoints
app.MapGet("/api/admin/users", GetUsers)
    .RequireAuthorization("AdminOnly");

app.MapGet("/api/products", GetProducts)
    .AllowAnonymous();

app.MapPost("/api/products", CreateProduct)
    .RequireAuthorization();
```

## OpenAPI/Swagger Documentation

Document your API properly:

```csharp
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Products API",
        Version = "v1",
        Description = "API for managing products"
    });
});

// Enhanced endpoint documentation
app.MapGet("/api/products/{id}", GetProductById)
    .WithName("GetProduct")
    .WithSummary("Gets a product by ID")
    .WithDescription("Returns a single product based on the provided ID")
    .Produces<ProductResponse>(200)
    .Produces(404)
    .WithOpenApi();
```

## Typed Results in .NET 7+

Use `TypedResults` for better type safety:

```csharp
app.MapGet("/api/products/{id}", async Task<Results<Ok<Product>, NotFound>> (
    int id,
    IProductRepository repository,
    CancellationToken ct) =>
{
    var product = await repository.GetByIdAsync(id, ct);

    return product is null
        ? TypedResults.NotFound()
        : TypedResults.Ok(product);
});
```

## Rate Limiting

Protect your API from abuse:

```csharp
builder.Services.AddRateLimiter(options =>
{
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(
        context =>
        {
            return RateLimitPartition.GetFixedWindowLimiter(
                context.User.Identity?.Name ?? context.Request.Headers.Host.ToString(),
                partition => new FixedWindowRateLimiterOptions
                {
                    AutoReplenishment = true,
                    PermitLimit = 100,
                    Window = TimeSpan.FromMinutes(1)
                });
        });

    options.AddPolicy("api", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10,
                Window = TimeSpan.FromSeconds(10)
            }));
});

app.UseRateLimiter();

app.MapGet("/api/products", GetProducts)
    .RequireRateLimiting("api");
```

## Best Practices Summary

1. **Organize endpoints** into logical modules or extension methods
2. **Validate input** using FluentValidation or similar libraries
3. **Use TypedResults** for compile-time result type checking
4. **Implement proper error handling** with ProblemDetails
5. **Document with OpenAPI** for better developer experience
6. **Apply rate limiting** to protect against abuse
7. **Use endpoint filters** for cross-cutting concerns
8. **Leverage endpoint groups** for shared configuration

## Conclusion

Minimal APIs are production-ready when properly structured. By applying these patterns, you can build maintainable, well-documented, and secure APIs. Start simple, and add structure as your application grows.

The key is finding the right balance between the simplicity that makes Minimal APIs attractive and the organization that production code requires.
