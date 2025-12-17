using ShareLibrary.Dto;

namespace BookingService.Manager.Dto
{
    public class BookingConfirmation
    {
        public string BookingId { set; get; }
        public string QrCode { set; get; }
        public double TotalAmount { set; get; }
        public List<SeatDto> Seats { set; get; }
        public ShowTimeDto ShowTime { get; set; }
    }
}
