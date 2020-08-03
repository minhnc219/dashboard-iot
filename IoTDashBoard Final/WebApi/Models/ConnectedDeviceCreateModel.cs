using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models
{
    public class ConnectedDeviceCreateModel
    {
        public string ConnectedDeviceTypeId { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public List<DeviceUsedGPIO> DeviceUsedGPIOs { get; set; }
        public ConnectedDeviceCreateModel()
        {
            DeviceUsedGPIOs = new List<DeviceUsedGPIO>();
        }
    }
}
