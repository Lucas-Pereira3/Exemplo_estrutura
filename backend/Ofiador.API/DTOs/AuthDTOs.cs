using System.ComponentModel.DataAnnotations;
namespace Ofiador.API.DTOs
{
    public class AuthDTO
    {
        public string Nome { get; set; } = string.Empty;

        [EmailAddress(ErrorMessage = "Email invalido")]
        public string Login { get; set; }= string.Empty;
        public string Senha { get; set; } = string.Empty;
    }

    
}