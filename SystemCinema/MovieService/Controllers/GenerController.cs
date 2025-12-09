using Microsoft.AspNetCore.Mvc;
using MovieService.Manager.Genres;
using MovieService.Manager.Genres.Dto;

namespace MovieService.Controllers
{
    [ApiController]
    [Route("/api/genre")]
    public class GenerController : Controller
    {
        private readonly IGenreManager _genreManager;
        public GenerController(IGenreManager genreManager)
        {
            _genreManager = genreManager;
        }

        [HttpPost("create")]
        public async Task CreateGenre(GenerDto dto)
        {
           await _genreManager.CreateGenre(dto);
        }
        [HttpGet("getAll")]
        public async Task<List<GenerDto>> GetAllGenre()
        {
           return await _genreManager.GetAllGener();
        }
    }
}
