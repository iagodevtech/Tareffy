import { supabase } from '../lib/supabase';
import { reportService } from './reportService';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
  team: string;
  deadline: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const projectService = {
  // Buscar todos os projetos do usuário
  async getProjects(): Promise<Project[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Criar novo projeto
  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Project> {
    console.log('🔧 projectService.createProject - Iniciando...', project);
    
    const { data: { user } } = await supabase.auth.getUser();
    console.log('👤 Usuário autenticado:', user?.id, user?.email);
    
    if (!user) throw new Error('Usuário não autenticado');

    // Remover campos que devem ser gerados automaticamente pelo Supabase
    const projectData = {
      name: project.name,
      description: project.description,
      status: project.status,
      progress: project.progress,
      team: project.team,
      deadline: project.deadline,
      user_id: user.id
    };
    console.log('📝 Dados do projeto para inserir:', projectData);

    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao criar projeto:', error);
      console.error('❌ Detalhes do erro:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
    
    console.log('✅ Projeto criado com sucesso:', data);

    // Registrar atividade
    try {
      await reportService.logActivity(
        'create',
        'project',
        data.id,
        `Projeto "${project.name}" foi criado`
      );
    } catch (logError) {
      console.warn('Erro ao registrar atividade:', logError);
    }

    return data;
  },

  // Atualizar projeto
  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    // Buscar dados antigos para log
    const { data: oldData } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    // Remover campos que não devem ser atualizados manualmente
    const { id: _, created_at, updated_at, user_id, ...updateData } = updates;
    console.log('📝 Dados para atualizar:', updateData);

    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    // Registrar atividade
    try {
      await reportService.logActivity(
        'update',
        'project',
        id,
        `Projeto "${data.name}" foi atualizado`,
        oldData,
        data
      );
    } catch (logError) {
      console.warn('Erro ao registrar atividade:', logError);
    }

    return data;
  },

  // Deletar projeto
  async deleteProject(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    // Buscar dados para log
    const { data: projectData } = await supabase
      .from('projects')
      .select('name')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    // Registrar atividade
    try {
      await reportService.logActivity(
        'delete',
        'project',
        id,
        `Projeto "${projectData?.name || 'Desconhecido'}" foi excluído`
      );
    } catch (logError) {
      console.warn('Erro ao registrar atividade:', logError);
    }
  }
};
