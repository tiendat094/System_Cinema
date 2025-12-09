using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MovieService.Model
{
    public class Seat
    {
        [Key]
        public Guid Id { get; set; }

        [Required, MaxLength(10)]
        public string SeatNumber { get; set; }

        [MaxLength(20)]
        public SeatType SeatType { get; set; } // Normal, VIP, etc.
        public Guid RoomId { get; set; }
        [ForeignKey(nameof(RoomId))]
        public Room Room { get; set; }
    }


    public class SeatStatusInShowTime
    {
        [Key]
        public Guid Id { get; set; }
        public Guid ShowTimeId { get; set; }
        [ForeignKey(nameof(ShowTimeId))]
        public Guid SeatId { get; set; }
        public SeatStatus Status { get; set; }
    }
    public enum SeatType {
       NORMAL = 0,
       VIP = 1
    }

    public enum SeatStatus
    {
        Available = 1,
        Pending = 2,
        Confirm = 0,
        Disabled = 4
    }

}
