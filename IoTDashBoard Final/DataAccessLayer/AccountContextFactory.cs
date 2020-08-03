using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataAccessLayer
{
    public class AccountContextFactory : IDesignTimeDbContextFactory<AccountDbContext>
    {
        public AccountDbContext CreateDbContext(string[] args)
        {
            string connectionString = @"Server=DESKTOP-I84VFOJ;Database=IdentityUser;Trusted_Connection=True;MultipleActiveResultSets=true";
            DbContextOptionsBuilder<AccountDbContext> builder = new DbContextOptionsBuilder<AccountDbContext>();
            builder.UseSqlServer(connectionString);
            return new AccountDbContext(builder.Options);
        }
    }
}
