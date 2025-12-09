using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MovieService.Infrastructure.Data;
using MovieService.Manager.Cinemas.Dto;
using MovieService.Manager.Genres;
using MovieService.Manager.Movies.Dto;
using MovieService.Model;
using ShareLibrary.Core.Mapper.Filter;
using ShareLibrary.Core.Paging;

namespace MovieService.Manager.Movies
{

    public interface IMovieManager
    {
        Task<PagedResultDto<Movie>> GetAllPaging(PagedResultRequestDto input, List<FilterClause> clause);
        Task CreateMovie(CreateOrUpdateMovieDto movie);
        Task DeleteMovie(Guid movieId);
        Task UpdateMovie(string Id,CreateOrUpdateMovieDto movie);

        Task<List<ShowTimeDto>> GetShowTimeByMovieId(string movieId);
        Task<Movie> GetMovieById(string id);
    }
    public class MovieManager : IMovieManager
    {
        private readonly MovieContext _context;
        private IMapper _mapper;
        private IGenreManager _genreManager;

        public MovieManager(MovieContext context, IMapper mapper,IGenreManager genreManager)
        {
            _context = context;
            _mapper = mapper;
            _genreManager = genreManager;
        }

        public async Task CreateMovie(CreateOrUpdateMovieDto movie)
        {
            var listGenre = _context.Genres.Where(x => movie.GenreIds.Contains(x.Id.ToString())).ToList();
            var model = _mapper.Map<Movie>(movie);
            model.Genres = listGenre;   
            model.Id = Guid.NewGuid();
            await _context.AddAsync(model);
            await _context.SaveChangesAsync(); 
        }

        public async Task DeleteMovie(Guid movieId)
        {
            var movie = await _context.Movies.FirstOrDefaultAsync(x => x.Id == movieId); 
            if (movie != null)
            {
                _context.Remove(movie);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<PagedResultDto<Movie>> GetAllPaging(PagedResultRequestDto input, List<FilterClause> clause)
        {
            var query = _context.Movies.Include(x => x.Genres).AsQueryable();
            if (clause != null)
            {
                query = Filter.ApplyFilters(query, clause);
            }
            var pagedQuery = query.ApplyPaging(input);

            var totalCount = await query.CountAsync(); 
            var items = await pagedQuery.ToListAsync();
            var totalPage = totalCount / items.Count;

            return new PagedResultDto<Movie>(totalCount, items,input.Page, input.PageSize,totalPage);
        }

        public async Task<Movie> GetMovieById(string id)
        {
           return await _context.Movies.Include(x => x.Showtimes).FirstOrDefaultAsync(x => x.Id.ToString() == id);
        }

        public async Task<List<ShowTimeDto>> GetShowTimeByMovieId(string movieId)
        {
            var listShowTime =await _context.ShowTimes.Where(x => x.MovieId.ToString() == movieId)
                              .Select(x => new ShowTimeDto
                              {
                                  Id = x.Id,
                                  MovieId = x.MovieId,
                                  CinemaId = x.CinemaId,
                                  CinemaName = x.Room.Cinema.Name,
                                  RoomId = x.RoomId,
                                  RoomName = x.Room.Name,
                                  StarTime = x.StartTime,
                                  EndTime = x.EndTime,
                                  Price = x.Price,
                                  totalSeats = x.Room.Seats.Count()

                              }).ToListAsync();
            return listShowTime;
        }

        public async Task UpdateMovie(string Id, CreateOrUpdateMovieDto dto)
        {
            var movieToUpdate = await _context.Movies.FirstOrDefaultAsync(x => x.Id.ToString() == Id); 

            if (movieToUpdate == null) return;

            _mapper.Map(dto, movieToUpdate); 
            await _context.SaveChangesAsync();
        }
    }
}
