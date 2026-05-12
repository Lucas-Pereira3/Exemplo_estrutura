using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ofiador.Infrastructure.Data;
using Ofiador.Domain.Models;
using Ofiador.API.DTOs;
namespace Ofiador.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ComprasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ComprasController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult CriarCompra([FromBody] Compra compra)
        {
            try
            {
                decimal valorParcela =Math.Round(compra.Valor_Total / compra.Parcelas,2);

               for(int i =0 ; i<compra.Parcelas; i++)
                {
                    var mesAtual = new DateTime(
                    compra.Data_Compra.Year,
                    compra.Data_Compra.Month,
                    1,
                    0,
                    0,
                    0,
                    DateTimeKind.Utc
                    ).AddMonths(i);
                
                    var dataReferencia= mesAtual.Date;
                //cliente não existente
                var clienteExiste = _context.Clientes.Any(c => c.IdCliente == compra.IdCliente);

                    if (!clienteExiste)
                    {
                        return BadRequest(new
                        {
                            erro = "cliente não encontrado"
                        });
                    }
                var fatura = _context.Faturas.FirstOrDefault(f=> f.IdCliente == compra.IdCliente && f.MesReferencia.Date == dataReferencia);

                //Se não existir fatura
                if(fatura == null)
                {
                    fatura = new Fatura
                    {
                        IdCliente = compra.IdCliente,
                        MesReferencia = mesAtual,
                        Vencimento = new DateTime(
                            mesAtual.Year,
                            mesAtual.Month,
                            10,
                            0,
                            0,
                            0,
                            DateTimeKind.Utc
                        ).AddMonths(1),
                        Status="Pendente",
                        Total= 0,
                        Parcelas = compra.Parcelas
                    };

                    _context.Faturas.Add(fatura);
                    _context.SaveChanges();
                }
                    fatura.Total += valorParcela;
                
                }
                
                _context.Compras.Add(compra);
                _context.SaveChanges();
                return Ok(compra);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public IActionResult ListarCompras() 
        {
            var compras = _context.Compras
                .Include(c => c.Cliente)
                .Include(c => c.Empresa)
                .Include(c=> c.Fatura)
                .Select(c=> new CompraDTOs
                {
                    IdCompra = c.IdCompra,

                    Valor_Total = c.Valor_Total,

                    Cliente = c.Cliente != null
                        ? c.Cliente.Nome
                        :string.Empty,
                    Empresa = c.Cliente !=null && c.Cliente.Empresa != null
                        ? c.Cliente.Empresa.Nome
                        :string.Empty
                }).ToList();

            return Ok(compras);
        }
    }
}