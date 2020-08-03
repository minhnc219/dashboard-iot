using System;
using System.Collections.Generic;
using System.Text;

namespace Model
{
    public class AverageDeviceSendModel
    {
        public string Id { get; set; }
        public List<AverageDeviceData> AverageDeviceDatas { get; set; }
        public AverageDeviceSendModel()
        {
            AverageDeviceDatas = new List<AverageDeviceData>();
        }
    }
}
