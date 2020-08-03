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

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly DashboardRepository dashboardRepository;
        private IAuthorizationService authService;
        public DashboardController(DashboardRepository dashboardRepository, IAuthorizationService authService)
        {
            this.dashboardRepository = dashboardRepository;
            this.authService = authService;
        }
        [HttpGet]
        [Route("[action]")]
        [Authorize]
        public IActionResult GetDashboards()
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
            List<Dashboard> dashboards = dashboardRepository.GetDashboards(userId);
            List<DashboardDto> dashboardDtos = new List<DashboardDto>();
            foreach (Dashboard dashboard in dashboards)
            {
                dashboardDtos.Add(new DashboardDto
                {
                    Id = dashboard.Id,
                    Name = dashboard.Name,
                });
            }
            return Ok(dashboardDtos);
        }

        [HttpGet]
        [Route("[action]/{dashboardId}")]
        [Authorize]
        public IActionResult GetDashboard(string dashboardId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (!dashboardRepository.DashboardExists(dashboardId))
            {
                return NotFound();
            }
            Dashboard dashboard = dashboardRepository.GetDashboard(dashboardId);
            AuthorizationResult result = authService.AuthorizeAsync(User, dashboard, "DashboardAuthorization").Result;
            if (!result.Succeeded)
            {
                return Forbid();
            }
            return Ok(dashboard);
        }

        [HttpPost]
        [Route("[action]")]
        [Authorize]
        public IActionResult CreateDashboard([FromBody] Dashboard model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (model == null)
            {
                return BadRequest(ModelState);
            }
            ClaimsIdentity claimIdentity = HttpContext.User.Identity as ClaimsIdentity;
            string userId = claimIdentity.FindFirst(ClaimTypes.Name)?.Value;
            if (userId == null)
            {
                return BadRequest(ModelState);
            }
            Dashboard dashboard = new Dashboard
            {
                UserId = userId,
                Name = model.Name,
            };
            dashboardRepository.CreateDashboard(dashboard);
            return Ok("Create Success");
        }

        [HttpPost]
        [Route("[action]/{dashboardId}")]
        [Authorize]
        public IActionResult UpdateDashboard(string dashboardId, [FromBody] Dashboard updateDashboard)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            dashboardRepository.UpdateDashboard(dashboardId, updateDashboard);
            return Ok("Update Success");
        }

        [HttpDelete]
        [Route("[action]/{dashboardId}")]
        [Authorize]
        public IActionResult DeleteDashboard(string dashboardId)
        {
            dashboardRepository.DeleteDashboard(dashboardId);
            return Ok("Delete Success");
        }

        [HttpPost]
        [Route("[action]/{dashboardId}")]
        [Authorize]
        public IActionResult CreateChartModel(string dashboardId, [FromBody] ChartModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (model == null)
            {
                return BadRequest(ModelState);
            }
            dashboardRepository.AddChartModel(dashboardId, model);
            return Ok("Create Success");
        }

        [HttpPost]
        [Route("[action]/{dashboardId}/{chartModelId}")]
        [Authorize]
        public IActionResult UpdateChartModel(string dashboardId, string chartModelId, [FromBody] ChartModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (model == null)
            {
                return BadRequest(ModelState);
            }
            dashboardRepository.UpdateChartModel(dashboardId, chartModelId, model);
            return Ok("Update Success");
        }

        [HttpDelete]
        [Route("[action]/{dashboardId}/{chartModelId}")]
        [Authorize]
        public IActionResult DeleteChartModel(string dashboardId, string chartModelId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            dashboardRepository.DeleteChartModel(dashboardId, chartModelId);
            return Ok("Delete Success");
        }

        [HttpGet]
        [Route("[action]/{dashboardId}")]
        [Authorize]
        public IActionResult GetChartModels(string dashboardId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            List<ChartModel> chartModels = dashboardRepository.GetChartModels(dashboardId);
            return Ok(chartModels);
        }

    }
}