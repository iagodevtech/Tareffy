-- Corrigir políticas RLS específicas para team_invites
-- Este arquivo resolve o erro "permission denied for table users" ao convidar membros

-- Remover políticas existentes problemáticas
DROP POLICY IF EXISTS "Users can view team invites" ON team_invites;
DROP POLICY IF EXISTS "Users can insert team invites" ON team_invites;
DROP POLICY IF EXISTS "Users can update team invites" ON team_invites;
DROP POLICY IF EXISTS "Users can delete team invites" ON team_invites;

-- Políticas simplificadas para team_invites
-- Permitir que usuários vejam convites que enviaram ou receberam
CREATE POLICY "Users can view team invites" ON team_invites
  FOR SELECT USING (
    auth.uid() = invited_by OR 
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Permitir que usuários criem convites se forem donos da equipe
CREATE POLICY "Users can insert team invites" ON team_invites
  FOR INSERT WITH CHECK (
    auth.uid() = invited_by AND
    auth.uid() IN (SELECT user_id FROM teams WHERE id = team_invites.team_id)
  );

-- Permitir que usuários atualizem convites que enviaram ou receberam
CREATE POLICY "Users can update team invites" ON team_invites
  FOR UPDATE USING (
    auth.uid() = invited_by OR 
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Permitir que usuários deletem convites que enviaram
CREATE POLICY "Users can delete team invites" ON team_invites
  FOR DELETE USING (auth.uid() = invited_by);

-- Verificar se a tabela team_invites tem a estrutura correta
-- Se não existir, criar com estrutura básica
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'team_invites') THEN
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
    
    -- Habilitar RLS
    ALTER TABLE team_invites ENABLE ROW LEVEL SECURITY;
    
    -- Criar índices para performance
    CREATE INDEX idx_team_invites_team_id ON team_invites(team_id);
    CREATE INDEX idx_team_invites_email ON team_invites(email);
    CREATE INDEX idx_team_invites_invited_by ON team_invites(invited_by);
  END IF;
END $$;
