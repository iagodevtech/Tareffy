-- Script para verificar se o membro foi adicionado corretamente
-- Execute este script no Supabase SQL Editor

-- 1. Verificar todos os membros de equipes
SELECT 
  tm.id,
  tm.team_id,
  tm.user_id,
  tm.role,
  tm.created_at,
  t.name as team_name,
  u.email as user_email
FROM team_members tm
LEFT JOIN teams t ON tm.team_id = t.id
LEFT JOIN auth.users u ON tm.user_id = u.id
ORDER BY tm.created_at DESC;

-- 2. Verificar se há algum problema com as políticas RLS da tabela team_members
SELECT * FROM pg_policies WHERE tablename = 'team_members';

-- 3. Verificar se há algum problema com as políticas RLS da tabela teams
SELECT * FROM pg_policies WHERE tablename = 'teams';

-- 4. Testar uma consulta simples para ver se as políticas estão funcionando
-- (Substitua 'SEU_USER_ID_AQUI' pelo ID do usuário que foi convidado)
-- SELECT * FROM team_members WHERE user_id = 'SEU_USER_ID_AQUI';

-- 5. Verificar se a tabela team_members tem as colunas corretas
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'team_members' 
ORDER BY ordinal_position;
