using DataAccessLayer.Repositories;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Services
{
    public class UserService
    {
        private UserRepository userRepository;
        private JwtGenerator generator;
        public UserService(UserRepository userRepository, JwtGenerator generator)
        {
            this.userRepository = userRepository;
            this.generator = generator;
        }

        public string GetUserId(UserLoginModel model)
        {
            AppUser user = userRepository.GetUser(model).Result;
            if (user == null)
            {
                return null;
            }
            else
            {
                return user.Id;
            }    
        }
        public UserModel Authenticate(UserLoginModel model)
        {
            AppUser user = userRepository.GetUser(model).Result;
            if (user == null)
            {
                return null;
            }
            else
            {
                UserModel userModel = new UserModel
                {
                    DisplayName = user.DisplayName,
                    Email = user.Email,
                    Token = generator.CreateToken(user)
                };
                return userModel;
            }

        }

        public bool CreateUser(UserRegisterModel model)
        {
            bool registerResult = userRepository.CreateUser(model).Result;
            return registerResult;
        }

        public string DeleteUser()
        {
            throw new NotImplementedException();
        }
    }
}
