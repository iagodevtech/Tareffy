# 🚀 Tareffy - Sistema de Gerenciamento de Tarefas

Um sistema completo de gerenciamento de tarefas com funcionalidades avançadas de colaboração em equipe, desenvolvido com React, Node.js e TypeScript.

## ✨ Funcionalidades

### 📊 Dashboard Completo
- **Estatísticas em Tempo Real**: Visão geral de projetos, tarefas concluídas, em progresso e pendentes
- **Gráficos Interativos**: Evolução mensal de tarefas, distribuição por prioridade
- **Produtividade das Equipes**: Métricas de performance por equipe
- **Filtros Mensais**: Análise detalhada por período

### 🎯 Gerenciamento de Projetos
- **CRUD Completo**: Criar, visualizar, editar e excluir projetos
- **Controle de Acesso**: Diferentes níveis de permissão (Admin, Manager, Member, Viewer)
- **Status de Projetos**: Ativo, Pausado, Concluído, Cancelado

### 👥 Colaboração em Equipe
- **Convite de Membros**: Sistema de convites por email
- **Funções Específicas**: Design, Dev Front, Dev Back, PMO
- **Gerenciamento de Equipe**: Adicionar/remover membros (apenas proprietários)
- **Avatares e Perfis**: Exibição visual dos membros

### 📋 Quadro Kanban Avançado
- **Arrastar e Soltar**: Interface intuitiva para mover tarefas
- **Colunas Personalizáveis**: Lista de Tarefas, Em Progresso, Testes, Concluído
- **Detalhes Completos**: Título, descrição, prioridade, responsável, prazo
- **Rastreamento de Atividades**: Histórico de quem criou/moveu tarefas
- **Comentários e Anexos**: Sistema de comunicação integrado

### 👤 Perfil e Configurações
- **Upload de Foto**: Avatar personalizado com ajuste automático
- **Configurações de Notificação**: Email, push e relatórios semanais
- **Tema Personalizável**: Modo claro/escuro
- **Preferências de Idioma e Fuso Horário**

### 🎨 Interface Responsiva
- **Design Adaptativo**: Funciona perfeitamente em desktop, tablet e mobile
- **Menu Lateral Recolhível**: Otimização de espaço
- **Navegação Intuitiva**: Menu mobile com fechamento automático
- **Tema Dark/Light**: Alternância suave entre modos

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **React Router** - Navegação
- **React Hook Form** - Formulários
- **Framer Motion** - Animações

### Backend (Próximas Implementações)
- **Node.js** - Runtime
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados
- **Prisma** - ORM
- **Socket.io** - Comunicação em tempo real
- **JWT** - Autenticação

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/iagodevtech/tareffy.git
cd tareffy
```

2. **Instale as dependências do Frontend**
```bash
cd frontend
npm install
```

3. **Instale as dependências do Backend**
```bash
cd ../backend
npm install
```

4. **Execute o projeto**
```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev
```

5. **Acesse o aplicativo**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📱 Funcionalidades Mobile

- **Menu Responsivo**: Navegação otimizada para touch
- **Gestos Intuitivos**: Arrastar e soltar em dispositivos móveis
- **Interface Adaptativa**: Elementos redimensionados automaticamente
- **Performance Otimizada**: Carregamento rápido em conexões lentas

## 🔧 Próximas Implementações

- [ ] **Integração com Banco de Dados**
- [ ] **Sistema de Autenticação Completo**
- [ ] **Comunicação em Tempo Real**
- [ ] **Notificações Push**
- [ ] **Sistema de Backup**
- [ ] **API REST Completa**
- [ ] **Deploy no Hostgator**

## 📊 Estrutura do Projeto

```
tareffy/
├── frontend/                 # Aplicação React
│   ├── src/
│   │   ├── App.js           # Componente principal
│   │   ├── index.js         # Ponto de entrada
│   │   └── tailwind.config.js
│   ├── package.json
│   └── README.md
├── backend/                  # API Node.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.ts
│   ├── package.json
│   └── README.md
├── docs/                     # Documentação
├── scripts/                  # Scripts de deploy
└── README.md
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Desenvolvedor

**Iago Alves**
- 🌐 Website: [iagodev.online](https://iagodev.online)
- 📧 GitHub: [github.com/iagodevtech](https://github.com/iagodevtech)
- 💼 LinkedIn: [linkedin.com/in/iagodevtech](https://linkedin.com/in/iagodevtech)

## 🎯 Roadmap

### Versão 1.0 (Atual)
- ✅ Interface completa responsiva
- ✅ Dashboard com gráficos
- ✅ Sistema de projetos
- ✅ Gerenciamento de equipes
- ✅ Quadro Kanban
- ✅ Tema dark/light
- ✅ Perfil e configurações

### Versão 1.1 (Próxima)
- 🔄 Integração com banco de dados
- 🔄 Sistema de autenticação
- 🔄 API REST completa
- 🔄 Deploy no Hostgator

### Versão 1.2 (Futura)
- 📋 Notificações em tempo real
- 📋 Sistema de backup
- 📋 Relatórios avançados
- 📋 Integração com calendário

---

**Tareffy** - Transformando a gestão de tarefas em uma experiência colaborativa e eficiente! 🚀
