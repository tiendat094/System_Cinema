using AuthService.Model;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Infrastructure.Data
{
    public class AuthContext : DbContext
    {
        public AuthContext(DbContextOptions<AuthContext> options) : base(options) { }

        public DbSet<AuthUser> AuthUsers { get; set; }
        public DbSet<LoginHistory> LoginHistory { get; set; }
        public DbSet<RefresherToken> RefresherToken { get; set;}
    }
}
