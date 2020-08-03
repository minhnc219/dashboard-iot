using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Metadata.Conventions.Infrastructure;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataAccessLayer.Configuration
{
    public class ClientUserConfig : IEntityTypeConfiguration<ClientUser>
    {
        public void Configure(EntityTypeBuilder<ClientUser> builder)
        {
            builder.ToTable("Clients");
            builder.HasKey(client => client.Id);
            builder.Property(client => client.Id)
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(client => client.Topics)
                .HasConversion(
                topics => string.Join(',', topics),
                topics => topics.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList());
            builder.HasOne(client => client.User)
                .WithOne(user => user.ClientUser)
                .HasForeignKey<ClientUser>(client => client.UserId);
        }
    }
}
