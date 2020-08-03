using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccessLayer.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Model;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceTypeController : ControllerBase
    {
        private readonly DeviceTypeRepository deviceTypeRepository;
        public DeviceTypeController(DeviceTypeRepository deviceTypeRepository)
        {
            this.deviceTypeRepository = deviceTypeRepository;
        }

        [HttpGet]
        [Route("[action]")]
        [Authorize]
        public IActionResult GetDeviceTypes()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            List<DeviceType> deviceTypes = deviceTypeRepository.GetDeviceTypes();
            return Ok(deviceTypes);
        }

        [HttpGet]
        [Route("[action]/{deviceTypeId}")]
        [Authorize]
        public IActionResult GetDeviceType(string deviceTypeId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if(!deviceTypeRepository.DeviceTypeExists(deviceTypeId))
            {
                return NotFound();
            }
            DeviceType deviceType = deviceTypeRepository.GetDeviceType(deviceTypeId);
            return Ok(deviceType);
        }

        [HttpPost]
        [Route("[action]")]
        [Authorize]
        public IActionResult CreateDeviceType([FromBody] DeviceType deviceType)
        {
            if (deviceType == null)
            {
                return BadRequest(ModelState);
            }
            if (deviceTypeRepository.DeviceTypeExists(deviceType.Id) == true)
            {
                ModelState.AddModelError("", $"Device Type Id {deviceType.Id} already exists");
                return StatusCode(422, ModelState);
            }
            bool isDuplicated = deviceTypeRepository.IsDuplicatedDeviceTypeName(deviceType.Id, deviceType.Name);
            if (isDuplicated == true)
            {
                ModelState.AddModelError("", $"Device Type Name {deviceType.Name} already exists");
                return StatusCode(422, ModelState);
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            deviceTypeRepository.CreateDeviceType(deviceType);
            return Ok("Create Success");
        }
        [HttpPut]
        [Route("[action]/{deviceTypeId}")]
        [Authorize]
        public IActionResult UpdateDeviceType(string deviceTypeId, [FromBody] DeviceType updateDeviceType)
        {
            if (updateDeviceType == null)
            {
                return BadRequest(ModelState);
            }
            if (deviceTypeId != updateDeviceType.Id)
            {
                return BadRequest(ModelState);
            }
            if (!deviceTypeRepository.DeviceTypeExists(deviceTypeId))
            {
                return NotFound();
            }
            if (deviceTypeRepository.IsDuplicatedDeviceTypeName(deviceTypeId, updateDeviceType.Name))
            {
                ModelState.AddModelError("", $"Device Type {updateDeviceType.Name} already exists");
                return StatusCode(422, ModelState);
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            deviceTypeRepository.UpdateDeviceType(deviceTypeId, updateDeviceType);
            return Ok("Update Success");
        }

        [HttpDelete]
        [Route("[action]/{deviceTypeId}")]
        [Authorize]
        public IActionResult DeleteDeviceType(string deviceTypeId)
        {
            if (!deviceTypeRepository.DeviceTypeExists(deviceTypeId))
            {
                return NotFound();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            deviceTypeRepository.RemoveDeviceType(deviceTypeId);
            return Ok("Remove Success");
        }
    }
}