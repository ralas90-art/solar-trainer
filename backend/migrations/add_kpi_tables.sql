-- KPI Tracker Tables Migration
-- Creates tables for customizable KPI tracking system

-- KPI Definitions (user's custom metrics)
CREATE TABLE IF NOT EXISTS kpi_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,  -- String to match UserStats.user_id
    label VARCHAR(100) NOT NULL,
    description TEXT,
    target_value INTEGER,  -- Daily goal
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- KPI Entries (daily values)
CREATE TABLE IF NOT EXISTS kpi_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,  -- String to match UserStats.user_id
    kpi_definition_id UUID NOT NULL REFERENCES kpi_definitions(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    value INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, kpi_definition_id, date)  -- One entry per KPI per day
);

-- KPI Templates (preset configurations)
CREATE TABLE IF NOT EXISTS kpi_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Template KPIs (what KPIs are in each template)
CREATE TABLE IF NOT EXISTS template_kpis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES kpi_templates(id) ON DELETE CASCADE,
    label VARCHAR(100) NOT NULL,
    description TEXT,
    target_value INTEGER,
    display_order INTEGER DEFAULT 0
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_kpi_definitions_user ON kpi_definitions(user_id);
CREATE INDEX IF NOT EXISTS idx_kpi_definitions_active ON kpi_definitions(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_kpi_entries_user_date ON kpi_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_kpi_entries_definition ON kpi_entries(kpi_definition_id);

-- Seed default templates
INSERT INTO kpi_templates (name, description, is_default) VALUES
    ('Door-to-Door', 'Metrics for door-to-door solar sales representatives', true),
    ('Virtual Sales', 'Metrics for virtual/phone-based solar sales', true),
    ('Hybrid', 'Combined metrics for multi-channel sales approach', false)
ON CONFLICT DO NOTHING;

-- Seed Door-to-Door template KPIs
INSERT INTO template_kpis (template_id, label, description, target_value, display_order)
SELECT 
    t.id,
    kpi.label,
    kpi.description,
    kpi.target_value,
    kpi.display_order
FROM kpi_templates t
CROSS JOIN (VALUES
    ('Knocks', 'Number of doors knocked', 100, 0),
    ('Conversations', 'Meaningful conversations with homeowners', 50, 1),
    ('Appointments Set', 'Appointments scheduled for assessment', 15, 2),
    ('Closes', 'Deals closed/signed', 5, 3)
) AS kpi(label, description, target_value, display_order)
WHERE t.name = 'Door-to-Door'
ON CONFLICT DO NOTHING;

-- Seed Virtual Sales template KPIs
INSERT INTO template_kpis (template_id, label, description, target_value, display_order)
SELECT 
    t.id,
    kpi.label,
    kpi.description,
    kpi.target_value,
    kpi.display_order
FROM kpi_templates t
CROSS JOIN (VALUES
    ('Calls Made', 'Total outbound calls attempted', 80, 0),
    ('Connects', 'Calls that reached a decision maker', 40, 1),
    ('Appointments Booked', 'Virtual or in-person appointments scheduled', 12, 2),
    ('Deals Closed', 'Contracts signed', 4, 3)
) AS kpi(label, description, target_value, display_order)
WHERE t.name = 'Virtual Sales'
ON CONFLICT DO NOTHING;

-- Seed Hybrid template KPIs
INSERT INTO template_kpis (template_id, label, description, target_value, display_order)
SELECT 
    t.id,
    kpi.label,
    kpi.description,
    kpi.target_value,
    kpi.display_order
FROM kpi_templates t
CROSS JOIN (VALUES
    ('Knocks', 'Doors knocked (D2D)', 60, 0),
    ('Calls Made', 'Outbound calls', 40, 1),
    ('Total Conversations', 'Combined conversations', 60, 2),
    ('Appointments Set', 'All appointments scheduled', 15, 3),
    ('Closes', 'Total deals closed', 5, 4)
) AS kpi(label, description, target_value, display_order)
WHERE t.name = 'Hybrid'
ON CONFLICT DO NOTHING;
