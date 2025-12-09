using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Serilog;
namespace ShareLibrary.Logs
{
    public static class LoggingConfiguration
    {
        public static void ConfigureShared(
            IConfiguration configuration,
            LoggerConfiguration loggerConfiguration)
        {
            loggerConfiguration
                .ReadFrom.Configuration(configuration)

                .Enrich.FromLogContext()
                .Enrich.WithProperty("ApplicationName",
                    configuration["ApplicationName"] ?? configuration["ServiceName"] ?? "UnknownService")

                .WriteTo.Console(
                    outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {ApplicationName} {MachineName} {SourceContext} {Message:lj}{NewLine}{Exception}")
                .WriteTo.File(
                    path: "logs/log-.txt",
                    rollingInterval: RollingInterval.Day,
                    outputTemplate: "[{Timestamp: HH:mm:ss.fff zzz} {Level:u3}] {ApplicationName} {Message:lj}{NewLine}{Exception}");

            loggerConfiguration.MinimumLevel.Information();
            loggerConfiguration.MinimumLevel.Override("Microsoft", Serilog.Events.LogEventLevel.Warning);
            loggerConfiguration.MinimumLevel.Override("System", Serilog.Events.LogEventLevel.Warning);

        }
    }
}
