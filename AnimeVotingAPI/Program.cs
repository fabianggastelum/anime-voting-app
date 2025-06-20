using AnimeVotingAPI.Data;
using AnimeVotingAPI.Middleware;
using AnimeVotingAPI.Models;
using AnimeVotingAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

//Database
//Step 1: Configure PostgreSQL Connection String
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
//Step 2: Register AppDbContext with EF Core and PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options  =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

//Controllers & Swagger
builder.Services.AddControllers();
// Add CORS for React
builder.Services.AddCors(options =>
{
    // Your production-ready policy
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",
                "http://localhost:3001",
                "https://localhost:3000",
                "https://localhost:3001",
                "https://localhost:7015",  // Added your API URL
                "http://localhost:7015",   // Added HTTP version too
                "https://www.google.com", // Temporarily for testing
                "https://google.com"      // Temporarily for testing
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
            .SetPreflightMaxAge(TimeSpan.FromMinutes(5)); // Cache preflight for 5 minutes
    });
});


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "AnimeVotingAPI", Version = "v1" });

    //Add JWT Authentication support
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Enter 'Bearer' followed by a space and your JWT.\nExample: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});


//Custom Services
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddScoped<TokenService>();
builder.Services.AddHttpClient<IJikanService, JikanService>();


//JWT Config
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY")
    ?? jwtSettings["SecretKey"];

if (string.IsNullOrEmpty(secretKey))
{
    throw new InvalidOperationException("JWT Secret Key is missing. Set it in environment variables or appsettings.");
}

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
        };
    });
builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseMiddleware<AdminAuthorizationMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();
