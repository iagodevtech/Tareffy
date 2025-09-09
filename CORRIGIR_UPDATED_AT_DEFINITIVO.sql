-- Script para corrigir definitivamente o problema do campo updated_at
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se a coluna updated_at existe na tabela team_invites
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'team_invites' 
ORDER BY ordinal_position;

-- 2. Adicionar a coluna updated_at se não existir
ALTER TABLE team_invites 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. Verificar se existem triggers que podem estar causando o problema
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'team_invites';

-- 4. Remover triggers problemáticos se existirem
DROP TRIGGER IF EXISTS update_team_invites_updated_at ON team_invites;

-- 5. Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Criar trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_team_invites_updated_at
    BEFORE UPDATE ON team_invites
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Verificar se a coluna foi criada corretamente
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'team_invites' 
ORDER BY ordinal_position;

-- 8. Testar se o trigger foi criado
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'team_invites';
