# 🚀 Tareffy - Sistema de Gerenciamento de Tarefas

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/iagodevtech/Tareffy)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-brightgreen.svg)](https://iagodevtech.github.io/Tareffy/)

> **Versão 1.0.0** - Sistema completo de gerenciamento de tarefas e projetos em equipe

## 📋 Sobre o Projeto

O **Tareffy** é uma aplicação web moderna e responsiva para gerenciamento de tarefas e projetos em equipe. Desenvolvido com React, TypeScript e Supabase, oferece uma experiência intuitiva tanto em desktop quanto em dispositivos móveis.

### ✨ Principais Funcionalidades

- 👥 **Gerenciamento de Equipes** - Crie equipes e convide membros por email
- 📋 **Projetos Organizados** - Organize tarefas em projetos vinculados a equipes
- 📊 **Kanban Board** - Interface drag & drop para gerenciar tarefas
- 📈 **Dashboard Inteligente** - Acompanhe estatísticas e progresso
- 📱 **Design Responsivo** - Funciona perfeitamente em mobile e desktop
- 🌙 **Tema Dark/Light** - Interface adaptável às suas preferências
- 📧 **Notificações por Email** - Receba convites e relatórios automaticamente
- 📄 **Relatórios em PDF** - Gere relatórios detalhados dos projetos

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **React Router** - Roteamento para aplicações React
- **Heroicons** - Ícones SVG otimizados

### Backend & Serviços
- **Supabase** - Backend-as-a-Service (PostgreSQL, Auth, Storage)
- **EmailJS** - Envio de emails direto do frontend
- **GitHub Pages** - Hospedagem estática
- **GitHub Actions** - CI/CD automatizado

## 🚀 Deploy

### 🌐 Aplicação Online
**URL:** https://iagodevtech.github.io/Tareffy/

### 📱 Compatibilidade
- ✅ **Desktop** - Chrome, Firefox, Safari, Edge
- ✅ **Mobile** - iOS Safari, Android Chrome
- ✅ **Tablet** - iPad, Android tablets

## 🏗️ Estrutura do Projeto

```
tareffy/
├── frontend/                 # Aplicação React
│   ├── public/              # Arquivos estáticos
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços e APIs
│   │   ├── contexts/       # Contextos React
│   │   └── lib/           # Configurações e utilitários
│   └── package.json
├── .github/workflows/       # GitHub Actions
├── CHANGELOG.md            # Histórico de mudanças
├── VERSION.md              # Informações da versão
└── README.md               # Este arquivo
```

## 🎯 Funcionalidades Detalhadas

### 👥 Sistema de Equipes
- Criação e gerenciamento de equipes
- Convites por email com links de aceite
- Sistema de permissões (Admin, Membro, Dev)
- Acesso baseado em membership

### 📋 Gerenciamento de Projetos
- Projetos vinculados a equipes
- Status: Ativo, Concluído, Em Espera
- Progresso e prazos
- Acesso controlado por equipe

### 📊 Kanban Board
- Interface drag & drop intuitiva
- Colunas personalizáveis
- Comentários e issues por tarefa
- Badges de notificação
- Otimizado para mobile

### 📈 Dashboard e Relatórios
- Estatísticas em tempo real
- Geração de relatórios em PDF
- Envio automático por email
- Log de atividades

### ⚙️ Configurações
- Perfil de usuário editável
- Tema dark/light mode
- Cockpit para anotações pessoais
- Relatório técnico das tecnologias

## 🔧 Desenvolvimento Local

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta no Supabase
- Conta no EmailJS

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/iagodevtech/Tareffy.git
cd Tareffy
```

2. **Instale as dependências**
```bash
cd frontend
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Crie um arquivo .env.local
cp .env.example .env.local
# Edite com suas credenciais do Supabase e EmailJS
```

4. **Execute o projeto**
```bash
npm start
```

## 📝 Changelog

Veja o [CHANGELOG.md](CHANGELOG.md) para o histórico completo de mudanças.

### Versão 1.0.0 (27/01/2025)
- 🎉 Lançamento inicial
- ✨ Todas as funcionalidades principais implementadas
- 🐛 Correções de bugs e melhorias de UX
- 📱 Otimização para dispositivos móveis

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Desenvolvedor

**Iago Alves**
- GitHub: [@iagodevtech](https://github.com/iagodevtech)
- Email: iagomederios801@gmail.com

## 🙏 Agradecimentos

- [Supabase](https://supabase.com/) - Backend-as-a-Service
- [EmailJS](https://www.emailjs.com/) - Serviço de email
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Heroicons](https://heroicons.com/) - Ícones SVG

---

**Tareffy v1.0.0** - Desenvolvido com ❤️ por Iago Alves