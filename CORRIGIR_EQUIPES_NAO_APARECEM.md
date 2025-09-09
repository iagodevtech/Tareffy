# 🔧 Corrigir Equipes Não Aparecem Após Aceitar Convite

## ❌ **Problema Identificado**
- ✅ Membro foi adicionado à equipe
- ✅ 10 memberships encontradas
- ❌ 0 equipes encontradas (políticas RLS bloqueando)

## ✅ **Solução**

### **Execute este comando no Supabase SQL Editor:**

```sql
-- Remover políticas antigas
DROP POLICY IF EXISTS "Users can view their own teams" ON teams;
DROP POLICY IF EXISTS "Users can view teams they are members of" ON teams;

-- Criar nova política que permite ver equipes onde é membro
CREATE POLICY "Users can view teams they are members of" ON teams
FOR SELECT USING (
  id IN (
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
WHERE tablename = 'teams';

-- Se rowsecurity = true, as políticas estão ativas
-- Se rowsecurity = false, RLS está desabilitado (isso pode ser o problema)
```

## 🎯 **Resultado Esperado**
Após executar, você deve conseguir:
- ✅ Ver equipes onde é membro
- ✅ Equipes aparecem na lista
- ✅ Sistema funcionando completamente

## 🚨 **Importante**
Execute apenas o **primeiro comando** primeiro. Se funcionar, não precisa executar o resto.

## 📞 **Se der erro**
Me envie a mensagem de erro que aparecer no Supabase.
