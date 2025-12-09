using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;

namespace ShareLibrary.DB
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddServiceInfrastructure<TDbContext>(this IServiceCollection services, IConfiguration configuration) where TDbContext : DbContext
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            if (string.IsNullOrWhiteSpace(connectionString))
            {
                return services;
            }

            services.AddDbContext<TDbContext>(options =>
            {
                options.UseNpgsql(connectionString,
                    b => b.MigrationsAssembly(typeof(TDbContext).Assembly.FullName));
            

            if(Environment.GetEnvironmentVariable("ASPNETCORE_ENVIROMENT") == "Development")
            {
                options.LogTo(Console.WriteLine, Microsoft.Extensions.Logging.LogLevel.Information);
                    options.EnableSensitiveDataLogging();
            }
            });
            return services;
        }
        
    }
}
