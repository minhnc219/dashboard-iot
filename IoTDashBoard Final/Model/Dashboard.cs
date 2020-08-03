using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace Model
{
    public class Dashboard
    {
        [BsonElement]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        [BsonElement]
        [BsonRequired]
        public string UserId { get; set; }
        [BsonElement]
        [BsonRequired]
        public string Name { get; set; }
        [BsonElement]
        public List<ChartModel> ChartModels { get; set; }
        public Dashboard()
        {
            ChartModels = new List<ChartModel>();
        }
    }
}
