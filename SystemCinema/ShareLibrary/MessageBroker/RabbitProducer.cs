using Newtonsoft.Json;
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
        private readonly string _connectionString = "";

        public async Task Publish<T>(T message, string exchangeName, string routingKey = "")
        {
            var factory = new ConnectionFactory()
            {
                Uri = new Uri(_connectionString)
            };
            using var connection = await factory.CreateConnectionAsync();
            using var channel = await connection.CreateChannelAsync();

           await channel.ExchangeDeclareAsync(exchange: exchangeName, type: ExchangeType.Direct);
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
