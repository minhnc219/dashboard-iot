using Microsoft.EntityFrameworkCore.Diagnostics;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataAccessLayer.Repositories
{
    public class ClientUserRepository
    {
        private readonly AccountDbContext dbContext;
        public ClientUserRepository(AccountDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public ClientUser GetClientUser(string userId)
        {
            return dbContext.ClientUsers.Where(client => client.User.Id == userId).FirstOrDefault();
        }

        public string CreateTopic(string id, string topic)
        {
            if (topic[topic.Length - 1] == '/')
            {
                topic += id;
            }
            else
            {
                topic += '/' + id;
            }
            return topic;
        }

        public bool CreateClientUser(ClientUser clientUser)
        {
            dbContext.ClientUsers.Add(clientUser);
            return Save();
        }

        public bool SubcribeTopic(string clientId, string topic)
        {
            ClientUser clientUser = dbContext.ClientUsers.Where(client => client.Id == clientId).FirstOrDefault();
            if (clientUser == null)
            {
                return false;
            }
            clientUser.Topics.Add(topic);
            dbContext.Update(clientUser);
            return Save();
        }

        public bool UnSubcribeTopic(string clientId, string topic)
        {
            ClientUser clientUser = dbContext.ClientUsers.Where(client => client.Id == clientId).FirstOrDefault();
            if (clientUser == null)
            {
                return false;
            }
            clientUser.Topics.Remove(topic);
            dbContext.Update(clientUser);
            return Save();
        }

        public bool DeleteClientUser(string clientId)
        {
            ClientUser clientUser = dbContext.ClientUsers.Where(client => client.Id == clientId).FirstOrDefault();
            if(clientUser == null)
            {
                return false;
            }    
            dbContext.Remove(clientUser);
            return Save();
        }

        public bool Save()
        {
            int saved = dbContext.SaveChanges();
            return saved >= 0 ? true : false;
        }
    }
}
