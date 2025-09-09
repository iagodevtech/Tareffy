import { supabase } from '../lib/supabase';
import { realEmailService } from './realEmailService';

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
  teams?: {
    name: string;
    description: string;
  };
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

    try {
      // Primeiro buscar os team_ids onde o usuário é membro
      const { data: memberships, error: membersError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id);

      if (membersError) throw membersError;

      if (!memberships || memberships.length === 0) {
        return [];
      }

      const teamIds = memberships.map(m => m.team_id);

      // Depois buscar as equipes pelos IDs
      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .in('id', teamIds)
        .order('created_at', { ascending: false });

      if (teamsError) throw teamsError;
      return teams || [];
    } catch (error) {
      console.error('❌ Erro em getTeamsAsMember:', error);
      throw error;
    }
  },

  // Criar nova equipe
  async createTeam(team: Omit<Team, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Team> {
    console.log('🔧 teamService.createTeam - Iniciando...', team);
    
    const { data: { user } } = await supabase.auth.getUser();
    console.log('👤 Usuário autenticado:', user?.id, user?.email);
    
    if (!user) throw new Error('Usuário não autenticado');

    // Remover campos que devem ser gerados automaticamente pelo Supabase
    const teamData = {
      name: team.name,
      description: team.description,
      user_id: user.id
    };
    console.log('📝 Dados da equipe para inserir:', teamData);

    const { data, error } = await supabase
      .from('teams')
      .insert(teamData)
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao criar equipe:', error);
      throw error;
    }
    
    console.log('✅ Equipe criada com sucesso:', data);

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

    // Remover campos que não devem ser atualizados manualmente
    const { id: _, created_at, updated_at, user_id, ...updateData } = updates;
    console.log('📝 Dados para atualizar equipe:', updateData);

    const { data, error } = await supabase
      .from('teams')
      .update(updateData)
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
    console.log('🔧 teamService.inviteMember - Iniciando...', { teamId, email, role });
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    // Verificar se o usuário tem permissão para convidar (apenas admin/criador)
    const { data: member } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .single();

    if (!member || member.role !== 'admin') {
      throw new Error('Apenas o administrador da equipe pode convidar novos membros');
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

    // Criar convite sem verificar se o usuário existe na tabela users
    // O convite será válido mesmo se o usuário não estiver registrado ainda
    const inviteData = {
      team_id: teamId,
      email,
      role,
      invited_by: user.id,
      expires_at: expiresAt.toISOString().split('T')[0] // Converter para formato DATE
    };
    
    console.log('📝 Dados do convite para inserir:', inviteData);

    const { data, error } = await supabase
      .from('team_invites')
      .insert(inviteData)
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao criar convite:', error);
      throw error;
    }

    console.log('✅ Convite criado com sucesso:', data);

    // Enviar email de convite
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const inviterName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário';
      
      // Buscar nome da equipe
      const { data: team } = await supabase
        .from('teams')
        .select('name')
        .eq('id', teamId)
        .single();
      
      const teamName = team?.name || 'Equipe';
      
      // Verificar se o email não está vazio
      if (!email || email.trim() === '') {
        console.error('❌ Email de destino está vazio!');
        return data;
      }
      
      console.log('📧 Enviando convite para:', { email, teamName, role, inviterName, inviteId: data.id });
      
      const emailSent = await realEmailService.sendTeamInvite(email.trim(), teamName, role, inviterName, data.id);
      
      if (emailSent) {
        console.log(`✅ Email de convite enviado com sucesso para ${email}`);
      } else {
        console.log(`⚠️ Convite criado no banco, mas falha ao enviar email para ${email}`);
      }
    } catch (emailError) {
      console.error('❌ Erro ao enviar email de convite:', emailError);
    }

    return data;
  },

  // Aceitar convite
  async acceptInvite(inviteId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    try {
      console.log('🔧 Iniciando aceite do convite:', inviteId);

      // Buscar convite
      const { data: invite, error: inviteError } = await supabase
        .from('team_invites')
        .select('*')
        .eq('id', inviteId)
        .eq('email', user.email)
        .eq('status', 'pending')
        .single();

      if (inviteError || !invite) {
        console.error('❌ Convite não encontrado:', inviteError);
        throw new Error('Convite não encontrado ou inválido');
      }

      console.log('✅ Convite encontrado:', invite);

      // Verificar se não expirou
      if (new Date(invite.expires_at) < new Date()) {
        throw new Error('Convite expirado');
      }

      // Adicionar membro à equipe
      console.log('👥 Adicionando membro à equipe...');
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: invite.team_id,
          user_id: user.id,
          role: invite.role
        });

      if (memberError) {
        console.error('❌ Erro ao adicionar membro:', memberError);
        throw memberError;
      }

      console.log('✅ Membro adicionado à equipe');

      // Atualizar status do convite (sem updated_at)
      console.log('📝 Atualizando status do convite...');
      const { error: updateError } = await supabase
        .from('team_invites')
        .update({ status: 'accepted' })
        .eq('id', inviteId)
        .select();

      if (updateError) {
        console.error('❌ Erro ao atualizar status do convite:', updateError);
        // Não vamos falhar aqui, pois o membro já foi adicionado
        console.log('⚠️ Membro foi adicionado, mas falha ao atualizar convite');
      } else {
        console.log('✅ Status do convite atualizado');
      }

    } catch (error) {
      console.error('❌ Erro geral ao aceitar convite:', error);
      throw error;
    }
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

    try {
      // Buscar convites pendentes
      const { data: invites, error: invitesError } = await supabase
        .from('team_invites')
        .select('*')
        .eq('email', user.email)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (invitesError) throw invitesError;

      if (!invites || invites.length === 0) {
        return [];
      }

      // Buscar informações das equipes
      const teamIds = invites.map(invite => invite.team_id);
      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select('id, name, description')
        .in('id', teamIds);

      if (teamsError) throw teamsError;

      // Combinar dados
      const invitesWithTeams = invites.map(invite => {
        const team = teams?.find(t => t.id === invite.team_id);
        return {
          ...invite,
          teams: team ? { name: team.name, description: team.description } : null
        };
      });

      return invitesWithTeams;
    } catch (error) {
      console.error('Erro em getPendingInvites:', error);
      throw error;
    }
  }
};
