using MovieService.Model;
using System.ComponentModel.DataAnnotations;

namespace MovieService.Manager.Seats.Dto
{
    public class SeatDto
    {
        public Guid Id { get; set; }
        public string SeatNumber { get; set; }
        public SeatType SeatType { get; set; } 
        public SeatStatus SeatStatus { get; set; }
        public Guid RoomId { get; set; }
    }
}
