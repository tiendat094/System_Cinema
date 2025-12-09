namespace MovieService.Manager.Cinemas.Dto
{
    public class ShowTimeDto
    {
        public Guid Id { get; set; }
        public Guid CinemaId { get; set; }
        public Guid MovieId { get; set; }
        public string CinemaName { get; set; }
        public string RoomName { get; set; }
        public Guid RoomId { get; set; }
        public DateTime StarTime { get; set; }
        public DateTime EndTime { get; set; }
        public double Price { get; set; }
        public int totalSeats { get; set; }
        public int avaliableSeats { get; set; }
    }
}
