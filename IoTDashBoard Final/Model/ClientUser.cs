using System;
using System.Collections.Generic;
using System.Text;

namespace Model
{
    public class ClientUser
    {
        //properties
        public string Id { get; set; }
        public List<string> Topics { get; set; }

        //relationships
        public string UserId { get; set; }
        public virtual AppUser User { get; set; }
        public ClientUser()
        {
            Topics = new List<string>();
        }
    }
}
