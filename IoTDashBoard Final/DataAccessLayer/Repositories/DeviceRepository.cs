using Model;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System;
using System.Collections.Generic;
using System.Text;
using WebApi.Models;

namespace DataAccessLayer.Repositories
{
    public class DeviceRepository
    {
        private readonly IMongoCollection<Device> devices;
        public DeviceRepository(ClientUserRepository clientUserRepository)
        {
            IMongoClient client = new MongoClient("mongodb://localhost:27017");
            IMongoDatabase database = client.GetDatabase("IotDatabase");
            devices = database.GetCollection<Device>("Devices");
        }


        public bool DeviceExists(string deviceId)
        {
            return devices.Find(device => device.Id == deviceId).Any();
        }
        public List<DeviceDto> GetDevices(string connectedDeviceId)
        {
            var listDevices = devices.AsQueryable().Where(device => device.ConnectedDeviceId == connectedDeviceId)
                .Select(device => new
                {
                    device.Id,
                    device.Name,
                    device.DeviceTypeId,
                    device.ConnectedDeviceId,
                    device.DeviceStatus,
                    device.GPIO,
                    device.Topic
                }).ToList();
            List<DeviceDto> deviceDtos = new List<DeviceDto>();
            foreach (var device in listDevices)
            {
                deviceDtos.Add(new DeviceDto
                {
                    Id = device.Id,
                    DeviceTypeId = device.DeviceTypeId,
                    Name = device.Name,
                    GPIO = device.GPIO,
                    DeviceStatus = device.DeviceStatus,
                    ConnectedDeviceId = device.ConnectedDeviceId,
                    Topic = device.Topic,
                });
            }
            return deviceDtos;
        }

        public DeviceDto GetDevice(string deviceId)
        {
            var device = devices.AsQueryable().Where(device => device.Id == deviceId)
                .Select(device => new 
                {
                    device.Id,
                    device.Name,
                    device.DeviceTypeId,
                    device.ConnectedDeviceId,
                    device.DeviceStatus,
                    device.GPIO,
                    device.Topic
                }).FirstOrDefault();
            DeviceDto deviceDto = new DeviceDto 
            {
                Id = device.Id,
                DeviceTypeId = device.DeviceTypeId,
                Name = device.Name,
                GPIO = device.GPIO,
                DeviceStatus = device.DeviceStatus,
                ConnectedDeviceId = device.ConnectedDeviceId,
                Topic = device.Topic,
            };
            deviceDto.DeviceStatus.LastConnected.ToLocalTime();
            deviceDto.DeviceStatus.LastDisconnected.ToLocalTime();
            return deviceDto;
        }
        public void CreateDevice(Device device)
        {
            device.DeviceStatus = new DeviceStatus();
            devices.InsertOne(device);
        }

        public void UpdateDevice(string deviceId, Device newDevice)
        {
            FilterDefinition<Device> filter = Builders<Device>.Filter.Eq(device => device.Id, deviceId);
            UpdateDefinition<Device> update = Builders<Device>.Update
                .Set(device => device.Name, newDevice.Name)
                .Set(device => device.DeviceTypeId, newDevice.DeviceTypeId)
                .Set(device => device.Topic, newDevice.Topic)
                .Set(device => device.GPIO, newDevice.GPIO)
                .Set(device => device.DeviceStatus, new DeviceStatus());
            devices.FindOneAndUpdate(filter, update);
        }

        public void RemoveDevice(string deviceId)
        {
            devices.DeleteOne(device => device.Id == deviceId);
        }


    }
}
