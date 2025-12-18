using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShareLibrary.Dto
{
    public class SeatDto 
    {
        public string Id { set; get; }
        public string Row { set; get; }
        public int Number {  set; get; }
        public SeatType Type { set; get; }
        public double Price { set; get; }
        public SeatStatus Status {  set; get; }
    }

    public enum SeatType
    {
        Normal = 0,
        VIP = 1,
        Couple = 2,
    }

    public enum SeatStatus
    {
        Available = 0,
        Selected = 1,
        Booked = 2,
        Broken = 3,
    }
}
