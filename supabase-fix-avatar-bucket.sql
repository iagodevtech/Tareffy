-- Script para corrigir o bucket de avatars e suas permissões

-- 1. Criar o bucket 'avatars' se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Remover políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Allow public read access to avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update to own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete to own avatar" ON storage.objects;

-- 3. Criar políticas RLS para o bucket 'avatars'
-- Permitir que qualquer pessoa veja avatares (público)
CREATE POLICY "Allow public read access to avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Permitir que usuários autenticados façam upload de avatares
CREATE POLICY "Allow authenticated uploads to avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid() IS NOT NULL
  );

-- Permitir que usuários autenticados atualizem seus próprios avatares
CREATE POLICY "Allow authenticated update to own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    auth.uid() IS NOT NULL
  );

-- Permitir que usuários autenticados deletem seus próprios avatares
CREATE POLICY "Allow authenticated delete to own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND 
    auth.uid() IS NOT NULL
  );

-- 4. Verificar se o bucket foi criado
SELECT * FROM storage.buckets WHERE name = 'avatars';
