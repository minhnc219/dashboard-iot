using Model;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using WebApi.Models;

namespace DataAccessLayer.Repositories
{
    public class ConnectedDeviceRepository
    {
        private readonly IMongoCollection<ConnectedDevice> connectedDevices;
        private readonly DeviceRepository deviceRepository;
        private readonly DeviceTypeRepository deviceTypeRepository;
        public ConnectedDeviceRepository(DeviceTypeRepository deviceTypeRepository, DeviceRepository deviceRepository)
        {
            IMongoClient client = new MongoClient("mongodb://localhost:27017");
            IMongoDatabase database = client.GetDatabase("IotDatabase");
            connectedDevices = database.GetCollection<ConnectedDevice>("ConnectedDevices");
            this.deviceRepository = deviceRepository;
            this.deviceTypeRepository = deviceTypeRepository;
        }

        public bool ConnectedDeviceExists(string connectedDeviceId)
        {
            return connectedDevices.Find(connectedDevice => connectedDevice.Id == connectedDeviceId).Any();
        }
        public List<ConnectedDevice> GetConnectedDevices(string userId)
        {
            return connectedDevices.Find(connectedDevice => connectedDevice.UserId == userId).ToList();
        }

        public ConnectedDevice GetConnectedDevice(string connectedDeviceId)
        {
            return connectedDevices.Find(connectedDevice => connectedDevice.Id == connectedDeviceId).FirstOrDefault();
        }

        public void CreateConnectedDevice(ConnectedDevice connectedDevice)
        {
            connectedDevices.InsertOne(connectedDevice);
        }
        public void UpdateConnectedDevice(string connectedDeviceId, ConnectedDevice updateConnectedDevice)
        {
            FilterDefinition<ConnectedDevice> filter = Builders<ConnectedDevice>.Filter.Eq(connectedDevice => connectedDevice.Id, connectedDeviceId);
            UpdateDefinition<ConnectedDevice> update = Builders<ConnectedDevice>.Update
                .Set(connectedDevice => connectedDevice.Name, updateConnectedDevice.Name)
                .Set(connectedDevice => connectedDevice.Location, updateConnectedDevice.Location);
            connectedDevices.FindOneAndUpdate(filter, update);
        }

        public void RemoveConnectedDevice(string connectedDeviceId, string userId)
        {
            
        }

        public List<DeviceType> GetDeviceTypes(string connectedDeviceId)
        {
            List<DeviceDto> devices = deviceRepository.GetDevices(connectedDeviceId);
            List<DeviceType> deviceTypes = new List<DeviceType>();
            for(int i = 0; i < devices.Count; i++)
            {
                DeviceType deviceType = this.deviceTypeRepository.GetDeviceType(devices[i].DeviceTypeId);
                if (deviceTypes.Any(deviceType => deviceType.Id == devices[i].DeviceTypeId) == false)
                {
                    deviceTypes.Add(deviceType);
                }
                
            }
            return deviceTypes;
        }

    }
}
