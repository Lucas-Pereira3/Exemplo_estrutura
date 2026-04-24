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
            try
            {
                // TENTAR CRIAR O USUÁRIO
                var usuario = _usuarioService.CriarUsuario(dto.Nome, dto.Login, dto.Senha);

                return Ok(new
                {
                    usuario.IdUsuario,
                    usuario.Nome,
                    usuario.Login,
                    token = "fake-token"
                });
            }
            catch (Exception ex)
            {
                // TRATAR O ERRO DE EMAIL DUPLICADO
                if (ex.Message == "Email já cadastrado")
                {
                    return Conflict(new { message = "Este e-mail já está cadastrado" });
                }
                
                // TRATAR O ERRO DE SENHA FRACA
                if (ex.Message.Contains("Senha fraca"))
                {
                    return BadRequest(new { message = ex.Message });
                }

                // OUTROS ERROS
                return StatusCode(500, new { message = "Erro interno no servidor" });
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] AuthDTO dto)
        {
            var usuario = _usuarioService.BuscarPorLogin(dto.Login);

            if (usuario == null)
                return Unauthorized(new { message = "Usuário não encontrado" });

            var senhaValida = _usuarioService.VerificarSenha(dto.Senha, usuario.SenhaHash);

            if (!senhaValida)
                return Unauthorized(new { message = "Senha inválida" });

            return Ok(new
            {
                usuario.IdUsuario,
                usuario.Nome,
                usuario.Login,
                token = "fake-token"
            });
        }
    }
}