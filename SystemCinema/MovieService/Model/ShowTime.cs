using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MovieService.Model
{
    public class ShowTime
    {
        [Key]
        public Guid Id { get; set; }

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        public double Price { get; set; }       
        public Guid MovieId { get; set; }
        [ForeignKey(nameof(MovieId))]
        public Movie Movie { get; set; }
        public Guid RoomId { get; set; }
        [ForeignKey(nameof(RoomId))]
        public Room Room { get; set; }
        
        public Guid CinemaId { get; set; }

    }
}
