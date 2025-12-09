using AutoMapper;
using MovieService.Infrastructure.Data;
using MovieService.Manager.Seats.Dto;
using MovieService.Model;

namespace MovieService.Manager.Seats
{
    public interface ISeatManager
    {
        Task CreateSeat(SeatDto seat);
    }
    public class SeatManager : ISeatManager
    {
        private readonly MovieContext _context;
        private readonly IMapper _mapper;
        public SeatManager(MovieContext context,IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task CreateSeat(SeatDto dto)
        {
            var seat = _mapper.Map<Seat>(dto);
            seat.Id = Guid.NewGuid();
            await _context.Seats.AddAsync(seat);
            await _context.SaveChangesAsync();
        }
    }
}
