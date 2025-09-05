-- Script seguro para corrigir políticas RLS da tabela team_invites
-- Este script remove todas as políticas existentes antes de criar as novas

-- Função para remover todas as políticas existentes da tabela team_invites
DO $$
DECLARE
    policy_name TEXT;
BEGIN
    -- Remover todas as políticas existentes
    FOR policy_name IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'team_invites' 
        AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON team_invites', policy_name);
    END LOOP;
END $$;

-- Verificar se a tabela team_invites existe, se não existir, criar
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'team_invites' AND table_schema = 'public') THEN
        CREATE TABLE team_invites (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
            email TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'member',
            invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            status TEXT NOT NULL DEFAULT 'pending',
            expires_at DATE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Criar índices para performance
        CREATE INDEX idx_team_invites_team_id ON team_invites(team_id);
        CREATE INDEX idx_team_invites_email ON team_invites(email);
        CREATE INDEX idx_team_invites_invited_by ON team_invites(invited_by);
        
        -- Habilitar RLS
        ALTER TABLE team_invites ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Criar políticas RLS simplificadas e funcionais
CREATE POLICY "Users can view team invites" ON team_invites
  FOR SELECT USING (
    auth.uid() = invited_by OR 
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert team invites" ON team_invites
  FOR INSERT WITH CHECK (
    auth.uid() = invited_by AND
    auth.uid() IN (SELECT user_id FROM teams WHERE id = team_invites.team_id)
  );

CREATE POLICY "Users can update team invites" ON team_invites
  FOR UPDATE USING (
    auth.uid() = invited_by OR 
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "Users can delete team invites" ON team_invites
  FOR DELETE USING (auth.uid() = invited_by);

-- Verificar se as políticas foram criadas corretamente
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'team_invites' 
AND schemaname = 'public'
ORDER BY policyname;
