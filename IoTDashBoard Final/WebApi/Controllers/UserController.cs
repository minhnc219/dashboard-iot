using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataAccessLayer.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Model;
using WebApi.Services;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private UserService userService;
        private ClientUserRepository clientUserRepository;
        private MqttClientService clientService;
        public UserController(UserService userService, ClientUserRepository clientUserRepository, MqttClientService clientService)
        {
            this.userService = userService;
            this.clientUserRepository = clientUserRepository;
            this.clientService = clientService;
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult Register([FromBody] UserRegisterModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            bool result = userService.CreateUser(model);
            if(result == false)
            {
                ModelState.AddModelError("", $"Register failed");
                return BadRequest(ModelState);
            }
            else
            {
                return Ok("Register Success");
            }

        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult Authenticate([FromBody] UserLoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            UserModel userModel = userService.Authenticate(model);
            string userId = userService.GetUserId(model);
            if (userModel == null)
            {
                return BadRequest(ModelState);
            }
            else
            {
                ClientUser client = clientUserRepository.GetClientUser(userId);
                List<string> topics = client.Topics;
                if(topics != null)
                {
                    for (int i = 0; i < topics.Count; i++)
                    {
                        clientService.SubscribeTopic(topics[i]);
                    }
                }
                return Ok(userModel);
            }
        }

        [Authorize]
        [HttpGet]
        [Route("[action]")]
        public string Post()
        {
            return "Hello World";
        }
    }
}