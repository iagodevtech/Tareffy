# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2025-01-27

### Adicionado
- Sistema completo de gerenciamento de tarefas e projetos
- Autenticação de usuários com Supabase
- Sistema de equipes com convites por email
- Kanban board com drag & drop
- Geração de relatórios em PDF
- Envio de emails via EmailJS
- Interface responsiva para mobile e desktop
- Tema dark/light mode
- Sistema de notificações
- Dashboard com estatísticas
- Perfil de usuário editável
- Configurações do sistema

### Corrigido
- Menu de notificações cortando no mobile
- Políticas RLS para acesso a projetos e equipes
- Aceite de convites de equipe
- Posicionamento de elementos na interface
- Responsividade em diferentes tamanhos de tela
- Erro 404 ao atualizar página (GitHub Pages)
- Funcionalidade de arrastar tarefas no mobile

### Melhorado
- Interface de usuário mais intuitiva
- Performance de carregamento
- Experiência do usuário em dispositivos móveis
- Sistema de permissões para equipes
- Integração com EmailJS para envio de emails
- Logs de debug para facilitar manutenção

### Técnico
- Migração de BrowserRouter para HashRouter (GitHub Pages)
- Implementação de políticas RLS no Supabase
- Otimização de consultas SQL
- Melhoria na estrutura de componentes React
- Implementação de TypeScript para type safety
- Configuração de CI/CD com GitHub Actions

## [0.1.0] - 2025-01-26

### Adicionado
- Versão inicial do projeto
- Estrutura básica do frontend
- Configuração do Supabase
- Componentes básicos da interface
