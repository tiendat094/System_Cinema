using Microsoft.EntityFrameworkCore;
using MovieService.Infrastructure.Data;
using MovieService.Manager.Cinemas.Dto;
using MovieService.Model;
using ShareLibrary.Core.Mapper.Filter;
using ShareLibrary.Core.Paging;

namespace MovieService.Manager.Cinemas
{
    public interface ICinemaManager
    {
        Task<PagedResultDto<Cinema>> GetPagedCinemasAsync(PagedResultRequestDto input, List<FilterClause> clause);
        Task<List<CreateOrUpdateCinemaDto>> GetAllCinema();
        Task DeleteCinemaById(Guid id);
        Task<Cinema> UpdateCinemaById(Cinema cinema);
        Task CreateCinema(Cinema cinema);   

    }
    public class CinemaManager : ICinemaManager
    {
        private readonly MovieContext _context;
        public CinemaManager(MovieContext context)
        {
            _context = context;
        }

        public async Task CreateCinema(Cinema cinema)
        {
           _context.Cinemas.Add(cinema);
            await _context.SaveChangesAsync();
        }

        public Task DeleteCinemaById(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<List<CreateOrUpdateCinemaDto>> GetAllCinema()
        {
            var cinema = _context.Cinemas.Select(x => new CreateOrUpdateCinemaDto { 
               Address = x.Address,
               City = x.City,
               Id = x.Id,
               Name = x.Name,
            
            }).ToListAsync();
            return cinema;
        }

        public async Task<PagedResultDto<Cinema>> GetPagedCinemasAsync(PagedResultRequestDto input,List<FilterClause> clause)
        {
            var query = _context.Cinemas.AsQueryable();
            if (clause != null)
            {
                query = Filter.ApplyFilters(query, clause);
            }

            var totalCount =  query.Count();
            
            var pagedQuery = query.ApplyPaging(input);
            var items = await pagedQuery.ToListAsync();
          //  var totalPage = items.Count < 0 ? 1 : totalCount / items.Count ;
            return new PagedResultDto<Cinema>(totalCount, items,input.Page, input.PageSize, 1);
        }

        public Task<Cinema> UpdateCinemaById(Cinema cinema)
        {
            throw new NotImplementedException();
        }
    }
}
