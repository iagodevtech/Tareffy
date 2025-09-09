# 🔧 Solução Definitiva para o Erro updated_at

## ❌ **Problema**
```
record "new" has no field "updated_at"
```

## ✅ **Solução Simples**

### **Execute este comando no Supabase SQL Editor:**

```sql
-- Adicionar coluna updated_at na tabela team_invites
ALTER TABLE team_invites 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
```

### **Se ainda der erro, execute também:**

```sql
-- Remover triggers problemáticos
DROP TRIGGER IF EXISTS update_team_invites_updated_at ON team_invites;

-- Criar função para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger correto
CREATE TRIGGER update_team_invites_updated_at
    BEFORE UPDATE ON team_invites
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## 🎯 **Resultado Esperado**
Após executar, você deve conseguir:
- ✅ Aceitar convites sem erro
- ✅ Equipes aparecem para o usuário
- ✅ Sistema funcionando completamente

## 🚨 **Importante**
Execute apenas o **primeiro comando** primeiro. Se funcionar, não precisa executar o resto.

## 📞 **Se der erro**
Me envie a mensagem de erro que aparecer no Supabase.
