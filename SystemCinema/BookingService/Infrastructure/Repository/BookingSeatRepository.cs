using BookingService.Infrastructure.Data;

namespace BookingService.Infrastructure.Repository
{
    public interface IBookingSeatRepository
    {

    }
    public class BookingSeatRepository : IBookingSeatRepository
    {
        private readonly BookingContext _context;
        public BookingSeatRepository(BookingContext context)
        {
            _context = context;
        }
    }
}
