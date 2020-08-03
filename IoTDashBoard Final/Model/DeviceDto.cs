using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models
{
    public class DeviceDto
    {
        public string Id { get; set; }
        public string ConnectedDeviceId { get; set; }
        public string DeviceTypeId { get; set; }
        public string Topic { get; set; }
        public string Name { get; set; }
        public DeviceStatus DeviceStatus { get; set; }
        public string GPIO { get; set; }
    }
}
