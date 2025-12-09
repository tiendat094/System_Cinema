using MovieService.Model;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MovieService.Manager.Rooms.Dto
{
    public class RoomDto
    {
        public Guid Id { get; set; }

        [Required, MaxLength(50)]
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdateAt { get; set; }
        public int TotalSeat { set; get; }
        public Guid CinemaId { get; set; }
        public RoomType Type { get; set; }
        public RoomStatus Status { get; set; }
        public string? CinemaName { get; set; }
    }
}
