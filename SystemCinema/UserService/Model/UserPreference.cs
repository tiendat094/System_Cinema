using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UserService.Model
{
    public class UserPreference
    {
        [Key]
        public Guid Id { get; set; }
        public string FavoriteGenre { get; set; }
        public bool ReceivePromotion { get; set; }  
        public Guid UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public UserProfile UserProfile { get; set; }    
    }
}
