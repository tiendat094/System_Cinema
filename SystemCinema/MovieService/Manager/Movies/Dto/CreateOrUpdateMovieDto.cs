using MovieService.Manager.Genres.Dto;
using MovieService.Model;

namespace MovieService.Manager.Movies.Dto
{
    public class CreateOrUpdateMovieDto
    {
        public int Duration { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string PosterUrl { get; set; }
        public string TrainerUrl { get; set; }
        public string Language { get; set; }
        public string Director { get; set; }
        public AgeRating AgeRating { get; set; }
        public string Cast { get; set; }
        public List<string> GenreIds { get; set; }
    }
}
