using Newtonsoft.Json;
using Npgsql.EntityFrameworkCore.PostgreSQL.Query.Expressions.Internal;
using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Channels;
using System.Threading.Tasks;

namespace ShareLibrary.MessageBroker
{
    public interface IMessageProducer
    {
        Task Publish<T>(T message, string exchangeName, string routingKey = "");
    }

    
    public class RabbitProducer : IMessageProducer
    {
        private readonly IRabbitMqConnection _connection;
        public RabbitProducer(IRabbitMqConnection connection)
        {
            _connection = connection;
        }

        public async Task Publish<T>(T message, string exchangeName, string routingKey = "")
        {
            using var channel =await _connection.CreateModel();

           await channel.ExchangeDeclareAsync(exchange: exchangeName, type: ExchangeType.Fanout);
           var json = JsonConvert.SerializeObject(message);
           var body = Encoding.UTF8.GetBytes(json);
          

           await channel.BasicPublishAsync(
                exchange: exchangeName,
                routingKey: routingKey,
                body: body
                );

            Console.WriteLine($" [MQ Producer] Sent message to Exchange '{exchangeName}'");

        }
    }
}
