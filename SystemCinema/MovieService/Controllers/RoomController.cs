using Microsoft.AspNetCore.Mvc;
using MovieService.Manager.Rooms;
using MovieService.Manager.Rooms.Dto;
using MovieService.Model;

namespace MovieService.Controllers
{
    [ApiController]
    [Route("api/room")]
    public class RoomController : Controller
    {
        private readonly IRoomManager _roomManager;
        public RoomController(IRoomManager roomManager)
        {
            _roomManager = roomManager;
        }

        [HttpGet("/getRoomByCinemaId")]
        public List<Manager.Rooms.Dto.RoomDto> GetRoomByCinemaId([FromQuery] Guid cinemaId)
        {
            return _roomManager.GetRoomByCinemeId(cinemaId);
        }

        [HttpPost("/create")]
        public async Task CreateRoom(RoomDto room)
        {
            await _roomManager.CreateRoom(room);
        }

        [HttpGet("/getAllRoom")]
        public async Task<List<RoomDto>> GetAllRoom()
        {
            return await _roomManager.GetAllRoom();
        }
    }
}
