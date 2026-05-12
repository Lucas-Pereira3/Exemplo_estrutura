namespace Ofiador.Domain.Models
{
    public class Compra
    {
        public int IdCompra { get; set; }

        public decimal Valor_Total {  get; set; }

        public DateTime Data_Compra {  get; set; }

        public int Parcelas {  get; set; }

        public int IdCliente { get; set; }

        public Cliente? Cliente {  get; set; }

        public int IdEmpresa { get; set; }

        public Empresa? Empresa { get; set; }

        public int? IdFatura { get; set; }

        public Fatura? Fatura { get; set; }
    }
}