using System.ComponentModel.DataAnnotations;

namespace NotificationService.Model
{
    public class NotificationTemplate
    {
        [Key]
        public Guid Id { get; set; }

        [Required, MaxLength(50)]
        public string Code { get; set; } // e.g. BOOKING_SUCCESS

        public string Subject { get; set; }

        public string Body { get; set; }
    }
}
