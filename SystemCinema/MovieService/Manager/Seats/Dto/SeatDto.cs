using MovieService.Model;
using System.ComponentModel.DataAnnotations;

namespace MovieService.Manager.Seats.Dto
{
    public class SeatDto
    {
        public Guid Id { get; set; }
        public string Row { get; set; }
        public int Number { get; set; }
        public double Price { get; set; }
        public SeatType SeatType { get; set; } 
        public Guid RoomId { get; set; }
    }
}
