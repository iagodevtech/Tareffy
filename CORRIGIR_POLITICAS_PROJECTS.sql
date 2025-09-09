-- Script para corrigir políticas RLS da tabela projects
-- Execute este script no Supabase SQL Editor

-- 1. Verificar políticas atuais da tabela projects
SELECT * FROM pg_policies WHERE tablename = 'projects';

-- 2. Verificar se RLS está habilitado na tabela projects
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'projects';

-- 3. Remover políticas antigas que podem estar bloqueando
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert their own projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;
DROP POLICY IF EXISTS "Users can view projects from their teams" ON projects;
DROP POLICY IF EXISTS "Users can view projects" ON projects;

-- 4. Criar novas políticas que permitem acesso baseado em membership da equipe
-- Política para visualizar projetos das equipes onde o usuário é membro
CREATE POLICY "Users can view projects from their teams" ON projects
FOR SELECT USING (
  team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid()
  )
);

-- Política para inserir projetos (apenas admin da equipe)
CREATE POLICY "Users can insert projects in their teams" ON projects
FOR INSERT WITH CHECK (
  team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Política para atualizar projetos (apenas admin da equipe)
CREATE POLICY "Users can update projects in their teams" ON projects
FOR UPDATE USING (
  team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Política para deletar projetos (apenas admin da equipe)
CREATE POLICY "Users can delete projects in their teams" ON projects
FOR DELETE USING (
  team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 5. Verificar se as políticas foram criadas
SELECT * FROM pg_policies WHERE tablename = 'projects';

-- 6. Testar se as políticas estão funcionando
-- (Substitua 'SEU_USER_ID' pelo ID do usuário)
-- SELECT * FROM projects WHERE team_id IN (
--   SELECT team_id FROM team_members WHERE user_id = 'SEU_USER_ID'
-- );
