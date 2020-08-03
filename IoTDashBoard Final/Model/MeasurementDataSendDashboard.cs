using System;
using System.Collections.Generic;
using System.Text;

namespace Model
{
    public class MeasurementDataSendDashboard
    {
        public List<MeasurementEndpointInPeriousTime> MeasurementEndpointInPeriousTimes { get; set; }
        public List<AverageDeviceSendModel> AverageDeviceSendModels { get; set; }
        public MeasurementDataSendDashboard()
        {
            MeasurementEndpointInPeriousTimes = new List<MeasurementEndpointInPeriousTime>();
            AverageDeviceSendModels = new List<AverageDeviceSendModel>();
        }
    }
}
