-- ============================================================
-- REGEN Railway Infrastructure Monitoring Platform
-- Seed Data SQL — Run AFTER 001_schema.sql
-- SIMULATED DATA ONLY — Not real PRASA/Transnet infrastructure
-- ============================================================

-- Organisation
INSERT INTO organisations (id, name, code, country) VALUES
  ('00000000-0000-0000-0000-000000000001', 'REGEN Railway Infrastructure Authority', 'RRIA', 'South Africa')
ON CONFLICT (id) DO NOTHING;

-- Railway Lines
INSERT INTO railway_lines (id, organisation_id, name, code, description, total_length_km, status) VALUES
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'Gauteng Corridor', 'GC', 'Main commuter and freight corridor through Gauteng province', 142.5, 'OPERATIONAL'),
  ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000001', 'Cape Metro Line', 'CML', 'Western Cape metropolitan rail network', 98.3, 'PARTIAL'),
  ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000001', 'Durban Coastal Corridor', 'DCC', 'KwaZulu-Natal coastal freight and passenger corridor', 76.8, 'OPERATIONAL')
ON CONFLICT (id) DO NOTHING;

-- NOTE: Full seed data is managed via the TypeScript seed module (src/data/seed.ts)
-- which provides in-memory data for the MVP when Supabase is not configured.
-- For a full Supabase deployment, use the TypeScript seed data to generate
-- INSERT statements matching your actual UUID values.
