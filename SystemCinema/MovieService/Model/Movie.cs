using System.ComponentModel.DataAnnotations;

namespace MovieService.Model
{
    public class Movie
    {
        [Key]
        public Guid Id { get; set; }

        [Required, MaxLength(200)]
        public string Title { get; set; }
        public string? OriginalTitle { get; set; }

        public string Description { get; set; }
        public string? Backdropurl { get; set; }
        public string PosterUrl { get; set; }
        public string? TrainerUrl { get; set; }
        public string Language {  get; set; }
        public AgeRating AgeRating { get; set; }
        public string Director { get; set; }
        public int Duration { get; set; } 
        public MovieStatus MovieStatus { get; set; }
        public double Rating {  get; set; } 
        public string Cast { get; set; }
        public string? subtitles { set; get; }
        public DateTime ReleaseDate { get; set; }

        public ICollection<Genre> Genres { get; set; }
        public ICollection<ShowTime> Showtimes { get; set; }
    }

    public enum MovieStatus
    {
        NowShowing = 0,
        ComingSoon = 1,
        Ended = 2
    }

    public enum AgeRating
    {
        P = 0,
        K = 1,
        T13 = 2,
        T16 = 3,
        T18 = 4
    }
}
