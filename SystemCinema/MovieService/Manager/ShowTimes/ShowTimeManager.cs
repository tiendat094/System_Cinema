using AutoMapper;
using Grpc.Core;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using MovieGrpc;
using MovieService.Infrastructure.Data;
using MovieService.Manager.Cinemas.Dto;
using MovieService.Model;
using ShareLibrary.Core.Mapper.Filter;
using ShareLibrary.Core.Paging;
using ShowTimeGrpc;

namespace MovieService.Manager.ShowTimes
{
    public interface IShowTimeManager
    {
        Task<PagedResultDto<ShowTimeDto>> GetAllPaging(PagedResultRequestDto input, List<FilterClause> clause);
        Task CreateShowTime(ShowTimeDto input);
        Task DeleteShowTime(Guid Id);
    }
    public class ShowTimeManager : MovieGrpc.MovieService.MovieServiceBase,IShowTimeManager
    {
        private readonly MovieContext _context;
        private readonly IMapper _mapper;
        public ShowTimeManager(MovieContext context,IMapper mapper) 
        {
            _context = context;
            _mapper = mapper;
        }

        public override async Task<ShowTimeReply> GetShowTimeById(GetShowTimeRequest request, ServerCallContext context)
        {
            if(!Guid.TryParse(request.ShowTimeId, out Guid showTimeGuid))
            {
                throw new RpcException(new Status(StatusCode.InvalidArgument, "Dinhj dang sai"));
            }
            var showTime =await _context.ShowTimes
                .Include(x => x.Movie)
                .Include(y => y.Room)
                   .ThenInclude(z => z.Cinema)
                .FirstOrDefaultAsync(s => s.Id == showTimeGuid);
            if (showTime == null)
            {
                throw new Exception($"not found showtime with Id : {request.ToString()}");
            }

            return new ShowTimeReply
            {
                MovieTitle = showTime.Movie?.Title ?? string.Empty,
                CinemaName = showTime.Room.Cinema.Name,
                RoomName = showTime.Room.Name,
                StartTime = showTime.StartTime.ToString(),
            };

        }
        public async Task CreateShowTime(ShowTimeDto input)
        {
            var model = _mapper.Map<ShowTime>(input);
            model.Id = Guid.NewGuid();
            await _context.AddAsync(model);
            await _context.SaveChangesAsync();

        }

        public async Task DeleteShowTime(Guid Id)
        {
            var model =await _context.ShowTimes.FirstOrDefaultAsync(x => x.Id == Id);
            if(model != null) 
            {
                _context.Remove(model);
              await _context.SaveChangesAsync();
            }
        }

        public async Task<PagedResultDto<ShowTimeDto>> GetAllPaging(PagedResultRequestDto input, List<FilterClause> clause)
        {
            var query = _context.ShowTimes.AsQueryable();
            if(clause != null) {
                query = Filter.ApplyFilters(query, clause);
            }

            var totalCount = query.Count();
            var pagedQuery = query.ApplyPaging(input);
            var items = query.ToList();
            var item = items.Select(x => new ShowTimeDto 
            {
                Id = x.Id,
                CinemaName = x.Room.Cinema.Name,
                StarTime = x.StartTime,
                EndTime = x.EndTime,
                Price = x.Price,
                RoomName = x.Room.Name,
            }).ToList();
            var totalPage = totalCount / input.PageSize;
            return new PagedResultDto<ShowTimeDto>(totalCount, item, input.Page, input.PageSize, totalPage);

        }
    }
}
