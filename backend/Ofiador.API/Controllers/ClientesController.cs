using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ofiador.API.Data;
using Ofiador.API.Models;

namespace Ofiador.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ClienteController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClienteController(ApplicationDbContext context) 
        { 
            _context = context;
        }

        [HttpPost]
        public IActionResult CriarCliente([FromBody] Cliente cliente) 
        { 
            _context.Clientes.Add(cliente);
            _context.SaveChanges();

            return Ok(cliente);
        }

        [HttpGet]
        public IActionResult ListarClientes()
        {
            var clientes = _context.Clientes
            .Include(c => c.Empresa)
            .ToList();

            
            return Ok(clientes);
        }

        //Logout
        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            return Ok(new
            {
                message = "Logout realizado com sucesso"
            });
        }
    }
}