using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace ShareLibrary.Core.Mapper
{
    public static class SharedModuleAutoMapperExtensions
    {
        public static IServiceCollection AddShareModuleMappings(this IServiceCollection services)
        {
            var shareAssembly = Assembly.GetExecutingAssembly();
            services.AddSingleton(shareAssembly);
            return services;
        }
    }
}
