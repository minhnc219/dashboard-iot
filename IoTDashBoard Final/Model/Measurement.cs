using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace Model
{
    public class Measurement
    {
        [BsonElement]
        [BsonRequired]
        public DateTime CreatedDate { get; set; }
        
        [BsonElement]
        public BsonDocument Value { get; set; }
    }
}
