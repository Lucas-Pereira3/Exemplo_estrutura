using System.Text.RegularExpressions;
using Ofiador.API.Data;
using Ofiador.API.Models;
public class EmpresaService
{
    private readonly ApplicationDbContext _context;

    public EmpresaService(ApplicationDbContext context)
    {
        _context = context;
    }

    //Validação do Cnpj
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

    //Cnpj Existente
    public bool cnpjExiste(string cnpj)
    {
        return _context.Empresas.Any(e => e.Cnpj == cnpj);
    }

    public (bool sucesso, string mensagem) CriarEmpresa(Empresa empresa)
    {
        if (string.IsNullOrWhiteSpace(empresa.Nome))
            {
                return (false, "Nome é obrigatório");
            }

            if (string.IsNullOrWhiteSpace(empresa.Cnpj))
            {
                return (false, "CNPJ é obrigatório");
            }

            if (string.IsNullOrWhiteSpace(empresa.Email))
            {
                return (false, "Email é obrigatório");
            }

            empresa.Cnpj = Regex.Replace(
                empresa.Cnpj, @"[^\d]",""
            );

        if (!CnpjValido(empresa.Cnpj))
        {
            return(false,"CNPJ inválido");
        }

        var existe = _context.Empresas.Any(e => e.Cnpj == empresa.Cnpj);

        if (existe)
        {
            return(false,"já eciste uma empresa com esse Cnpj");
        }

        _context.Empresas.Add(empresa);

        _context.SaveChanges();

        return (true, "empresa cadastrada com sucesso");
    }
}