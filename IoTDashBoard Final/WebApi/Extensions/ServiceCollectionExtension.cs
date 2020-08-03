using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MQTTnet.Client.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Options;
using WebApi.Services;
using WebApi.Settings;

namespace WebApi.Extensions
{
    public static class ServiceCollectionExtension
    {
        private static IServiceCollection AddMqttClientServiceWithConfig(this IServiceCollection services, Action<AspMqttClientOptionsBuilder> configure)
        {
            services.AddSingleton<IMqttClientOptions>(serviceProvider =>
            {
                var optionBuilder = new AspMqttClientOptionsBuilder(serviceProvider);
                configure(optionBuilder);
                return optionBuilder.Build();
            });
            services.AddSingleton<MqttClientService>();
            services.AddSingleton<IHostedService>(serviceProvider =>
            {
                return serviceProvider.GetService<MqttClientService>();
            });

            return services;
        }

        public static IServiceCollection AddMqttClientHostedService(this IServiceCollection services)
        {
            services.AddMqttClientServiceWithConfig(aspOptionBuilder =>
            {
                var clientSettings = AppSettingsProvider.clientSetting;
                var brokerHostSettings = AppSettingsProvider.brokerHostSetting;
                aspOptionBuilder
                .WithClientId(clientSettings.Id)
                .WithTcpServer(brokerHostSettings.Host, brokerHostSettings.Port);
            });
            return services;
        }
    }
}
