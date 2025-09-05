-- Script para corrigir RLS da tabela users

-- 1. Remover políticas existentes problemáticas
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- 2. Criar políticas RLS simplificadas para users
-- Permitir que usuários vejam apenas seu próprio perfil
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Permitir que usuários atualizem apenas seu próprio perfil
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Permitir que usuários criem seu próprio perfil
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Verificar se RLS está habilitado
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 4. Verificar as políticas criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users';
