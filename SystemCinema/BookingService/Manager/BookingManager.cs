using BookingService.Infrastructure.Data;
using BookingService.Manager.Dto;
using ShareLibrary.MessageBroker;

namespace BookingService.Manager
{
    public interface IBookingManager
    {

    }
    public class BookingManager : IBookingManager
    {
        private readonly BookingContext _context;
        private readonly IMessageProducer _messageProducer;
        public BookingManager(BookingContext context, IMessageProducer messageProducer)
        {
            _context = context;
            _messageProducer = messageProducer;
        }

/*        public async Task<BookingConfirmation> CreateBooking(CreateBookingRequest input)
        {
            
        }*/
    }
}
