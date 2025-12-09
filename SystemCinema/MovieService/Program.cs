using Microsoft.Extensions.DependencyInjection;
using MovieService.Infrastructure.Data;
using MovieService.Manager.Cinemas;
using MovieService.Manager.Genres;
using MovieService.Manager.Movies;
using MovieService.Manager.Rooms;
using MovieService.Manager.Seats;
using MovieService.Manager.ShowTimes;
using Serilog;
using ShareLibrary.Core.Mapper;
using ShareLibrary.DB;
using ShareLibrary.Logs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Host.UseSerilog((context, services, configuration) =>
{
    LoggingConfiguration.ConfigureShared(context.Configuration, configuration);
});
builder.Services.AddControllers();
builder.Services.AddServiceInfrastructure<MovieContext>(builder.Configuration);
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddShareModuleMappings();
builder.Services.AddAutoMapper(typeof(Program).Assembly);
builder.Services.AddTransient<IMovieManager, MovieManager>();
builder.Services.AddTransient<ICinemaManager, CinemaManager>();
builder.Services.AddTransient<IRoomManager, RoomManager>();
builder.Services.AddTransient<ISeatManager, SeatManager>();
builder.Services.AddTransient<IShowTimeManager, ShowTimeManager>();
builder.Services.AddTransient<IGenreManager, GenreManager>();
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
