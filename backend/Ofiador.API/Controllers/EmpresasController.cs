using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Ofiador.API.Data;
using Ofiador.API.Models;

namespace Ofiador.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmpresaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EmpresaController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult CriarEmpresa([FromBody] Empresa empresa)
        {
            var existe = _context.Empresas.Any(e => e.Cnpj == empresa.Cnpj);

            if (existe)
            {
                return BadRequest(new { erro = "Já existe uma empresa com esse CNPJ" });
            }

            _context.Empresas.Add(empresa);
            _context.SaveChanges();

            return Ok(empresa);
        }

        [HttpGet]
        public IActionResult ListarEmpresa()
        {
            var empresas = _context.Empresas.ToList();
            return Ok(empresas);
        }
    }
}