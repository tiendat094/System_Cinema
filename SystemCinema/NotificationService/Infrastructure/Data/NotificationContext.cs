using Microsoft.EntityFrameworkCore;
using NotificationService.Model;
using System.Runtime.CompilerServices;

namespace NotificationService.Infrastructure.Data
{
    public class NotificationContext : DbContext
    {
        public NotificationContext(DbContextOptions<NotificationContext> options) : base(options) { }

        public DbSet<Notification> Notifications { get; set; }
        public DbSet<NotificationTemplate> NotificationTemplates { get; set; }
    }


}
