using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace PaymentService.Model
{
    public class Invoice
    {
        [Key]
        public Guid Id { get; set; }

        [Required, MaxLength(50)]
        public string InvoiceNumber { get; set; }

        public double TotalAmount { get; set; }

        public DateTime IssuedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(PaymentId))]
        public Guid PaymentId { get; set; }
        public Payment Payment { get; set; }
    }
}
