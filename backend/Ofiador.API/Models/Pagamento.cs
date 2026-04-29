namespace Ofiador.API.Models
{
    public class Pagamento{
    
    public int IdPagamento{get; set;}
    public DateTime Data_Pagamento{get; set;}

    public decimal Valor_Pago{get; set;}

    public int IdFatura {get; set;}

    public Fatura? Fatura{get; set;}
    }
}