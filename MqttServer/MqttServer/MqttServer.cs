using Model;
using MongoDB.Driver;
using MQTTnet;
using MQTTnet.Server;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using WebApi.Models;

namespace MqttServer
{
    public class MqttServer
    {
        private MqttFactory factory;
        public IMqttServer Server { get; set; }
        public MqttServerOptionsBuilder Options { get; set; }
        private IMongoCollection<ConnectedDevice> connectedDevices;
        private IMongoCollection<Device> devices;
        public MqttServer()
        {
            IMongoClient client = new MongoClient("mongodb://localhost:27017");
            IMongoDatabase database = client.GetDatabase("IotDatabase");
            connectedDevices = database.GetCollection<ConnectedDevice>("ConnectedDevices");
            this.devices = database.GetCollection<Device>("Devices");
        }
        public void InitialServer()
        {
            factory = new MqttFactory();
            this.Server = factory.CreateMqttServer();
            Options = new MqttServerOptionsBuilder()
                .WithDefaultEndpointBoundIPAddress(IPAddress.Any)
                .WithDefaultEndpointPort(23000)
                .WithClientId("Server")
                .WithConnectionBacklog(100);
        }
        private void OnServerStarted(EventArgs e)
        {
            Console.WriteLine("Server started");
        }
        private void OnServerStopped(EventArgs e)
        {
            Console.WriteLine("Server stopped");
        }

        private void OnClientConnectedHandler(MqttServerClientConnectedEventArgs e)
        {
            Console.WriteLine("Client Id: " + e.ClientId + " is connected");            
        }

        private void OnClientDisconnectedHandler(MqttServerClientDisconnectedEventArgs e)
        {
            Console.WriteLine("Client Id: " + e.ClientId + " is disconnected");
            
        }

        private void OnClientSubscribedTopicHandler(MqttServerClientSubscribedTopicEventArgs e)
        {
            Console.WriteLine("Client Id: " + e.ClientId + " subscribed topic " + e.TopicFilter.Topic);
        }
        private void OnClientUnsubscribedTopicHandler(MqttServerClientUnsubscribedTopicEventArgs e)
        {
            Console.WriteLine("Client Id: " + e.ClientId + " unsubcribed topic " + e.TopicFilter);
        }

        public async void StartServer()
        {
            if (this.Server == null)
            {
                InitialServer();
            }
            Server.StartedHandler = new MqttServerStartedHandlerDelegate(OnServerStarted);
            Server.ClientConnectedHandler = new MqttServerClientConnectedHandlerDelegate(OnClientConnectedHandler);
            Server.ClientDisconnectedHandler = new MqttServerClientDisconnectedHandlerDelegate(OnClientDisconnectedHandler);
            Server.ClientSubscribedTopicHandler = new MqttServerClientSubscribedHandlerDelegate(OnClientSubscribedTopicHandler);
            Server.ClientUnsubscribedTopicHandler = new MqttServerClientUnsubscribedTopicHandlerDelegate(OnClientUnsubscribedTopicHandler);
            try
            {
                await Server.StartAsync(Options.Build());
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                await Server.StopAsync();
                this.Server = null;
            }

        }
        public async void StopServer()
        {
            if (this.Server == null)
            {
                Console.WriteLine("Server is off");
                return;
            }
            Server.StoppedHandler = new MqttServerStoppedHandlerDelegate(OnServerStopped);
            await this.Server.StopAsync();
            this.Server = null;
        }
    }
}
