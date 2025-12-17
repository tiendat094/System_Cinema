namespace BookingService.Manager.Dto
{
    public class CreateBookingRequest
    {
        public string ShowtimeId {  get; set; }
        public List<string> SeatIds { get; set; }
        public string UserId { get; set; }
    }
}
