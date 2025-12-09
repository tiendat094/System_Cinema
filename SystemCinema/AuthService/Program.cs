using AuthService.Infrastructure.Data;
using AuthService.Manager;
using AuthService.Model;
using Microsoft.AspNetCore.Identity;
using Serilog;
using ShareLibrary.DB;
using ShareLibrary.Logs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Host.UseSerilog((context, services, configuration) =>
{
    LoggingConfiguration.ConfigureShared(context.Configuration, configuration);
});

builder.Services.AddSingleton<IRsaKeyService, RsaKeyService>();
builder.Services.AddTransient<IAuthManager, AuthManager>();
builder.Services.AddTransient<IPasswordHasher<AuthUser>, PasswordHasher<AuthUser>>();
builder.Services.AddServiceInfrastructure<AuthContext>(builder.Configuration);
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
