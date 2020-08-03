using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Hosting;
using Model;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Cache;
using System.Threading;
using System.Threading.Tasks;
using WebApi.SignalR;

namespace WebApi.Services
{
    public class ClientSocketService : BackgroundService
    {
        //private readonly IHubContext<SensorHub> hub;
        //private readonly IDistributedCache cache;
        //public static List<string> devices;
        private Timer timer;
        public static Action action;
        public ClientSocketService()
        {
            action = () => { };
        }
        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            timer = new Timer(Execute, null, 0, 5000);
            return Task.CompletedTask;
        }

        private void Execute(object state)
        {
            action();
        }
    }
}
