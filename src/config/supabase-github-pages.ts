import { createClient } from '@supabase/supabase-js'

// Configuração para GitHub Pages
// As variáveis de ambiente devem ser configuradas nos Secrets do GitHub
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Verificação de configuração
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Configuração do Supabase não encontrada!')
  console.error('Configure as seguintes variáveis de ambiente:')
  console.error('- VITE_SUPABASE_URL')
  console.error('- VITE_SUPABASE_ANON_KEY')
  console.error('')
  console.error('Para GitHub Pages, configure nos Secrets do repositório:')
  console.error('1. Vá para Settings > Secrets and variables > Actions')
  console.error('2. Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY')
  console.error('3. Faça push para a branch main para executar o deploy')
}

// Cliente Supabase
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// Função para verificar se o Supabase está configurado
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Função para obter status da configuração
export const getConfigStatus = () => {
  return {
    supabaseUrl: !!supabaseUrl,
    supabaseAnonKey: !!supabaseAnonKey,
    isConfigured: isSupabaseConfigured()
  }
}
