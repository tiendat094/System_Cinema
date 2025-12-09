using Microsoft.AspNetCore.Mvc;
using MovieService.Manager.Cinemas;
using MovieService.Manager.Cinemas.Dto;
using MovieService.Model;
using ShareLibrary.Core.Mapper.Filter;
using ShareLibrary.Core.Paging;

namespace MovieService.Controllers
{
    [ApiController]
    [Route("/api/cinema")]
    public class CinemaController : Controller
    {
        public readonly ICinemaManager _cinemaManager;

        public CinemaController(ICinemaManager cinemaManager)
        {
            _cinemaManager = cinemaManager;
        }

        [HttpGet]
        public async Task<PagedResultDto<Cinema>> GetAllPaging(
            [FromQuery] PagedResultRequestDto? input,
            [FromQuery] List<FilterClause> clause)
        {
            return await _cinemaManager.GetPagedCinemasAsync(input, clause);
        }

        [HttpDelete("{id}")]
        public async Task DeleteCinemaById(Guid id)
        {
            await _cinemaManager.DeleteCinemaById(id);
        }
        [HttpPost("create")]
        public async Task CreateCinema([FromBody] Cinema cinema)
        {
            await _cinemaManager.CreateCinema(cinema);
        }
        [HttpGet("getAllCinema")]
        public async Task<List<CreateOrUpdateCinemaDto>> GetAllCinema()
        {
            return await _cinemaManager.GetAllCinema();
        }
    }
}