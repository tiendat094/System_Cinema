using System.ComponentModel.DataAnnotations;

namespace UserService.Model
{
    public class UserProfile
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string FullName { get; set; }
        
        public Gender Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Phone {  get; set; }
        public string Address { get; set; }
        public string AvartarUrl { get; set; }
        public DateTime CreateAt { get; set; }
        public string UpdateAt { get; set; }
        public ICollection<UserPreference> Preferences { get; set; }

    }

    public enum Gender
    {
        Male = 0,
        Female = 1,
    }
}
