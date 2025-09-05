import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase - funciona tanto em desenvolvimento quanto em produção
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://hgvttyfclovanraevluf.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhndnR0eWZjbG92YW5yYWV2bHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MTI2NjQsImV4cCI6MjA3MjQ4ODY2NH0.SBW41D1nY9_fWjk2YhVWKGzW2wCeH07kfz9ebZEk2Sc'

// Log para debug
console.log('🔧 Supabase Config:', {
  url: supabaseUrl,
  key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT FOUND',
  env: process.env.NODE_ENV,
  hasUrl: !!process.env.REACT_APP_SUPABASE_URL,
  hasKey: !!process.env.REACT_APP_SUPABASE_ANON_KEY
})

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Configuração do Supabase não encontrada!')
  console.error('URL:', supabaseUrl)
  console.error('Key:', supabaseAnonKey ? 'EXISTS' : 'NOT FOUND')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
