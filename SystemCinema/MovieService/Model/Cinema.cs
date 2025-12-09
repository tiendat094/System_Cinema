using AutoMapper.Configuration.Annotations;
using System.ComponentModel.DataAnnotations;

namespace MovieService.Model
{
    public class Cinema
    {
        [Key]
        public Guid Id { get; set; }

        [Required, MaxLength(150)]
        public string Name { get; set; }

        [MaxLength(250)]
        public string Address { get; set; }
        public string City { get; set; }
        public string District { get; set; }
        public string PhoneNumber { get; set; }
        public string? Email { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public List<string> Facilities { get; set; } 
        public string OpeningHours { get; set; }
        public List<string> Imgaes { get; set; }
        public int TotalRooms { get; set; }
        public int TotalSeats { get; set; }
        public CinemaStatus CinemaStatus { get; set; }
        public string Thumbnail {  get; set; }
        public ICollection<Room>? Rooms { get; set; }
    }

    public enum CinemaStatus
    {
        Active = 0,
        Failed = 1,
        Maintenance = 2,
    }
}
