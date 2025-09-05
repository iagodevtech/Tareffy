# 🚀 Tareffy - Sistema de Gestão de Tarefas

Tareffy é uma plataforma moderna e intuitiva para gestão de tarefas, projetos e equipes, desenvolvida com React, TypeScript e Supabase.

## ✨ Características

- 📱 **Interface Responsiva**: Design moderno e adaptável para todos os dispositivos
- 🔐 **Autenticação Segura**: Sistema de login integrado com Supabase
- 📊 **Dashboard Intuitivo**: Métricas e gráficos em tempo real
- 👥 **Gestão de Equipes**: Organize e gerencie suas equipes de trabalho
- 📋 **Sistema de Tarefas**: Crie, organize e acompanhe o progresso das tarefas
- 🎯 **Sistema de Prioridades**: Defina e gerencie prioridades das tarefas
- 📈 **Relatórios**: Gere relatórios diários e semanais
- 🌙 **Tema Escuro/Claro**: Suporte a múltiplos temas

## 🛠️ Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + Prisma
- **Banco de Dados**: PostgreSQL (via Supabase)
- **Autenticação**: Supabase Auth
- **Estilização**: Tailwind CSS + CSS Modules
- **Deploy**: GitHub Pages

## 🚀 Como Usar

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/tareffy.git
   cd tareffy
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o Supabase**
   - Crie um projeto no [Supabase](https://supabase.com)
   - Copie as credenciais do projeto
   - Crie um arquivo `.env` na raiz do projeto:

   ```env
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```

4. **Execute o projeto**
   ```bash
   npm run dev
   ```

### Configuração do Banco de Dados

1. **Execute as migrações do Prisma**
   ```bash
   cd backend
   npx prisma migrate dev
   ```

2. **Execute o seed (opcional)**
   ```bash
   npm run seed
   ```

## 📱 Deploy no GitHub Pages

O projeto está configurado para deploy automático no GitHub Pages:

1. **Configure os Secrets do GitHub**
   - Vá para `Settings > Secrets and variables > Actions`
   - Adicione:
     - `VITE_SUPABASE_URL`: Sua URL do Supabase
     - `VITE_SUPABASE_ANON_KEY`: Sua chave anônima do Supabase

2. **Ative o GitHub Pages**
   - Vá para `Settings > Pages`
   - Source: `Deploy from a branch`
   - Branch: `gh-pages` (criado automaticamente pelo workflow)

3. **Faça push para a branch main**
   ```bash
   git add .
   git commit -m "Configuração para GitHub Pages"
   git push origin main
   ```

O deploy será executado automaticamente e estará disponível em `https://seu-usuario.github.io/tareffy/`

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter
- `npm run type-check` - Verifica tipos TypeScript

## 📁 Estrutura do Projeto

```
tareffy/
├── src/                    # Código fonte do frontend
│   ├── components/         # Componentes React
│   ├── pages/             # Páginas da aplicação
│   ├── contexts/          # Contextos React
│   ├── services/          # Serviços e APIs
│   ├── styles/            # Estilos CSS
│   └── config/            # Configurações
├── backend/               # Backend Node.js
│   ├── src/               # Código fonte do backend
│   ├── prisma/            # Schema e migrações do banco
│   └── dist/              # Build do backend
├── .github/               # Workflows do GitHub Actions
├── dist/                  # Build de produção
└── docs/                  # Documentação
```

## 🔐 Configuração do Supabase

### 1. Crie um Projeto
- Acesse [supabase.com](https://supabase.com)
- Crie um novo projeto
- Aguarde a configuração inicial

### 2. Configure as Tabelas
Execute o arquivo `supabase-schema.sql` no SQL Editor do Supabase:

```sql
-- Execute o conteúdo de supabase-schema.sql
```

### 3. Configure as Políticas de Segurança
Configure as Row Level Security (RLS) para suas tabelas:

```sql
-- Exemplo para tabela de usuários
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);
```

### 4. Configure as Variáveis de Ambiente
No seu arquivo `.env`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/tareffy/issues)
- **Documentação**: [Wiki do Projeto](https://github.com/seu-usuario/tareffy/wiki)
- **Email**: seu-email@exemplo.com

## 🙏 Agradecimentos

- [React](https://reactjs.org/) - Biblioteca JavaScript para interfaces
- [Supabase](https://supabase.com/) - Backend como serviço
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário
- [Vite](https://vitejs.dev/) - Build tool moderna

---

**Desenvolvido com ❤️ por [Seu Nome]**
