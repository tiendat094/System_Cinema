using System.ComponentModel.DataAnnotations;
using System.Net.Sockets;

namespace BookingService.Model
{
    public class Booking
    {
        [Key]
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public BookingStatus Status { get; set; } // PENDING, CONFIRMED, CANCELED
        public string? PaymentId { get; set; }
        public string? QrCode { get; set; }
        public string ShowTimeId {  get; set; }
        public List<string> Seats { get; set; }
        public DateTime? LastUpdated { get; set;}
        public DateTime CreateAt { get; set; }
    }

    public enum BookingStatus 
    { 
        PENDING = 0,
        CONFIRMED = 1,
        CANCELEDED = 2,
    }

}
