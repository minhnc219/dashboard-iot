using Microsoft.AspNetCore.Identity;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Repositories
{
    public class UserRepository
    {
        private UserManager<AppUser> userManager;
        private ClientUserRepository clientUserRepository;
        public UserRepository(UserManager<AppUser> userManager, ClientUserRepository clientUserRepository)
        {
            this.clientUserRepository = clientUserRepository;
            this.userManager = userManager;
        }

        public async Task<bool> UserExists(string userId)
        {
            AppUser user = await userManager.FindByIdAsync(userId);
            if(user != null)
            {
                return true;
            }    
            else
            {
                return false;
            }    
        }

        public async Task<bool> CreateUser(UserRegisterModel model)
        {
            if ((userManager.Users.Any(user => user.Email.Trim().ToLower() == model.Email.Trim().ToLower()) || 
                userManager.Users.Any(user => user.UserName.Trim().ToLower() == model.Username.Trim().ToLower())) == false)
            {
                AppUser newUser = new AppUser
                {
                    UserName = model.Username,
                    Email = model.Email,
                    DisplayName = model.DisplayName
                };
                IdentityResult result = await userManager.CreateAsync(newUser, model.Password);
                if (result.Succeeded)
                {
                    AppUser user = await userManager.FindByNameAsync(model.Username);
                    ClientUser clientUser = new ClientUser
                    {
                        Id = Guid.NewGuid().ToString(),
                        UserId = user.Id,
                        User = user
                    };
                    clientUserRepository.CreateClientUser(clientUser);
                    return true;
                }
                else
                {
                    return false;
                }

            }
            else
            {
                return false;
            }

        }
        public async Task<AppUser> GetUser(UserLoginModel model)
        {
            if (string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.Password))
            {
                return null;
            }
            AppUser user = await userManager.FindByNameAsync(model.Username);
            if (user == null)
            {
                return null;
            }
            bool checkPassword = await userManager.CheckPasswordAsync(user, model.Password);
            if (checkPassword == false)
            {
                return null;
            }
            else
            {
                return user;
            }
        }

        public Task<bool> DeleteUser(string userId)
        {
            throw new NotImplementedException();
        }
    }
}
