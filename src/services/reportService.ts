import { supabase } from '../config/supabase'

export interface Activity {
  id: string
  user_id: string
  action_type: string
  entity_type: string
  entity_id: string
  description: string
  old_value: any
  new_value: any
  created_at: string
}

export interface Report {
  id: string
  report_type: 'daily' | 'weekly' | 'monthly'
  period_start: string
  period_end: string
  generated_at: string
  data: any
  recipients: string[]
  sent_at: string | null
  status: 'pending' | 'sent' | 'failed'
}

export interface PendingItem {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  assigned_to: string
  due_date: string
  category: string
  created_at: string
  updated_at: string
}

export interface Metric {
  id: string
  metric_name: string
  metric_value: number
  metric_unit: string
  category: string
  period_start: string
  period_end: string
  created_at: string
}

// Serviço de Relatórios
export const reportService = {
  // Gerar relatório diário
  async generateDailyReport(date: Date = new Date()): Promise<any> {
    const { data, error } = await supabase.rpc('generate_daily_report', {
      p_date: date.toISOString().split('T')[0]
    })
    
    if (error) throw error
    return data
  },

  // Gerar relatório semanal
  async generateWeeklyReport(startDate: Date = new Date()): Promise<any> {
    const { data, error } = await supabase.rpc('generate_weekly_report', {
      p_start_date: startDate.toISOString().split('T')[0]
    })
    
    if (error) throw error
    return data
  },

  // Salvar relatório gerado
  async saveReport(report: Omit<Report, 'id' | 'generated_at'>): Promise<Report> {
    const { data, error } = await supabase
      .from('reports')
      .insert([report])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Obter relatórios por período
  async getReportsByPeriod(startDate: string, endDate: string): Promise<Report[]> {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .gte('period_start', startDate)
      .lte('period_end', endDate)
      .order('generated_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Obter configurações de relatórios
  async getReportConfigs(): Promise<any[]> {
    const { data, error } = await supabase
      .from('report_configs')
      .select('*')
      .eq('is_active', true)

    if (error) throw error
    return data || []
  },

  // Atualizar configuração de relatório
  async updateReportConfig(id: string, updates: Partial<any>): Promise<any> {
    const { data, error } = await supabase
      .from('report_configs')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Serviço de Atividades
export const activityService = {
  // Registrar atividade automaticamente
  async logActivity(
    actionType: string,
    entityType: string,
    entityId: string,
    description: string,
    oldValue?: any,
    newValue?: any
  ): Promise<void> {
    const { error } = await supabase.rpc('log_activity', {
      p_action_type: actionType,
      p_entity_type: entityType,
      p_entity_id: entityId,
      p_description: description,
      p_old_value: oldValue,
      p_new_value: newValue
    })

    if (error) throw error
  },

  // Obter atividades por período
  async getActivitiesByPeriod(startDate: string, endDate: string): Promise<Activity[]> {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Obter atividades por usuário
  async getActivitiesByUser(userId: string): Promise<Activity[]> {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }
}

// Serviço de Pendências
export const pendingService = {
  // Criar nova pendência
  async createPendingItem(item: Omit<PendingItem, 'id' | 'created_at' | 'updated_at'>): Promise<PendingItem> {
    const { data, error } = await supabase
      .from('pending_items')
      .insert([item])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Atualizar pendência
  async updatePendingItem(id: string, updates: Partial<PendingItem>): Promise<PendingItem> {
    const { data, error } = await supabase
      .from('pending_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Obter pendências por status
  async getPendingItemsByStatus(status: string): Promise<PendingItem[]> {
    const { data, error } = await supabase
      .from('pending_items')
      .select('*')
      .eq('status', status)
      .order('due_date', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Obter pendências por prioridade
  async getPendingItemsByPriority(priority: string): Promise<PendingItem[]> {
    const { data, error } = await supabase
      .from('pending_items')
      .select('*')
      .eq('priority', priority)
      .order('due_date', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Obter pendências vencidas
  async getOverdueItems(): Promise<PendingItem[]> {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('pending_items')
      .select('*')
      .lt('due_date', today)
      .in('status', ['pending', 'in_progress'])
      .order('due_date', { ascending: true })

    if (error) throw error
    return data || []
  }
}

// Serviço de Métricas
export const metricService = {
  // Criar nova métrica
  async createMetric(metric: Omit<Metric, 'id' | 'created_at'>): Promise<Metric> {
    const { data, error } = await supabase
      .from('metrics')
      .insert([metric])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Obter métricas por categoria
  async getMetricsByCategory(category: string, startDate: string, endDate: string): Promise<Metric[]> {
    const { data, error } = await supabase
      .from('metrics')
      .select('*')
      .eq('category', category)
      .gte('period_start', startDate)
      .lte('period_end', endDate)
      .order('period_start', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Obter métricas para dashboard
  async getDashboardMetrics(): Promise<any> {
    const today = new Date()
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('status, created_at')
      .gte('created_at', weekAgo.toISOString())

    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select('action_type, created_at')
      .gte('created_at', weekAgo.toISOString())

    const { data: pending, error: pendingError } = await supabase
      .from('pending_items')
      .select('priority, status, due_date')

    if (contactsError || activitiesError || pendingError) {
      throw new Error('Erro ao carregar métricas do dashboard')
    }

    return {
      contacts: contacts || [],
      activities: activities || [],
      pending: pending || []
    }
  }
}
