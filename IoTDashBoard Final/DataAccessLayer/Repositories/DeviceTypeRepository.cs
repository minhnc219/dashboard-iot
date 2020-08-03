using Model;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataAccessLayer.Repositories
{
    public class DeviceTypeRepository
    {
        private readonly IMongoCollection<DeviceType> deviceTypes;
        public DeviceTypeRepository()
        {
            IMongoClient client = new MongoClient("mongodb://localhost:27017");
            IMongoDatabase database = client.GetDatabase("IotDatabase");
            deviceTypes = database.GetCollection<DeviceType>("DeviceTypes");
        }

        public bool DeviceTypeExists(string deviceTypeId)
        {
            return deviceTypes.Find(deviceType => deviceType.Id == deviceTypeId).Any();
        }

        public bool IsDuplicatedDeviceTypeName(string deviceTypeId, string deviceTypeName)
        {
            DeviceType deviceType = deviceTypes.AsQueryable().Where(deviceType => deviceType.Id != deviceTypeId &&
            deviceType.Name.ToLower() == deviceTypeName.ToLower()).FirstOrDefault();
            return deviceType == null ? false : true;
        }

        public List<DeviceType> GetDeviceTypes()
        {
            return deviceTypes.Find(deviceType => true).ToList();
        }

        public DeviceType GetDeviceType(string deviceTypeId)
        {
            return deviceTypes.Find(deviceType => deviceType.Id == deviceTypeId).FirstOrDefault();
        }

        public void CreateDeviceType(DeviceType deviceType)
        {
            deviceTypes.InsertOne(deviceType);
        }

        public void UpdateDeviceType(string deviceTypeId, DeviceType updateDeviceType)
        {
            deviceTypes.ReplaceOne(deviceType => deviceType.Id == deviceTypeId, updateDeviceType);
        }

        public void RemoveDeviceType(string deviceTypeId)
        {
            deviceTypes.DeleteOne(deviceType => deviceType.Id == deviceTypeId);
        }
    }
}
