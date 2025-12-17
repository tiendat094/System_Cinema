using System.ComponentModel.DataAnnotations;

namespace PaymentService.Model
{
    public class Payment
    {
        [Key]
        public Guid Id { get; set; }

        public Guid BookingId { get; set; }

        [MaxLength(20)]
        public string? PaymentMethod { get; set; } // MOMO, VISA...

        [MaxLength(20)]
        public PaymentStatus Status { get; set; } // SUCCESS, FAILED, PENDING

        public DateTime PaidAt { get; set; }

        public Invoice Invoice { get; set; }
    }

    public enum PaymentStatus
    {
        SUCCESS = 0, FAILURE = 1, PENDING = 2
    }
}
