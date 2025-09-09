-- Script para corrigir a tabela projects e adicionar relacionamento com equipes
-- Execute este script no Supabase SQL Editor

-- 1. Adicionar coluna team_id na tabela projects
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE CASCADE;

-- 2. Adicionar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_projects_team_id ON projects(team_id);

-- 3. Adicionar constraint para garantir que team_id seja obrigatório
-- (Descomente a linha abaixo se quiser tornar team_id obrigatório)
-- ALTER TABLE projects ALTER COLUMN team_id SET NOT NULL;

-- 4. Verificar se a coluna foi criada corretamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name = 'team_id';

-- 5. Atualizar RLS (Row Level Security) para permitir acesso baseado em equipes
-- Primeiro, vamos ver as políticas existentes
SELECT * FROM pg_policies WHERE tablename = 'projects';

-- 6. Criar política RLS para projetos baseada em equipes
-- (Substitua as políticas existentes se necessário)
DROP POLICY IF EXISTS "Users can view projects from their teams" ON projects;
DROP POLICY IF EXISTS "Users can insert projects to their teams" ON projects;
DROP POLICY IF EXISTS "Users can update projects from their teams" ON projects;
DROP POLICY IF EXISTS "Users can delete projects from their teams" ON projects;

-- Política para visualizar projetos das equipes do usuário
CREATE POLICY "Users can view projects from their teams" ON projects
FOR SELECT USING (
  team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid()
  )
);

-- Política para inserir projetos nas equipes do usuário
CREATE POLICY "Users can insert projects to their teams" ON projects
FOR INSERT WITH CHECK (
  team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Política para atualizar projetos das equipes do usuário
CREATE POLICY "Users can update projects from their teams" ON projects
FOR UPDATE USING (
  team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Política para deletar projetos das equipes do usuário
CREATE POLICY "Users can delete projects from their teams" ON projects
FOR DELETE USING (
  team_id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 7. Verificar se as políticas foram criadas
SELECT * FROM pg_policies WHERE tablename = 'projects';
