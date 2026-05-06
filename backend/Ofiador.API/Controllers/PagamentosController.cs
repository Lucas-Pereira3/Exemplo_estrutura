using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Ofiador.API.Data;
using Ofiador.API.Models;

namespace Ofiador.API.Controllers
{
    
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]

    public class PagamentosController: ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PagamentosController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult CriarPagamento([FromBody] Pagamento pagamento)
        {
            _context.Pagamentos.Add(pagamento);
            _context.SaveChanges();

            return Ok(pagamento);
        }

        [HttpGet]
        public IActionResult ListarPagamento()
        {
            var pagamentos = _context.Pagamentos
            .Include(p => p.Fatura)
            .ToList();

            return Ok(pagamentos);
        }
    }
}