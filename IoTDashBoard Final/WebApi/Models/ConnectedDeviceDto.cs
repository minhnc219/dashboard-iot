using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models
{
    public class ConnectedDeviceDto
    {
        public string Id { get; set; }
        public string ConnectedDeviceTypeId { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public List<DeviceUsedGPIO> DeviceUsedGPIOs { get; set; }
        public ConnectedDeviceDto()
        {
            DeviceUsedGPIOs = new List<DeviceUsedGPIO>();
        }
    }
}
