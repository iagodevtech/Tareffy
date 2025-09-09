# 🔧 Corrigir Projetos Não Aparecem para Membros da Equipe

## ❌ **Problema Identificado**
- ✅ Equipes funcionando (1 equipe encontrada)
- ❌ Projeto "teste 3" não acessível para membro da equipe
- ❌ Erro 406 ao tentar acessar detalhes do projeto

## ✅ **Solução**

### **Execute este comando no Supabase SQL Editor:**

```sql
-- Remover políticas antigas
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
DROP POLICY IF EXISTS "Users can view projects from their teams" ON projects;

-- Criar nova política que permite ver projetos das equipes onde é membro
CREATE POLICY "Users can view projects from their teams" ON projects
FOR SELECT USING (
  team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid()
  )
);
```

### **Se ainda não funcionar, execute também:**

```sql
-- Verificar se RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'projects';

-- Se rowsecurity = true, as políticas estão ativas
-- Se rowsecurity = false, RLS está desabilitado (isso pode ser o problema)
```

## 🎯 **Resultado Esperado**
Após executar, você deve conseguir:
- ✅ Acessar detalhes do projeto "teste 3"
- ✅ Ver todos os projetos da equipe
- ✅ Trabalhar nos projetos como membro da equipe

## 🚨 **Importante**
Execute apenas o **primeiro comando** primeiro. Se funcionar, não precisa executar o resto.

## 📞 **Se der erro**
Me envie a mensagem de erro que aparecer no Supabase.

## 🔍 **Como Testar**
1. Execute o comando SQL
2. Vá para a página de projetos
3. Clique em "Ver detalhes" do projeto "teste 3"
4. Deve funcionar sem erro 406
