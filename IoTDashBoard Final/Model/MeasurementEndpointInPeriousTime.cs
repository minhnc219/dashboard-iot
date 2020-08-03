using System;
using System.Collections.Generic;
using System.Text;

namespace Model
{
    public class MeasurementEndpointInPeriousTime
    {
        public string Id { get; set; }
        public List<MeasurementEnpointInTime> MeasurementEnpoints { get; set; }
    }
}
