using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthService.Model
{
    public class LoginHistory
    {
        [Key]
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public DateTime LoginTime { get; set; }
        [Required]
        public string IPAdress {  get; set; }
        [Required] 
        public string Device {  get; set; }
        public bool IsSuccess {  get; set; }
        [ForeignKey(nameof(UserId))]
        public AuthUser AuthUser { get; set; }
    }
}
