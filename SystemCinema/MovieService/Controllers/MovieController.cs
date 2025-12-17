using Microsoft.AspNetCore.Mvc;
using MovieService.Manager.Cinemas.Dto;
using MovieService.Manager.Movies;
using MovieService.Manager.Movies.Dto;
using MovieService.Model;
using ShareLibrary.Core.Mapper.Filter;
using ShareLibrary.Core.Paging;

namespace MovieService.Controllers
{
    [ApiController]
    [Route("api/movie")]
    public class MovieController : Controller
    {
        private readonly IMovieManager _movieManager;
        public MovieController(IMovieManager movieManager)
        {
            _movieManager = movieManager;
        }

        [HttpPost("getAllPaging")]
        public async Task<PagedResultDto<Movie>> GetAllPaging(
            [FromQuery] PagedResultRequestDto input,
            [FromQuery] List<FilterClause> clause)
        {
            return await _movieManager.GetAllPaging(input, clause);
        }

        [HttpPost("create")]
        public async Task CreateMovie(
            [FromBody] CreateOrUpdateMovieDto movieDto) // Best practice: explicitly use [FromBody] for POST/PUT/PATCH
        {
            await _movieManager.CreateMovie(movieDto);
        }

        [HttpPut("updateMovie")]
        public async Task UpdateMovie(string Id,
            [FromBody] CreateOrUpdateMovieDto movie) // Best practice: explicitly use [FromBody]
        {
            await _movieManager.UpdateMovie(Id,movie);
        }

        [HttpDelete("delete/{movieId}")] // Add route placeholder for the ID
        public async Task DeleteMovie(
            [FromRoute] Guid movieId) // Bind the ID from the route path
        {
            await _movieManager.DeleteMovie(movieId);
        }

        [HttpGet("{movieId}/showtime")]
        public async Task<List<ShowTimeDto>> GetShowTimeByMovieId(string movieId)
        {
           return await _movieManager.GetShowTimeByMovieId(movieId);
        }
        [HttpGet("{movieId}")]
        public async Task<Movie> GetMovieById(string movieId)
        {
          return  await _movieManager.GetMovieById(movieId);
        }
    }
}