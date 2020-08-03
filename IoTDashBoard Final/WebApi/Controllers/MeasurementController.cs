using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using DataAccessLayer.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.IIS.Core;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.Extensions.Caching.Distributed;
using Model;
using MongoDB.Bson;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using WebApi.Services;
using WebApi.SignalR;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MeasurementController : ControllerBase
    {
        private readonly IHubContext<SensorHub> hub;
        private readonly IDistributedCache cache;
        private TimerManager timerManager;
        private MeasurementRepository measurementRepository;
        private DashboardRepository dashboardRepository;
        public MeasurementController(DashboardRepository dashboardRepository, IHubContext<SensorHub> hub, IDistributedCache cache, MeasurementRepository measurementRepository)
        {
            this.hub = hub;
            this.cache = cache;
            this.measurementRepository = measurementRepository;
            this.dashboardRepository = dashboardRepository;
        }

        [HttpGet]
        [Route("[action]/{deviceId}")]
        public IActionResult GetRealtimeMeasurementDevice(string deviceId)
        {
            bool result = GroupAndTimer.groupAndTimers.Any(group => group.GroupName == deviceId);
            if (result == false)
            {
                GroupAndTimer.groupAndTimers.Add(new GroupTimerModel
                {
                    GroupName = deviceId,
                    Timer = null
                });
                int index = GroupAndTimer.groupAndTimers.Count - 1;
                DateTime lastSend = new DateTime();
                this.timerManager = new TimerManager(() =>
                {
                    string measurementJson = cache.GetString(deviceId);
                    if (measurementJson != null)
                    {
                        JObject json = JObject.Parse(measurementJson);
                        MeasurementModelSend measurement = new MeasurementModelSend
                        {
                            CreatedDate = DateTime.Parse(json["CreatedDate"].ToString()),
                            Value = json["Value"].ToString()
                        };

                        if (lastSend != measurement.CreatedDate)
                        {
                            hub.Clients.Group(deviceId).SendAsync("SendMessage", measurement);
                        }
                        lastSend = DateTime.Parse(json["CreatedDate"].ToString());

                    }
                }, index);
            }
            else
            {
                int index = -1;
                for (int i = 0; i < GroupAndTimer.groupAndTimers.Count; i++)
                {
                    if (GroupAndTimer.groupAndTimers[i].GroupName == deviceId)
                    {
                        index = i;
                        break;
                    }
                }
                if (index != -1)
                {
                    if (GroupAndTimer.groupAndTimers[index] == null)
                    {
                        timerManager = new TimerManager(() =>
                        {
                            DateTime lastSend = new DateTime();
                            string measurementJson = cache.GetString(deviceId);
                            if (measurementJson != null)
                            {
                                JObject json = JObject.Parse(measurementJson);
                                MeasurementModelSend measurement = new MeasurementModelSend
                                {
                                    CreatedDate = DateTime.Parse(json["CreatedDate"].ToString()),
                                    Value = json["Value"].ToString()
                                };
                                if (lastSend != measurement.CreatedDate)
                                {
                                    hub.Clients.Group(deviceId).SendAsync("SendMessage", measurement);
                                }
                                lastSend = DateTime.Parse(json["CreatedDate"].ToString());

                            }

                        }, index);
                    }
                }
            }
            return Ok();
        }
        [HttpGet]
        [Route("[action]/{dashboardId}")]
        public IActionResult GetMeasurementDashboard(string dashboardId)
        {
            List<ChartModel> chartModels = dashboardRepository.GetChartModels(dashboardId);
            List<ChartModel> chartModelsRealTime = new List<ChartModel>();
            List<string> devices = new List<string>();
            for(int i = 0; i < chartModels.Count; i++)
            {
                if(chartModels[i].TypeData == "Real Time")
                {
                    chartModelsRealTime.Add(chartModels[i]);
                }
            }
            for (int i = 0; i < chartModelsRealTime.Count; i++)
            {
                for(int j = 0; j < chartModelsRealTime[i].Devices.Count; j++)
                {
                    if(devices.Contains(chartModelsRealTime[i].Devices[j]) == false)
                    {
                        devices.Add(chartModelsRealTime[i].Devices[j]);
                    }
                }
            }

            bool result = GroupAndTimer.groupAndTimers.Any(group => group.GroupName == dashboardId);
            if(result == false)
            {
                GroupAndTimer.groupAndTimers.Add(new GroupTimerModel
                {
                    GroupName = dashboardId,
                    Timer = null
                });
                int index = GroupAndTimer.groupAndTimers.Count - 1;
                this.timerManager = new TimerManager(() =>
                {
                    MeasurementModelSendDashboard measurements = new MeasurementModelSendDashboard 
                    {
                        CreatedDate = DateTime.Now,
                    };
                    for(int i = 0; i < devices.Count; i++)
                    {
                        string measurementJson = cache.GetString(devices[i]);
                        if (measurementJson != null)
                        {
                            JObject json = JObject.Parse(measurementJson);
                            MeasurementEndpoint measurement = new MeasurementEndpoint
                            {
                                Id = devices[i],
                                Value = json["Value"].ToString()
                            };
                            measurements.MeasurementEndpoints.Add(measurement);

                        }
                    }
                    hub.Clients.Group(dashboardId).SendAsync("SendMessage", measurements);
                }, index);
            }
            else
            {
                int index = -1;
                for (int i = 0; i < GroupAndTimer.groupAndTimers.Count; i++)
                {
                    if (GroupAndTimer.groupAndTimers[i].GroupName == dashboardId)
                    {
                        index = i;
                        break;
                    }
                }
                if (index != -1)
                {
                    if (GroupAndTimer.groupAndTimers[index] == null)
                    {
                        this.timerManager = new TimerManager(() =>
                        {
                            MeasurementModelSendDashboard measurements = new MeasurementModelSendDashboard
                            {
                                CreatedDate = DateTime.Now,
                            };
                            for (int i = 0; i < devices.Count; i++)
                            {
                                string measurementJson = cache.GetString(devices[i]);
                                if (measurementJson != null)
                                {
                                    JObject json = JObject.Parse(measurementJson);
                                    MeasurementEndpoint measurement = new MeasurementEndpoint
                                    {
                                        Id = devices[i],
                                        Value = json["Value"].ToString()
                                    };
                                    measurements.MeasurementEndpoints.Add(measurement);

                                }
                            }
                            hub.Clients.Group(dashboardId).SendAsync("SendMessage", measurements);
                        }, index);
                    }
                    else
                    {
                        GroupAndTimer.groupAndTimers[index].Timer.Dispose();
                        GroupAndTimer.groupAndTimers[index].Timer = null;
                        this.timerManager = new TimerManager(() =>
                        {
                            MeasurementModelSendDashboard measurements = new MeasurementModelSendDashboard
                            {
                                CreatedDate = DateTime.Now,
                            };
                            for (int i = 0; i < devices.Count; i++)
                            {
                                string measurementJson = cache.GetString(devices[i]);
                                if (measurementJson != null)
                                {
                                    JObject json = JObject.Parse(measurementJson);
                                    MeasurementEndpoint measurement = new MeasurementEndpoint
                                    {
                                        Id = devices[i],
                                        Value = json["Value"].ToString()
                                    };
                                    measurements.MeasurementEndpoints.Add(measurement);
                                }
                            }
                            hub.Clients.Group(dashboardId).SendAsync("SendMessage", measurements);
                        }, index);
                    }
                }
            }
            return Ok();
        }

        [HttpGet]
        [Route("[action]/{deviceId}")]
        [Authorize]
        public IActionResult GetMeasurementDeviceOneHour(string deviceId)
        {
            List<MeasurementEnpointInTime> measurements = measurementRepository.GetMeasurementDeviceInOneHour(deviceId);
            return Ok(measurements);
        }

        [HttpGet]
        [Route("[action]/{deviceId}")]
        [Authorize]
        public IActionResult GetMeasurementDeviceSixHour(string deviceId)
        {
            List<MeasurementEnpointInTime> measurements = measurementRepository.GetMeasurementDeviceInSixHour(deviceId);
            return Ok(measurements);
        }

        [HttpGet]
        [Route("[action]/{deviceId}")]
        public IActionResult GetAverageDeviceOneHour(string deviceId)
        {
            AverageDeviceSendModel averageDeviceSend = measurementRepository.GetAverageDeviceDataOneHour(deviceId);
            return Ok(averageDeviceSend);
        }
    }

}