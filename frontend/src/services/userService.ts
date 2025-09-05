import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  company?: string;
  position?: string;
  timezone?: string;
  language?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
    project_updates: boolean;
    team_invites: boolean;
    deadline_reminders: boolean;
  };
  privacy: {
    profile_visibility: 'public' | 'private' | 'team_only';
    show_online_status: boolean;
    allow_team_invites: boolean;
  };
  preferences: {
    date_format: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
    time_format: '12h' | '24h';
    week_start: 'monday' | 'sunday';
    default_view: 'dashboard' | 'projects' | 'teams';
  };
  created_at: string;
  updated_at: string;
}

export const userService = {
  // Buscar perfil do usuário
  async getProfile(): Promise<UserProfile> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }

    // Se não existe perfil, criar um básico
    if (!data) {
      return {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || '',
        avatar_url: user.user_metadata?.avatar_url || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    return data;
  },

  // Atualizar perfil do usuário
  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email,
        ...updates,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Atualizar metadados do usuário no auth
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        full_name: updates.full_name || data.full_name,
        avatar_url: updates.avatar_url || data.avatar_url
      }
    });

    if (authError) {
      console.warn('Erro ao atualizar metadados do auth:', authError);
    }

    return data;
  },

  // Buscar configurações do usuário
  async getSettings(): Promise<UserSettings> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // Se não existe configurações, criar padrões
    if (!data) {
      const defaultSettings: UserSettings = {
        id: '',
        user_id: user.id,
        theme: 'system',
        notifications: {
          email: true,
          push: true,
          desktop: true,
          project_updates: true,
          team_invites: true,
          deadline_reminders: true
        },
        privacy: {
          profile_visibility: 'team_only',
          show_online_status: true,
          allow_team_invites: true
        },
        preferences: {
          date_format: 'DD/MM/YYYY',
          time_format: '24h',
          week_start: 'monday',
          default_view: 'dashboard'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return await this.updateSettings(defaultSettings);
    }

    return data;
  },

  // Atualizar configurações do usuário
  async updateSettings(updates: Partial<UserSettings>): Promise<UserSettings> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        ...updates,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Upload de avatar
  async uploadAvatar(file: File): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = fileName; // Remover o prefixo avatars/ se o bucket já tem essa estrutura

    console.log('🔧 Tentando fazer upload do avatar:', { fileName, filePath });

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      console.error('❌ Erro no upload:', uploadError);
      throw new Error(`Erro no upload: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    console.log('✅ Avatar enviado com sucesso:', data.publicUrl);
    return data.publicUrl;
  },

  // Deletar conta
  async deleteAccount(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    // Deletar dados do usuário
    await supabase.from('users').delete().eq('id', user.id);
    await supabase.from('user_settings').delete().eq('user_id', user.id);
    
    // Deletar avatar se existir
    try {
      await supabase.storage.from('avatars').remove([`avatars/${user.id}-*`]);
    } catch (error) {
      console.warn('Erro ao deletar avatar:', error);
    }

    // Deletar conta do auth
    const { error } = await supabase.auth.admin.deleteUser(user.id);
    if (error) throw error;
  },

  // Alterar senha
  async changePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
  }
};
