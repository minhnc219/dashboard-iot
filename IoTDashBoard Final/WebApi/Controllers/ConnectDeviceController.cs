using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using DataAccessLayer.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Model;
using WebApi.Models;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConnectDeviceController : ControllerBase
    {
        private readonly ConnectedDeviceRepository connectedDeviceRepository;
        private IAuthorizationService authService;
        private readonly DeviceRepository deviceRepository;
        public ConnectDeviceController(DeviceRepository deviceRepository, ConnectedDeviceRepository connectedDeviceRepository, IAuthorizationService authService)
        {
            this.connectedDeviceRepository = connectedDeviceRepository;
            this.authService = authService;
            this.deviceRepository = deviceRepository;
        }

        [HttpGet]
        [Route("[action]")]
        [Authorize]
        public IActionResult GetConnectedDevices()
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }    
            ClaimsIdentity claimIdentity = this.User.Identity as ClaimsIdentity;
            string userId = claimIdentity.FindFirst(ClaimTypes.Name).Value;
            if(userId == null)
            {
                return BadRequest(ModelState);
            }
            List<ConnectedDevice> connectedDevices = connectedDeviceRepository.GetConnectedDevices(userId);
            List<ConnectedDeviceDto> connectedDeviceDtos = new List<ConnectedDeviceDto>();
            foreach(ConnectedDevice connectedDevice in connectedDevices)
            {
                connectedDeviceDtos.Add(new ConnectedDeviceDto 
                {
                    Id = connectedDevice.Id,
                    ConnectedDeviceTypeId = connectedDevice.ConnectedDeviceTypeId,
                    Name = connectedDevice.Name,
                    Location = connectedDevice.Location,
                    DeviceUsedGPIOs = connectedDevice.DeviceUsedGPIOs
                });
            }    
            return Ok(connectedDeviceDtos);
        }

        [HttpGet]
        [Route("[action]")]
        [Authorize]
        public IActionResult GetAllDevices()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            ClaimsIdentity claimIdentity = this.User.Identity as ClaimsIdentity;
            string userId = claimIdentity.FindFirst(ClaimTypes.Name).Value;
            if (userId == null)
            {
                return BadRequest(ModelState);
            }
            List<ConnectedDevice> connectedDevices = connectedDeviceRepository.GetConnectedDevices(userId);
            List<DeviceDto> devices = new List<DeviceDto>();
            foreach(ConnectedDevice connectedDevice in connectedDevices)
            {
                devices.AddRange(this.deviceRepository.GetDevices(connectedDevice.Id));
            }
            return Ok(devices);
        }

        [HttpGet]
        [Route("[action]/{deviceId}")]
        [Authorize]
        public IActionResult GetConnectedDevice(string deviceId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (!connectedDeviceRepository.ConnectedDeviceExists(deviceId))
            {
                return NotFound();
            }
            ConnectedDevice connectedDevice = connectedDeviceRepository.GetConnectedDevice(deviceId);
            AuthorizationResult result = authService.AuthorizeAsync(User, connectedDevice, "DeviceAuthorization").Result;
            if(!result.Succeeded)
            {
                return Forbid();
            }    
            return Ok(connectedDevice);
        }

        [HttpPost]
        [Route("[action]")]
        [Authorize]
        public IActionResult CreateConnectedDevice([FromBody] ConnectedDeviceCreateModel model)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }    
            if(model == null)
            {
                return BadRequest(ModelState);
            }    
            ClaimsIdentity claimIdentity = HttpContext.User.Identity as ClaimsIdentity;
            string userId = claimIdentity.FindFirst(ClaimTypes.Name)?.Value;
            if(userId == null)
            {
                return BadRequest(ModelState);
            }
            ConnectedDevice connectedDevice = new ConnectedDevice
            {
                UserId = userId,
                ConnectedDeviceTypeId = model.ConnectedDeviceTypeId,
                Location = model.Location,
                Name = model.Name,
                DeviceUsedGPIOs = model.DeviceUsedGPIOs
            };
            connectedDeviceRepository.CreateConnectedDevice(connectedDevice);
            return Ok("Create Success");
        }

    }
}