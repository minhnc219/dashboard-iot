using System;
using System.Collections.Generic;
using System.Text;

namespace Model
{
    public class DeviceStatus
    {
        public bool Status { get; set; }
        public DateTime LastConnected { get; set; }
        public DateTime LastDisconnected { get; set; }
    }
}
