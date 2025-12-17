using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.DependencyInjection;
using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShareLibrary.MessageBroker
{

    public interface IRabbitMqConnection
    {
        Task<IChannel> CreateModel();
        Task ConnectAsync();
    }
    public class RabbitMqConnection : IRabbitMqConnection, IDisposable
    {
        private  IConnection? _connection;
        private readonly ConnectionFactory _connectionFactory;
        public RabbitMqConnection(string uri)
        {
            _connectionFactory = new ConnectionFactory
            {
                Uri = new Uri(uri)
            };
        
        }

        public async Task ConnectAsync()
        {
            if(_connection == null || ! _connection.IsOpen)
            {
                _connection = await _connectionFactory.CreateConnectionAsync();
            }
        }

        public async Task<IChannel> CreateModel()
        {
            if(_connection == null || !_connection.IsOpen)
            {
                throw new Exception("RabbitMq connection is not establish");
            }
            return  await _connection.CreateChannelAsync();
        }

        public void Dispose() { 
           if(_connection != null && _connection.IsOpen)
            {
                _connection.CloseAsync();
            }
           _connection?.Dispose();
        }
    }
}
