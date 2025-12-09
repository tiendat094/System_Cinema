using Microsoft.EntityFrameworkCore;
using MovieService.Model;

namespace MovieService.Infrastructure.Data
{
    public class MovieContext : DbContext
    {
        public MovieContext(DbContextOptions<MovieContext> options) : base(options)
        {

        }

        public DbSet<Cinema> Cinemas { get; set; }
        public DbSet<Movie> Movies { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<Seat> Seats { get; set; }
        public DbSet<ShowTime> ShowTimes { get; set; }
        public DbSet<SeatStatusInShowTime> SeatsStatusInShowTimes { get;set; }
    }
}
