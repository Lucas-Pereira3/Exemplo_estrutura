using Microsoft.EntityFrameworkCore;
using Ofiador.API.Models;

namespace Ofiador.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //Modelo de Usuario
            modelBuilder.Entity<Usuario>()
                .HasKey(u => u.IdUsuario);

            //Modelo de Empresa
            modelBuilder.Entity<Empresa>().HasKey(e => e.IdEmpresa);

            modelBuilder.Entity<Empresa>()
                .HasIndex(e => e.Cnpj)
                .IsUnique();

            //Modelo do Cliente
            modelBuilder.Entity<Cliente>()
            .HasKey(c => c.IdCliente);

            modelBuilder.Entity<Cliente>()
                .HasOne(c => c.Empresa)
                .WithMany()
                .HasForeignKey(c => c.IdEmpresa)
                .IsRequired();

            modelBuilder.Entity<Cliente>()
                .HasIndex(c => c.Cpf_Cnpj)
                .IsUnique();

            //Modelo Compra
            modelBuilder.Entity<Compra>()
            .HasKey(c => c.IdCompra);

            modelBuilder.Entity<Compra>()
                .HasOne(c => c.Cliente)
                .WithMany()
                .HasForeignKey(c => c.IdCliente);

            modelBuilder.Entity<Compra>()
                .HasOne(c => c.Empresa)
                .WithMany()
                .HasForeignKey(c => c.IdEmpresa);
        }

        // Por enquanto, sem DbSets - vamos adicionar depois
        // Quando criar os modelos, descomente as linhas abaixo:
        public DbSet<Empresa> Empresas { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Compra> Compras { get; set; }
        // public DbSet<Parcela> Parcelas { get; set; }
        // public DbSet<Fatura> Faturas { get; set; }
        // public DbSet<Pagamento> Pagamentos { get; set; }
    }
}