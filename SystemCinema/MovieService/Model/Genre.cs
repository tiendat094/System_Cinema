using System.ComponentModel.DataAnnotations;

namespace MovieService.Model
{
    public class Genre
    {
        [Key]
        public Guid Id { get; set; }

        [Required, MaxLength(50)]
        public string Name { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public ICollection<Movie> Movies { get; set; }
    }
}
