using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace WebApi.Authorization
{
    public class DashboardAuthorizationHandler : AuthorizationHandler<DashboardAuthorizationRequirement, Dashboard>
    {
        private readonly UserManager<AppUser> userManager;
        public DashboardAuthorizationHandler(UserManager<AppUser> userManager)
        {
            this.userManager = userManager;
        }
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, DashboardAuthorizationRequirement requirement, Dashboard resource)
        {
            if (context.User.FindFirst(ClaimTypes.Name).Value == resource.UserId)
            {
                context.Succeed(requirement);
            }
            return Task.CompletedTask;
        }
    }
}
