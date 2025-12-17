using AutoMapper;
using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using MovieGrpc;
using MovieService.Infrastructure.Data;
using MovieService.Manager.Seats.Dto;
using MovieService.Model;

namespace MovieService.Manager.Seats
{
    public interface ISeatManager
    {
        Task CreateSeat(SeatDto seat);
        Task CreateListSeat(List<SeatDto> dtos);

        Task<List<SeatDto>> GetSeatByRoomId(string roomId);
    }
    public class SeatManager : MovieGrpc.MovieService.MovieServiceBase,ISeatManager
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

        public async Task CreateListSeat(List<SeatDto> dtos)
        {
            var seats = dtos.Select(x => new Seat
            {
                Id = Guid.NewGuid(),
                RoomId = x.RoomId,
                Row = x.Row,
                Number = x.Number,
                SeatType = x.SeatType
                ,Price = x.Price
            });

            await _context.Seats.AddRangeAsync(seats);
            await _context.SaveChangesAsync();
        }

        public async Task<List<SeatDto>> GetSeatByRoomId(string roomId)
        {
            Guid roomGuid = Guid.Parse(roomId);

            var seats = await _context.Seats
                .Where(x => x.RoomId == roomGuid)
                .Select(x => new SeatDto
                {
                    Id = x.Id,
                    RoomId = x.RoomId,
                    Row = x.Row,
                    Number = x.Number,
                    SeatType = x.SeatType,
                    Price = x.Price
                })
                .ToListAsync();

            return seats;
        }
        //Grpc

        public override async Task<SeatReply> GetSeatByIds(GetSeatRequest request, ServerCallContext context)
        {
            List<Guid> guidId = request.MovieIds
                .Select(x => Guid.TryParse(x,out var g) ? g : Guid.Empty)
                .ToList();

            var seats =await _context.SeatsStatusInShowTimes
                        .Include(x => x.Seat)
                        .Where(x => guidId.Contains(x.Id))
                        .Select(x => new SeatItem
                        {
                            Id = x.Id.ToString(),
                            Row = x.Seat.Row,
                            Number = x.Seat.Number,
                            Price= x.Seat.Price,
                            Status = (int)x.Status,
                            Type = (int)x.Seat.SeatType
                        })
                        .ToListAsync();
            var response = new SeatReply();
            response.Seats.AddRange(seats);

            return response;

        }

    }
}
