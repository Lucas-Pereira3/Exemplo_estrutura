namespace Ofiador.API.Models
{
    public class Empresa
    {
        public int IdEmpresa { get; set; }

        public string Nome { get; set; } = string.Empty;

        public string Cnpj { get; set; } = string.Empty;

        public string? Endereço { get; set; }
    }
}