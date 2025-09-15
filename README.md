# 📋 Tareffy

[![GitHub stars](https://img.shields.io/github/stars/iagodevtech/Tareffy?style=social)](https://github.com/iagodevtech/Tareffy/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/iagodevtech/Tareffy?style=social)](https://github.com/iagodevtech/Tareffy/network)
[![GitHub last commit](https://img.shields.io/github/last-commit/iagodevtech/Tareffy?style=flat)](https://github.com/iagodevtech/Tareffy/commits)
[![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-orange?style=flat)](#)

Aplicativo de gerenciamento de tarefas com drag & drop, notificações e sincronização em tempo real.

## ✨ Funcionalidades

- **Drag & Drop**: Organize tarefas arrastando entre colunas
- **Notificações**: Lembretes inteligentes e notificações push
- **Sincronização**: Dados sincronizados em tempo real
- **Interface Intuitiva**: Design limpo e responsivo
- **Categorização**: Organize tarefas por projetos e prioridades
- **Colaboração**: Compartilhe listas com equipe

## 🛠️ Stack Tecnológica

### Frontend
- **React** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **React DnD** - Drag and drop

### Backend & Database
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Socket.io** - Comunicação em tempo real

### Mobile
- **React Native** - Desenvolvimento mobile
- **Expo** - Plataforma de desenvolvimento

## 🚀 Quickstart

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- MongoDB (local ou Atlas)

### 1. Clone o repositório
```bash
git clone https://github.com/iagodevtech/Tareffy.git
cd Tareffy
```

### 2. Instale as dependências
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

# Mobile (opcional)
cd ../mobile
npm install
```

### 3. Configure as variáveis de ambiente
```bash
# Backend - .env
MONGODB_URI=mongodb://localhost:27017/tareffy
JWT_SECRET=your_jwt_secret
PORT=5000

# Frontend - .env
REACT_APP_API_URL=http://localhost:5000
```

### 4. Execute o projeto
```bash
# Backend
cd backend
npm run dev

# Frontend (em outro terminal)
cd frontend
npm start

# Mobile (opcional)
cd mobile
npm start
```

### 5. Acesse
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Mobile**: Expo Go app

## 📱 Funcionalidades Mobile

- **Notificações Push**: Lembretes mesmo com app fechado
- **Sincronização Offline**: Funciona sem internet
- **Biometria**: Login seguro com impressão digital
- **Widgets**: Acesso rápido às tarefas

## 🎨 Interface

- **Design System**: Componentes consistentes
- **Temas**: Modo claro e escuro
- **Responsivo**: Funciona em todos os dispositivos
- **Acessibilidade**: Suporte a leitores de tela

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Backend em modo dev
npm run start        # Frontend em modo dev

# Build
npm run build        # Build de produção
npm run test         # Executar testes

# Mobile
npm run mobile:dev   # Desenvolvimento mobile
npm run mobile:build # Build mobile
```

## 📊 Estrutura do Projeto

```
Tareffy/
├── frontend/         # Aplicação React
├── backend/          # API Node.js
├── mobile/           # App React Native
├── shared/           # Código compartilhado
└── docs/             # Documentação
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

- **LinkedIn**: [Iago Alves](https://www.linkedin.com/in/iago-alves-b502a518b/)
- **GitHub**: [@iagodevtech](https://github.com/iagodevtech)
- **Email**: iagodevtech@gmail.com

---

Desenvolvido com ❤️ por [Iago Alves](https://github.com/iagodevtech)
