using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace Model
{
    public class DeviceType
    {
        [BsonElement]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement]
        [BsonRequired]
        public string Name { get; set; }

        [BsonElement]
        public string Description { get; set; }

        public List<MeasurementType> MeasurementTypes { get; set; }

        [BsonConstructor]
        public DeviceType()
        {
            MeasurementTypes = new List<MeasurementType>();
        }
    }
}
