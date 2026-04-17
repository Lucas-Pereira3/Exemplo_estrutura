
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        senha: '',
        nome: '',
        cpfCnpj: '',
        telefone: '',
    });
  
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        let success;
        if (isLogin) {
            success = await login(formData.email, formData.senha);
        } else {
            success = await register({
                nome: formData.nome,
                email: formData.email,
                senha: formData.senha,
                cpfCnpj: formData.cpfCnpj,
                telefone: formData.telefone,
            });
        }
    
        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
                <div>
                    <h2 className="text-center text-3xl font-bold text-gray-900">
                        {isLogin ? 'Bem-vindo de volta!' : 'Criar conta'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {isLogin ? 'Acesso exclusivo para usuários' : 'Cadastre-se para começar'}
                    </p>
                </div>
        
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nome</label>
                                <input
                                    name="nome"
                                    type="text"
                                    required
                                    value={formData.nome}
                                    onChange={handleChange}
                                    className="input mt-1"
                                />
                            </div>
              
                            <div>
                                <label className="block text-sm font-medium text-gray-700">CPF/CNPJ</label>
                                <input
                                    name="cpfCnpj"
                                    type="text"
                                    required
                                    value={formData.cpfCnpj}
                                    onChange={handleChange}
                                    className="input mt-1"
                                />
                            </div>
              
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                                <input
                                    name="telefone"
                                    type="tel"
                                    value={formData.telefone}
                                    onChange={handleChange}
                                    className="input mt-1"
                                />
                            </div>
                        </>
                    )}
          
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="input mt-1"
                        />
                    </div>
          
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Senha</label>
                        <input
                            name="senha"
                            type="password"
                            required
                            value={formData.senha}
                            onChange={handleChange}
                            className="input mt-1"
                        />
                    </div>
          
                    <button type="submit" className="btn-primary w-full">
                        {isLogin ? 'Entrar' : 'Cadastrar'}
                    </button>
          
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm text-blue-600 hover:text-blue-500"
                        >
                            {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;