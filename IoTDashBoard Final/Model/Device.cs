using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace Model
{
    public class Device
    {
        [BsonElement]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement]
        [BsonRequired]
        public string ConnectedDeviceId { get; set; }

        [BsonElement]
        [BsonRequired]
        public string DeviceTypeId { get; set; }

        [BsonElement]
        [BsonRequired]
        public string Name { get; set; }

        [BsonElement]
        public DeviceStatus DeviceStatus { get; set; }

        [BsonElement]
        public string Topic { get; set; }

        [BsonElement]
        public string GPIO { get; set; }

        [BsonElement]
        public List<Measurement> Measurements { get; set; }


        [BsonConstructor]
        public Device()
        {
            Measurements = new List<Measurement>();
            DeviceStatus = new DeviceStatus();
        }

    }
}
