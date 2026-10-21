using System.Text;
using IotServer.Data;
using IotServer.Dtos.Common;
using IotServer.Mapping;
using IotServer.Middleware;
using IotServer.Mqtt;
using IotServer.Repositories.Implementations;
using IotServer.Repositories.Interfaces;
using IotServer.Services;
using IotServer.Services.Implementations;
using IotServer.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// ---- Config ----
builder.Services.Configure<MqttOptions>(builder.Configuration.GetSection("Mqtt"));
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));

// ---- Database ----
builder.Services.AddDbContext<AppDbContext>(o =>
    o.UseSqlServer(builder.Configuration.GetConnectionString("Default")));
builder.Services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<AppDbContext>());

// ---- Repositories ----
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ISensorRepository, SensorRepository>();
builder.Services.AddScoped<IDeviceRepository, DeviceRepository>();
builder.Services.AddScoped<ISensorDataRepository, SensorDataRepository>();
builder.Services.AddScoped<IActionHistoryRepository, ActionHistoryRepository>();

// ---- MQTT ----
builder.Services.AddSingleton<LatestSensorCache>();
builder.Services.AddSingleton<PendingCommandRegistry>();
builder.Services.AddSingleton<MqttMessageHandler>();
builder.Services.AddSingleton<MqttService>();
builder.Services.AddSingleton<IMqttPublisher>(sp => sp.GetRequiredService<MqttService>());
builder.Services.AddHostedService(sp => sp.GetRequiredService<MqttService>());

// ---- Services ----
builder.Services.AddSingleton<SensorMapper>();
builder.Services.AddSingleton<DeviceMapper>();
builder.Services.AddSingleton<ActionHistoryMapper>();
builder.Services.AddSingleton<ProfileMapper>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ISensorService, SensorService>();
builder.Services.AddScoped<IDeviceService, DeviceService>();
builder.Services.AddScoped<IActionHistoryService, ActionHistoryService>();
builder.Services.AddScoped<IProfileService, ProfileService>();

// ---- Web ----
builder.Services.AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.Converters.Add(new UtcDateTimeConverter()));
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddCors(o => o.AddPolicy("Frontend", p => p
    .SetIsOriginAllowed(_ => true)
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        var jwt = builder.Configuration.GetSection("Jwt").Get<JwtOptions>() ?? new JwtOptions();
        o.MapInboundClaims = false;
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwt.Issuer,
            ValidateAudience = true,
            ValidAudience = jwt.Audience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,
            NameClaimType = "name",
            RoleClaimType = "role"
        };
    });
builder.Services.AddAuthorization();

// OpenAPI + nút Authorize (Bearer) trên Swagger UI
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, context, ct) =>
    {
        document.Components ??= new OpenApiComponents();
        document.Components.SecuritySchemes = new Dictionary<string, IOpenApiSecurityScheme>
        {
            ["Bearer"] = new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                In = ParameterLocation.Header,
                BearerFormat = "JWT"
            }
        };

        if (document.Paths != null)
        {
            foreach (var operation in document.Paths.Values.SelectMany(p => p.Operations ?? []))
            {
                operation.Value.Security ??= [];
                operation.Value.Security.Add(new OpenApiSecurityRequirement
                {
                    [new OpenApiSecuritySchemeReference("Bearer", document)] = []
                });
            }
        }

        return Task.CompletedTask;
    });
});

var app = builder.Build();

// ---- Seed ----
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await DbSeeder.SeedAsync(db);
}

// ---- Pipeline (thứ tự quan trọng) ----
app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(o => o.SwaggerEndpoint("/openapi/v1.json", "IotServer v1"));
    app.MapGet("/", () => Results.Redirect("/swagger"));
}

if (!app.Environment.IsDevelopment())
    app.UseHttpsRedirection();

app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
