using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using DataAccessLayer.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Model;
using WebApi.Models;
using WebApi.Services;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceController : ControllerBase
    {
        private readonly DeviceRepository deviceRepository;
        private readonly ClientUserRepository clientUserRepository;
        private MqttClientService clientService;
        public DeviceController(DeviceRepository deviceRepository, ClientUserRepository clientUserRepository, MqttClientService clientService)
        {
            this.deviceRepository = deviceRepository;
            this.clientUserRepository = clientUserRepository;
            this.clientService = clientService;
        }
        [HttpGet]
        [Route("[action]/{connectedDeviceId}")]
        [Authorize]
        public IActionResult GetDevices(string connectedDeviceId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            List<DeviceDto> deviceDtos = deviceRepository.GetDevices(connectedDeviceId);
            return Ok(deviceDtos);
        }

        [HttpGet]
        [Route("[action]/{deviceId}")]
        [Authorize]
        public IActionResult GetDevice(string deviceId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if(!deviceRepository.DeviceExists(deviceId))
            {
                return NotFound();
            }    
            DeviceDto deviceDto = deviceRepository.GetDevice(deviceId);
            return Ok(deviceDto);
        }

        [HttpPost]
        [Route("[action]")]
        [Authorize]
        public IActionResult CreateDevice([FromBody]Device device)
        {
            if(device == null)
            {
                return BadRequest(ModelState);
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (deviceRepository.DeviceExists(device.Id) == true)
            {
                ModelState.AddModelError("", $"Device Type Id {device.Id} already exists");
                return StatusCode(422, ModelState);
            }
            deviceRepository.CreateDevice(device);
            string topic = clientUserRepository.CreateTopic(device.Id, device.Topic);
            ClaimsIdentity claimIdentity = this.User.Identity as ClaimsIdentity;
            string userId = claimIdentity.FindFirst(ClaimTypes.Name).Value;
            ClientUser client = clientUserRepository.GetClientUser(userId);
            clientUserRepository.SubcribeTopic(client.Id, topic);
            clientService.SubscribeTopic(topic);
            return Ok("Create Success");
        }

        [HttpPut]
        [Route("[action]/{deviceId}")]
        [Authorize]
        public IActionResult UpdateDevice(string deviceId, Device updateDevice)
        {
            if(updateDevice == null)
            {
                return BadRequest(ModelState);
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (deviceId != updateDevice.Id)
            {
                return BadRequest(ModelState);
            }
            if (!deviceRepository.DeviceExists(deviceId))
            {
                ModelState.AddModelError("", $"Device Type Id {deviceId} no exists");
                return NotFound(ModelState);
            }
            DeviceDto device = deviceRepository.GetDevice(deviceId);
            string topic = clientUserRepository.CreateTopic(device.Id, device.Topic);
            ClaimsIdentity claimIdentity = this.User.Identity as ClaimsIdentity;
            string userId = claimIdentity.FindFirst(ClaimTypes.Name).Value;
            ClientUser client = clientUserRepository.GetClientUser(userId);
            clientUserRepository.UnSubcribeTopic(client.Id, topic);
            clientService.UnsubscribeTopic(topic);
            deviceRepository.UpdateDevice(deviceId, updateDevice);
            string newTopic = clientUserRepository.CreateTopic(updateDevice.Id, updateDevice.Topic);
            clientUserRepository.SubcribeTopic(client.Id, newTopic);
            clientService.SubscribeTopic(newTopic);
            return Ok("Update Success");
        }

        [HttpDelete]
        [Route("[action]/{deviceId}")]
        [Authorize]
        public IActionResult DeleteDevice(string deviceId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (!deviceRepository.DeviceExists(deviceId))
            {
                return NotFound();
            }
            DeviceDto device = deviceRepository.GetDevice(deviceId);
            string topic = clientUserRepository.CreateTopic(device.Id, device.Topic);
            ClaimsIdentity claimIdentity = this.User.Identity as ClaimsIdentity;
            string userId = claimIdentity.FindFirst(ClaimTypes.Name).Value;
            ClientUser client = clientUserRepository.GetClientUser(userId);
            clientUserRepository.UnSubcribeTopic(client.Id, topic);
            clientService.UnsubscribeTopic(topic);
            deviceRepository.RemoveDevice(deviceId);
            return Ok("Delete Success");
        }

    }
}