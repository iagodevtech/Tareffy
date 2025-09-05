-- Script para corrigir TODOS os problemas de RLS

-- 1. Corrigir RLS da tabela users
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Corrigir RLS da tabela team_invites
DROP POLICY IF EXISTS "Users can view team invites" ON team_invites;
DROP POLICY IF EXISTS "Users can insert team invites" ON team_invites;
DROP POLICY IF EXISTS "Users can update team invites" ON team_invites;
DROP POLICY IF EXISTS "Users can delete team invites" ON team_invites;

CREATE POLICY "Users can view team invites" ON team_invites
  FOR SELECT USING (
    auth.uid() = invited_by OR
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert team invites" ON team_invites
  FOR INSERT WITH CHECK (auth.uid() = invited_by);

CREATE POLICY "Users can update team invites" ON team_invites
  FOR UPDATE USING (
    auth.uid() = invited_by OR
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "Users can delete team invites" ON team_invites
  FOR DELETE USING (
    auth.uid() = invited_by OR
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- 3. Verificar se RLS está habilitado
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invites ENABLE ROW LEVEL SECURITY;

-- 4. Verificar as políticas criadas
SELECT 'users' as table_name, policyname, cmd FROM pg_policies WHERE tablename = 'users'
UNION ALL
SELECT 'team_invites' as table_name, policyname, cmd FROM pg_policies WHERE tablename = 'team_invites';
