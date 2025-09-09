# 🔧 Corrigir Tabela Projects - Adicionar team_id

## ❌ **Problema Atual**
```
Could not find the 'team_id' column of 'projects' in the source
```

## ✅ **Solução**

### 1. **Acesse o Supabase**
- Vá para: https://supabase.com/dashboard
- Entre no seu projeto Tareffy
- Vá para **SQL Editor**

### 2. **Execute este comando SQL**
```sql
-- Adicionar coluna team_id na tabela projects
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
```

### 3. **Verificar se funcionou**
```sql
-- Verificar se a coluna foi criada
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name = 'team_id';
```

### 4. **Atualizar RLS (Opcional)**
Se quiser que apenas admins possam criar projetos:
```sql
-- Remover políticas antigas
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert their own projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;

-- Criar novas políticas baseadas em equipes
CREATE POLICY "Users can view projects from their teams" ON projects
FOR SELECT USING (
  team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert projects to their teams" ON projects
FOR INSERT WITH CHECK (
  team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Users can update projects from their teams" ON projects
FOR UPDATE USING (
  team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Users can delete projects from their teams" ON projects
FOR DELETE USING (
  team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
```

## 🎯 **Resultado Esperado**
Após executar o comando, você deve conseguir:
- ✅ Criar projetos vinculados a equipes
- ✅ Ver apenas projetos das suas equipes
- ✅ Apenas admins podem criar/editar projetos

## 🚨 **Importante**
- Execute apenas o **comando 1** primeiro
- Teste criar um projeto
- Se funcionar, execute os comandos 4 (RLS) se quiser

## 📞 **Se der erro**
Me envie a mensagem de erro que aparecer no Supabase SQL Editor.
