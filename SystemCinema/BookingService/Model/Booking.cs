using System.ComponentModel.DataAnnotations;
using System.Net.Sockets;

namespace BookingService.Model
{
    public class Booking
    {
        [Key]
        public Guid Id { get; set; }

        public Guid UserId { get; set; }

        public DateTime BookingTime { get; set; } = DateTime.UtcNow;

        [MaxLength(20)]
        public BookingStatus Status { get; set; } // PENDING, CONFIRMED, CANCELED

        public ICollection<Ticket> Tickets { get; set; }
        public ICollection<BookingSeat> Seats { get; set; }
    }

    public enum BookingStatus 
    { 
        PENDING = 0,
        CONFIRMED = 1,
        CANCELEDED = 2,
    }

}
