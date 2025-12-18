using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShareLibrary.MessageBroker.Dto
{
    public class BookingCreatedEvent
    {
        public Guid BookingId { get; set; } 
        public Guid ShowTimeId { get; set; }
        public string QRCode { get; set; }
        public List<string> SeatIds { get; set; }   
        public double TotalAmount { get; set; }
        public DateTime CreateAt { get; set; }
    }
}
