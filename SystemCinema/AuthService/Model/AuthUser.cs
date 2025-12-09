using System.ComponentModel.DataAnnotations;

namespace AuthService.Model
{
    public class AuthUser
    {
        [Key]
        public Guid Id { set; get; }
        [Required]
        public string Name { set; get; }
        [Required]
        public string Password { set; get; }
        [Required]
        public string Email { set; get; }
        public Role Role {  set; get; }
        public bool IsActive { set; get; }
        public DateTime CreateAt { set; get; } = DateTime.UtcNow;
        public DateTime? UpdateAt { set; get; }
        public ICollection<LoginHistory> History { set; get; }
        public ICollection<RefresherToken> RefresherTokens { set; get; }

    }

    public enum Role
    {
        Admin = 0 , User= 1 , Staff = 2
    }
}
