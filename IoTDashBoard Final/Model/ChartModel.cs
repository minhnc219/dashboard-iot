using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace Model
{
    public class ChartModel
    {
        [BsonElement]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement]
        [BsonRequired]
        public string TypeChart { get; set; }

        [BsonElement]
        [BsonRequired]
        public string TypeData { get; set; }

        [BsonElement]
        [BsonRequired]
        public string Title { get; set; }

        [BsonElement]
        public string DeviceType { get; set; }

        [BsonElement]
        public string Parameter { get; set; }

        [BsonElement]
        public List<string> Devices { get; set; }
        public List<string> DeviceTypeParameters { get; set; }

        [BsonConstructor]
        public ChartModel()
        {
            Id = ObjectId.GenerateNewId().ToString();
            Devices = new List<string>();
            DeviceTypeParameters = new List<string>();
        }
    }
}
