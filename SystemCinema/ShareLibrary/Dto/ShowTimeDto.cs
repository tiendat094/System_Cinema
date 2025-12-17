using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShareLibrary.Dto
{
    public class ShowTimeDto
    {
        public string MovieTitle {  get; set; }
        public string CinemaName { get; set; }
        public string RoomName { get; set; }
        public string StartTime { get; set; }
    }
}
