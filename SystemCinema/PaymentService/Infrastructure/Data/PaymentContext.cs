using Microsoft.EntityFrameworkCore;
using PaymentService.Model;

namespace PaymentService.Infrastructure.Data
{
    public class PaymentContext : DbContext
    {
        public PaymentContext(DbContextOptions<PaymentContext> options) : base(options)
        {
            
        }

        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<Payment> Payments {  get; set; }
    }
}
