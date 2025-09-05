import { supabase } from '../lib/supabase';

export interface Activity {
  id: string;
  user_id: string;
  action_type: string;
  entity_type: string;
  entity_id: string;
  description: string;
  old_value?: any;
  new_value?: any;
  created_at: string;
}

export interface Report {
  id: string;
  report_type: string;
  period_start: string;
  period_end: string;
  generated_at: string;
  data: any;
  recipients: string[];
  sent_at?: string;
  status: string;
}

export interface PendingItem {
  id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  assigned_to?: string;
  due_date?: string;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface Metric {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_unit?: string;
  category: string;
  period_start: string;
  period_end: string;
  created_at: string;
}

export const reportService = {
  // Buscar atividades recentes
  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // Buscar itens pendentes
  async getPendingItems(): Promise<PendingItem[]> {
    const { data, error } = await supabase
      .from('pending_items')
      .select('*')
      .order('priority', { ascending: false })
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Buscar métricas
  async getMetrics(category?: string): Promise<Metric[]> {
    let query = supabase
      .from('metrics')
      .select('*')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  // Gerar relatório diário
  async generateDailyReport(date: string = new Date().toISOString().split('T')[0]): Promise<any> {
    const { data, error } = await supabase.rpc('generate_daily_report', {
      p_date: date
    });

    if (error) throw error;
    return data;
  },

  // Gerar relatório semanal
  async generateWeeklyReport(startDate: string): Promise<any> {
    const { data, error } = await supabase.rpc('generate_weekly_report', {
      p_start_date: startDate
    });

    if (error) throw error;
    return data;
  },

  // Criar item pendente
  async createPendingItem(item: Omit<PendingItem, 'id' | 'created_at' | 'updated_at'>): Promise<PendingItem> {
    const { data, error } = await supabase
      .from('pending_items')
      .insert(item)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Atualizar item pendente
  async updatePendingItem(id: string, updates: Partial<PendingItem>): Promise<PendingItem> {
    const { data, error } = await supabase
      .from('pending_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Deletar item pendente
  async deletePendingItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('pending_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Registrar atividade
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
    });

    if (error) throw error;
  }
};
