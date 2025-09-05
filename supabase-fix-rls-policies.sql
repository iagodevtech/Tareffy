-- Corrigir políticas RLS para tabela users
-- Este arquivo deve ser executado no Supabase para corrigir o erro "permission denied for table users"

-- Habilitar RLS na tabela users se não estiver habilitado
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política para usuários visualizarem apenas seus próprios dados
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Política para usuários atualizarem apenas seus próprios dados
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Política para inserção de novos usuários (usado pelo trigger)
CREATE POLICY "Enable insert for authenticated users" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Política para deletar próprio perfil
CREATE POLICY "Users can delete own profile" ON users
  FOR DELETE USING (auth.uid() = id);

-- Verificar se as tabelas projects e teams têm RLS habilitado
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Políticas para projects
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para teams
CREATE POLICY "Users can view own teams" ON teams
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own teams" ON teams
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own teams" ON teams
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own teams" ON teams
  FOR DELETE USING (auth.uid() = user_id);

-- Verificar se as tabelas team_members e team_invites existem e têm RLS
DO $$
BEGIN
  -- Verificar se team_members existe
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'team_members') THEN
    ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Users can view team members" ON team_members
      FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.uid() IN (SELECT user_id FROM team_members WHERE team_id = team_members.team_id)
      );
    
    CREATE POLICY "Users can insert team members" ON team_members
      FOR INSERT WITH CHECK (
        auth.uid() = user_id OR 
        auth.uid() IN (SELECT user_id FROM team_members WHERE team_id = team_members.team_id AND role IN ('admin', 'dev'))
      );
    
    CREATE POLICY "Users can delete team members" ON team_members
      FOR DELETE USING (
        auth.uid() = user_id OR 
        auth.uid() IN (SELECT user_id FROM team_members WHERE team_id = team_members.team_id AND role = 'admin')
      );
  END IF;

  -- Verificar se team_invites existe
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'team_invites') THEN
    ALTER TABLE team_invites ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Users can view team invites" ON team_invites
      FOR SELECT USING (
        auth.uid() = invited_by OR 
        email = (SELECT email FROM auth.users WHERE id = auth.uid())
      );
    
    CREATE POLICY "Users can insert team invites" ON team_invites
      FOR INSERT WITH CHECK (
        auth.uid() = invited_by AND
        auth.uid() IN (SELECT user_id FROM team_members WHERE team_id = team_invites.team_id AND role IN ('admin', 'dev'))
      );
    
    CREATE POLICY "Users can update team invites" ON team_invites
      FOR UPDATE USING (
        auth.uid() = invited_by OR 
        email = (SELECT email FROM auth.users WHERE id = auth.uid())
      );
  END IF;
END $$;
