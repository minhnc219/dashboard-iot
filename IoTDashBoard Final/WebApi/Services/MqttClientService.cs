using DataAccessLayer.Repositories;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Hosting;
using MQTTnet.Client.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebApi.MqttClients;

namespace WebApi.Services
{
    public class MqttClientService : IHostedService
    {
        private AspMqttClient client;
        public MqttClientService(IMqttClientOptions options, IDistributedCache cache)
        {
            this.client = new AspMqttClient(options, cache);
        }
        public Task StartAsync(CancellationToken cancellationToken)
        {
            return client.StartClientAsync();
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return client.StopClientAsync();
        }

        public void PublishMessage(string topic, string message)
        {
            client.PublishMessage(topic, message);
        }
        public void SubscribeTopic(string topic)
        {
            client.SubcribeTopic(topic);
        }

        public void UnsubscribeTopic(string topic)
        {
            client.UnSubcribeTopic(topic);
        }
    }
}
