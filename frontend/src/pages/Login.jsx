import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

import logo from "../assets/logo.png";
import sideImage from "../assets/image.png";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
    nome: "",
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Função para validar formato de email
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação de formato de email
    if (!validateEmail(formData.email)) {
      toast.error("Digite um email válido (exemplo@email.com)");
      return;
    }

    let success;
    if (isLogin) {
      success = await login(formData.email, formData.senha);
    } else {
      // Validação adicional para cadastro
      if (!formData.nome.trim()) {
        toast.error("Digite seu nome completo");
        return;
      }
      if (formData.senha.length < 6) {
        toast.error("A senha deve ter pelo menos 6 caracteres");
        return;
      }
      success = await register({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
      });
    }

    if (success) {
      if (isLogin) {
        navigate("/dashboard");
      } else {
        setIsLogin(true);
        setFormData({
          email: "",
          senha: "",
          nome: "",
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* Container principal com duas colunas */}
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Coluna da imagem - lado esquerdo */}
        <div className="hidden lg:block lg:w-1/2 relative bg-gray-200">
          {sideImage ? (
            <img
              src={sideImage}
              alt="Ofiador"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Erro ao carregar imagem:", sideImage);
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <p className="text-gray-500">Imagem não encontrada</p>
            </div>
          )}

          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-8">
            <h2 className="text-2xl font-bold text-center">
              Bem-vindo ao Ofiador
            </h2>
            <p className="text-center mt-2">Sua plataforma de gestão</p>
          </div>
        </div>

        {/* Coluna do formulário - lado direito */}
        <div className="w-full lg:w-1/2 p-8 lg:p-10 pt-6 overflow-y-auto">
          {/* Logo */}
          <div className="flex justify-center -mt-8 mb-2">
            {logo ? (
              <img src={logo} alt="Logo" className="w-38 h-38 object-contain" />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
            )}
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isLogin ? "Bem-vindo de volta!" : "Criar conta"}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {isLogin
                ? "Acesso exclusivo para usuários"
                : "Cadastre-se para começar"}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome completo
                </label>
                <input
                  name="nome"
                  type="text"
                  required
                  placeholder="Digite seu nome completo"
                  value={formData.nome}
                  onChange={handleChange}
                  className="input mt-1"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="Digite seu endereço de e-mail"
                value={formData.email}
                onChange={handleChange}
                className="input mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                name="senha"
                type="password"
                required
                placeholder={
                  isLogin
                    ? "Digite sua senha"
                    : "Crie sua senha (mínimo 6 caracteres)"
                }
                value={formData.senha}
                onChange={handleChange}
                className="input mt-1"
              />
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">
                  A senha deve ter pelo menos 6 caracteres
                </p>
              )}
            </div>

            <button type="submit" className="btn-primary w-full">
              {isLogin ? "Entrar" : "Criar conta"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({
                    email: "",
                    senha: "",
                    nome: "",
                  });
                }}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                {isLogin
                  ? "Não tem conta? Cadastre-se"
                  : "Já tem conta? Faça login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
