# 🚀 Migração para Supabase - Guia Completo

## 📋 **Pré-requisitos**

1. **Conta Supabase**: [https://supabase.com](https://supabase.com)
2. **Node.js** instalado (versão 16+)
3. **Git** configurado

## 🔧 **Passo a Passo da Migração**

### **1. Criar Projeto no Supabase**

1. Acesse [https://supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Escolha sua organização
5. Digite o nome: `tareffy`
6. Escolha uma senha forte para o banco
7. Escolha a região mais próxima (ex: São Paulo)
8. Clique em "Create new project"

### **2. Configurar Banco de Dados**

1. No dashboard do projeto, vá para **SQL Editor**
2. Copie o conteúdo do arquivo `supabase-schema.sql`
3. Cole no editor SQL e execute
4. Verifique se as tabelas foram criadas em **Table Editor**

### **3. Configurar Autenticação**

1. Vá para **Authentication > Settings**
2. Configure as URLs permitidas:
   - Site URL: `https://seu-dominio.com`
   - Redirect URLs: `https://seu-dominio.com/auth/callback`
3. Em **Email Templates**, personalize as mensagens

### **4. Configurar Storage (opcional)**

1. Vá para **Storage**
2. Crie um bucket chamado `uploads`
3. Configure as políticas de acesso

### **5. Obter Credenciais**

1. Vá para **Settings > API**
2. Copie:
   - **Project URL**
   - **anon public key**

### **6. Configurar Variáveis de Ambiente**

1. Crie um arquivo `.env` na raiz do projeto
2. Adicione suas credenciais:

```env
VITE_SUPABASE_URL=sua_url_do_projeto
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

### **7. Testar Localmente**

```bash
npm run dev
```

### **8. Fazer Build e Deploy**

```bash
npm run build
```

## 🌐 **Deploy no Supabase**

### **Opção 1: Deploy Automático (Recomendado)**

1. Conecte seu repositório GitHub ao Supabase
2. Configure o build automático
3. O site será atualizado automaticamente

### **Opção 2: Deploy Manual**

1. Faça build: `npm run build`
2. Faça upload da pasta `dist/` para o Supabase Storage
3. Configure o domínio personalizado

## 🔐 **Configurações de Segurança**

### **Row Level Security (RLS)**
- Todas as tabelas têm RLS habilitado
- Políticas definidas para usuários autenticados
- Contatos podem ser criados por qualquer pessoa
- Apenas admins podem visualizar/editar contatos

### **Autenticação**
- Login com email/senha
- Sessões JWT seguras
- Logout automático

## 📱 **Funcionalidades Implementadas**

- ✅ **Sistema de Contatos** com Supabase
- ✅ **Autenticação** de usuários
- ✅ **Dashboard Admin** para gerenciar contatos
- ✅ **Tema Dark/Light** persistente
- ✅ **Responsivo** para mobile
- ✅ **API REST** completa

## 🚨 **Troubleshooting**

### **Erro de CORS**
- Verifique as URLs permitidas no Supabase
- Adicione seu domínio às configurações

### **Erro de Autenticação**
- Verifique as credenciais no `.env`
- Confirme se o projeto está ativo

### **Erro de Banco**
- Execute o schema SQL novamente
- Verifique as políticas RLS

## 📞 **Suporte**

- **Documentação Supabase**: [https://supabase.com/docs](https://supabase.com/docs)
- **Discord Supabase**: [https://discord.supabase.com](https://discord.supabase.com)
- **GitHub Issues**: [https://github.com/iagodevtech/Tareffy](https://github.com/iagodevtech/Tareffy)

## 🎯 **Próximos Passos**

1. **Testar** todas as funcionalidades
2. **Configurar** domínio personalizado
3. **Monitorar** performance e logs
4. **Implementar** backup automático
5. **Configurar** CI/CD pipeline

---

**🎉 Parabéns! Seu projeto está migrado para o Supabase!**
