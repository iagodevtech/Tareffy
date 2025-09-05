# 🔐 Configuração do Supabase para Tareffy

Este arquivo contém as configurações necessárias para conectar o Tareffy ao Supabase.

## 📋 Variáveis de Ambiente

Para o projeto funcionar, você precisa configurar as seguintes variáveis:

### Desenvolvimento Local (.env)
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

### GitHub Pages (Secrets)
Configure no repositório: `Settings > Secrets and variables > Actions`

- **VITE_SUPABASE_URL**: `https://seu-projeto.supabase.co`
- **VITE_SUPABASE_ANON_KEY**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

1. **users** - Usuários do sistema
2. **projects** - Projetos
3. **tasks** - Tarefas
4. **teams** - Equipes
5. **contacts** - Contatos
6. **activities** - Atividades do sistema

### Executar Schema

1. Acesse o SQL Editor do Supabase
2. Execute o arquivo `supabase-schema.sql`
3. Configure as políticas de segurança (RLS)

## 🔒 Políticas de Segurança (RLS)

### Habilitar RLS
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
```

### Políticas Básicas
```sql
-- Usuários podem ver e editar seu próprio perfil
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Usuários podem ver projetos que participam
CREATE POLICY "Users can view projects they belong to" ON projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE user_id = auth.uid() 
      AND team_id IN (
        SELECT team_id FROM project_teams 
        WHERE project_id = projects.id
      )
    )
  );
```

## 🚀 Configuração de Autenticação

### 1. Habilitar Providers
No Supabase Dashboard:
- **Settings > Auth > Providers**
- Habilitar Email
- Configurar confirmação de email (opcional)

### 2. Configurar URLs
- **Site URL**: `https://seu-usuario.github.io`
- **Redirect URLs**: 
  - `https://seu-usuario.github.io/tareffy/auth/callback`
  - `https://seu-usuario.github.io/tareffy/dashboard`

### 3. Configurar Email Templates
Personalize os templates de:
- Confirmação de email
- Reset de senha
- Invite de usuário

## 📊 Monitoramento

### 1. Logs de Autenticação
- **Dashboard > Auth > Logs**
- Monitore tentativas de login
- Verifique erros de autenticação

### 2. Uso da API
- **Dashboard > API > Usage**
- Monitore requisições
- Verifique limites de uso

### 3. Performance do Banco
- **Dashboard > Database > Performance**
- Monitore queries lentas
- Verifique uso de recursos

## 🔍 Troubleshooting

### Erro: "Invalid API key"
- Verifique se a chave está correta
- Confirme se o projeto está ativo

### Erro: "JWT expired"
- Verifique a configuração de tempo de expiração
- Configure refresh tokens se necessário

### Erro: "RLS policy violation"
- Verifique se as políticas estão configuradas
- Teste as políticas com usuários de teste

## 📱 Teste da Conexão

### 1. Console do Navegador
Verifique se não há erros de conexão

### 2. Network Tab
Confirme se as requisições para o Supabase estão funcionando

### 3. Supabase Dashboard
Verifique se as requisições estão chegando

## 🆘 Suporte

- **Documentação Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **GitHub Issues**: [github.com/seu-usuario/tareffy/issues](https://github.com/seu-usuario/tareffy/issues)
- **Supabase Discord**: [discord.gg/supabase](https://discord.gg/supabase)

---

**✅ Configure estas variáveis e seu Tareffy estará funcionando perfeitamente!**

