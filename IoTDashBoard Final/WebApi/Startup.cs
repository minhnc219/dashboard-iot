using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccessLayer;
using DataAccessLayer.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Model;
using WebApi.Authorization;
using WebApi.Extensions;
using WebApi.Services;
using WebApi.Settings;
using WebApi.SignalR;

namespace WebApi
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            MapBrokerHostSettings();
            MapClientSettings();
        }
        private void MapBrokerHostSettings()
        {
            BrokerHostSetting brokerHostSettings = new BrokerHostSetting();
            Configuration.GetSection(nameof(BrokerHostSetting)).Bind(brokerHostSettings);
            AppSettingsProvider.brokerHostSetting = brokerHostSettings;
        }

        private void MapClientSettings()
        {
            ClientSetting clientSettings = new ClientSetting();
            Configuration.GetSection(nameof(ClientSetting)).Bind(clientSettings);
            AppSettingsProvider.clientSetting = clientSettings;
        }
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            string connectionString = @"Server=DESKTOP-I84VFOJ;Database=IdentityUser;Trusted_Connection=True;MultipleActiveResultSets=true";
            services.AddControllers();
            services.AddDbContext<AccountDbContext>(options => options.UseSqlServer(connectionString));
            services.AddIdentity<AppUser, IdentityRole>()
                .AddEntityFrameworkStores<AccountDbContext>()
                .AddDefaultTokenProviders();
            services.AddTransient<IAuthorizationHandler, DeviceAuthorizationHandler>();
            services.AddTransient<IAuthorizationHandler, DashboardAuthorizationHandler>();
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
                {
                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("secret key vampireking"));
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });
            services.AddHostedService<ClientSocketService>();
            services.AddAuthorization(opts => 
            {
                opts.AddPolicy("DeviceAuthorization", policy => 
                {
                    policy.AddRequirements(new DeviceAuthorizationRequirement());
                });
                opts.AddPolicy("DashboardAuthorization", policy => 
                {
                    policy.AddRequirements(new DashboardAuthorizationRequirement());
                });
            });

            services.AddMqttClientHostedService();
            services.AddStackExchangeRedisCache(options => 
            {
                options.Configuration = "localhost:6379";
                options.InstanceName = "RedisCache";
            });
            services.AddCors(options => options.AddPolicy("CorsPolicy",
            builder =>
            {
                builder.AllowAnyMethod().AllowAnyHeader()
                       .WithOrigins("http://localhost:3000")
                       .AllowCredentials();
            }));
            services.AddSignalR();
            services.AddScoped<ClientUserRepository>();
            services.AddScoped<UserRepository>();
            services.AddScoped<JwtGenerator>();
            services.AddScoped<UserService>();
            services.AddScoped<DeviceTypeRepository>();
            services.AddScoped<DeviceRepository>();
            services.AddScoped<DashboardRepository>();
            services.AddScoped<MeasurementRepository>();
            services.AddScoped<ConnectedDeviceTypeRepository>();
            services.AddScoped<ConnectedDeviceRepository>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseCors("CorsPolicy");
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<SensorHub>("/sensorhub");
            });
        }
    }
}
