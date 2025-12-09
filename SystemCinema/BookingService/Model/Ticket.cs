using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BookingService.Model
{
    public class Ticket
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string TicketCode { get; set; }

        public double Price { get; set; }

        [ForeignKey(nameof(Booking))]
        public Guid BookingId { get; set; }
        public Booking Booking { get; set; }

        public Guid ShowtimeId { get; set; }
    }
}
