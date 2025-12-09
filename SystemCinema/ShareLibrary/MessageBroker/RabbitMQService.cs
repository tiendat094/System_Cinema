using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShareLibrary.MessageBroker
{
    public static class RabbitMQService
    {
        public static IServiceCollection AddRabbitMQProducer(this IServiceCollection services)
        {
            services.AddSingleton<IMessageProducer, RabbitProducer>();
            return services;
        }
    }
}
