using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace Model
{
    public class ConnectedDevice
    {
        [BsonElement]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement]
        public string ConnectedDeviceTypeId { get; set; }

        [BsonElement]
        [BsonRequired]
        public string UserId { get; set; }

        [BsonElement]
        [BsonRequired]
        public string Name { get; set; }

        [BsonElement]
        public string Location { get; set; }

        [BsonElement]
        public List<DeviceUsedGPIO> DeviceUsedGPIOs { get; set; }
        [BsonConstructor]
        public ConnectedDevice()
        {
            DeviceUsedGPIOs = new List<DeviceUsedGPIO>();
        }
    }
}
