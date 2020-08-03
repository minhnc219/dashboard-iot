using Microsoft.AspNetCore.Identity;
using System;

namespace Model
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public virtual ClientUser ClientUser { get; set; }
    }
}
