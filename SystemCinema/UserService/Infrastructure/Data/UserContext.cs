using Microsoft.EntityFrameworkCore;
using UserService.Model;

namespace UserService.Infrastructure.Data
{
    public class UserContext : DbContext
    {
        public UserContext(DbContextOptions<UserContext> options) : base(options) { }
        public DbSet<UserPreference> UserPreferences { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
    }
}
