-- Sistema de Relatórios e Dashboard para Tareffy

-- Tabela de atividades/alterações
CREATE TABLE IF NOT EXISTS activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action_type VARCHAR(100) NOT NULL, -- 'create', 'update', 'delete', 'status_change'
  entity_type VARCHAR(100) NOT NULL, -- 'contact', 'project', 'task', 'user'
  entity_id UUID,
  description TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de relatórios gerados
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_type VARCHAR(50) NOT NULL, -- 'daily', 'weekly', 'monthly'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data JSONB NOT NULL, -- Dados do relatório
  recipients TEXT[] NOT NULL, -- Lista de emails
  sent_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'pending' -- 'pending', 'sent', 'failed'
);

-- Tabela de configurações de relatórios
CREATE TABLE IF NOT EXISTS report_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_type VARCHAR(50) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  schedule VARCHAR(100) NOT NULL, -- 'daily', 'weekly', 'monthly'
  time TIME DEFAULT '09:00:00',
  day_of_week INTEGER, -- 0-6 (domingo-sábado) para relatórios semanais
  recipients TEXT[] NOT NULL,
  template_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de métricas para dashboard
CREATE TABLE IF NOT EXISTS metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name VARCHAR(100) NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_unit VARCHAR(50),
  category VARCHAR(100),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de pendências
CREATE TABLE IF NOT EXISTS pending_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(50) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'
  assigned_to UUID REFERENCES auth.users(id),
  due_date DATE,
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_items ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Activities viewable by authenticated users" ON activities
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Activities insertable by authenticated users" ON activities
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Reports viewable by authenticated users" ON reports
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Reports insertable by admin" ON reports
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Report configs viewable by admin" ON report_configs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Report configs manageable by admin" ON report_configs
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Metrics viewable by authenticated users" ON metrics
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Metrics insertable by admin" ON metrics
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Pending items viewable by authenticated users" ON pending_items
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Pending items manageable by authenticated users" ON pending_items
  FOR ALL USING (auth.role() = 'authenticated');

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_entity_type ON activities(entity_type);
CREATE INDEX IF NOT EXISTS idx_reports_period ON reports(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_metrics_period ON metrics(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_pending_items_status ON pending_items(status);
CREATE INDEX IF NOT EXISTS idx_pending_items_due_date ON pending_items(due_date);

-- Função para registrar atividades automaticamente
CREATE OR REPLACE FUNCTION log_activity(
  p_action_type VARCHAR(100),
  p_entity_type VARCHAR(100),
  p_entity_id UUID,
  p_description TEXT,
  p_old_value JSONB DEFAULT NULL,
  p_new_value JSONB DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  INSERT INTO activities (
    user_id,
    action_type,
    entity_type,
    entity_id,
    description,
    old_value,
    new_value
  ) VALUES (
    auth.uid(),
    p_action_type,
    p_entity_type,
    p_entity_id,
    p_description,
    p_old_value,
    p_new_value
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para gerar relatório diário
CREATE OR REPLACE FUNCTION generate_daily_report(p_date DATE DEFAULT CURRENT_DATE)
RETURNS JSONB AS $$
DECLARE
  report_data JSONB;
BEGIN
  SELECT jsonb_build_object(
    'period', jsonb_build_object('start', p_date, 'end', p_date),
    'summary', jsonb_build_object(
      'total_contacts', (SELECT COUNT(*) FROM contacts WHERE DATE(created_at) = p_date),
      'new_contacts', (SELECT COUNT(*) FROM contacts WHERE DATE(created_at) = p_date AND status = 'Novo Contato'),
      'total_activities', (SELECT COUNT(*) FROM activities WHERE DATE(created_at) = p_date),
      'pending_items', (SELECT COUNT(*) FROM pending_items WHERE status = 'pending'),
      'overdue_items', (SELECT COUNT(*) FROM pending_items WHERE due_date < p_date AND status IN ('pending', 'in_progress'))
    ),
    'activities', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'time', created_at,
          'user', (SELECT email FROM auth.users WHERE id = user_id),
          'action', action_type,
          'entity', entity_type,
          'description', description
        )
      ) FROM activities WHERE DATE(created_at) = p_date
    ),
    'pending_items', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'title', title,
          'priority', priority,
          'due_date', due_date,
          'assigned_to', (SELECT email FROM auth.users WHERE id = assigned_to)
        )
      ) FROM pending_items WHERE status = 'pending'
    )
  ) INTO report_data;
  
  RETURN report_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para gerar relatório semanal
CREATE OR REPLACE FUNCTION generate_weekly_report(p_start_date DATE DEFAULT DATE_TRUNC('week', CURRENT_DATE))
RETURNS JSONB AS $$
DECLARE
  end_date DATE := p_start_date + INTERVAL '6 days';
  report_data JSONB;
BEGIN
  SELECT jsonb_build_object(
    'period', jsonb_build_object('start', p_start_date, 'end', end_date),
    'summary', jsonb_build_object(
      'total_contacts', (SELECT COUNT(*) FROM contacts WHERE created_at >= p_start_date AND created_at <= end_date),
      'contacts_by_status', (
        SELECT jsonb_object_agg(status, count)
        FROM (
          SELECT status, COUNT(*) as count
          FROM contacts 
          WHERE created_at >= p_start_date AND created_at <= end_date
          GROUP BY status
        ) status_counts
      ),
      'total_activities', (SELECT COUNT(*) FROM activities WHERE created_at >= p_start_date AND created_at <= end_date),
      'activities_by_type', (
        SELECT jsonb_object_agg(action_type, count)
        FROM (
          SELECT action_type, COUNT(*) as count
          FROM activities 
          WHERE created_at >= p_start_date AND created_at <= end_date
          GROUP BY action_type
        ) action_counts
      ),
      'pending_items', (SELECT COUNT(*) FROM pending_items WHERE status = 'pending'),
      'completed_items', (SELECT COUNT(*) FROM pending_items WHERE status = 'completed' AND updated_at >= p_start_date AND updated_at <= end_date)
    ),
    'daily_breakdown', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'date', day_date,
          'contacts', day_contacts,
          'activities', day_activities
        )
      ) FROM (
        SELECT 
          generate_series(p_start_date, end_date, '1 day'::interval)::date as day_date,
          COUNT(DISTINCT c.id) as day_contacts,
          COUNT(DISTINCT a.id) as day_activities
        FROM generate_series(p_start_date, end_date, '1 day'::interval)::date d
        LEFT JOIN contacts c ON DATE(c.created_at) = d
        LEFT JOIN activities a ON DATE(a.created_at) = d
        GROUP BY d
        ORDER BY d
      ) daily_stats
    ),
    'top_priorities', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'title', title,
          'priority', priority,
          'due_date', due_date,
          'days_overdue', GREATEST(0, p_start_date - due_date)
        )
      ) FROM pending_items 
      WHERE status IN ('pending', 'in_progress') 
      AND priority IN ('high', 'urgent')
      ORDER BY priority DESC, due_date ASC
      LIMIT 10
    )
  ) INTO report_data;
  
  RETURN report_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Inserir configurações padrão de relatórios
INSERT INTO report_configs (report_type, schedule, recipients, template_id) VALUES
('daily', 'daily', ARRAY['admin@tareffy.com', 'team@tareffy.com'], 'daily_report_template'),
('weekly', 'weekly', ARRAY['admin@tareffy.com', 'team@tareffy.com', 'managers@tareffy.com'], 'weekly_report_template')
ON CONFLICT (report_type) DO NOTHING;
