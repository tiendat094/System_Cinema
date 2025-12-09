using Gateway.Helper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = "http://localhost:7002",

            ValidateAudience = true,
            ValidAudience = "http://localhost:7002",

            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,


            IssuerSigningKeyResolver = (token, securityToken, kid, parameters) =>
            {
                return JwksRetriever.GetSigningKeys("https://localhost:7002/.well-known/jwks.json", kid);
            }
        };
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "MyAllowSpecificOrigins",
        policy =>
        {
            // Cho phép domain của client (hoặc React/Vue app)
            policy.WithOrigins("http://localhost:3000")
                  // Hoặc dùng .AllowAnyOrigin() để cho phép tất cả (chỉ nên dùng khi dev)
                  //.AllowAnyOrigin() 
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials(); // Nếu bạn sử dụng cookies/credentials
        });
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);
builder.Services.AddOcelot();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();
app.UseCors("MyAllowSpecificOrigins");
app.MapControllers();
app.UseOcelot().Wait();
app.Run();
