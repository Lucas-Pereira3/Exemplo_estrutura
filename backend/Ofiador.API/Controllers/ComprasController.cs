using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ofiador.API.Data;
using Ofiador.API.Models;

namespace Ofiador.API.Controllers
{
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
                .ToList();

            return Ok(compras);
        }
    }
}