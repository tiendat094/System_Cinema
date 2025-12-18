using Microsoft.AspNetCore.Components.Server.ProtectedBrowserStorage;
using Microsoft.Extensions.Hosting;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace ShareLibrary.MessageBroker
{
    public abstract class RabbitMqConsumerBase<T> : BackgroundService
    {
        private IChannel _channel;
        private IRabbitMqConnection _connection;
        private readonly string _queueName;
        private readonly string _exchangeName;
        private readonly string _routingKey;
        private readonly string _exchangeType;

        public RabbitMqConsumerBase(IRabbitMqConnection connection
            , string queueName,
            string exchangeName,
            string routingKey = "",
            string exchangeType = ExchangeType.Fanout)
        {
            _connection = connection;
            _queueName = queueName;
            _exchangeName = exchangeName;
            _routingKey = routingKey;
            _exchangeType = exchangeType;
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _channel = await _connection.CreateModel();
            var deadLetterExchageName = $"{_queueName}.dlx.exchange";
            var deadLetterQueueName = $"{_queueName}.dlq";
            var routingKey = "dead-letter";

           await _channel.ExchangeDeclareAsync(exchange: deadLetterExchageName, type: ExchangeType.Direct);

           await _channel.QueueDeclareAsync(queue: deadLetterExchageName, durable: true, exclusive: false, autoDelete: false, arguments: null);

           await  _channel.QueueBindAsync(exchange: deadLetterExchageName, queue: deadLetterQueueName,  routingKey: routingKey);

            var arguments = new Dictionary<string, object>
            {
                { "x-dead-letter-exchange", deadLetterExchageName },
                { "x-dead-letter-routing-key", routingKey }
            };

            await _channel.ExchangeDeclareAsync(_exchangeName, type: _exchangeType);

            await _channel.QueueDeclareAsync(queue: _queueName, durable: true, exclusive: false, autoDelete: false, arguments: arguments);
            await _channel.QueueBindAsync(_queueName,_exchangeType, routingKey: routingKey);
            await _channel.BasicQosAsync(prefetchCount: 1, prefetchSize: 0, global: false);

            var consumer = new AsyncEventingBasicConsumer(_channel);

            consumer.ReceivedAsync += async (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var messageString = Encoding.UTF8.GetString(body);

                try
                {
                    var message = JsonSerializer.Deserialize<T>(messageString);

                    await ProcessMessageAsync(message);

                  await  _channel.BasicAckAsync(deliveryTag: ea.DeliveryTag, multiple: false);
                }catch(Exception ex)
                {
                    Console.WriteLine($"[Error] Message failed: {ex.Message} Moving to DLQ ");

                  await  _channel.BasicNackAsync(deliveryTag: ea.DeliveryTag, multiple: false, requeue: false);
                }

              
            };
            await _channel.BasicConsumeAsync(queue: _queueName, autoAck: false,consumer: consumer);
        }

        protected abstract Task ProcessMessageAsync(T message);

        public override void Dispose()
        {
            _channel?.Dispose();
            _channel.Dispose();
            base.Dispose();
        }
    }
}
