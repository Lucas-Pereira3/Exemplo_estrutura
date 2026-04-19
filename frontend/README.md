# Frontend - Sistema de Gestão

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

## 🚀 Instalação e Execução

1. **Clone o repositório**

```bash
git clone [url-do-repositorio]
cd frontend
```

2. **Instale as dependências**

```bash
npm install
# ou
# yarn install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto com o conteúdo abaixo:

```env
VITE_API_URL=http://localhost:3000/api
```

4. **Execute o projeto**

```bash
npm run dev
# ou
# yarn dev
```

5. **Acesse no navegador**

http://localhost:5173

## 📁 Estrutura do Projeto

```
src/
├── assets/      # Imagens, fonts, CSS
├── components/  # Componentes reutilizáveis
├── contexts/    # Context API (AuthContext)
├── pages/       # Páginas da aplicação
├── services/    # Integração com API
├── App.jsx      # Rotas principais
└── main.jsx     # Entry point
```

## 🔑 Funcionalidades

- Autenticação de usuários (login / register / logout)
- Rotas públicas e privadas
- Dashboard e gerenciamento de clientes

## 🛠️ Tecnologias

- React 19
- Vite
- React Router DOM v7
- Context API
- TailwindCSS
- Axios

---
