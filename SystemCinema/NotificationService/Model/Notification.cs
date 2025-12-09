using System.ComponentModel.DataAnnotations;

namespace NotificationService.Model
{
    public class Notification
    {
        [Key]
        public Guid Id { get; set; }

        public Guid UserId { get; set; }

        [Required, MaxLength(20)]
        public NotiType Type { get; set; } // EMAIL, SMS, PUSH

        public string Content { get; set; }

        public bool Sent { get; set; }

        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }

    public enum NotiType {
       EMAIL = 0,
       SMS = 1
    }

}
