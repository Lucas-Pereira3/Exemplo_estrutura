using Ofiador.API.Data;
using Ofiador.API.Models;

namespace Ofiador.API.Services
{
    public class UsuarioService
    {
        private readonly ApplicationDbContext _context;

        public UsuarioService(ApplicationDbContext context)
        {
            _context = context;
        }

        public Usuario CriarUsuario(string nome, string login, string senha)
        {
            var usuario = new Usuario
            {
                Nome = nome,
                Login = login
            };

            usuario.DefinirSenha(senha);

            _context.Usuarios.Add(usuario);
            _context.SaveChanges();

            return usuario;
        }

        public bool VerificarSenha(string senha, string hash)
        {
            return BCrypt.Net.BCrypt.Verify(senha, hash);
        }
    }
}