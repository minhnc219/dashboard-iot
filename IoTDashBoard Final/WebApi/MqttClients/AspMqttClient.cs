using DataAccessLayer.Repositories;
using Microsoft.Extensions.Caching.Distributed;
using Model;
using MongoDB.Bson;
using MQTTnet;
using MQTTnet.Client.Options;
using MQTTnet.Client.Receiving;
using MQTTnet.Extensions.ManagedClient;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace WebApi.MqttClients
{
    public class AspMqttClient
    {
        private ManagedMqttClientOptionsBuilder managedOptionsBuilder;
        private IMqttClientOptions options;
        private IManagedMqttClient client;
        private MeasurementRepository measurementRepository;
        private IDistributedCache cache;
        public AspMqttClient(IMqttClientOptions options, IDistributedCache cache)
        {
            this.measurementRepository = new MeasurementRepository();
            this.cache = cache;
            this.options = options;
            client = new MqttFactory().CreateManagedMqttClient();
            managedOptionsBuilder = new ManagedMqttClientOptionsBuilder()
                .WithClientOptions(this.options);
            client.ApplicationMessageReceivedHandler = new MqttApplicationMessageReceivedHandlerDelegate(OnReceivedApplicationMessage);
        }

        
        private string GetEndpointId(string topic)
        {
            int index = topic.LastIndexOf('/');
            string id = topic.Substring(index + 1);
            return id;
        }

        private void OnReceivedApplicationMessage(MqttApplicationMessageReceivedEventArgs e)
        {
            string topic = e.ApplicationMessage.Topic;
            string id = GetEndpointId(topic);
            string payload = e.ApplicationMessage.ConvertPayloadToString();
            Measurement measurement = new Measurement
            {
                CreatedDate = DateTime.Now,
                Value = BsonDocument.Parse(payload)
            };
            string measurementJson = JsonConvert.SerializeObject(measurement);
            cache.SetString(id, measurementJson);
            measurementRepository.CreateMeasurement(id, measurement);
        }

        public async void PublishMessage(string topic, string message)
        {
            MqttApplicationMessageBuilder messageBuilder = new MqttApplicationMessageBuilder()
                .WithTopic(topic)
                .WithPayload(message);
            await client.PublishAsync(messageBuilder.Build(), CancellationToken.None);
        }

        public async Task StartClientAsync()
        {
            await client.StartAsync(managedOptionsBuilder.Build());
            System.Console.WriteLine("Client is connected");
        }

        public async Task StopClientAsync()
        {
            if (client.IsConnected != false)
            {
                await client.StopAsync();
            }
        }

        public async void SubcribeTopic(string topic)
        {

            await client.SubscribeAsync(new MqttTopicFilter 
            {
                Topic = topic
            });
        }

        public async void UnSubcribeTopic(string topic)
        {
            await client.UnsubscribeAsync(topic);
        }
    }
}

