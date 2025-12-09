using MovieService.Manager.Genres.Dto;
using MovieService.Model;

namespace MovieService.Manager.Movies.Dto
{
    public class MovieDto
    {
        public Guid Id { get; set; } 
        public List<GenerDto> Genres { get; set; }
        public int Duration { get; set; }
        public DateTime ReleaseDate { get; set; }
        public MovieStatus Status { get; set; }
        public double Rating { get; set; }
    }
}
