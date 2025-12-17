using Microsoft.AspNetCore.Mvc;
using MovieService.Manager.Cinemas.Dto;
using MovieService.Manager.ShowTimes;
using ShareLibrary.Core.Mapper.Filter;
using ShareLibrary.Core.Paging;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MovieService.Controllers
{
    [ApiController]
    [Route("api/showTime")]
    public class ShowTimeController : Controller
    {
        private readonly IShowTimeManager _showTimeManager;

        public ShowTimeController(IShowTimeManager showTimeManager)
        {
            _showTimeManager = showTimeManager;
        }

        [HttpGet("getAllPaging")]
        public async Task<PagedResultDto<ShowTimeDto>> GetAllPaging(
            [FromQuery] PagedResultRequestDto input,      
            [FromQuery] List<FilterClause> clauses)       
        {
            return await _showTimeManager.GetAllPaging(input, clauses);
        }

        [HttpPost("create")]
        public async Task CreateShowTime(
            [FromBody] ShowTimeDto input) 
        {
            await _showTimeManager.CreateShowTime(input);
        }

        [HttpDelete("delete/{id}")]
        public async Task DeleteShowTime(
            [FromRoute] Guid id) 
        {
            await _showTimeManager.DeleteShowTime(id);
        }


    }
}