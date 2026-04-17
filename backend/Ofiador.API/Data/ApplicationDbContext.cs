using Microsoft.EntityFrameworkCore;

namespace Ofiador.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // Por enquanto, sem DbSets - vamos adicionar depois
        // Quando criar os modelos, descomente as linhas abaixo:
        // public DbSet<Empresa> Empresas { get; set; }
        // public DbSet<Usuario> Usuarios { get; set; }
        // public DbSet<Cliente> Clientes { get; set; }
        // public DbSet<Compra> Compras { get; set; }
        // public DbSet<Parcela> Parcelas { get; set; }
        // public DbSet<Fatura> Faturas { get; set; }
        // public DbSet<Pagamento> Pagamentos { get; set; }
    }
}