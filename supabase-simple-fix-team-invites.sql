-- Script simples e direto para corrigir permissões de team_invites
-- Execute este script no Supabase SQL Editor

-- 1. Remover todas as políticas existentes
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON users;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON users;

DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON team_invites;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON team_invites;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON team_invites;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON team_invites;

-- 2. Criar políticas muito simples
CREATE POLICY "users_select_policy" ON users FOR SELECT USING (true);
CREATE POLICY "users_insert_policy" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_update_policy" ON users FOR UPDATE USING (true);
CREATE POLICY "users_delete_policy" ON users FOR DELETE USING (true);

CREATE POLICY "team_invites_select_policy" ON team_invites FOR SELECT USING (true);
CREATE POLICY "team_invites_insert_policy" ON team_invites FOR INSERT WITH CHECK (true);
CREATE POLICY "team_invites_update_policy" ON team_invites FOR UPDATE USING (true);
CREATE POLICY "team_invites_delete_policy" ON team_invites FOR DELETE USING (true);

-- 3. Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename IN ('users', 'team_invites')
ORDER BY tablename, policyname;
