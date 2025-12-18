using RabbitMQ.Client;
using ShareLibrary.MessageBroker;
using ShareLibrary.MessageBroker.Dto;

namespace BookingService.Event
{
    public class UpdateSeatStatusConsumer : RabbitMqConsumerBase<BookingCreatedEvent>
    {
        private readonly IServiceProvider _serviceProvider;
        public UpdateSeatStatusConsumer(IRabbitMqConnection connection, IServiceProvider serviceProvider) 
            :base(
                 connection,
                 queueName: "movie.update-seat.queue",
                 exchangeName: "booking.created.exchange",
                 routingKey: "",
                 exchangeType : ExchangeType.Fanout)
        {
            _serviceProvider = serviceProvider;

        }

        protected override Task ProcessMessageAsync(BookingCreatedEvent message)
        {
            throw new NotImplementedException();
        }
    }
}
