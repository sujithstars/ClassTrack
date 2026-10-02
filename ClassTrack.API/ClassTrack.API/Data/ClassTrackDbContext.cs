using ClassTrack.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ClassTrack.API.Data
{
    public class ClassTrackDbContext : DbContext
    {
        public ClassTrackDbContext(
            DbContextOptions<ClassTrackDbContext> options)
            : base(options)
        {
        }

        public DbSet<Student> Students { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<Fee> Fees { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Fee>()
                .Property(f => f.Amount)
                .HasPrecision(18, 2);
        }
    }
}