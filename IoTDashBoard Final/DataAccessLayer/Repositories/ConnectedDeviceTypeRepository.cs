using Model;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataAccessLayer.Repositories
{
    public class ConnectedDeviceTypeRepository
    {
        private readonly IMongoCollection<ConnectedDeviceType> connectedDeviceTypes;
        public ConnectedDeviceTypeRepository()
        {
            IMongoClient client = new MongoClient("mongodb://localhost:27017");
            IMongoDatabase database = client.GetDatabase("IotDatabase");
            connectedDeviceTypes = database.GetCollection<ConnectedDeviceType>("ConnectedDeviceTypes");
        }

        public bool ConnectedDeviceTypeExists(string connectedDeviceTypeId)
        {
            return connectedDeviceTypes.Find(connectedDeviceType => connectedDeviceType.Id == connectedDeviceTypeId).Any();
        }

        public bool IsDuplicatedConnectedDeviceTypeName(string connectedDeviceTypeId, string connectedDeviceTypeName)
        {
            ConnectedDeviceType connectedDeviceType = connectedDeviceTypes.AsQueryable().Where(connectedDeviceType => connectedDeviceType.Id != connectedDeviceTypeId &&
            connectedDeviceType.Name.ToLower() == connectedDeviceTypeName.ToLower()).FirstOrDefault();
            return connectedDeviceType == null ? false : true;
        }

        public List<ConnectedDeviceType> GetConnectedDeviceTypes()
        {
            return connectedDeviceTypes.Find(connectedDeviceType => true).ToList();
        }

        public ConnectedDeviceType GetConnectedDeviceType(string connectedDeviceTypeId)
        {
            return connectedDeviceTypes.Find(connectedDeviceType => connectedDeviceType.Id == connectedDeviceTypeId).FirstOrDefault();
        }

        public void CreateConnectedDeviceType(ConnectedDeviceType connectedDeviceType)
        {
            connectedDeviceTypes.InsertOne(connectedDeviceType);
        }

        public void UpdateConnectedDeviceType(string connectedDeviceTypeId, ConnectedDeviceType updateConnectedDeviceType)
        {
            connectedDeviceTypes.ReplaceOne(connectedDeviceType => connectedDeviceType.Id == connectedDeviceTypeId, updateConnectedDeviceType);
        }

        public void RemoveConnectedDeviceType(string connectedDeviceTypeId)
        {
            connectedDeviceTypes.DeleteOne(connectedDeviceType => connectedDeviceType.Id == connectedDeviceTypeId);
        }
    }
}
