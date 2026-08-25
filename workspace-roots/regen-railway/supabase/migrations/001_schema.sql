-- ============================================================
-- REGEN Railway Infrastructure Monitoring Platform
-- Database Schema - PostgreSQL / Supabase
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ORGANISATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS organisations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL DEFAULT 'South Africa',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- RAILWAY LINES
-- ============================================================
CREATE TABLE IF NOT EXISTS railway_lines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  total_length_km NUMERIC(8,2),
  status TEXT NOT NULL DEFAULT 'OPERATIONAL' CHECK (status IN ('OPERATIONAL','PARTIAL','SUSPENDED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_railway_lines_org ON railway_lines(organisation_id);

-- ============================================================
-- SECTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  railway_line_id UUID NOT NULL REFERENCES railway_lines(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  start_location TEXT NOT NULL,
  end_location TEXT NOT NULL,
  length_km NUMERIC(6,2),
  status TEXT NOT NULL DEFAULT 'OPERATIONAL' CHECK (status IN ('OPERATIONAL','RESTRICTED','MAINTENANCE','SUSPENDED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sections_line ON sections(railway_line_id);

-- ============================================================
-- TRACK CIRCUITS
-- ============================================================
CREATE TABLE IF NOT EXISTS track_circuits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  track_circuit_id TEXT NOT NULL UNIQUE,
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  railway_line_id UUID NOT NULL REFERENCES railway_lines(id) ON DELETE CASCADE,
  location_description TEXT NOT NULL,
  latitude NUMERIC(10,6),
  longitude NUMERIC(10,6),
  status TEXT NOT NULL DEFAULT 'NORMAL' CHECK (status IN ('NORMAL','OCCUPIED','FAULT','UNKNOWN','OFFLINE')),
  occupancy BOOLEAN NOT NULL DEFAULT FALSE,
  signal_relationship TEXT,
  last_update TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fault_status TEXT,
  fault_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tc_section ON track_circuits(section_id);
CREATE INDEX IF NOT EXISTS idx_tc_railway_line ON track_circuits(railway_line_id);
CREATE INDEX IF NOT EXISTS idx_tc_status ON track_circuits(status);

-- ============================================================
-- TRACK CIRCUIT EVENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS track_circuit_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  track_circuit_id UUID NOT NULL REFERENCES track_circuits(id) ON DELETE CASCADE,
  previous_status TEXT NOT NULL,
  new_status TEXT NOT NULL,
  event_type TEXT NOT NULL,
  description TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tce_tc ON track_circuit_events(track_circuit_id);
CREATE INDEX IF NOT EXISTS idx_tce_timestamp ON track_circuit_events(timestamp DESC);

-- ============================================================
-- SIGNALS
-- ============================================================
CREATE TABLE IF NOT EXISTS signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  signal_id TEXT NOT NULL UNIQUE,
  track_circuit_id UUID NOT NULL REFERENCES track_circuits(id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location_description TEXT NOT NULL,
  signal_type TEXT NOT NULL DEFAULT 'COLOUR_LIGHT',
  status TEXT NOT NULL DEFAULT 'NORMAL' CHECK (status IN ('NORMAL','CAUTION','STOP','FAULT','OFFLINE')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_signals_tc ON signals(track_circuit_id);

-- ============================================================
-- ASSETS
-- ============================================================
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id TEXT NOT NULL UNIQUE,
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  track_circuit_id UUID NOT NULL REFERENCES track_circuits(id) ON DELETE CASCADE,
  signal_id UUID REFERENCES signals(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  location_description TEXT NOT NULL,
  latitude NUMERIC(10,6),
  longitude NUMERIC(10,6),
  installation_date DATE NOT NULL,
  condition TEXT NOT NULL DEFAULT 'GOOD' CHECK (condition IN ('GOOD','FAIR','WARNING','CRITICAL','REQUIRES_VERIFICATION','UNKNOWN')),
  last_inspection_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_assets_section ON assets(section_id);
CREATE INDEX IF NOT EXISTS idx_assets_tc ON assets(track_circuit_id);
CREATE INDEX IF NOT EXISTS idx_assets_condition ON assets(condition);

-- ============================================================
-- FBG SENSORS
-- ============================================================
CREATE TABLE IF NOT EXISTS fbg_sensors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sensor_id TEXT NOT NULL UNIQUE,
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  sensor_name TEXT NOT NULL,
  baseline_strain NUMERIC(10,2) NOT NULL,
  current_strain NUMERIC(10,2) NOT NULL,
  deviation NUMERIC(10,2) GENERATED ALWAYS AS (current_strain - baseline_strain) STORED,
  percentage_change NUMERIC(8,2) GENERATED ALWAYS AS (
    CASE WHEN baseline_strain <> 0
    THEN ((current_strain - baseline_strain) / baseline_strain) * 100
    ELSE 0 END
  ) STORED,
  trend TEXT NOT NULL DEFAULT 'STABLE' CHECK (trend IN ('STABLE','INCREASING','DECREASING','SUDDEN_CHANGE','OFFLINE')),
  wavelength_nm NUMERIC(10,4) NOT NULL,
  sensor_status TEXT NOT NULL DEFAULT 'ONLINE' CHECK (sensor_status IN ('ONLINE','OFFLINE','DEGRADED','CALIBRATING')),
  risk_level TEXT NOT NULL DEFAULT 'LOW' CHECK (risk_level IN ('LOW','MODERATE','WARNING','HIGH','CRITICAL','OFFLINE')),
  warning_threshold NUMERIC(10,2) NOT NULL DEFAULT 400,
  critical_threshold NUMERIC(10,2) NOT NULL DEFAULT 600,
  last_reading TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_fbg_asset ON fbg_sensors(asset_id);
CREATE INDEX IF NOT EXISTS idx_fbg_status ON fbg_sensors(sensor_status);
CREATE INDEX IF NOT EXISTS idx_fbg_risk ON fbg_sensors(risk_level);

-- ============================================================
-- FBG READINGS (time-series)
-- ============================================================
CREATE TABLE IF NOT EXISTS fbg_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sensor_id UUID NOT NULL REFERENCES fbg_sensors(id) ON DELETE CASCADE,
  strain_value NUMERIC(10,2) NOT NULL,
  temperature NUMERIC(6,2),
  wavelength_nm NUMERIC(10,4) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_fbgr_sensor ON fbg_readings(sensor_id);
CREATE INDEX IF NOT EXISTS idx_fbgr_timestamp ON fbg_readings(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_fbgr_sensor_time ON fbg_readings(sensor_id, timestamp DESC);

-- ============================================================
-- ALERTS
-- ============================================================
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alert_id TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL CHECK (source IN ('TRACK_CIRCUIT','FBG_SENSOR','ASSET','COMMUNICATION','MAINTENANCE','COMBINED')),
  priority TEXT NOT NULL DEFAULT 'NORMAL' CHECK (priority IN ('NORMAL','WARNING','HIGH','CRITICAL','OFFLINE')),
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','ACKNOWLEDGED','INVESTIGATING','RESOLVED','CLOSED')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
  track_circuit_id UUID REFERENCES track_circuits(id) ON DELETE SET NULL,
  sensor_id UUID REFERENCES fbg_sensors(id) ON DELETE SET NULL,
  section_id UUID REFERENCES sections(id) ON DELETE SET NULL,
  railway_line_id UUID REFERENCES railway_lines(id) ON DELETE SET NULL,
  evidence_summary TEXT,
  requires_inspection BOOLEAN NOT NULL DEFAULT FALSE,
  acknowledged_by TEXT,
  acknowledged_at TIMESTAMPTZ,
  resolved_by TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_priority ON alerts(priority);
CREATE INDEX IF NOT EXISTS idx_alerts_asset ON alerts(asset_id);
CREATE INDEX IF NOT EXISTS idx_alerts_tc ON alerts(track_circuit_id);
CREATE INDEX IF NOT EXISTS idx_alerts_sensor ON alerts(sensor_id);
CREATE INDEX IF NOT EXISTS idx_alerts_section ON alerts(section_id);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON alerts(created_at DESC);

-- ============================================================
-- INSPECTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inspection_id TEXT NOT NULL UNIQUE,
  alert_id UUID REFERENCES alerts(id) ON DELETE SET NULL,
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  track_circuit_id UUID REFERENCES track_circuits(id) ON DELETE SET NULL,
  sensor_id UUID REFERENCES fbg_sensors(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  reason TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'NORMAL',
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','ASSIGNED','IN_PROGRESS','COMPLETED','CANCELLED')),
  assigned_inspector TEXT,
  inspector_id TEXT,
  scheduled_date TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  location_description TEXT NOT NULL,
  observations TEXT,
  findings TEXT,
  fault_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  false_alarm BOOLEAN NOT NULL DEFAULT FALSE,
  photos JSONB DEFAULT '[]',
  recommendations TEXT,
  maintenance_required BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_insp_asset ON inspections(asset_id);
CREATE INDEX IF NOT EXISTS idx_insp_alert ON inspections(alert_id);
CREATE INDEX IF NOT EXISTS idx_insp_status ON inspections(status);
CREATE INDEX IF NOT EXISTS idx_insp_created ON inspections(created_at DESC);

-- ============================================================
-- MAINTENANCE TASKS
-- ============================================================
CREATE TABLE IF NOT EXISTS maintenance_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  maintenance_id TEXT NOT NULL UNIQUE,
  inspection_id UUID REFERENCES inspections(id) ON DELETE SET NULL,
  alert_id UUID REFERENCES alerts(id) ON DELETE SET NULL,
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  fault_description TEXT NOT NULL,
  root_cause TEXT,
  work_description TEXT NOT NULL,
  assigned_technician TEXT,
  technician_id TEXT,
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','ASSIGNED','IN_PROGRESS','COMPLETED','VERIFICATION_REQUIRED','VERIFIED','CLOSED')),
  priority TEXT NOT NULL DEFAULT 'NORMAL',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  estimated_hours NUMERIC(5,2),
  actual_hours NUMERIC(5,2),
  parts_used TEXT,
  cost_estimate NUMERIC(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_maint_asset ON maintenance_tasks(asset_id);
CREATE INDEX IF NOT EXISTS idx_maint_status ON maintenance_tasks(status);
CREATE INDEX IF NOT EXISTS idx_maint_created ON maintenance_tasks(created_at DESC);

-- ============================================================
-- MAINTENANCE VERIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS maintenance_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  maintenance_task_id UUID NOT NULL REFERENCES maintenance_tasks(id) ON DELETE CASCADE,
  verified_by TEXT NOT NULL,
  verification_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  track_circuit_status TEXT,
  fbg_readings_normal BOOLEAN DEFAULT FALSE,
  asset_condition TEXT,
  notes TEXT,
  passed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mv_task ON maintenance_verifications(maintenance_task_id);

-- ============================================================
-- ROW LEVEL SECURITY (enable but allow all for MVP)
-- ============================================================
ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE railway_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_circuits ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_circuit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE fbg_sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE fbg_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_verifications ENABLE ROW LEVEL SECURITY;

-- Allow all operations for MVP (anon key for demo)
CREATE POLICY "allow_all_organisations" ON organisations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_railway_lines" ON railway_lines FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_sections" ON sections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_track_circuits" ON track_circuits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_tc_events" ON track_circuit_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_signals" ON signals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_assets" ON assets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_fbg_sensors" ON fbg_sensors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_fbg_readings" ON fbg_readings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_alerts" ON alerts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_inspections" ON inspections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_maintenance" ON maintenance_tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_mv" ON maintenance_verifications FOR ALL USING (true) WITH CHECK (true);
