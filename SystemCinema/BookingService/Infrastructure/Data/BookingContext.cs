using Microsoft.EntityFrameworkCore;
using BookingService.Model; // Đảm bảo Entity models được import

namespace BookingService.Infrastructure.Data
{
    // Đảm bảo BookingContext kế thừa từ DbContext và được sử dụng với Generic Type
    public class BookingContext : DbContext
    {
        public BookingContext(DbContextOptions<BookingContext> options)
            : base(options)
        {
        }

        // --- DbSet cho các Entity thuộc sở hữu của Booking Service ---
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<BookingSeat> BookingSeats { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            modelBuilder.Entity<Booking>()
                .Property(b => b.Status);

            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Booking)
                .WithMany(b => b.Tickets)
                .HasForeignKey(t => t.BookingId)
                .IsRequired();

            modelBuilder.Entity<BookingSeat>()
                .HasOne(bs => bs.Booking)
                .WithMany(b => b.Seats)
                .HasForeignKey(bs => bs.BookingId)
                .IsRequired();

        }
    }
}