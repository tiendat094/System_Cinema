using BookingService.Infrastructure.Data;
using BookingService.Model;
using Microsoft.EntityFrameworkCore;

namespace BookingService.Infrastructure.Repository
{
    public interface IBookingRepository
    {

    }
    public class BookingRepository : IBookingRepository
    {
        private readonly BookingContext _context;
        public BookingRepository(BookingContext context)
        {
            _context = context;
        }   


    }
}
