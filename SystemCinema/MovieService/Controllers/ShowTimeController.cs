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
            [FromQuery] PagedResultRequestDto input,      // ⬅️ FIX 1: Must explicitly bind complex types from Query
            [FromQuery] List<FilterClause> clauses)       // ⬅️ FIX 1: Must explicitly bind complex types from Query
        {
            return await _showTimeManager.GetAllPaging(input, clauses);
        }

        [HttpPost("create")]
        public async Task CreateShowTime(
            [FromBody] ShowTimeDto input) // Best practice: explicitly bind DTO from Body
        {
            await _showTimeManager.CreateShowTime(input);
        }

        [HttpDelete("delete/{id}")] // ⬅️ FIX 2: Add route segment for the ID
        public async Task DeleteShowTime(
            [FromRoute] Guid id) // ⬅️ FIX 2: Bind simple type from the Route Path
        {
            await _showTimeManager.DeleteShowTime(id);
        }


    }
}