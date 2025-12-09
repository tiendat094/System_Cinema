using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MovieService.Infrastructure.Data;
using MovieService.Manager.Rooms.Dto;
using MovieService.Model;


namespace MovieService.Manager.Rooms
{
    public interface IRoomManager
    {
        public List<Dto.RoomDto> GetRoomByCinemeId(Guid CinemaId);
        Task CreateRoom(RoomDto room);
        Task<List<RoomDto>> GetAllRoom();
    }
    public class RoomManager : IRoomManager
    {
        private readonly MovieContext _context;
        private readonly IMapper _mapper;
        public RoomManager(MovieContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task CreateRoom(RoomDto dto)
        {
            var room = _mapper.Map<Room>(dto);
            room.Id = Guid.NewGuid();
            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();
        }
        public async Task<List<RoomDto>> GetAllRoom()
        {
            var room = await _context.Rooms
                .Select(x => new RoomDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    CreatedAt = x.CreatedAt,
                    UpdateAt = x.UpdateAt,
                    TotalSeat = x.TotalSeat,
                    Type = x.Type,
                    Status = x.Status,
                    CinemaId = x.CinemaId,
                    CinemaName = x.Cinema.Name,

                }).ToListAsync();
            
            return room;
        }
        public List<Dto.RoomDto> GetRoomByCinemeId(Guid CinemaId)
        {
            var room = _context.Rooms.Where(x => x.CinemaId == CinemaId)
                .Select(x => new Dto.RoomDto
                {
                    Id = x.Id,
                    CinemaName = x.Cinema.Name,
                    Name = x.Name,
                    
                }).ToList();

            return room;
            
        }
    }
}
