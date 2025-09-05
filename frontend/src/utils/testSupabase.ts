import { supabase } from '../lib/supabase';

export const testSupabaseConnection = async () => {
  console.log('🔧 Testando conexão com Supabase...');
  
  try {
    // Testar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('👤 Usuário atual:', user?.id, user?.email);
    if (authError) {
      console.error('❌ Erro de autenticação:', authError);
      return false;
    }

    // Testar se as tabelas existem
    const tables = ['projects', 'teams', 'users'];
    
    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.error(`❌ Erro ao acessar tabela ${table}:`, error);
        } else {
          console.log(`✅ Tabela ${table} acessível`);
        }
      } catch (err) {
        console.error(`❌ Erro ao testar tabela ${table}:`, err);
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Erro geral no teste:', error);
    return false;
  }
};

// Função para testar criação de projeto
export const testCreateProject = async () => {
  console.log('🔧 Testando criação de projeto...');
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('❌ Usuário não autenticado');
      return false;
    }

    const testProject = {
      name: 'Projeto Teste',
      description: 'Descrição do projeto teste',
      status: 'active' as const,
      progress: 0,
      team: 'Equipe Teste',
      deadline: null,
      user_id: user.id
    };

    console.log('📝 Tentando criar projeto:', testProject);

    const { data, error } = await supabase
      .from('projects')
      .insert(testProject)
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao criar projeto teste:', error);
      return false;
    }

    console.log('✅ Projeto teste criado com sucesso:', data);
    
    // Limpar o projeto teste
    await supabase
      .from('projects')
      .delete()
      .eq('id', data.id);
    
    console.log('🧹 Projeto teste removido');
    return true;
  } catch (error) {
    console.error('❌ Erro no teste de criação:', error);
    return false;
  }
};
