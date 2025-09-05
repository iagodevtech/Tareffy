-- Sistema de Relatórios e Dashboard para Tareffy - Fixed Version

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

-- Tabela de itens pendentes
CREATE TABLE IF NOT EXISTS pending_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  item_type VARCHAR(100) NOT NULL, -- 'task', 'project', 'team_invite'
  item_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(20) DEFAULT 'medium',
  due_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Activities viewable by authenticated users" ON activities;
DROP POLICY IF EXISTS "Activities insertable by authenticated users" ON activities;
DROP POLICY IF EXISTS "Reports viewable by authenticated users" ON reports;
DROP POLICY IF EXISTS "Reports insertable by admin" ON reports;
DROP POLICY IF EXISTS "Report configs viewable by admin" ON report_configs;
DROP POLICY IF EXISTS "Report configs manageable by admin" ON report_configs;
DROP POLICY IF EXISTS "Metrics viewable by authenticated users" ON metrics;
DROP POLICY IF EXISTS "Metrics insertable by admin" ON metrics;
DROP POLICY IF EXISTS "Pending items viewable by authenticated users" ON pending_items;
DROP POLICY IF EXISTS "Pending items manageable by authenticated users" ON pending_items;

-- Criar políticas RLS
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
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Pending items manageable by authenticated users" ON pending_items
  FOR ALL USING (auth.uid() = user_id);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_entity_type ON activities(entity_type);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(report_type);
CREATE INDEX IF NOT EXISTS idx_reports_period ON reports(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_metrics_name ON metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_metrics_period ON metrics(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_pending_items_user_id ON pending_items(user_id);
CREATE INDEX IF NOT EXISTS idx_pending_items_status ON pending_items(status);

-- Função para log de atividades
CREATE OR REPLACE FUNCTION log_activity(
  p_action_type VARCHAR(100),
  p_entity_type VARCHAR(100),
  p_entity_id UUID,
  p_description TEXT,
  p_old_value JSONB DEFAULT NULL,
  p_new_value JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  activity_id UUID;
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
  ) RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para gerar relatório diário
CREATE OR REPLACE FUNCTION generate_daily_report(p_date DATE DEFAULT CURRENT_DATE)
RETURNS JSONB AS $$
DECLARE
  report_data JSONB;
BEGIN
  SELECT jsonb_build_object(
    'date', p_date,
    'total_contacts', (
      SELECT COUNT(*) FROM contacts 
      WHERE DATE(created_at) = p_date
    ),
    'total_projects', (
      SELECT COUNT(*) FROM projects 
      WHERE DATE(created_at) = p_date
    ),
    'total_tasks', (
      SELECT COUNT(*) FROM tasks 
      WHERE DATE(created_at) = p_date
    ),
    'completed_tasks', (
      SELECT COUNT(*) FROM tasks 
      WHERE status = 'completed' AND DATE(updated_at) = p_date
    ),
    'new_users', (
      SELECT COUNT(*) FROM auth.users 
      WHERE DATE(created_at) = p_date
    ),
    'activities', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'action_type', action_type,
          'entity_type', entity_type,
          'description', description,
          'created_at', created_at
        )
      ) FROM activities 
      WHERE DATE(created_at) = p_date
    )
  ) INTO report_data;
  
  RETURN report_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para gerar relatório semanal
CREATE OR REPLACE FUNCTION generate_weekly_report(p_start_date DATE DEFAULT DATE_TRUNC('week', CURRENT_DATE)::date)
RETURNS JSONB AS $$
DECLARE
  report_data JSONB;
  end_date DATE;
BEGIN
  end_date := p_start_date + INTERVAL '6 days';
  
  SELECT jsonb_build_object(
    'period_start', p_start_date,
    'period_end', end_date,
    'total_contacts', (
      SELECT COUNT(*) FROM contacts 
      WHERE DATE(created_at) BETWEEN p_start_date AND end_date
    ),
    'total_projects', (
      SELECT COUNT(*) FROM projects 
      WHERE DATE(created_at) BETWEEN p_start_date AND end_date
    ),
    'total_tasks', (
      SELECT COUNT(*) FROM tasks 
      WHERE DATE(created_at) BETWEEN p_start_date AND end_date
    ),
    'completed_tasks', (
      SELECT COUNT(*) FROM tasks 
      WHERE status = 'completed' AND DATE(updated_at) BETWEEN p_start_date AND end_date
    ),
    'new_users', (
      SELECT COUNT(*) FROM auth.users 
      WHERE DATE(created_at) BETWEEN p_start_date AND end_date
    ),
    'daily_breakdown', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'date', day_date,
          'contacts', day_contacts,
          'projects', day_projects,
          'tasks', day_tasks,
          'completed_tasks', day_completed_tasks
        )
      ) FROM (
        SELECT 
          generate_series(p_start_date, end_date, '1 day'::interval)::date as day_date,
          COALESCE((
            SELECT COUNT(*) FROM contacts 
            WHERE DATE(created_at) = generate_series(p_start_date, end_date, '1 day'::interval)::date
          ), 0) as day_contacts,
          COALESCE((
            SELECT COUNT(*) FROM projects 
            WHERE DATE(created_at) = generate_series(p_start_date, end_date, '1 day'::interval)::date
          ), 0) as day_projects,
          COALESCE((
            SELECT COUNT(*) FROM tasks 
            WHERE DATE(created_at) = generate_series(p_start_date, end_date, '1 day'::interval)::date
          ), 0) as day_tasks,
          COALESCE((
            SELECT COUNT(*) FROM tasks 
            WHERE status = 'completed' AND DATE(updated_at) = generate_series(p_start_date, end_date, '1 day'::interval)::date
          ), 0) as day_completed_tasks
      ) daily_stats
    ),
    'activities', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'action_type', action_type,
          'entity_type', entity_type,
          'description', description,
          'created_at', created_at
        )
      ) FROM activities 
      WHERE DATE(created_at) BETWEEN p_start_date AND end_date
    )
  ) INTO report_data;
  
  RETURN report_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para gerar relatório mensal
CREATE OR REPLACE FUNCTION generate_monthly_report(p_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE), p_month INTEGER DEFAULT EXTRACT(MONTH FROM CURRENT_DATE))
RETURNS JSONB AS $$
DECLARE
  report_data JSONB;
  start_date DATE;
  end_date DATE;
BEGIN
  start_date := DATE(p_year || '-' || p_month || '-01');
  end_date := (start_date + INTERVAL '1 month' - INTERVAL '1 day')::date;
  
  SELECT jsonb_build_object(
    'year', p_year,
    'month', p_month,
    'period_start', start_date,
    'period_end', end_date,
    'total_contacts', (
      SELECT COUNT(*) FROM contacts 
      WHERE DATE(created_at) BETWEEN start_date AND end_date
    ),
    'total_projects', (
      SELECT COUNT(*) FROM projects 
      WHERE DATE(created_at) BETWEEN start_date AND end_date
    ),
    'total_tasks', (
      SELECT COUNT(*) FROM tasks 
      WHERE DATE(created_at) BETWEEN start_date AND end_date
    ),
    'completed_tasks', (
      SELECT COUNT(*) FROM tasks 
      WHERE status = 'completed' AND DATE(updated_at) BETWEEN start_date AND end_date
    ),
    'new_users', (
      SELECT COUNT(*) FROM auth.users 
      WHERE DATE(created_at) BETWEEN start_date AND end_date
    ),
    'weekly_breakdown', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'week', week_num,
          'start_date', week_start,
          'end_date', week_end,
          'contacts', week_contacts,
          'projects', week_projects,
          'tasks', week_tasks,
          'completed_tasks', week_completed_tasks
        )
      ) FROM (
        SELECT 
          EXTRACT(WEEK FROM week_date) as week_num,
          week_date as week_start,
          (week_date + INTERVAL '6 days')::date as week_end,
          COALESCE((
            SELECT COUNT(*) FROM contacts 
            WHERE DATE(created_at) BETWEEN week_date AND (week_date + INTERVAL '6 days')::date
          ), 0) as week_contacts,
          COALESCE((
            SELECT COUNT(*) FROM projects 
            WHERE DATE(created_at) BETWEEN week_date AND (week_date + INTERVAL '6 days')::date
          ), 0) as week_projects,
          COALESCE((
            SELECT COUNT(*) FROM tasks 
            WHERE DATE(created_at) BETWEEN week_date AND (week_date + INTERVAL '6 days')::date
          ), 0) as week_tasks,
          COALESCE((
            SELECT COUNT(*) FROM tasks 
            WHERE status = 'completed' AND DATE(updated_at) BETWEEN week_date AND (week_date + INTERVAL '6 days')::date
          ), 0) as week_completed_tasks
        FROM generate_series(start_date, end_date, '1 week'::interval) as week_date
      ) weekly_stats
    ),
    'activities', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'action_type', action_type,
          'entity_type', entity_type,
          'description', description,
          'created_at', created_at
        )
      ) FROM activities 
      WHERE DATE(created_at) BETWEEN start_date AND end_date
    )
  ) INTO report_data;
  
  RETURN report_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para criar item pendente
CREATE OR REPLACE FUNCTION create_pending_item(
  p_item_type VARCHAR(100),
  p_item_id UUID,
  p_title VARCHAR(255),
  p_description TEXT DEFAULT NULL,
  p_priority VARCHAR(20) DEFAULT 'medium',
  p_due_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  item_id UUID;
BEGIN
  INSERT INTO pending_items (
    user_id,
    item_type,
    item_id,
    title,
    description,
    priority,
    due_date
  ) VALUES (
    auth.uid(),
    p_item_type,
    p_item_id,
    p_title,
    p_description,
    p_priority,
    p_due_date
  ) RETURNING id INTO item_id;
  
  RETURN item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para atualizar métricas
CREATE OR REPLACE FUNCTION update_metrics(p_date DATE DEFAULT CURRENT_DATE)
RETURNS VOID AS $$
BEGIN
  -- Inserir métricas do dia
  INSERT INTO metrics (metric_name, metric_value, category, period_start, period_end)
  VALUES 
    ('total_contacts', (SELECT COUNT(*) FROM contacts), 'contacts', p_date, p_date),
    ('total_projects', (SELECT COUNT(*) FROM projects), 'projects', p_date, p_date),
    ('total_tasks', (SELECT COUNT(*) FROM tasks), 'tasks', p_date, p_date),
    ('completed_tasks', (SELECT COUNT(*) FROM tasks WHERE status = 'completed'), 'tasks', p_date, p_date),
    ('pending_tasks', (SELECT COUNT(*) FROM tasks WHERE status = 'todo'), 'tasks', p_date, p_date),
    ('in_progress_tasks', (SELECT COUNT(*) FROM tasks WHERE status = 'in_progress'), 'tasks', p_date, p_date),
    ('total_users', (SELECT COUNT(*) FROM auth.users), 'users', p_date, p_date),
    ('new_users_today', (SELECT COUNT(*) FROM auth.users WHERE DATE(created_at) = p_date), 'users', p_date, p_date);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar updated_at em report_configs
CREATE TRIGGER update_report_configs_updated_at 
  BEFORE UPDATE ON report_configs
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar updated_at em pending_items
CREATE TRIGGER update_pending_items_updated_at 
  BEFORE UPDATE ON pending_items
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

