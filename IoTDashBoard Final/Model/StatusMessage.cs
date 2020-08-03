using System;
using System.Collections.Generic;
using System.Text;

namespace Model
{
    public class StatusMessage
    {
        public string DeviceId { get; set; }
        public bool Status { get; set; }
        public DateTime LastConnected { get; set; }
        public DateTime LastDisconnected { get; set; }
    }
}
