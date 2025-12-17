using BookingService.Infrastructure.Data;
using Serilog;
using ShareLibrary.DB;
using ShareLibrary.Logs;
using ShareLibrary.MessageBroker;
using ShowTimeGrpc;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Host.UseSerilog((context, services, configuration) =>
{
    LoggingConfiguration.ConfigureShared(context.Configuration, configuration);
});

builder.Services.AddSingleton<IRabbitMqConnection>(sp =>
    new RabbitMqConnection("amqp://guest:guest@localhost:5672/"));

builder.Services.AddTransient<IMessageProducer, RabbitProducer>();

builder.Services.AddControllers();
builder.Services.AddServiceInfrastructure<BookingContext>(builder.Configuration);
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddGrpc();
builder.Services.AddGrpcClient<UserGrpc.UserService.UserServiceClient>(o =>
{
    o.Address = new Uri("https://localhost:7002");
});
builder.Services.AddGrpcClient<ShowTimeGrpc.ShowTimeService.ShowTimeServiceClient>(o =>
{
    o.Address = new Uri("https://localhost:7001");
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseSerilogRequestLogging();
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
