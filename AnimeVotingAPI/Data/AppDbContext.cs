using AnimeVotingAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace AnimeVotingAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Character> Characters { get; set; }
        public DbSet<Vote> Votes { get; set; }
    }
}
