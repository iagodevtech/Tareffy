-- Script para corrigir a tabela team_invites
-- Execute este script no Supabase SQL Editor

-- 1. Verificar a estrutura atual da tabela team_invites
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'team_invites' 
ORDER BY ordinal_position;

-- 2. Verificar se existe algum trigger que está causando o problema
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'team_invites';

-- 3. Verificar políticas RLS da tabela team_invites
SELECT * FROM pg_policies WHERE tablename = 'team_invites';

-- 4. Se necessário, adicionar a coluna updated_at (caso não exista)
-- ALTER TABLE team_invites ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 5. Criar trigger para atualizar updated_at automaticamente (se a coluna existir)
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at = NOW();
--     RETURN NEW;
-- END;
-- $$ language 'plpgsql';

-- DROP TRIGGER IF EXISTS update_team_invites_updated_at ON team_invites;
-- CREATE TRIGGER update_team_invites_updated_at
--     BEFORE UPDATE ON team_invites
--     FOR EACH ROW
--     EXECUTE FUNCTION update_updated_at_column();

-- 6. Verificar se há algum problema com as políticas RLS
-- Se necessário, recriar as políticas
DROP POLICY IF EXISTS "Users can view their own invites" ON team_invites;
DROP POLICY IF EXISTS "Users can insert invites" ON team_invites;
DROP POLICY IF EXISTS "Users can update invites" ON team_invites;
DROP POLICY IF EXISTS "Users can delete invites" ON team_invites;

-- Política para visualizar convites
CREATE POLICY "Users can view their own invites" ON team_invites
FOR SELECT USING (
  email = auth.jwt() ->> 'email' OR
  invited_by = auth.uid()
);

-- Política para inserir convites
CREATE POLICY "Users can insert invites" ON team_invites
FOR INSERT WITH CHECK (
  invited_by = auth.uid()
);

-- Política para atualizar convites (aceitar/rejeitar)
CREATE POLICY "Users can update invites" ON team_invites
FOR UPDATE USING (
  email = auth.jwt() ->> 'email' OR
  invited_by = auth.uid()
);

-- Política para deletar convites
CREATE POLICY "Users can delete invites" ON team_invites
FOR DELETE USING (
  invited_by = auth.uid()
);

-- 7. Verificar se as políticas foram criadas corretamente
SELECT * FROM pg_policies WHERE tablename = 'team_invites';
