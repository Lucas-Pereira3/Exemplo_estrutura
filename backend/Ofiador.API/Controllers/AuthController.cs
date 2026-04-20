using Microsoft.AspNetCore.Mvc;
using Ofiador.API.DTOs;
using Ofiador.API.Services;

namespace Ofiador.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UsuarioService _usuarioService;

        public AuthController(UsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] AuthDTO dto)
        {
            var usuario = _usuarioService.CriarUsuario(dto.Nome, dto.Login, dto.Senha);
            return Ok(usuario);
        }
    }
}