# 🔧 Corrigir Erro ao Aceitar Convite

## ❌ **Problema Atual**
```
record "new" has no field "updated_at"
```

## ✅ **Solução Passo a Passo**

### 1. **Acesse o Supabase**
- Vá para: https://supabase.com/dashboard
- Entre no seu projeto Tareffy
- Vá para **SQL Editor**

### 2. **Execute este comando para verificar a estrutura da tabela**
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'team_invites' 
ORDER BY ordinal_position;
```

### 3. **Verificar políticas RLS**
```sql
SELECT * FROM pg_policies WHERE tablename = 'team_invites';
```

### 4. **Recriar as políticas RLS (Execute este bloco completo)**
```sql
-- Remover políticas antigas
DROP POLICY IF EXISTS "Users can view their own invites" ON team_invites;
DROP POLICY IF EXISTS "Users can insert invites" ON team_invites;
DROP POLICY IF EXISTS "Users can update invites" ON team_invites;
DROP POLICY IF EXISTS "Users can delete invites" ON team_invites;

-- Criar novas políticas
CREATE POLICY "Users can view their own invites" ON team_invites
FOR SELECT USING (
  email = auth.jwt() ->> 'email' OR
  invited_by = auth.uid()
);

CREATE POLICY "Users can insert invites" ON team_invites
FOR INSERT WITH CHECK (
  invited_by = auth.uid()
);

CREATE POLICY "Users can update invites" ON team_invites
FOR UPDATE USING (
  email = auth.jwt() ->> 'email' OR
  invited_by = auth.uid()
);

CREATE POLICY "Users can delete invites" ON team_invites
FOR DELETE USING (
  invited_by = auth.uid()
);
```

### 5. **Se ainda der erro, adicione a coluna updated_at**
```sql
ALTER TABLE team_invites ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
```

## 🎯 **Resultado Esperado**
Após executar os comandos, você deve conseguir:
- ✅ Aceitar convites sem erro
- ✅ Usuários entram na equipe corretamente
- ✅ Status do convite é atualizado

## 🚨 **Importante**
1. Execute o **comando 2** primeiro para ver a estrutura
2. Execute o **comando 3** para ver as políticas atuais
3. Execute o **comando 4** para recriar as políticas
4. Se ainda der erro, execute o **comando 5**

## 📞 **Se der erro**
Me envie:
1. O resultado do comando 2 (estrutura da tabela)
2. O resultado do comando 3 (políticas atuais)
3. A mensagem de erro que aparecer
