using BookingService.Infrastructure.Data;
using BookingService.Manager.Dto;
using BookingService.Model;
using MovieGrpc;
using ShareLibrary.Dto;
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
        private readonly MovieGrpc.MovieService.MovieServiceClient _movieServiceClient;
        public BookingManager(BookingContext context, IMessageProducer messageProducer,
            MovieGrpc.MovieService.MovieServiceClient movieServiceClient)
        {
            _context = context;
            _messageProducer = messageProducer;
            _movieServiceClient = movieServiceClient;
        }

        public async Task<BookingConfirmation> CreateBooking(CreateBookingRequest input)
        {
            var booking = new Booking()
            {
                Id = Guid.NewGuid(),
                UserId = Guid.Parse(input.UserId),
                Status = BookingStatus.PENDING,
                QrCode = "QR -" + DateTime.Now,
                ShowTimeId = input.ShowtimeId,
                Seats = input.SeatIds,
                CreateAt = DateTime.UtcNow,
                LastUpdated = DateTime.UtcNow,
            };
            _context.Bookings.Add(booking);
            _context.SaveChanges();
            var getRequestSeat = new GetSeatRequest();
            getRequestSeat.MovieIds.AddRange(input.SeatIds);
            var seatInfo = _movieServiceClient.GetSeatByIds(getRequestSeat);
            var showTimeInfo = _movieServiceClient.GetShowTimeById(new GetShowTimeRequest() { ShowTimeId = input.ShowtimeId });

            var totalAmount = seatInfo.Seats.Sum(x => x.Price);
            return new BookingConfirmation()
            {
                BookingId = booking.Id.ToString(),
                QrCode = booking.QrCode,
                TotalAmount = totalAmount,
                Seats = seatInfo.Seats
                        .Select(x => new SeatDto
                        {
                            Id = x.Id,
                            Row = x.Row,
                            Number = x.Number,
                            Type = (SeatType)x.Type,
                            Price = x.Price,
                            Status = (SeatStatus)x.Status,
                        }).ToList(),
                ShowTime = new ShowTimeDto()
                {
                    MovieTitle = showTimeInfo.MovieTitle,
                    CinemaName = showTimeInfo.CinemaName,
                    RoomName = showTimeInfo.RoomName,
                    StartTime = showTimeInfo.StartTime,
                }

            };

        }
    }
}
