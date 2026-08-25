-- ============================================================
-- REGEN Railway Infrastructure Monitoring Platform
-- Database Schema - PostgreSQL / Supabase
-- ============================================================
-- MVP NOTICE: This schema supports a READ-ONLY monitoring
-- and decision-support platform. No safety-critical commands
-- are issued to real railway systems.
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ORGANISATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS organisations (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  code          TEXT NOT NULL UNIQUE,
  country       TEXT NOT NULL DEFAULT 'South Africa',
  contact_email TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- RAILWAY LINES
-- ============================================================
CREATE TABLE IF NOT EXISTS railway_lines (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  code            TEXT NOT NULL,
  description     TEXT,
  total_length_km NUMERIC(8,2),
  status          TEXT NOT NULL DEFAULT 'OPERATIONAL'
                  CHECK (status IN ('OPERATIONAL','SUSPENDED','MAINTENANCE','OFFLINE')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organisation_id, code)
);

CREATE INDEX idx_railway_lines_organisation ON railway_lines(organisation_id);

-- ============================================================
-- SECTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS sections (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  railway_line_id UUID NOT NULL REFERENCES railway_lines(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  code            TEXT NOT NULL,
  description     TEXT,
  start_location  TEXT,
  end_location    TEXT,
  length_km       NUMERIC(6,2),
  status          TEXT NOT NULL DEFAULT 'OPERATIONAL'
                  CHECK (status IN ('OPERATIONAL','DEGRADED','SUSPENDED','MAINTENANCE','OFFLINE')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(railway_line_id, code)
);

CREATE INDEX idx_sections_railway_line ON sections(railway_line_id);

-- ============================================================
-- TRACK CIRCUITS
-- ============================================================
CREATE TABLE IF NOT EXISTS track_circuits (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id         UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  track_circuit_id   TEXT NOT NULL UNIQUE,  -- e.g. TC-021
  railway_line       TEXT NOT NULL,
  location           TEXT NOT NULL,
  status             TEXT NOT NULL DEFAULT 'NORMAL'
                     CHECK (status IN ('NORMAL','OCCUPIED','FAULT','UNKNOWN','OFFLINE')),
  occupancy          TEXT NOT NULL DEFAULT 'CLEAR'
                     CHECK (occupancy IN ('CLEAR','OCCUPIED','UNKNOWN')),
  signal_relationship TEXT,                  -- e.g. S-021
  last_update        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fault_status       TEXT,
  fault_description  TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_track_circuits_section ON track_circuits(section_id);
CREATE INDEX idx_track_circuits_status  ON track_circuits(status);

-- ============================================================
-- SIGNALS
-- ============================================================
CREATE TABLE IF NOT EXISTS signals (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id        UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  track_circuit_id  UUID REFERENCES track_circuits(id),
  signal_id         TEXT NOT NULL UNIQUE,   -- e.g. S-021
  signal_type       TEXT NOT NULL DEFAULT 'COLOUR_LIGHT'
                    CHECK (signal_type IN ('COLOUR_LIGHT','SEMAPHORE','DWARF','SHUNTING')),
  location          TEXT NOT NULL,
  status            TEXT NOT NULL DEFAULT 'CLEAR'
                    CHECK (status IN ('CLEAR','CAUTION','DANGER','UNKNOWN','OFFLINE')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_signals_section       ON signals(section_id);
CREATE INDEX idx_signals_track_circuit ON signals(track_circuit_id);

-- ============================================================
-- ASSETS (Infrastructure assets)
-- ============================================================
CREATE TABLE IF NOT EXISTS assets (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id       UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  track_circuit_id UUID REFERENCES track_circuits(id),
  asset_id         TEXT NOT NULL UNIQUE,   -- e.g. COMPOSITE-SLEEPER-021
  asset_type       TEXT NOT NULL
                   CHECK (asset_type IN (
                     'COMPOSITE_SLEEPER','STEEL_RAIL','BRIDGE','CULVERT',
                     'BALLAST_BED','SWITCH_ASSEMBLY','LEVEL_CROSSING',
                     'RETAINING_WALL','EMBANKMENT','VIADUCT'
                   )),
  description      TEXT,
  location         TEXT NOT NULL,
  gps_lat          NUMERIC(10,7),
  gps_lon          NUMERIC(10,7),
  installation_date DATE,
  last_inspection   DATE,
  condition        TEXT NOT NULL DEFAULT 'GOOD'
                   CHECK (condition IN ('GOOD','FAIR','WARNING','CRITICAL','UNKNOWN')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assets_section       ON assets(section_id);
CREATE INDEX idx_assets_track_circuit ON assets(track_circuit_id);
CREATE INDEX idx_assets_condition     ON assets(condition);

-- ============================================================
-- FBG SENSORS
-- ============================================================
CREATE TABLE IF NOT EXISTS fbg_sensors (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id         UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  sensor_id        TEXT NOT NULL UNIQUE,   -- e.g. FBG-00021
  sensor_type      TEXT NOT NULL DEFAULT 'STRAIN'
                   CHECK (sensor_type IN ('STRAIN','TEMPERATURE','DISPLACEMENT','ACCELERATION')),
  baseline_strain  NUMERIC(10,2) NOT NULL,  -- microstrain (µε)
  current_strain   NUMERIC(10,2),
  wavelength_nm    NUMERIC(8,3),            -- FBG centre wavelength in nm
  sensor_status    TEXT NOT NULL DEFAULT 'ACTIVE'
                   CHECK (sensor_status IN ('ACTIVE','WARNING','FAULT','OFFLINE','CALIBRATING')),
  risk_level       TEXT NOT NULL DEFAULT 'NORMAL'
                   CHECK (risk_level IN ('NORMAL','SIMULATED_WARNING','SIMULATED_CRITICAL','OFFLINE','UNKNOWN')),
  install_date     DATE,
  last_reading     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fbg_sensors_asset  ON fbg_sensors(asset_id);
CREATE INDEX idx_fbg_sensors_status ON fbg_sensors(sensor_status);

-- ============================================================
-- FBG READINGS (time-series)
-- ============================================================
CREATE TABLE IF NOT EXISTS fbg_readings (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sensor_id    UUID NOT NULL REFERENCES fbg_sensors(id) ON DELETE CASCADE,
  timestamp    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  strain_value NUMERIC(10,2) NOT NULL,     -- µε
  wavelength   NUMERIC(8,3),               -- nm
  temperature  NUMERIC(6,2),               -- °C (optional compensation)
  is_simulated BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fbg_readings_sensor    ON fbg_readings(sensor_id);
CREATE INDEX idx_fbg_readings_timestamp ON fbg_readings(timestamp);

-- ============================================================
-- TRACK CIRCUIT EVENTS (state-change log)
-- ============================================================
CREATE TABLE IF NOT EXISTS track_circuit_events (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  track_circuit_id UUID NOT NULL REFERENCES track_circuits(id) ON DELETE CASCADE,
  timestamp        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  previous_status  TEXT,
  new_status       TEXT NOT NULL,
  event_type       TEXT NOT NULL DEFAULT 'STATUS_CHANGE'
                   CHECK (event_type IN ('STATUS_CHANGE','FAULT','RECOVERY','OFFLINE','RECONNECT','MANUAL_UPDATE')),
  description      TEXT,
  operator_id      UUID,
  is_simulated     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tc_events_circuit   ON track_circuit_events(track_circuit_id);
CREATE INDEX idx_tc_events_timestamp ON track_circuit_events(timestamp);

-- ============================================================
-- ALERTS
-- ============================================================
CREATE TABLE IF NOT EXISTS alerts (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alert_ref        TEXT NOT NULL UNIQUE,   -- e.g. ALT-2024-001
  source_type      TEXT NOT NULL
                   CHECK (source_type IN (
                     'TRACK_CIRCUIT','FBG_SENSOR','ASSET',
                     'COMMUNICATION','MAINTENANCE','COMBINED'
                   )),
  priority         TEXT NOT NULL DEFAULT 'WARNING'
                   CHECK (priority IN ('NORMAL','WARNING','HIGH','CRITICAL','OFFLINE','REQUIRES_VERIFICATION')),
  title            TEXT NOT NULL,
  description      TEXT NOT NULL,
  track_circuit_id UUID REFERENCES track_circuits(id),
  asset_id         UUID REFERENCES assets(id),
  sensor_id        UUID REFERENCES fbg_sensors(id),
  section_id       UUID REFERENCES sections(id),
  status           TEXT NOT NULL DEFAULT 'OPEN'
                   CHECK (status IN ('OPEN','ACKNOWLEDGED','INVESTIGATING','RESOLVED','CLOSED','FALSE_ALARM')),
  acknowledged_by  TEXT,
  acknowledged_at  TIMESTAMPTZ,
  resolved_at      TIMESTAMPTZ,
  is_simulated     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_alerts_status     ON alerts(status);
CREATE INDEX idx_alerts_priority   ON alerts(priority);
CREATE INDEX idx_alerts_asset      ON alerts(asset_id);
CREATE INDEX idx_alerts_tc         ON alerts(track_circuit_id);
CREATE INDEX idx_alerts_created_at ON alerts(created_at);

-- ============================================================
-- INSPECTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS inspections (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inspection_ref   TEXT NOT NULL UNIQUE,   -- e.g. INS-2024-001
  alert_id         UUID REFERENCES alerts(id),
  asset_id         UUID NOT NULL REFERENCES assets(id),
  track_circuit_id UUID REFERENCES track_circuits(id),
  sensor_id        UUID REFERENCES fbg_sensors(id),
  title            TEXT NOT NULL,
  reason           TEXT NOT NULL,
  priority         TEXT NOT NULL DEFAULT 'NORMAL'
                   CHECK (priority IN ('LOW','NORMAL','HIGH','URGENT')),
  assigned_to      TEXT,
  inspector_name   TEXT,
  status           TEXT NOT NULL DEFAULT 'OPEN'
                   CHECK (status IN ('OPEN','ASSIGNED','IN_PROGRESS','COMPLETED','CANCELLED')),
  scheduled_date   DATE,
  completed_date   DATE,
  location         TEXT,
  findings         TEXT,
  fault_confirmed  BOOLEAN,
  false_alarm      BOOLEAN DEFAULT FALSE,
  photos_count     INT DEFAULT 0,
  recommendation   TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inspections_asset    ON inspections(asset_id);
CREATE INDEX idx_inspections_alert    ON inspections(alert_id);
CREATE INDEX idx_inspections_status   ON inspections(status);
CREATE INDEX idx_inspections_created  ON inspections(created_at);

-- ============================================================
-- MAINTENANCE TASKS
-- ============================================================
CREATE TABLE IF NOT EXISTS maintenance_tasks (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  maintenance_ref  TEXT NOT NULL UNIQUE,   -- e.g. MNT-2024-001
  inspection_id    UUID REFERENCES inspections(id),
  asset_id         UUID NOT NULL REFERENCES assets(id),
  alert_id         UUID REFERENCES alerts(id),
  title            TEXT NOT NULL,
  fault_description TEXT NOT NULL,
  cause            TEXT,
  work_description  TEXT,
  assigned_technician TEXT,
  priority         TEXT NOT NULL DEFAULT 'NORMAL'
                   CHECK (priority IN ('LOW','NORMAL','HIGH','URGENT')),
  status           TEXT NOT NULL DEFAULT 'OPEN'
                   CHECK (status IN (
                     'OPEN','ASSIGNED','IN_PROGRESS','COMPLETED',
                     'VERIFICATION_REQUIRED','VERIFIED','CLOSED'
                   )),
  start_time       TIMESTAMPTZ,
  completion_time  TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_maintenance_asset   ON maintenance_tasks(asset_id);
CREATE INDEX idx_maintenance_status  ON maintenance_tasks(status);
CREATE INDEX idx_maintenance_created ON maintenance_tasks(created_at);

-- ============================================================
-- MAINTENANCE VERIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS maintenance_verifications (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  maintenance_task_id UUID NOT NULL REFERENCES maintenance_tasks(id) ON DELETE CASCADE,
  verified_by         TEXT NOT NULL,
  verification_date   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  result              TEXT NOT NULL
                      CHECK (result IN ('PASSED','FAILED','PARTIAL','REQUIRES_FOLLOW_UP')),
  notes               TEXT,
  post_strain_reading NUMERIC(10,2),   -- FBG reading after maintenance (µε)
  tc_status_confirmed TEXT,            -- Track circuit status after verification
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_verifications_task ON maintenance_verifications(maintenance_task_id);

-- ============================================================
-- ROW LEVEL SECURITY (basic — enable per table for Supabase)
-- ============================================================
ALTER TABLE organisations           ENABLE ROW LEVEL SECURITY;
ALTER TABLE railway_lines           ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections                ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_circuits          ENABLE ROW LEVEL SECURITY;
ALTER TABLE signals                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE fbg_sensors             ENABLE ROW LEVEL SECURITY;
ALTER TABLE fbg_readings            ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_circuit_events    ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections             ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_tasks       ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_verifications ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users (MVP policy — tighten for production)
CREATE POLICY "Allow authenticated read" ON organisations           FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON railway_lines           FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON sections                FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON track_circuits          FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON signals                 FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON assets                  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON fbg_sensors             FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON fbg_readings            FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON track_circuit_events    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON alerts                  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON inspections             FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON maintenance_tasks       FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON maintenance_verifications FOR SELECT TO authenticated USING (true);

-- Allow write access for inspections, maintenance (field staff)
CREATE POLICY "Allow authenticated write" ON inspections        FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write" ON maintenance_tasks  FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write" ON maintenance_verifications FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated write" ON alerts             FOR ALL TO authenticated USING (true);
