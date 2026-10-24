using ClassTrack.API.Data;
using ClassTrack.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey) || Encoding.UTF8.GetByteCount(jwtKey) < 32)
{
    throw new InvalidOperationException("Configure Jwt:Key with at least 32 bytes in application settings.");
}

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("Configure ConnectionStrings:DefaultConnection in application settings.");
}

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
if (builder.Environment.IsDevelopment() && allowedOrigins.Length == 0)
{
    allowedOrigins = ["http://localhost:4200"];
}

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        if (allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins);
        }

        policy.AllowAnyHeader().AllowAnyMethod();
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)
            )
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter: Bearer {your JWT token}"
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddDbContext<ClassTrackDbContext>(options =>
    options.UseSqlServer(connectionString));

var app = builder.Build();

if (builder.Configuration.GetValue<bool>("Database:ApplyMigrations"))
{
    await using var scope = app.Services.CreateAsyncScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<ClassTrackDbContext>();
    await dbContext.Database.MigrateAsync();
}

var bootstrapUsername = builder.Configuration["BootstrapAdmin:Username"];
var bootstrapPassword = builder.Configuration["BootstrapAdmin:Password"];
if (string.IsNullOrWhiteSpace(bootstrapUsername) != string.IsNullOrWhiteSpace(bootstrapPassword))
{
    throw new InvalidOperationException(
        "Configure both BootstrapAdmin:Username and BootstrapAdmin:Password, or remove both.");
}

if (!string.IsNullOrWhiteSpace(bootstrapUsername) &&
    !string.IsNullOrWhiteSpace(bootstrapPassword))
{
    await using var scope = app.Services.CreateAsyncScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<ClassTrackDbContext>();
    if (!await dbContext.Users.AnyAsync())
    {
        var admin = new User
        {
            Username = bootstrapUsername,
            Role = "Admin"
        };
        admin.PasswordHash = new PasswordHasher<User>()
            .HashPassword(admin, bootstrapPassword);
        dbContext.Users.Add(admin);
        await dbContext.SaveChangesAsync();
    }
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors("AllowAngular");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/api/_deployment/database-check", async (
    HttpContext context,
    IConfiguration configuration,
    ClassTrackDbContext dbContext) =>
{
    var expectedToken = configuration["DeploymentDiagnostics:Token"];
    var providedToken = context.Request.Headers["X-Deployment-Diagnostic-Token"].ToString();
    if (string.IsNullOrEmpty(expectedToken) ||
        !CryptographicOperations.FixedTimeEquals(
            Encoding.UTF8.GetBytes(expectedToken),
            Encoding.UTF8.GetBytes(providedToken)))
    {
        return Results.NotFound();
    }

    try
    {
        await dbContext.Database.OpenConnectionAsync();
        await using var command = dbContext.Database.GetDbConnection().CreateCommand();
        command.CommandText = """
            SELECT
                CONVERT(bit, CASE WHEN OBJECT_ID(N'dbo.Users', N'U') IS NOT NULL THEN 1 ELSE 0 END),
                CONVERT(bit, CASE WHEN OBJECT_ID(N'dbo.__EFMigrationsHistory', N'U') IS NOT NULL THEN 1 ELSE 0 END)
            """;
        await using var reader = await command.ExecuteReaderAsync();
        await reader.ReadAsync();

        return Results.Ok(new
        {
            databaseConnected = true,
            usersTableExists = reader.GetBoolean(0),
            migrationHistoryExists = reader.GetBoolean(1)
        });
    }
    catch (Microsoft.Data.SqlClient.SqlException exception)
    {
        return Results.Json(
            new { databaseConnected = false, sqlErrorNumber = exception.Number },
            statusCode: StatusCodes.Status503ServiceUnavailable);
    }
});

app.MapFallback(async context =>
{
    if (!HttpMethods.IsGet(context.Request.Method) ||
        context.Request.Path.StartsWithSegments("/api"))
    {
        context.Response.StatusCode = StatusCodes.Status404NotFound;
        return;
    }

    var indexPath = Path.Combine(app.Environment.WebRootPath ?? "wwwroot", "index.html");
    if (!File.Exists(indexPath))
    {
        context.Response.StatusCode = StatusCodes.Status404NotFound;
        return;
    }

    context.Response.ContentType = "text/html";
    await context.Response.SendFileAsync(indexPath);
});


app.Run();