using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MovieService.Model
{
    public class Room
    {
        [Key]
        public Guid Id { get; set; }

        [Required, MaxLength(50)]
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdateAt { get; set; }
        public int TotalSeat { set; get; }
        public Guid CinemaId { get; set; }
        [ForeignKey(nameof(CinemaId))]
        public Cinema Cinema { get; set; }
        public RoomType Type { get; set; }
        public RoomStatus Status { get; set; }
        public ICollection<Seat>? Seats { get; set; }
        public ICollection<ShowTime>? Showtimes { get; set; }
    }

    public enum RoomType
    {
        Standard = 0,
        Vip = 1,
        Imax = 2,
        FourDx = 3,
        SweetBox = 4,
    }

    public enum RoomStatus
    {
        Active = 0  ,
        Inactive = 1 ,
        Maintenance = 2 ,
    }
}
