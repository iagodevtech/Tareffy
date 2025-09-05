import { supabase } from '../lib/supabase';

export interface Team {
  id: string;
  name: string;
  description: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'admin' | 'dev' | 'member';
  created_at: string;
}

export interface TeamInvite {
  id: string;
  team_id: string;
  email: string;
  role: 'admin' | 'dev' | 'member';
  status: 'pending' | 'accepted' | 'rejected';
  invited_by: string;
  created_at: string;
  expires_at: string;
}

export const teamService = {
  // Buscar equipes do usuário
  async getTeams(): Promise<Team[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Buscar equipes onde o usuário é membro
  async getTeamsAsMember(): Promise<Team[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('team_members')
      .select(`
        team_id,
        teams (
          id,
          name,
          description,
          user_id,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', user.id);

    if (error) throw error;
    return data?.map(item => item.teams).flat().filter(Boolean) || [];
  },

  // Criar nova equipe
  async createTeam(team: Omit<Team, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Team> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('teams')
      .insert({
        ...team,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;

    // Adicionar o criador como admin
    await supabase
      .from('team_members')
      .insert({
        team_id: data.id,
        user_id: user.id,
        role: 'admin'
      });

    return data;
  },

  // Atualizar equipe
  async updateTeam(id: string, updates: Partial<Team>): Promise<Team> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('teams')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Deletar equipe
  async deleteTeam(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  // Buscar membros da equipe
  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Convidar membro para equipe
  async inviteMember(teamId: string, email: string, role: 'admin' | 'dev' | 'member'): Promise<TeamInvite> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    // Verificar se o usuário tem permissão para convidar
    const { data: member } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .single();

    if (!member || (member.role !== 'admin' && member.role !== 'dev')) {
      throw new Error('Você não tem permissão para convidar membros');
    }

    // Verificar se já existe convite pendente
    const { data: existingInvite } = await supabase
      .from('team_invites')
      .select('id')
      .eq('team_id', teamId)
      .eq('email', email)
      .eq('status', 'pending')
      .single();

    if (existingInvite) {
      throw new Error('Já existe um convite pendente para este email');
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expira em 7 dias

    const { data, error } = await supabase
      .from('team_invites')
      .insert({
        team_id: teamId,
        email,
        role,
        invited_by: user.id,
        expires_at: expiresAt.toISOString().split('T')[0] // Converter para formato DATE
      })
      .select()
      .single();

    if (error) throw error;

    // TODO: Enviar email de convite
    console.log(`Convite enviado para ${email} com role ${role}`);

    return data;
  },

  // Aceitar convite
  async acceptInvite(inviteId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    // Buscar convite
    const { data: invite, error: inviteError } = await supabase
      .from('team_invites')
      .select('*')
      .eq('id', inviteId)
      .eq('email', user.email)
      .eq('status', 'pending')
      .single();

    if (inviteError || !invite) {
      throw new Error('Convite não encontrado ou inválido');
    }

    // Verificar se não expirou
    if (new Date(invite.expires_at) < new Date()) {
      throw new Error('Convite expirado');
    }

    // Adicionar membro à equipe
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: invite.team_id,
        user_id: user.id,
        role: invite.role
      });

    if (memberError) throw memberError;

    // Atualizar status do convite
    const { error: updateError } = await supabase
      .from('team_invites')
      .update({ status: 'accepted' })
      .eq('id', inviteId);

    if (updateError) throw updateError;
  },

  // Rejeitar convite
  async rejectInvite(inviteId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { error } = await supabase
      .from('team_invites')
      .update({ status: 'rejected' })
      .eq('id', inviteId)
      .eq('email', user.email);

    if (error) throw error;
  },

  // Remover membro da equipe
  async removeMember(teamId: string, userId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    // Verificar se o usuário tem permissão
    const { data: member } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .single();

    if (!member || member.role !== 'admin') {
      throw new Error('Apenas administradores podem remover membros');
    }

    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  // Buscar convites pendentes do usuário
  async getPendingInvites(): Promise<TeamInvite[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('team_invites')
      .select(`
        *,
        teams (
          name,
          description
        )
      `)
      .eq('email', user.email)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};
