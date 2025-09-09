-- Script para corrigir políticas RLS da tabela teams
-- Execute este script no Supabase SQL Editor

-- 1. Verificar políticas atuais da tabela teams
SELECT * FROM pg_policies WHERE tablename = 'teams';

-- 2. Verificar se RLS está habilitado na tabela teams
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'teams';

-- 3. Remover políticas antigas que podem estar bloqueando
DROP POLICY IF EXISTS "Users can view their own teams" ON teams;
DROP POLICY IF EXISTS "Users can insert their own teams" ON teams;
DROP POLICY IF EXISTS "Users can update their own teams" ON teams;
DROP POLICY IF EXISTS "Users can delete their own teams" ON teams;
DROP POLICY IF EXISTS "Users can view teams they are members of" ON teams;
DROP POLICY IF EXISTS "Users can view teams" ON teams;

-- 4. Criar novas políticas que permitem acesso baseado em membership
-- Política para visualizar equipes onde o usuário é membro
CREATE POLICY "Users can view teams they are members of" ON teams
FOR SELECT USING (
  id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid()
  )
);

-- Política para inserir equipes (criar)
CREATE POLICY "Users can insert their own teams" ON teams
FOR INSERT WITH CHECK (
  user_id = auth.uid()
);

-- Política para atualizar equipes (apenas admin)
CREATE POLICY "Users can update teams they admin" ON teams
FOR UPDATE USING (
  user_id = auth.uid() OR
  id IN (
    SELECT team_id FROM team_members 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Política para deletar equipes (apenas criador)
CREATE POLICY "Users can delete their own teams" ON teams
FOR DELETE USING (
  user_id = auth.uid()
);

-- 5. Verificar se as políticas foram criadas
SELECT * FROM pg_policies WHERE tablename = 'teams';

-- 6. Testar se as políticas estão funcionando
-- (Substitua 'SEU_USER_ID' pelo ID do usuário)
-- SELECT * FROM teams WHERE id IN (
--   SELECT team_id FROM team_members WHERE user_id = 'SEU_USER_ID'
-- );
