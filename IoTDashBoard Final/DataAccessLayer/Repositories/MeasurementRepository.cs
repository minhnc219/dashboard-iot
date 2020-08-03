using Model;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Core.Misc;
using MongoDB.Driver.Linq;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;

namespace DataAccessLayer.Repositories
{
    public class MeasurementRepository
    {
        private readonly IMongoCollection<Device> devices;
        private readonly IMongoCollection<DeviceType> deviceTypes;
        public MeasurementRepository()
        {
            IMongoClient client = new MongoClient("mongodb://localhost:27017");
            IMongoDatabase database = client.GetDatabase("IotDatabase");
            devices = database.GetCollection<Device>("Devices");
            deviceTypes = database.GetCollection<DeviceType>("DeviceTypes");
        }

        public void CreateMeasurement(string deviceId, Measurement measurement)
        {
            Device device = devices.Find(device => device.Id == deviceId).FirstOrDefault();
            if(device == null)
            {
                return;
            }
            FilterDefinition<Device> filter = Builders<Device>.Filter
                .Eq(device => device.Id, deviceId);
            UpdateDefinition<Device> update = Builders<Device>.Update
                .Push(device => device.Measurements, measurement);
            devices.FindOneAndUpdate(filter, update);
        }
        
        public List<MeasurementEnpointInTime> GetMeasurementDeviceInOneHour(string deviceId)
        {
            DateTime time = DateTime.Now;
            time = time.ToUniversalTime();
            time = time.AddHours(-1);
            Device device = devices.Find(device => device.Id == deviceId).FirstOrDefault();
            List<Measurement> measurements = device.Measurements
                .OrderByDescending(measurement => measurement.CreatedDate).Take(720)
                .Where(measurement => measurement.CreatedDate > time).ToList();
            List<MeasurementEnpointInTime> measurementEnpoints = new List<MeasurementEnpointInTime>();
            int count = measurements.Count;
            for(int i = 0; i < measurements.Count; i += count/20)
            {
                measurementEnpoints.Add(new MeasurementEnpointInTime
                {
                    CreatedDate = measurements[i].CreatedDate.ToLocalTime(),
                    Value = measurements[i].Value.ToString()
                });
            }    
            return measurementEnpoints;
        }
        
        public List<MeasurementEnpointInTime> GetMeasurementDeviceInSixHour(string deviceId)
        {
            DateTime time = DateTime.Now;
            time = time.ToUniversalTime();
            time = time.AddHours(-6);
            List<Measurement> measurements = devices.Find(device => device.Id == deviceId).FirstOrDefault()
                .Measurements.OrderByDescending(measurement => measurement.CreatedDate).Take(6000)
                .Where(measurement => measurement.CreatedDate > time).ToList();
            List<MeasurementEnpointInTime> measurementEnpoints = new List<MeasurementEnpointInTime>();
            int count = measurements.Count;
            for (int i = 0; i < measurements.Count; i += count / 20)
            {
                measurementEnpoints.Add(new MeasurementEnpointInTime
                {
                    CreatedDate = measurements[i].CreatedDate.ToLocalTime(),
                    Value = measurements[i].Value.ToString()
                });
            }
            return measurementEnpoints;
        }

        public AverageDeviceSendModel GetAverageDeviceDataOneHour(string deviceId)
        {
            DateTime time = DateTime.Now;
            DateTime time1 = new DateTime(time.Year, time.Month, time.Day, time.Hour, 0, 0);
            time1 = time1.ToUniversalTime();
            time1 = time1.AddHours(-1);
            List<double> totals = new List<double>();
            AverageDeviceSendModel sendModel = new AverageDeviceSendModel 
            {
                Id = deviceId
            };
            Device device = devices.Find(device => device.Id == deviceId).FirstOrDefault();
            List<Measurement> measurements = device.Measurements
                .OrderByDescending(measurement => measurement.CreatedDate).Take(720)
                .Where(measurement => measurement.CreatedDate > time1).ToList();
            if(measurements.Count != 0)
            {
                for (int i = 0; i < measurements[0].Value.ElementCount; i++)
                {
                    totals.Add(new double());
                    sendModel.AverageDeviceDatas.Add(new AverageDeviceData
                    {
                        Name = measurements[0].Value.GetElement(i).Name
                    });
                }

                for (int i = 0; i < measurements.Count; i++)
                {
                    for (int j = 0; j < measurements[i].Value.ElementCount; j++)
                    {
                        totals[j] += measurements[i].Value.GetElement(j).Value.ToDouble();
                    }
                }

                for (int i = 0; i < totals.Count; i++)
                {
                    sendModel.AverageDeviceDatas[i].Value = totals[i] / measurements.Count;
                }
            }    
            
            return sendModel;
        }

    }
}
