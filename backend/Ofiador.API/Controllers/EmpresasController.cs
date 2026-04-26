using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        [HttpGet("{id}")]
        public IActionResult BuscarEmpresa(int id)
        {
            var empresa = _context.Empresas.Find(id);
            
            if (empresa == null)
            {
                return NotFound(new { erro = "Empresa não encontrada" });
            }
            
            return Ok(empresa);
        }

        [HttpPut("{id}")]
        public IActionResult AtualizarEmpresa(int id, [FromBody] Empresa empresaAtualizada)
        {
            var empresa = _context.Empresas.Find(id);
            
            if (empresa == null)
            {
                return NotFound(new { erro = "Empresa não encontrada" });
            }

            // Verificar se o CNPJ já existe em outra empresa
            var cnpjExiste = _context.Empresas.Any(e => e.Cnpj == empresaAtualizada.Cnpj && e.IdEmpresa != id);
            if (cnpjExiste)
            {
                return BadRequest(new { erro = "Já existe uma empresa com esse CNPJ" });
            }

            empresa.Nome = empresaAtualizada.Nome;
            empresa.Cnpj = empresaAtualizada.Cnpj;
            empresa.Endereco = empresaAtualizada.Endereco;
            empresa.Telefone = empresaAtualizada.Telefone;
            empresa.Email = empresaAtualizada.Email;

            _context.Entry(empresa).State = EntityState.Modified;
            _context.SaveChanges();

            return Ok(empresa);
        }

        [HttpDelete("{id}")]
        public IActionResult ExcluirEmpresa(int id)
        {
            var empresa = _context.Empresas.Find(id);
            
            if (empresa == null)
            {
                return NotFound(new { erro = "Empresa não encontrada" });
            }

            // Verificar se existem clientes vinculados
            var clientesVinculados = _context.Clientes.Any(c => c.IdEmpresa == id);
            if (clientesVinculados)
            {
                return BadRequest(new { erro = "Não é possível excluir a empresa pois existem clientes vinculados a ela" });
            }

            _context.Empresas.Remove(empresa);
            _context.SaveChanges();

            return Ok(new { mensagem = "Empresa excluída com sucesso" });
        }
    }
}