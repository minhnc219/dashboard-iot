using Microsoft.AspNetCore.SignalR;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.SignalR
{
    public class SensorHub : Hub
    {
        public async Task SendStatusConnected(StatusMessage message)
        {
            await Clients.All.SendAsync("ReceiveStatusConnected", message);
        }

        public async Task SendStatusDisconnected(StatusMessage message)
        { 
            await Clients.All.SendAsync("ReceiveStatusDisconnected", message);
        }

        public Task JoinGroup(string groupName)
        {
            return Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }
        public Task LeaveGroup(string groupName)
        {
            return Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }
    }
}
