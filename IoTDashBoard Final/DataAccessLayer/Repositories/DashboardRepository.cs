using Model;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataAccessLayer.Repositories
{
    public class DashboardRepository
    {
        private readonly IMongoCollection<Dashboard> dashboards;
        public DashboardRepository()
        {
            IMongoClient client = new MongoClient("mongodb://localhost:27017");
            IMongoDatabase database = client.GetDatabase("IotDatabase");
            dashboards = database.GetCollection<Dashboard>("Dashboards");
        }
        public bool DashboardExists(string dashboardId)
        {
            return dashboards.Find(dashboard => dashboard.Id == dashboardId).Any();
        }
        public List<Dashboard> GetDashboards(string userId)
        {
            return dashboards.Find(dashboard => dashboard.UserId == userId).ToList();
        }
        public Dashboard GetDashboard(string dashboardId)
        {
            return dashboards.Find(dashboard => dashboard.Id == dashboardId).FirstOrDefault();
        }
        public void CreateDashboard(Dashboard dashboard)
        {
            dashboards.InsertOne(dashboard);
        }
        public void UpdateDashboard(string dashboardId, Dashboard updateDashboard)
        {
            FilterDefinition<Dashboard> filter = Builders<Dashboard>.Filter.Eq(dashboard => dashboard.Id, dashboardId);
            UpdateDefinition<Dashboard> update = Builders<Dashboard>.Update
                .Set(dashboard => dashboard.Name, updateDashboard.Name);
            dashboards.FindOneAndUpdate(filter, update);
        }
        public void DeleteDashboard(string dashboardId)
        {
            dashboards.DeleteOne(dashboard => dashboard.Id == dashboardId);
        }

        public void AddChartModel(string dashboardId, ChartModel model)
        {
            FilterDefinition<Dashboard> filter = Builders<Dashboard>.Filter.Eq(dashboard => dashboard.Id, dashboardId);
            UpdateDefinition<Dashboard> update = Builders<Dashboard>.Update
                .AddToSet(dashboard => dashboard.ChartModels, model);
            dashboards.FindOneAndUpdate(filter, update);
        }
        public void UpdateChartModel(string dashboardId, string chartModelId, ChartModel model)
        {
            FilterDefinition<Dashboard> filter = Builders<Dashboard>.Filter.And(
                Builders<Dashboard>.Filter.Eq(dashboard => dashboard.Id, dashboardId),
                Builders<Dashboard>.Filter.ElemMatch(dashboard => dashboard.ChartModels,
                Builders<ChartModel>.Filter.Eq(model => model.Id, chartModelId)));
            UpdateDefinition<Dashboard> update = Builders<Dashboard>.Update
                .Set(dashboard => dashboard.ChartModels[-1], model);
            dashboards.FindOneAndUpdate(filter, update);
        }
        public void DeleteChartModel(string dashboardId, string chartModelId)
        {
            ChartModel model = dashboards.Find(dashboard => dashboard.Id == dashboardId).FirstOrDefault()
                .ChartModels.Where(model => model.Id == chartModelId).FirstOrDefault();
            FilterDefinition<Dashboard> filter = Builders<Dashboard>.Filter.Eq(dashboard => dashboard.Id, dashboardId);
            UpdateDefinition<Dashboard> update = Builders<Dashboard>.Update
                .Pull(dashboard => dashboard.ChartModels, model);
            dashboards.FindOneAndUpdate(filter, update);
        }
        public List<ChartModel> GetChartModels(string dashboardId)
        {
            List<ChartModel> chartModels = dashboards.Find(dashboard => dashboard.Id == dashboardId)
                .FirstOrDefault().ChartModels;
            return chartModels;
        }
    }
}
