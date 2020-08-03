using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using DataAccessLayer.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Model;
using Newtonsoft.Json.Linq;
using WebApi.Services;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        private ClientUserRepository clientUser;
        private MqttClientService service;
        public ClientController(ClientUserRepository clientUser, MqttClientService service)
        {
            this.clientUser = clientUser;
            this.service = service;
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Subcribe([FromBody] Topic topic)
        {
            service.SubscribeTopic(topic.Value);
            return Ok();
        }
    }
}