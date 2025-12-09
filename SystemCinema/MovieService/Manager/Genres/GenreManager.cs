using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MovieService.Infrastructure.Data;
using MovieService.Manager.Genres.Dto;
using MovieService.Model;

namespace MovieService.Manager.Genres
{
    public interface IGenreManager
    {
        Task<List<GenerDto>> GetAllGener();
        Task CreateGenre(GenerDto genre);
        Task<Genre> GetGenreForListId(List<Guid> ids);
    }
    public class GenreManager : IGenreManager
    {
        private readonly MovieContext _context;
        private readonly IMapper _mapper;
        public GenreManager(MovieContext movieContext,IMapper mapper)
        {
            _context = movieContext;
            _mapper = mapper;
        }

        public async Task CreateGenre(GenerDto genre)
        {
            var model = _mapper.Map<Genre>(genre);
            model.Id = Guid.NewGuid();
            _context.Genres.Add(model);
           await _context.SaveChangesAsync();
        }

        public async Task<List<GenerDto>> GetAllGener()
        {
            return await _context.Genres
                .Select(x => new GenerDto
                {
                    Id = x.Id,
                    Name = x.Name,
                })
                .ToListAsync();
        }

        public async Task<Genre> GetGenreForListId(List<Guid> ids)
        {
            throw new NotImplementedException();
        }
    }
}
