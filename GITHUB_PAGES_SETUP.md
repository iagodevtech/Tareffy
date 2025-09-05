# 🚀 Configuração do Tareffy no GitHub Pages

Este guia explica como configurar e fazer deploy do Tareffy no GitHub Pages com conexão direta ao Supabase.

## 📋 Pré-requisitos

- ✅ Conta no GitHub
- ✅ Conta no Supabase
- ✅ Projeto Tareffy clonado localmente

## 🔧 Passo a Passo

### 1. Criar Repositório no GitHub

1. Acesse [github.com](https://github.com)
2. Clique em "New repository"
3. Nome: `tareffy`
4. Descrição: `Sistema de Gestão de Tarefas com React e Supabase`
5. Público ou Privado (sua escolha)
6. **NÃO** inicialize com README, .gitignore ou license
7. Clique em "Create repository"

### 2. Configurar o Projeto Local

```bash
# No diretório do projeto
git remote add origin https://github.com/SEU_USUARIO/tareffy.git
git branch -M main
git add .
git commit -m "Configuração inicial para GitHub Pages"
git push -u origin main
```

### 3. Configurar o Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Aguarde a configuração inicial
4. Vá para `Settings > API`
5. Copie:
   - **Project URL** (ex: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (ex: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 4. Configurar Secrets do GitHub

1. No seu repositório, vá para `Settings > Secrets and variables > Actions`
2. Clique em "New repository secret"
3. Adicione os seguintes secrets:

   **Nome:** `VITE_SUPABASE_URL`
   **Value:** `https://abcdefghijklmnop.supabase.co`

   **Nome:** `VITE_SUPABASE_ANON_KEY`
   **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 5. Configurar o Banco de Dados

1. No Supabase, vá para `SQL Editor`
2. Execute o arquivo `supabase-schema.sql`:

```sql
-- Copie e cole o conteúdo de supabase-schema.sql
-- Execute o script completo
```

3. Configure as políticas de segurança (RLS):

```sql
-- Habilitar RLS nas tabelas principais
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajuste conforme necessário)
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### 6. Ativar GitHub Pages

1. No repositório, vá para `Settings > Pages`
2. **Source:** `Deploy from a branch`
3. **Branch:** `gh-pages` (será criado automaticamente)
4. **Folder:** `/ (root)`
5. Clique em "Save"

### 7. Fazer Deploy

```bash
# Faça qualquer alteração e push
git add .
git commit -m "Atualização para deploy"
git push origin main
```

O GitHub Actions executará automaticamente:
1. ✅ Build do projeto
2. ✅ Configuração das variáveis de ambiente
3. ✅ Deploy para a branch `gh-pages`
4. ✅ Ativação do GitHub Pages

### 8. Verificar o Deploy

1. Aguarde alguns minutos
2. Acesse `https://SEU_USUARIO.github.io/tareffy/`
3. Verifique se a aplicação está funcionando
4. Teste o login e funcionalidades

## 🔍 Troubleshooting

### Erro: "Configuração do Supabase não encontrada"

**Causa:** Variáveis de ambiente não configuradas
**Solução:** Verifique se os Secrets estão configurados corretamente

### Erro: "Build failed"

**Causa:** Problema no código ou dependências
**Solução:** Verifique os logs do GitHub Actions

### Erro: "Page not found"

**Causa:** GitHub Pages não configurado
**Solução:** Verifique se a branch `gh-pages` foi criada

### Erro: "Supabase connection failed"

**Causa:** Credenciais incorretas ou projeto não configurado
**Solução:** Verifique as credenciais do Supabase

## 📱 URLs Importantes

- **GitHub Pages:** `https://SEU_USUARIO.github.io/tareffy/`
- **Supabase Dashboard:** `https://app.supabase.com/project/SEU_PROJECT_ID`
- **GitHub Actions:** `https://github.com/SEU_USUARIO/tareffy/actions`

## 🔐 Segurança

- ✅ Nunca commite arquivos `.env`
- ✅ Use sempre Secrets do GitHub para variáveis sensíveis
- ✅ Configure RLS no Supabase adequadamente
- ✅ Monitore o uso da API do Supabase

## 📊 Monitoramento

- **GitHub Actions:** Verifique o status dos deploys
- **Supabase:** Monitore o uso da API e banco de dados
- **GitHub Pages:** Verifique o status da página

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs do GitHub Actions
2. Consulte a documentação do Supabase
3. Abra uma issue no repositório
4. Verifique o console do navegador para erros

---

**🎉 Parabéns! Seu Tareffy está rodando no GitHub Pages com Supabase!**

