using System;
using System.Collections.Generic;
using System.Text;

namespace Model
{
    public class MeasurementModelSendDashboard
    {
        public DateTime CreatedDate { get; set; }
        public List<MeasurementEndpoint> MeasurementEndpoints { get; set; }
        public MeasurementModelSendDashboard()
        {
            MeasurementEndpoints = new List<MeasurementEndpoint>();
        }
    }
}
