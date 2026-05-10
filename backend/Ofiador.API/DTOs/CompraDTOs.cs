namespace Ofiador.API.DTOs{
public class CompraDTOs
{
    public int IdCompra { get; set; }

    public decimal Valor_Total { get; set; }

    public string Cliente { get; set; } = string.Empty;

    public string Empresa { get; set; }= string.Empty;
}
}