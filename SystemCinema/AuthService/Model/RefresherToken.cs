using System.ComponentModel.DataAnnotations.Schema;

namespace AuthService.Model
{
    public class RefresherToken
    {
        public Guid Id { get; set; }
        [ForeignKey(nameof(UserId))]
        public AuthUser AuthUser { get; set; }
        public Guid UserId { get; set; }
        public string RefreshToken {  get; set; }
        public DateTime ExpireAt { get; set; }
        public bool IsRevoked {  get; set; } = false;
        public DateTime IssuedAt { get; set; }

    }
}
