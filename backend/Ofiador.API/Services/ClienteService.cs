using System.Text.RegularExpressions;
using Ofiador.API.Data;
using Ofiador.API.Models;

namespace Ofiador.API.Services
{
    public class ClienteService
    {
        private readonly ApplicationDbContext _context;

        public ClienteService(ApplicationDbContext context){
            _context = context;
        }
        //Cnjpj Valido
        public bool CnpjValido(string cnpj)
        {
        cnpj = Regex.Replace(cnpj,@"[^\d]","");

        if(cnpj.Length != 14)
            return false;

        //Impedir sequencia repetida
        if(new string(cnpj[0], 14)==cnpj)
            return false;

        int[] multiplicador1 = {5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
        int[] multiplicador2 = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};

        string tempCnpj = cnpj.Substring(0,12);

        int soma =0;

        for (int i =0; i<12; i++)
            soma += int.Parse(tempCnpj[i].ToString())*multiplicador1[i];
        int resto = soma % 11;

        resto = resto < 2 ? 0 : 11 - resto;

        string digito = resto.ToString();

        tempCnpj += digito;

        soma = 0;

        for (int i =0; i < 13; i++)
            soma += int.Parse(tempCnpj[i].ToString())*multiplicador2[i];
        
        resto = soma % 11;

        resto = resto < 2 ? 0 : 11 - resto;

        digito += resto.ToString();

        return cnpj.EndsWith(digito);
        }

        //validar CPF
        public bool CpfValido(string cpf)
        {
            cpf= Regex.Replace(cpf,@"[^\d]","");

            if(cpf.Length != 11)
                return false;
            
            if(new string(cpf[0], 11)== cpf)
                return false;
            
            int[] multiplicador1= {10,9,8,7,6,5,4,3,2};

            int[] multiplicador2= {11,10,9,8,7,6,5,4,3,2};

            string tempCpf = cpf.Substring(0,9);

            int soma=0;

            for(int i=0; i < 9; i++)
            {
                soma+= int.Parse(tempCpf[i].ToString())*multiplicador1[i];
            }

            int resto= soma % 11;

            resto=resto<2 ? 0 : 11 - resto;

            string digito = resto.ToString();

            tempCpf += digito;

            soma = 0;

            for (int i = 0; i < 10; i++)
            {
                soma += int.Parse(tempCpf[i].ToString()) *
                multiplicador2[i];
            }

            resto = soma % 11;

            resto = resto < 2 ? 0 : 11 - resto;

            digito += resto.ToString();

            return cpf.EndsWith(digito);

        }
        //Email
        public bool EmailValido(string email)
        {
            email = email.Trim();
            var regex = new Regex( @"^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|yahoo)\.(com|com\.br|net)$",RegexOptions.IgnoreCase);
            return regex.IsMatch(email);
        }
        //Validar Documento
        public bool DocumentoValido(string documento)
        {
            documento = Regex.Replace(documento,@"[^\d]","");

            if(documento.Length == 11)
            {
                return CpfValido(documento);
            }

            if(documento.Length == 14)
            {
                return CnpjValido(documento);
            }

            return false;
        }
        //Documento Existe
        public bool DocumentoExiste(string documento)
        {
            return _context.Clientes.Any(c => c.Cpf_Cnpj == documento);
        }

        //Email Existe
         public bool EmailExiste(string email)
        {
            return _context.Clientes.Any(c => c.Email == email);
        }

        //Criar Cliente
        public(bool sucesso, string mensagem)CriarCliente(Cliente cliente){
            cliente.Email = cliente.Email.Trim().ToLower();

            cliente.Cpf_Cnpj = Regex.Replace(cliente.Cpf_Cnpj, @"[^\d]","");

             if (string.IsNullOrWhiteSpace(cliente.Nome))
            {
                return (false, "Nome é obrigatório");
            }

            if (string.IsNullOrWhiteSpace(cliente.Cpf_Cnpj))
            {
                return (false, "CPF/CNPJ é obrigatório");
            }

            if (string.IsNullOrWhiteSpace(cliente.Email))
            {
                return (false, "Email é obrigatório");
            }

            if (string.IsNullOrWhiteSpace(cliente.Telefone))
            {
                return (false, "Telefone é obrigatório");
            }

             if (DocumentoExiste(cliente.Cpf_Cnpj))
            {
                return (false,"Já existe cliente com esse documento");
            }

            if (!EmailValido(cliente.Email))
            {
                return (false,"Email inválido");
            }

            if (EmailExiste(cliente.Email))
            {
                return(false,"Email já cadastrado");
            }

            if (!DocumentoValido(cliente.Cpf_Cnpj))
            {
                return (false,"CPF/CNPJ inválido");
            }
            
            var empresaExiste = _context.Empresas.Any(e=> e.IdEmpresa == cliente.IdEmpresa);

            if (!empresaExiste)
            {
                return(false,"empresa não encontrada");
            }

            _context.Clientes.Add(cliente);
            _context.SaveChanges();

            return(true, "Cliente cadastrado com sucesso");
        }
    }
}