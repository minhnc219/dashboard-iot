using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace Model
{
    public class ConnectedDeviceType
    {
        [BsonElement]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement]
        [BsonRequired]
        public string Name { get; set; }

        public List<GPIO> GPIOs { get; set; }

        [BsonConstructor]
        public ConnectedDeviceType()
        {
            GPIOs = new List<GPIO>();
        }

    }
}
