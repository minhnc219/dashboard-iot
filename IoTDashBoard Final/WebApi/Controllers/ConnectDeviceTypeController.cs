using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccessLayer.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Model;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConnectDeviceTypeController : ControllerBase
    {
        private readonly ConnectedDeviceTypeRepository connectedDeviceTypeRepository;
        public ConnectDeviceTypeController(ConnectedDeviceTypeRepository connectedDeviceTypeRepository)
        {
            this.connectedDeviceTypeRepository = connectedDeviceTypeRepository;
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetConnectedDeviceTypes()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            List<ConnectedDeviceType> connectedDeviceTypes = connectedDeviceTypeRepository.GetConnectedDeviceTypes();
            return Ok(connectedDeviceTypes);
        }

        [HttpGet]
        [Route("[action]/{deviceTypeId}")]
        public IActionResult GetConnectedDeviceType(string deviceTypeId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (!connectedDeviceTypeRepository.ConnectedDeviceTypeExists(deviceTypeId))
            {
                return NotFound();
            }
            ConnectedDeviceType connectedDeviceType = connectedDeviceTypeRepository.GetConnectedDeviceType(deviceTypeId);
            return Ok(connectedDeviceType);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult CreateConnectedDeviceType([FromBody] ConnectedDeviceType connectedDeviceType)
        {
            if(connectedDeviceType == null)
            {
                return BadRequest(ModelState);
            }    
            if(connectedDeviceTypeRepository.ConnectedDeviceTypeExists(connectedDeviceType.Id) == true)
            {
                ModelState.AddModelError("", $"Device Type Id {connectedDeviceType.Id} already exists");
                return StatusCode(422, ModelState);
            }
            bool isDuplicated = connectedDeviceTypeRepository.IsDuplicatedConnectedDeviceTypeName(connectedDeviceType.Id, connectedDeviceType.Name);
            if (isDuplicated == true)
            {
                ModelState.AddModelError("", $"Device Type Name {connectedDeviceType.Name} already exists");
                return StatusCode(422, ModelState);
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            connectedDeviceTypeRepository.CreateConnectedDeviceType(connectedDeviceType);
            return Ok("Create Success");
        }

        [HttpPut]
        [Route("[action]/{deviceTypeId}")]
        public IActionResult UpdateConnectedDeviceType(string deviceTypeId, [FromBody] ConnectedDeviceType updateConnectedDeviceType)
        {
            if (updateConnectedDeviceType == null)
            {
                return BadRequest(ModelState);
            }
            if (deviceTypeId != updateConnectedDeviceType.Id)
            {
                return BadRequest(ModelState);
            }
            if (!connectedDeviceTypeRepository.ConnectedDeviceTypeExists(deviceTypeId))
            {
                return NotFound();
            }
            if (connectedDeviceTypeRepository.IsDuplicatedConnectedDeviceTypeName(deviceTypeId, updateConnectedDeviceType.Name))
            {
                ModelState.AddModelError("", $"Device Type {updateConnectedDeviceType.Name} already exists");
                return StatusCode(422, ModelState);
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            connectedDeviceTypeRepository.UpdateConnectedDeviceType(deviceTypeId, updateConnectedDeviceType);
            return Ok("Update Success");
        }

        [HttpDelete]
        [Route("[action]/{deviceTypeId}")]
        public IActionResult RemoveConnectedDeviceType(string deviceTypeId)
        {
            if (!connectedDeviceTypeRepository.ConnectedDeviceTypeExists(deviceTypeId))
            {
                return NotFound();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            connectedDeviceTypeRepository.RemoveConnectedDeviceType(deviceTypeId);
            return Ok("Remove Success");
        }
    }
}