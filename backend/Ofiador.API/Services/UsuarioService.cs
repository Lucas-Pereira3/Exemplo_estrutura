using Ofiador.API.Data;
using Ofiador.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace Ofiador.API.Services
{
    public class UsuarioService
    {
        private readonly ApplicationDbContext _context;

        public UsuarioService(ApplicationDbContext context)
        {
            _context = context;
        }

        public bool SenhaForte(string senha)
        {
            var regex = new Regex(@"^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$");
            return regex.IsMatch(senha);
        }

        public Usuario CriarUsuario(string nome, string login, string senha)
        {
            if (!SenhaForte(senha))
                throw new Exception("Senha fraca. Use pelo menos 8 caracteres, 1 maiúscula, 1 número e 1 símbolo.");

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

        public Usuario? BuscarPorLogin(string login)
        {
            return _context.Usuarios
                .FirstOrDefault(u => u.Login == login);
        }

        public bool VerificarSenha(string senha, string hash)
        {
            return BCrypt.Net.BCrypt.Verify(senha, hash);
        }
    }
}