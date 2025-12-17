using Microsoft.AspNetCore.Mvc;
using MovieService.Manager.Seats;
using MovieService.Manager.Seats.Dto;
using MovieService.Model;

namespace MovieService.Controllers
{
    [ApiController]
    [Route("api/seat")]
    public class SeatController : Controller
    {
        private readonly ISeatManager _seatManager;
        public SeatController(ISeatManager seatManager)
        {
            _seatManager = seatManager;
        }

        [HttpPost("/createSeat")]
        public async Task CreatSeat(SeatDto seat)
        {
            await _seatManager.CreateSeat(seat);
        }

        [HttpPost("/createSeats")]
        public async Task CreateListSeat(List<SeatDto> seat)
        {
            await _seatManager.CreateListSeat(seat);
        }

        [HttpPost("/getSeatByRoomId")]
        public async Task<List<SeatDto>> GetSeatByRoomId(string roomId)
        {
            return await _seatManager.GetSeatByRoomId(roomId);
        }

    }
}
