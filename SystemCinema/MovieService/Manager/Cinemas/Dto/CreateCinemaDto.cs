namespace MovieService.Manager.Cinemas.Dto
{
    public class CreateOrUpdateCinemaDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
    }
}
