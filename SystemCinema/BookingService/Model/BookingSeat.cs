using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BookingService.Model
{
    public class BookingSeat
    {
        [Key]
        public Guid Id { get; set; }

        public Guid SeatStatusInShowTimeId { get; set; } 

        [ForeignKey(nameof(Booking))]
        public Guid BookingId { get; set; }
        public Booking Booking { get; set; }
    }
}
