using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Model;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace WebApi.Authorization
{
    public class DeviceAuthorizationHandler : AuthorizationHandler<DeviceAuthorizationRequirement, ConnectedDevice>
    {
        private readonly UserManager<AppUser> userManager;
        public DeviceAuthorizationHandler(UserManager<AppUser> userManager)
        {
            this.userManager = userManager;
        }
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, DeviceAuthorizationRequirement requirement, ConnectedDevice resource)
        {
            if(context.User.FindFirst(ClaimTypes.Name).Value == resource.UserId) 
            {
                context.Succeed(requirement);
            }
            return Task.CompletedTask;
        }
    }
}
