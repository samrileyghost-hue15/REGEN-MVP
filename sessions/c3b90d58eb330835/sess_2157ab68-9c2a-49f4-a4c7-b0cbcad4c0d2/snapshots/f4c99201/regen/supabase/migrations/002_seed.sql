-- ============================================================
-- REGEN - Seed Data
-- Simulated South African Railway Infrastructure Data
-- ============================================================
-- IMPORTANT: All data is FICTIONAL and SIMULATED.
-- This does NOT represent real PRASA or Transnet infrastructure.
-- Data is for MVP demonstration purposes only.
-- ============================================================

-- ============================================================
-- ORGANISATION
-- ============================================================
INSERT INTO organisations (id, name, code, country, contact_email) VALUES
('00000000-0000-0000-0000-000000000001',
 'REGEN Rail Infrastructure (Demo)',
 'REGEN-DEMO',
 'South Africa',
 'ops@regen-demo.co.za');

-- ============================================================
-- RAILWAY LINES (3 lines)
-- ============================================================
INSERT INTO railway_lines (id, organisation_id, name, code, description, total_length_km, status) VALUES
('10000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0000-000000000001',
 'Gauteng Corridor',
 'GAU-COR',
 'Primary commuter and freight corridor through Gauteng province',
 142.5,
 'OPERATIONAL'),

('10000000-0000-0000-0000-000000000002',
 '00000000-0000-0000-0000-000000000001',
 'Cape Metro Line',
 'CPT-MET',
 'Western Cape metropolitan commuter network',
 98.3,
 'OPERATIONAL'),

('10000000-0000-0000-0000-000000000003',
 '00000000-0000-0000-0000-000000000001',
 'KwaZulu-Natal Coastal',
 'KZN-CST',
 'Durban coastal and inland freight connection',
 87.6,
 'MAINTENANCE');

-- ============================================================
-- SECTIONS (10 sections)
-- ============================================================
INSERT INTO sections (id, railway_line_id, name, code, description, start_location, end_location, length_km, status) VALUES
-- Gauteng Corridor Sections
('20000000-0000-0000-0000-000000000001',
 '10000000-0000-0000-0000-000000000001',
 'Section 01 - Johannesburg Central',
 'GAU-SEC-01',
 'Johannesburg CBD to Park Station',
 'Park Station', 'Johannesburg Central', 12.4, 'OPERATIONAL'),

('20000000-0000-0000-0000-000000000002',
 '10000000-0000-0000-0000-000000000001',
 'Section 02 - Soweto Link',
 'GAU-SEC-02',
 'Johannesburg South to Naledi',
 'Johannesburg South', 'Naledi', 18.7, 'OPERATIONAL'),

('20000000-0000-0000-0000-000000000003',
 '10000000-0000-0000-0000-000000000001',
 'Section 03 - East Rand Corridor',
 'GAU-SEC-03',
 'Germiston to Springs industrial zone',
 'Germiston', 'Springs', 22.1, 'OPERATIONAL'),

('20000000-0000-0000-0000-000000000004',
 '10000000-0000-0000-0000-000000000001',
 'Section 04 - Pretoria South',
 'GAU-SEC-04',
 'Halfway House to Pretoria Central',
 'Halfway House', 'Pretoria Central', 31.2, 'DEGRADED'),

-- Cape Metro Line Sections
('20000000-0000-0000-0000-000000000005',
 '10000000-0000-0000-0000-000000000002',
 'Section 01 - Cape Town Central',
 'CPT-SEC-01',
 'Cape Town Station to Salt River',
 'Cape Town Station', 'Salt River', 8.3, 'OPERATIONAL'),

('20000000-0000-0000-0000-000000000006',
 '10000000-0000-0000-0000-000000000002',
 'Section 02 - Southern Suburbs',
 'CPT-SEC-02',
 'Salt River to Claremont',
 'Salt River', 'Claremont', 14.6, 'OPERATIONAL'),

('20000000-0000-0000-0000-000000000007',
 '10000000-0000-0000-0000-000000000002',
 'Section 03 - False Bay Line',
 'CPT-SEC-03',
 'Claremont to Simon''s Town coastal section',
 'Claremont', "Simon's Town", 28.9, 'OPERATIONAL'),

-- KZN Coastal Sections
('20000000-0000-0000-0000-000000000008',
 '10000000-0000-0000-0000-000000000003',
 'Section 01 - Durban Port',
 'KZN-SEC-01',
 'Durban Port industrial section',
 'Durban Port', 'Umbilo', 9.2, 'MAINTENANCE'),

('20000000-0000-0000-0000-000000000009',
 '10000000-0000-0000-0000-000000000003',
 'Section 02 - North Coast Link',
 'KZN-SEC-02',
 'Durban to Umhlanga industrial link',
 'Durban Central', 'Umhlanga', 16.4, 'OPERATIONAL'),

('20000000-0000-0000-0000-000000000010',
 '10000000-0000-0000-0000-000000000003',
 'Section 03 - Pinetown Freight',
 'KZN-SEC-03',
 'Pinetown freight marshalling section',
 'Pinetown', 'New Germany', 11.8, 'OPERATIONAL');

-- ============================================================
-- TRACK CIRCUITS (20 circuits)
-- ============================================================
INSERT INTO track_circuits (id, section_id, track_circuit_id, railway_line, location, status, occupancy, signal_relationship, last_update, fault_status, fault_description) VALUES
-- GAU-SEC-01
('30000000-0000-0000-0000-000000000001',
 '20000000-0000-0000-0000-000000000001',
 'TC-001', 'Gauteng Corridor', 'Park Station - Platform 1', 'NORMAL', 'CLEAR', 'S-001',
 NOW() - INTERVAL '2 minutes', NULL, NULL),

('30000000-0000-0000-0000-000000000002',
 '20000000-0000-0000-0000-000000000001',
 'TC-002', 'Gauteng Corridor', 'Park Station - Platform 2', 'OCCUPIED', 'OCCUPIED', 'S-002',
 NOW() - INTERVAL '1 minute', NULL, NULL),

-- GAU-SEC-02
('30000000-0000-0000-0000-000000000003',
 '20000000-0000-0000-0000-000000000002',
 'TC-003', 'Gauteng Corridor', 'Johannesburg South - Approach', 'NORMAL', 'CLEAR', 'S-003',
 NOW() - INTERVAL '3 minutes', NULL, NULL),

('30000000-0000-0000-0000-000000000004',
 '20000000-0000-0000-0000-000000000002',
 'TC-004', 'Gauteng Corridor', 'Naledi Station Loop', 'NORMAL', 'CLEAR', 'S-004',
 NOW() - INTERVAL '4 minutes', NULL, NULL),

-- GAU-SEC-03
('30000000-0000-0000-0000-000000000005',
 '20000000-0000-0000-0000-000000000003',
 'TC-005', 'Gauteng Corridor', 'Germiston Junction - North', 'OCCUPIED', 'OCCUPIED', 'S-005',
 NOW() - INTERVAL '1 minute', NULL, NULL),

('30000000-0000-0000-0000-000000000006',
 '20000000-0000-0000-0000-000000000003',
 'TC-006', 'Gauteng Corridor', 'Germiston Junction - South', 'NORMAL', 'CLEAR', 'S-006',
 NOW() - INTERVAL '5 minutes', NULL, NULL),

('30000000-0000-0000-0000-000000000007',
 '20000000-0000-0000-0000-000000000003',
 'TC-007', 'Gauteng Corridor', 'Springs Approach East', 'OFFLINE', 'UNKNOWN', 'S-007',
 NOW() - INTERVAL '45 minutes', 'COMMUNICATION_LOSS', 'Track circuit telemetry link offline'),

-- GAU-SEC-04 (DEGRADED section — includes the main demo scenario)
('30000000-0000-0000-0000-000000000008',
 '20000000-0000-0000-0000-000000000004',
 'TC-008', 'Gauteng Corridor', 'Halfway House - North Approach', 'NORMAL', 'CLEAR', 'S-008',
 NOW() - INTERVAL '2 minutes', NULL, NULL),

('30000000-0000-0000-0000-000000000009',
 '20000000-0000-0000-0000-000000000004',
 'TC-009', 'Gauteng Corridor', 'Midrand Industrial Siding', 'FAULT', 'UNKNOWN', 'S-009',
 NOW() - INTERVAL '12 minutes', 'SHUNT_FAILURE', 'Shunt current below detection threshold'),

('30000000-0000-0000-0000-000000000021',
 '20000000-0000-0000-0000-000000000004',
 'TC-021', 'Gauteng Corridor', 'Pretoria South - Composite Sleeper Zone', 'FAULT', 'UNKNOWN', 'S-021',
 NOW() - INTERVAL '8 minutes', 'COMMUNICATION_FAILURE', 'Track circuit communication failure — physical verification required'),

-- CPT-SEC-01
('30000000-0000-0000-0000-000000000011',
 '20000000-0000-0000-0000-000000000005',
 'TC-011', 'Cape Metro Line', 'Cape Town Station - Bay 1', 'NORMAL', 'CLEAR', 'S-011',
 NOW() - INTERVAL '1 minute', NULL, NULL),

('30000000-0000-0000-0000-000000000012',
 '20000000-0000-0000-0000-000000000005',
 'TC-012', 'Cape Metro Line', 'Cape Town Station - Bay 2', 'OCCUPIED', 'OCCUPIED', 'S-012',
 NOW() - INTERVAL '2 minutes', NULL, NULL),

('30000000-0000-0000-0000-000000000013',
 '20000000-0000-0000-0000-000000000005',
 'TC-013', 'Cape Metro Line', 'Salt River Junction', 'NORMAL', 'CLEAR', 'S-013',
 NOW() - INTERVAL '3 minutes', NULL, NULL),

-- CPT-SEC-02
('30000000-0000-0000-0000-000000000014',
 '20000000-0000-0000-0000-000000000006',
 'TC-014', 'Cape Metro Line', 'Rondebosch Station', 'OCCUPIED', 'OCCUPIED', 'S-014',
 NOW() - INTERVAL '1 minute', NULL, NULL),

('30000000-0000-0000-0000-000000000015',
 '20000000-0000-0000-0000-000000000006',
 'TC-015', 'Cape Metro Line', 'Claremont Station Approach', 'NORMAL', 'CLEAR', 'S-015',
 NOW() - INTERVAL '4 minutes', NULL, NULL),

-- CPT-SEC-03
('30000000-0000-0000-0000-000000000016',
 '20000000-0000-0000-0000-000000000007',
 'TC-016', 'Cape Metro Line', 'Lakeside Coastal Section', 'NORMAL', 'CLEAR', 'S-016',
 NOW() - INTERVAL '6 minutes', NULL, NULL),

-- KZN Sections
('30000000-0000-0000-0000-000000000017',
 '20000000-0000-0000-0000-000000000008',
 'TC-017', 'KwaZulu-Natal Coastal', 'Durban Port - Wharf Siding', 'OFFLINE', 'UNKNOWN', 'S-017',
 NOW() - INTERVAL '3 hours', 'PLANNED_MAINTENANCE', 'Planned maintenance outage - KZN-SEC-01'),

('30000000-0000-0000-0000-000000000018',
 '20000000-0000-0000-0000-000000000009',
 'TC-018', 'KwaZulu-Natal Coastal', 'Berea Road Junction', 'NORMAL', 'CLEAR', 'S-018',
 NOW() - INTERVAL '2 minutes', NULL, NULL),

('30000000-0000-0000-0000-000000000019',
 '20000000-0000-0000-0000-000000000010',
 'TC-019', 'KwaZulu-Natal Coastal', 'Pinetown Freight Yard - North', 'OCCUPIED', 'OCCUPIED', 'S-019',
 NOW() - INTERVAL '3 minutes', NULL, NULL),

('30000000-0000-0000-0000-000000000020',
 '20000000-0000-0000-0000-000000000010',
 'TC-020', 'KwaZulu-Natal Coastal', 'New Germany Marshalling', 'NORMAL', 'CLEAR', 'S-020',
 NOW() - INTERVAL '5 minutes', NULL, NULL);

-- ============================================================
-- SIGNALS (10 signals)
-- ============================================================
INSERT INTO signals (id, section_id, track_circuit_id, signal_id, signal_type, location, status) VALUES
('40000000-0000-0000-0000-000000000001',
 '20000000-0000-0000-0000-000000000001',
 '30000000-0000-0000-0000-000000000001',
 'S-001', 'COLOUR_LIGHT', 'Park Station - Platform 1 Departure', 'CLEAR'),

('40000000-0000-0000-0000-000000000002',
 '20000000-0000-0000-0000-000000000001',
 '30000000-0000-0000-0000-000000000002',
 'S-002', 'COLOUR_LIGHT', 'Park Station - Platform 2 Departure', 'DANGER'),

('40000000-0000-0000-0000-000000000003',
 '20000000-0000-0000-0000-000000000003',
 '30000000-0000-0000-0000-000000000005',
 'S-005', 'COLOUR_LIGHT', 'Germiston Junction - North Signal', 'CAUTION'),

('40000000-0000-0000-0000-000000000004',
 '20000000-0000-0000-0000-000000000003',
 '30000000-0000-0000-0000-000000000007',
 'S-007', 'COLOUR_LIGHT', 'Springs Approach East Signal', 'UNKNOWN'),

('40000000-0000-0000-0000-000000000005',
 '20000000-0000-0000-0000-000000000004',
 '30000000-0000-0000-0000-000000000021',
 'S-021', 'COLOUR_LIGHT', 'Pretoria South - Composite Sleeper Zone Signal', 'UNKNOWN'),

('40000000-0000-0000-0000-000000000006',
 '20000000-0000-0000-0000-000000000005',
 '30000000-0000-0000-0000-000000000011',
 'S-011', 'COLOUR_LIGHT', 'Cape Town Station - Bay 1 Departure', 'CLEAR'),

('40000000-0000-0000-0000-000000000007',
 '20000000-0000-0000-0000-000000000005',
 '30000000-0000-0000-0000-000000000012',
 'S-012', 'COLOUR_LIGHT', 'Cape Town Station - Bay 2 Departure', 'DANGER'),

('40000000-0000-0000-0000-000000000008',
 '20000000-0000-0000-0000-000000000006',
 '30000000-0000-0000-0000-000000000014',
 'S-014', 'COLOUR_LIGHT', 'Rondebosch Station Signal', 'CAUTION'),

('40000000-0000-0000-0000-000000000009',
 '20000000-0000-0000-0000-000000000008',
 '30000000-0000-0000-0000-000000000017',
 'S-017', 'COLOUR_LIGHT', 'Durban Port - Wharf Siding Signal', 'OFFLINE'),

('40000000-0000-0000-0000-000000000010',
 '20000000-0000-0000-0000-000000000010',
 '30000000-0000-0000-0000-000000000019',
 'S-019', 'COLOUR_LIGHT', 'Pinetown Freight Yard Signal', 'CAUTION');

-- ============================================================
-- ASSETS (30 infrastructure assets)
-- ============================================================
INSERT INTO assets (id, section_id, track_circuit_id, asset_id, asset_type, description, location, gps_lat, gps_lon, installation_date, last_inspection, condition) VALUES
-- GAU-SEC-01 Assets
('50000000-0000-0000-0000-000000000001',
 '20000000-0000-0000-0000-000000000001',
 '30000000-0000-0000-0000-000000000001',
 'STEEL-RAIL-001', 'STEEL_RAIL',
 'Main line steel rail - Park Station northbound',
 'Park Station - Platform 1, Northbound', -26.1952, 28.0439,
 '2018-03-15', '2024-01-10', 'GOOD'),

('50000000-0000-0000-0000-000000000002',
 '20000000-0000-0000-0000-000000000001',
 '30000000-0000-0000-0000-000000000002',
 'COMPOSITE-SLEEPER-002', 'COMPOSITE_SLEEPER',
 'Composite sleeper installation - Platform 2 Zone',
 'Park Station - Platform 2, Mid-section', -26.1958, 28.0445,
 '2019-07-20', '2024-01-10', 'FAIR'),

-- GAU-SEC-02 Assets
('50000000-0000-0000-0000-000000000003',
 '20000000-0000-0000-0000-000000000002',
 '30000000-0000-0000-0000-000000000003',
 'BALLAST-001', 'BALLAST_BED',
 'Ballast bed - Johannesburg South',
 'Johannesburg South - Approach km 2.4', -26.2341, 28.0123,
 '2017-11-01', '2023-11-20', 'GOOD'),

('50000000-0000-0000-0000-000000000004',
 '20000000-0000-0000-0000-000000000002',
 '30000000-0000-0000-0000-000000000004',
 'SWITCH-ASSEMBLY-001', 'SWITCH_ASSEMBLY',
 'Switch assembly - Naledi loop junction',
 'Naledi Station - Loop Junction', -26.2780, 27.8654,
 '2020-04-12', '2024-02-05', 'GOOD'),

-- GAU-SEC-03 Assets
('50000000-0000-0000-0000-000000000005',
 '20000000-0000-0000-0000-000000000003',
 '30000000-0000-0000-0000-000000000005',
 'BRIDGE-001', 'BRIDGE',
 'Germiston Junction overpass bridge structure',
 'Germiston Junction - North Span', -26.2099, 28.1678,
 '2005-08-22', '2023-09-15', 'WARNING'),

('50000000-0000-0000-0000-000000000006',
 '20000000-0000-0000-0000-000000000003',
 '30000000-0000-0000-0000-000000000006',
 'COMPOSITE-SLEEPER-006', 'COMPOSITE_SLEEPER',
 'Composite sleeper panel - Germiston South',
 'Germiston Junction - South Approach', -26.2134, 28.1590,
 '2021-01-08', '2024-01-22', 'GOOD'),

('50000000-0000-0000-0000-000000000007',
 '20000000-0000-0000-0000-000000000003',
 '30000000-0000-0000-0000-000000000007',
 'EMBANKMENT-001', 'EMBANKMENT',
 'Earthwork embankment - Springs approach',
 'Springs Approach - East Embankment km 19.8', -26.2435, 28.4123,
 '2003-06-10', '2023-07-14', 'WARNING'),

-- GAU-SEC-04 Assets (PRIMARY DEMO SCENARIO ASSETS)
('50000000-0000-0000-0000-000000000008',
 '20000000-0000-0000-0000-000000000004',
 '30000000-0000-0000-0000-000000000008',
 'COMPOSITE-SLEEPER-008', 'COMPOSITE_SLEEPER',
 'Composite sleeper block - Halfway House North',
 'Halfway House - North Approach km 1.2', -25.9767, 28.1256,
 '2020-03-18', '2024-01-30', 'GOOD'),

('50000000-0000-0000-0000-000000000009',
 '20000000-0000-0000-0000-000000000004',
 '30000000-0000-0000-0000-000000000009',
 'BRIDGE-009', 'BRIDGE',
 'Midrand industrial viaduct - west span',
 'Midrand Industrial Siding - Bridge West', -25.9870, 28.1432,
 '2008-05-14', '2023-10-08', 'CRITICAL'),

-- THE MAIN DEMO ASSET
('50000000-0000-0000-0000-000000000021',
 '20000000-0000-0000-0000-000000000004',
 '30000000-0000-0000-0000-000000000021',
 'COMPOSITE-SLEEPER-021', 'COMPOSITE_SLEEPER',
 'Composite sleeper panel - Pretoria South Zone, TC-021 corridor',
 'Pretoria South - Composite Sleeper Zone km 28.4', -25.7461, 28.1889,
 '2021-06-01', '2023-12-15', 'WARNING'),

-- CPT-SEC-01 Assets
('50000000-0000-0000-0000-000000000011',
 '20000000-0000-0000-0000-000000000005',
 '30000000-0000-0000-0000-000000000011',
 'STEEL-RAIL-011', 'STEEL_RAIL',
 'Main line rail - Cape Town Station Bay 1',
 'Cape Town Station - Bay 1', -33.9249, 18.4241,
 '2019-02-14', '2024-02-01', 'GOOD'),

('50000000-0000-0000-0000-000000000012',
 '20000000-0000-0000-0000-000000000005',
 '30000000-0000-0000-0000-000000000012',
 'COMPOSITE-SLEEPER-012', 'COMPOSITE_SLEEPER',
 'Composite sleeper - Cape Town Bay 2 zone',
 'Cape Town Station - Bay 2', -33.9254, 18.4248,
 '2020-09-22', '2024-02-01', 'FAIR'),

('50000000-0000-0000-0000-000000000013',
 '20000000-0000-0000-0000-000000000005',
 '30000000-0000-0000-0000-000000000013',
 'SWITCH-ASSEMBLY-013', 'SWITCH_ASSEMBLY',
 'Salt River Junction switch assembly',
 'Salt River Junction - Main Switch', -33.9345, 18.4678,
 '2018-11-30', '2023-12-05', 'GOOD'),

-- CPT-SEC-02 Assets
('50000000-0000-0000-0000-000000000014',
 '20000000-0000-0000-0000-000000000006',
 '30000000-0000-0000-0000-000000000014',
 'COMPOSITE-SLEEPER-014', 'COMPOSITE_SLEEPER',
 'Composite sleeper panel - Rondebosch Station',
 'Rondebosch Station - Platform Zone', -33.9561, 18.4728,
 '2021-03-10', '2024-01-18', 'GOOD'),

('50000000-0000-0000-0000-000000000015',
 '20000000-0000-0000-0000-000000000006',
 '30000000-0000-0000-0000-000000000015',
 'BALLAST-015', 'BALLAST_BED',
 'Ballast bed renewal - Claremont approach',
 'Claremont Station - South Approach', -33.9837, 18.4703,
 '2022-07-05', '2024-01-18', 'GOOD'),

-- CPT-SEC-03 Assets
('50000000-0000-0000-0000-000000000016',
 '20000000-0000-0000-0000-000000000007',
 '30000000-0000-0000-0000-000000000016',
 'RETAINING-WALL-016', 'RETAINING_WALL',
 'Coastal retaining wall - Lakeside embankment',
 'Lakeside - Coastal Section km 4.2', -34.0580, 18.4789,
 '2006-12-01', '2023-08-20', 'WARNING'),

('50000000-0000-0000-0000-000000000017',
 '20000000-0000-0000-0000-000000000007',
 '30000000-0000-0000-0000-000000000016',
 'CULVERT-017', 'CULVERT',
 'Stormwater culvert - False Bay coastal zone',
 'False Bay Line - km 12.7', -34.1123, 18.4567,
 '2004-08-15', '2023-08-20', 'FAIR'),

-- KZN-SEC-01 Assets
('50000000-0000-0000-0000-000000000018',
 '20000000-0000-0000-0000-000000000008',
 '30000000-0000-0000-0000-000000000017',
 'BRIDGE-018', 'BRIDGE',
 'Durban Port wharf access bridge',
 'Durban Port - Wharf Siding Bridge', -29.8587, 31.0218,
 '2001-04-30', '2023-06-10', 'WARNING'),

-- KZN-SEC-02 Assets
('50000000-0000-0000-0000-000000000019',
 '20000000-0000-0000-0000-000000000009',
 '30000000-0000-0000-0000-000000000018',
 'COMPOSITE-SLEEPER-019', 'COMPOSITE_SLEEPER',
 'Composite sleeper section - Berea Road junction',
 'Berea Road - Junction Approach', -29.8512, 31.0001,
 '2022-01-14', '2024-01-05', 'GOOD'),

-- KZN-SEC-03 Assets
('50000000-0000-0000-0000-000000000020',
 '20000000-0000-0000-0000-000000000010',
 '30000000-0000-0000-0000-000000000019',
 'SWITCH-ASSEMBLY-020', 'SWITCH_ASSEMBLY',
 'Pinetown freight yard switch assembly - North throat',
 'Pinetown Freight Yard - North Throat', -29.8234, 30.8601,
 '2019-10-22', '2024-01-12', 'GOOD'),

-- Additional assets to reach 30
('50000000-0000-0000-0000-000000000022',
 '20000000-0000-0000-0000-000000000004',
 '30000000-0000-0000-0000-000000000008',
 'STEEL-RAIL-022', 'STEEL_RAIL',
 'Continuous welded rail - Halfway House zone',
 'Halfway House - CWR section km 3.1', -25.9720, 28.1290,
 '2020-03-18', '2024-01-30', 'GOOD'),

('50000000-0000-0000-0000-000000000023',
 '20000000-0000-0000-0000-000000000001',
 '30000000-0000-0000-0000-000000000002',
 'BRIDGE-023', 'BRIDGE',
 'Park Station northern approach viaduct',
 'Park Station - North Viaduct', -26.1940, 28.0441,
 '2010-06-12', '2023-11-15', 'FAIR'),

('50000000-0000-0000-0000-000000000024',
 '20000000-0000-0000-0000-000000000003',
 '30000000-0000-0000-0000-000000000005',
 'VIADUCT-024', 'VIADUCT',
 'Germiston industrial viaduct',
 'Germiston - Industrial Zone Viaduct', -26.2080, 28.1690,
 '2007-03-28', '2023-09-15', 'FAIR'),

('50000000-0000-0000-0000-000000000025',
 '20000000-0000-0000-0000-000000000006',
 '30000000-0000-0000-0000-000000000015',
 'LEVEL-CROSSING-025', 'LEVEL_CROSSING',
 'Claremont road-rail level crossing',
 'Claremont - Main Road Level Crossing', -33.9845, 18.4710,
 '2015-09-01', '2024-01-18', 'GOOD'),

('50000000-0000-0000-0000-000000000026',
 '20000000-0000-0000-0000-000000000007',
 '30000000-0000-0000-0000-000000000016',
 'EMBANKMENT-026', 'EMBANKMENT',
 'False Bay coastal earthwork embankment',
 'False Bay Line - Coastal Embankment km 8.9', -34.0920, 18.4700,
 '1998-11-20', '2023-08-20', 'WARNING'),

('50000000-0000-0000-0000-000000000027',
 '20000000-0000-0000-0000-000000000009',
 '30000000-0000-0000-0000-000000000018',
 'BRIDGE-027', 'BRIDGE',
 'Umgeni River rail bridge - North Coast link',
 'North Coast Link - Umgeni River Bridge', -29.8100, 31.0245,
 '2003-07-15', '2023-06-28', 'FAIR'),

('50000000-0000-0000-0000-000000000028',
 '20000000-0000-0000-0000-000000000010',
 '30000000-0000-0000-0000-000000000020',
 'COMPOSITE-SLEEPER-028', 'COMPOSITE_SLEEPER',
 'Composite sleeper block - New Germany marshalling',
 'New Germany Marshalling - West End', -29.8250, 30.8580,
 '2022-05-09', '2024-01-12', 'GOOD'),

('50000000-0000-0000-0000-000000000029',
 '20000000-0000-0000-0000-000000000002',
 '30000000-0000-0000-0000-000000000003',
 'CULVERT-029', 'CULVERT',
 'Drainage culvert - Johannesburg South approach',
 'Johannesburg South - Culvert km 4.8', -26.2360, 28.0130,
 '2011-02-28', '2023-10-30', 'FAIR'),

('50000000-0000-0000-0000-000000000030',
 '20000000-0000-0000-0000-000000000004',
 '30000000-0000-0000-0000-000000000009',
 'RETAINING-WALL-030', 'RETAINING_WALL',
 'Cutting retaining wall - Midrand industrial',
 'Midrand Industrial - Retaining Wall East', -25.9885, 28.1440,
 '2009-08-17', '2023-10-08', 'CRITICAL');

-- ============================================================
-- FBG SENSORS (20 sensors)
-- ============================================================
INSERT INTO fbg_sensors (id, asset_id, sensor_id, sensor_type, baseline_strain, current_strain, wavelength_nm, sensor_status, risk_level, install_date, last_reading) VALUES
-- COMPOSITE-SLEEPER-021 sensors (THE MAIN DEMO — increasing strain)
('60000000-0000-0000-0000-000000000021',
 '50000000-0000-0000-0000-000000000021',
 'FBG-00021', 'STRAIN', 250.00, 612.00, 1550.324,
 'WARNING', 'SIMULATED_WARNING',
 '2021-06-15', NOW() - INTERVAL '3 minutes'),

-- BRIDGE-001 Germiston (warning trend)
('60000000-0000-0000-0000-000000000001',
 '50000000-0000-0000-0000-000000000005',
 'FBG-00001', 'STRAIN', 180.00, 267.00, 1548.112,
 'WARNING', 'SIMULATED_WARNING',
 '2021-09-01', NOW() - INTERVAL '5 minutes'),

-- BRIDGE-009 Midrand (critical — matches CRITICAL asset)
('60000000-0000-0000-0000-000000000002',
 '50000000-0000-0000-0000-000000000009',
 'FBG-00002', 'STRAIN', 220.00, 489.00, 1549.876,
 'FAULT', 'SIMULATED_CRITICAL',
 '2020-10-20', NOW() - INTERVAL '4 minutes'),

-- BRIDGE-018 Durban Port (offline)
('60000000-0000-0000-0000-000000000003',
 '50000000-0000-0000-0000-000000000018',
 'FBG-00003', 'STRAIN', 195.00, NULL, 1551.005,
 'OFFLINE', 'OFFLINE',
 '2019-07-22', NOW() - INTERVAL '6 hours'),

-- COMPOSITE-SLEEPER-002 Park Station (stable)
('60000000-0000-0000-0000-000000000004',
 '50000000-0000-0000-0000-000000000002',
 'FBG-00004', 'STRAIN', 230.00, 238.00, 1549.234,
 'ACTIVE', 'NORMAL',
 '2021-08-10', NOW() - INTERVAL '2 minutes'),

-- COMPOSITE-SLEEPER-006 Germiston (slightly elevated)
('60000000-0000-0000-0000-000000000005',
 '50000000-0000-0000-0000-000000000006',
 'FBG-00005', 'STRAIN', 245.00, 261.00, 1550.001,
 'ACTIVE', 'NORMAL',
 '2021-01-15', NOW() - INTERVAL '6 minutes'),

-- COMPOSITE-SLEEPER-008 Halfway House (normal)
('60000000-0000-0000-0000-000000000006',
 '50000000-0000-0000-0000-000000000008',
 'FBG-00006', 'STRAIN', 240.00, 245.00, 1548.750,
 'ACTIVE', 'NORMAL',
 '2020-04-01', NOW() - INTERVAL '3 minutes'),

-- RETAINING-WALL-016 Lakeside (increasing — warning)
('60000000-0000-0000-0000-000000000007',
 '50000000-0000-0000-0000-000000000016',
 'FBG-00007', 'STRAIN', 160.00, 312.00, 1552.340,
 'WARNING', 'SIMULATED_WARNING',
 '2022-01-20', NOW() - INTERVAL '7 minutes'),

-- RETAINING-WALL-030 Midrand (decreasing — recovering)
('60000000-0000-0000-0000-000000000008',
 '50000000-0000-0000-0000-000000000030',
 'FBG-00008', 'STRAIN', 175.00, 193.00, 1549.560,
 'ACTIVE', 'NORMAL',
 '2021-11-05', NOW() - INTERVAL '4 minutes'),

-- COMPOSITE-SLEEPER-012 Cape Town (stable)
('60000000-0000-0000-0000-000000000009',
 '50000000-0000-0000-0000-000000000012',
 'FBG-00009', 'STRAIN', 235.00, 239.00, 1550.890,
 'ACTIVE', 'NORMAL',
 '2020-10-01', NOW() - INTERVAL '2 minutes'),

-- COMPOSITE-SLEEPER-014 Rondebosch (stable)
('60000000-0000-0000-0000-000000000010',
 '50000000-0000-0000-0000-000000000014',
 'FBG-00010', 'STRAIN', 248.00, 252.00, 1548.900,
 'ACTIVE', 'NORMAL',
 '2021-03-15', NOW() - INTERVAL '3 minutes'),

-- EMBANKMENT-001 Springs (warning - slight increase)
('60000000-0000-0000-0000-000000000011',
 '50000000-0000-0000-0000-000000000007',
 'FBG-00011', 'STRAIN', 140.00, 198.00, 1553.110,
 'WARNING', 'SIMULATED_WARNING',
 '2022-06-08', NOW() - INTERVAL '8 minutes'),

-- COMPOSITE-SLEEPER-019 Berea Road (stable)
('60000000-0000-0000-0000-000000000012',
 '50000000-0000-0000-0000-000000000019',
 'FBG-00012', 'STRAIN', 242.00, 244.00, 1549.005,
 'ACTIVE', 'NORMAL',
 '2022-01-20', NOW() - INTERVAL '4 minutes'),

-- VIADUCT-024 Germiston (stable but monitored)
('60000000-0000-0000-0000-000000000013',
 '50000000-0000-0000-0000-000000000024',
 'FBG-00013', 'STRAIN', 320.00, 334.00, 1547.789,
 'ACTIVE', 'NORMAL',
 '2021-04-12', NOW() - INTERVAL '5 minutes'),

-- BRIDGE-023 Park Station (slight decrease)
('60000000-0000-0000-0000-000000000014',
 '50000000-0000-0000-0000-000000000023',
 'FBG-00014', 'STRAIN', 290.00, 281.00, 1550.445,
 'ACTIVE', 'NORMAL',
 '2021-07-30', NOW() - INTERVAL '6 minutes'),

-- BRIDGE-027 Umgeni (stable freight bridge)
('60000000-0000-0000-0000-000000000015',
 '50000000-0000-0000-0000-000000000027',
 'FBG-00015', 'STRAIN', 380.00, 392.00, 1546.234,
 'ACTIVE', 'NORMAL',
 '2021-09-14', NOW() - INTERVAL '3 minutes'),

-- EMBANKMENT-026 False Bay (warning - coastal erosion monitoring)
('60000000-0000-0000-0000-000000000016',
 '50000000-0000-0000-0000-000000000026',
 'FBG-00016', 'STRAIN', 110.00, 178.00, 1554.001,
 'WARNING', 'SIMULATED_WARNING',
 '2022-03-07', NOW() - INTERVAL '9 minutes'),

-- COMPOSITE-SLEEPER-028 New Germany (stable)
('60000000-0000-0000-0000-000000000017',
 '50000000-0000-0000-0000-000000000028',
 'FBG-00017', 'STRAIN', 238.00, 241.00, 1549.678,
 'ACTIVE', 'NORMAL',
 '2022-05-15', NOW() - INTERVAL '2 minutes'),

-- STEEL-RAIL-001 Park Station (calibrating)
('60000000-0000-0000-0000-000000000018',
 '50000000-0000-0000-0000-000000000001',
 'FBG-00018', 'STRAIN', 210.00, 210.00, 1550.000,
 'CALIBRATING', 'NORMAL',
 '2023-11-01', NOW() - INTERVAL '15 minutes'),

-- SWITCH-ASSEMBLY-001 Naledi (stable operational)
('60000000-0000-0000-0000-000000000019',
 '50000000-0000-0000-0000-000000000004',
 'FBG-00019', 'STRAIN', 190.00, 195.00, 1551.234,
 'ACTIVE', 'NORMAL',
 '2022-09-20', NOW() - INTERVAL '4 minutes'),

-- STEEL-RAIL-022 Halfway House (stable)
('60000000-0000-0000-0000-000000000020',
 '50000000-0000-0000-0000-000000000022',
 'FBG-00020', 'STRAIN', 205.00, 208.00, 1549.120,
 'ACTIVE', 'NORMAL',
 '2022-02-14', NOW() - INTERVAL '3 minutes');

-- ============================================================
-- TRACK CIRCUIT EVENTS (demo scenario for TC-021 + others)
-- ============================================================
INSERT INTO track_circuit_events (id, track_circuit_id, timestamp, previous_status, new_status, event_type, description, is_simulated) VALUES
-- TC-021 DEMO SCENARIO EVENT CHAIN
('70000000-0000-0000-0000-000000000001',
 '30000000-0000-0000-0000-000000000021',
 NOW() - INTERVAL '75 minutes', NULL, 'NORMAL', 'STATUS_CHANGE',
 'TC-021 online and reporting normal status', TRUE),

('70000000-0000-0000-0000-000000000002',
 '30000000-0000-0000-0000-000000000021',
 NOW() - INTERVAL '60 minutes', 'NORMAL', 'OCCUPIED', 'STATUS_CHANGE',
 'TC-021 section occupied — train movement detected', TRUE),

('70000000-0000-0000-0000-000000000003',
 '30000000-0000-0000-0000-000000000021',
 NOW() - INTERVAL '45 minutes', 'OCCUPIED', 'OCCUPIED', 'STATUS_CHANGE',
 'TC-021 section still occupied — normal passage', TRUE),

('70000000-0000-0000-0000-000000000004',
 '30000000-0000-0000-0000-000000000021',
 NOW() - INTERVAL '30 minutes', 'OCCUPIED', 'FAULT', 'FAULT',
 'TC-021 entered FAULT state — communication failure detected. Shunt current loss. Physical verification required.', TRUE),

('70000000-0000-0000-0000-000000000005',
 '30000000-0000-0000-0000-000000000021',
 NOW() - INTERVAL '28 minutes', 'FAULT', 'FAULT', 'FAULT',
 'TC-021 fault persisting — no recovery. Alert generated.', TRUE),

('70000000-0000-0000-0000-000000000006',
 '30000000-0000-0000-0000-000000000021',
 NOW() - INTERVAL '20 minutes', 'FAULT', 'UNKNOWN', 'STATUS_CHANGE',
 'TC-021 status UNKNOWN — telemetry intermittent. FBG-00021 simultaneously shows elevated strain.', TRUE),

('70000000-0000-0000-0000-000000000007',
 '30000000-0000-0000-0000-000000000021',
 NOW() - INTERVAL '8 minutes', 'UNKNOWN', 'FAULT', 'FAULT',
 'TC-021 confirmed FAULT. Inspection task INS-2024-001 created. Technician assigned.', TRUE),

-- TC-009 fault events
('70000000-0000-0000-0000-000000000008',
 '30000000-0000-0000-0000-000000000009',
 NOW() - INTERVAL '2 hours', NULL, 'NORMAL', 'STATUS_CHANGE',
 'TC-009 normal status', TRUE),

('70000000-0000-0000-0000-000000000009',
 '30000000-0000-0000-0000-000000000009',
 NOW() - INTERVAL '30 minutes', 'NORMAL', 'FAULT', 'FAULT',
 'TC-009 shunt current below detection threshold — possible shunting failure or contamination', TRUE),

-- TC-007 offline events
('70000000-0000-0000-0000-000000000010',
 '30000000-0000-0000-0000-000000000007',
 NOW() - INTERVAL '90 minutes', 'NORMAL', 'OFFLINE', 'OFFLINE',
 'TC-007 telemetry link dropped — communication unit fault suspected', TRUE),

-- TC-002 occupation events
('70000000-0000-0000-0000-000000000011',
 '30000000-0000-0000-0000-000000000002',
 NOW() - INTERVAL '10 minutes', 'NORMAL', 'OCCUPIED', 'STATUS_CHANGE',
 'TC-002 section occupied — scheduled service', TRUE),

('70000000-0000-0000-0000-000000000012',
 '30000000-0000-0000-0000-000000000005',
 NOW() - INTERVAL '5 minutes', 'NORMAL', 'OCCUPIED', 'STATUS_CHANGE',
 'TC-005 section occupied — freight consist passing Germiston North', TRUE),

-- Additional historical events for TC-021 (older history)
('70000000-0000-0000-0000-000000000013',
 '30000000-0000-0000-0000-000000000021',
 NOW() - INTERVAL '7 days', NULL, 'NORMAL', 'STATUS_CHANGE',
 'TC-021 routine status check — normal', TRUE),

('70000000-0000-0000-0000-000000000014',
 '30000000-0000-0000-0000-000000000021',
 NOW() - INTERVAL '6 days', 'NORMAL', 'OCCUPIED', 'STATUS_CHANGE',
 'TC-021 occupied — morning service', TRUE),

('70000000-0000-0000-0000-000000000015',
 '30000000-0000-0000-0000-000000000021',
 NOW() - INTERVAL '6 days 10 minutes', 'OCCUPIED', 'NORMAL', 'STATUS_CHANGE',
 'TC-021 section cleared', TRUE),

('70000000-0000-0000-0000-000000000016',
 '30000000-0000-0000-0000-000000000021',
 NOW() - INTERVAL '3 days', 'NORMAL', 'OCCUPIED', 'STATUS_CHANGE',
 'TC-021 occupied — afternoon freight service', TRUE),

('70000000-0000-0000-0000-000000000017',
 '30000000-0000-0000-0000-000000000021',
 NOW() - INTERVAL '3 days 15 minutes', 'OCCUPIED', 'NORMAL', 'STATUS_CHANGE',
 'TC-021 section cleared', TRUE),

-- Bridge-009 area — TC-009 additional history
('70000000-0000-0000-0000-000000000018',
 '30000000-0000-0000-0000-000000000009',
 NOW() - INTERVAL '3 days', NULL, 'NORMAL', 'STATUS_CHANGE',
 'TC-009 normal status — routine monitoring', TRUE),

('70000000-0000-0000-0000-000000000019',
 '30000000-0000-0000-0000-000000000009',
 NOW() - INTERVAL '14 hours', 'NORMAL', 'FAULT', 'FAULT',
 'TC-009 brief fault event — auto-recovered after 12 minutes', TRUE),

('70000000-0000-0000-0000-000000000020',
 '30000000-0000-0000-0000-000000000009',
 NOW() - INTERVAL '13 hours 48 minutes', 'FAULT', 'NORMAL', 'RECOVERY',
 'TC-009 recovered to normal — likely transient event', TRUE);

-- ============================================================
-- ALERTS (20 alerts)
-- ============================================================
INSERT INTO alerts (id, alert_ref, source_type, priority, title, description, track_circuit_id, asset_id, sensor_id, section_id, status, acknowledged_by, acknowledged_at, is_simulated) VALUES
-- PRIMARY DEMO ALERT (COMBINED — TC-021 + FBG-00021)
('80000000-0000-0000-0000-000000000001',
 'ALT-2024-001',
 'COMBINED',
 'REQUIRES_VERIFICATION',
 'TC-021 Fault + FBG-00021 Elevated Strain — Verification Required',
 'TC-021 has entered a FAULT state (communication failure). Separately, FBG-00021 on COMPOSITE-SLEEPER-021 reports an increasing strain trend (+144.8% above baseline). These are two independent evidence sources in the same physical zone. Physical verification is recommended. SIMULATED DATA — MVP only.',
 '30000000-0000-0000-0000-000000000021',
 '50000000-0000-0000-0000-000000000021',
 '60000000-0000-0000-0000-000000000021',
 '20000000-0000-0000-0000-000000000004',
 'INVESTIGATING',
 'Control Room Operator A. Nkosi',
 NOW() - INTERVAL '25 minutes',
 TRUE),

-- TC-021 FAULT only
('80000000-0000-0000-0000-000000000002',
 'ALT-2024-002',
 'TRACK_CIRCUIT',
 'HIGH',
 'TC-021 Track Circuit Communication Failure',
 'TC-021 (Pretoria South - Composite Sleeper Zone) has entered a FAULT state. Communication failure detected. Last valid status: OCCUPIED. Fault description: Track circuit communication failure. Physical verification required. SIMULATED DATA.',
 '30000000-0000-0000-0000-000000000021',
 '50000000-0000-0000-0000-000000000021',
 NULL,
 '20000000-0000-0000-0000-000000000004',
 'INVESTIGATING',
 'Control Room Operator A. Nkosi',
 NOW() - INTERVAL '27 minutes',
 TRUE),

-- FBG-00021 WARNING
('80000000-0000-0000-0000-000000000003',
 'ALT-2024-003',
 'FBG_SENSOR',
 'WARNING',
 'FBG-00021 Increasing Strain Trend on COMPOSITE-SLEEPER-021',
 'FBG-00021 monitoring COMPOSITE-SLEEPER-021 reports an increasing strain trend. Current reading: 612 µε vs baseline 250 µε (deviation +362 µε, +144.8%). Trend: INCREASING. Risk: SIMULATED WARNING. This is infrastructure condition data only — it does not confirm a structural fault. Engineering review recommended. SIMULATED DATA.',
 NULL,
 '50000000-0000-0000-0000-000000000021',
 '60000000-0000-0000-0000-000000000021',
 '20000000-0000-0000-0000-000000000004',
 'INVESTIGATING',
 'Infrastructure Engineer B. van der Merwe',
 NOW() - INTERVAL '22 minutes',
 TRUE),

-- TC-009 Shunt Failure
('80000000-0000-0000-0000-000000000004',
 'ALT-2024-004',
 'TRACK_CIRCUIT',
 'WARNING',
 'TC-009 Shunt Current Below Detection Threshold',
 'TC-009 (Midrand Industrial Siding) reports shunt current below detection threshold. Possible contamination, track degradation or shunting equipment issue. Fault status: SHUNT_FAILURE. SIMULATED DATA.',
 '30000000-0000-0000-0000-000000000009',
 '50000000-0000-0000-0000-000000000009',
 NULL,
 '20000000-0000-0000-0000-000000000004',
 'OPEN',
 NULL, NULL, TRUE),

-- BRIDGE-009 Critical FBG
('80000000-0000-0000-0000-000000000005',
 'ALT-2024-005',
 'FBG_SENSOR',
 'CRITICAL',
 'FBG-00002 SIMULATED CRITICAL Strain on BRIDGE-009 Midrand',
 'FBG-00002 monitoring BRIDGE-009 (Midrand industrial viaduct) shows SIMULATED CRITICAL strain reading of 489 µε vs baseline 220 µε (+122.3%). This is a simulated alert for MVP demonstration. A real critical reading would require immediate engineering assessment. SIMULATED DATA ONLY.',
 NULL,
 '50000000-0000-0000-0000-000000000009',
 '60000000-0000-0000-0000-000000000002',
 '20000000-0000-0000-0000-000000000004',
 'ACKNOWLEDGED',
 'Senior Engineer T. Dlamini',
 NOW() - INTERVAL '1 hour',
 TRUE),

-- TC-007 Offline
('80000000-0000-0000-0000-000000000006',
 'ALT-2024-006',
 'COMMUNICATION',
 'WARNING',
 'TC-007 Telemetry Link Offline',
 'TC-007 (Springs Approach East) telemetry link is offline. Communication unit fault suspected. Last status: NORMAL. Section status cannot be determined. Maintenance team notified. SIMULATED DATA.',
 '30000000-0000-0000-0000-000000000007',
 '50000000-0000-0000-0000-000000000007',
 NULL,
 '20000000-0000-0000-0000-000000000003',
 'ACKNOWLEDGED',
 'Control Room Operator P. Sithole',
 NOW() - INTERVAL '80 minutes',
 TRUE),

-- Lakeside Retaining Wall
('80000000-0000-0000-0000-000000000007',
 'ALT-2024-007',
 'FBG_SENSOR',
 'WARNING',
 'FBG-00007 Elevated Strain on RETAINING-WALL-016 Lakeside',
 'FBG-00007 on RETAINING-WALL-016 (Lakeside coastal section) reports elevated strain of 312 µε vs baseline 160 µε (+95%). Trend: INCREASING. Possible coastal erosion or soil movement. Engineering review recommended. SIMULATED DATA.',
 NULL,
 '50000000-0000-0000-0000-000000000016',
 '60000000-0000-0000-0000-000000000007',
 '20000000-0000-0000-0000-000000000007',
 'OPEN',
 NULL, NULL, TRUE),

-- KZN Durban Port offline
('80000000-0000-0000-0000-000000000008',
 'ALT-2024-008',
 'COMMUNICATION',
 'OFFLINE',
 'TC-017 and FBG-00003 Offline — KZN-SEC-01 Planned Maintenance',
 'TC-017 (Durban Port Wharf Siding) and FBG-00003 are offline as part of planned maintenance on KZN-SEC-01. Expected return to service: 72 hours. No unplanned fault suspected. SIMULATED DATA.',
 '30000000-0000-0000-0000-000000000017',
 '50000000-0000-0000-0000-000000000018',
 '60000000-0000-0000-0000-000000000003',
 '20000000-0000-0000-0000-000000000008',
 'ACKNOWLEDGED',
 'Maintenance Manager S. Maharaj',
 NOW() - INTERVAL '3 hours',
 TRUE),

-- Germiston Bridge warning
('80000000-0000-0000-0000-000000000009',
 'ALT-2024-009',
 'FBG_SENSOR',
 'WARNING',
 'FBG-00001 Elevated Strain — BRIDGE-001 Germiston Junction',
 'FBG-00001 on BRIDGE-001 (Germiston Junction overpass) shows elevated strain of 267 µε vs baseline 180 µε (+48.3%). Trend: STABLE. Asset condition: WARNING. Routine inspection scheduled. SIMULATED DATA.',
 NULL,
 '50000000-0000-0000-0000-000000000005',
 '60000000-0000-0000-0000-000000000001',
 '20000000-0000-0000-0000-000000000003',
 'OPEN',
 NULL, NULL, TRUE),

-- Embankment Springs warning
('80000000-0000-0000-0000-000000000010',
 'ALT-2024-010',
 'FBG_SENSOR',
 'WARNING',
 'FBG-00011 Elevated Strain — EMBANKMENT-001 Springs',
 'FBG-00011 on EMBANKMENT-001 (Springs approach) shows elevated strain of 198 µε vs baseline 140 µε (+41.4%). Trend: INCREASING. May indicate seasonal ground movement. SIMULATED DATA.',
 '30000000-0000-0000-0000-000000000007',
 '50000000-0000-0000-0000-000000000007',
 '60000000-0000-0000-0000-000000000011',
 '20000000-0000-0000-0000-000000000003',
 'OPEN',
 NULL, NULL, TRUE),

-- Resolved alerts (historical)
('80000000-0000-0000-0000-000000000011',
 'ALT-2024-011',
 'TRACK_CIRCUIT', 'WARNING',
 'TC-014 Brief Occupation Anomaly — Resolved',
 'TC-014 showed anomalous occupation signal. Investigation found vegetation on track. Vegetation cleared. SIMULATED DATA.',
 '30000000-0000-0000-0000-000000000014', NULL, NULL,
 '20000000-0000-0000-0000-000000000006',
 'CLOSED', 'Inspector M. Botha', NOW() - INTERVAL '5 days', TRUE),

('80000000-0000-0000-0000-000000000012',
 'ALT-2024-012',
 'FBG_SENSOR', 'WARNING',
 'FBG-00009 Transient Reading — False Alarm',
 'FBG-00009 showed a single transient high reading. Subsequent readings confirmed normal. Likely temperature compensation artefact. SIMULATED DATA.',
 NULL, '50000000-0000-0000-0000-000000000012',
 '60000000-0000-0000-0000-000000000009',
 '20000000-0000-0000-0000-000000000005',
 'CLOSED', 'Engineer L. Naidoo', NOW() - INTERVAL '10 days', TRUE),

('80000000-0000-0000-0000-000000000013',
 'ALT-2024-013',
 'COMMUNICATION', 'WARNING',
 'TC-016 Telemetry Intermittent — Resolved',
 'TC-016 telemetry was intermittent for 4 hours. Communication unit power supply fault identified and rectified. SIMULATED DATA.',
 '30000000-0000-0000-0000-000000000016', NULL, NULL,
 '20000000-0000-0000-0000-000000000007',
 'CLOSED', 'Technician R. Williams', NOW() - INTERVAL '15 days', TRUE),

-- More open alerts
('80000000-0000-0000-0000-000000000014',
 'ALT-2024-014',
 'ASSET', 'WARNING',
 'BRIDGE-009 Asset Condition CRITICAL — Engineering Review Required',
 'BRIDGE-009 Midrand industrial viaduct is rated CRITICAL condition. Last inspection: 3 months ago. Engineering review and condition assessment required. SIMULATED DATA.',
 '30000000-0000-0000-0000-000000000009',
 '50000000-0000-0000-0000-000000000009',
 '60000000-0000-0000-0000-000000000002',
 '20000000-0000-0000-0000-000000000004',
 'OPEN', NULL, NULL, TRUE),

('80000000-0000-0000-0000-000000000015',
 'ALT-2024-015',
 'ASSET', 'WARNING',
 'RETAINING-WALL-030 Asset Condition CRITICAL — Midrand',
 'RETAINING-WALL-030 (Midrand Industrial) rated CRITICAL. Engineering review required. TC-009 nearby. SIMULATED DATA.',
 '30000000-0000-0000-0000-000000000009',
 '50000000-0000-0000-0000-000000000030',
 NULL,
 '20000000-0000-0000-0000-000000000004',
 'OPEN', NULL, NULL, TRUE),

('80000000-0000-0000-0000-000000000016',
 'ALT-2024-016',
 'FBG_SENSOR', 'WARNING',
 'FBG-00016 Coastal Erosion Indicator — EMBANKMENT-026 False Bay',
 'FBG-00016 on EMBANKMENT-026 (False Bay coastal embankment) shows elevated strain of 178 µε vs baseline 110 µε (+61.8%). Trend: INCREASING. Coastal erosion monitoring flag. Geotechnical review recommended. SIMULATED DATA.',
 NULL, '50000000-0000-0000-0000-000000000026',
 '60000000-0000-0000-0000-000000000016',
 '20000000-0000-0000-0000-000000000007',
 'OPEN', NULL, NULL, TRUE),

('80000000-0000-0000-0000-000000000017',
 'ALT-2024-017',
 'TRACK_CIRCUIT', 'WARNING',
 'TC-021 GAU-SEC-04 Section Degraded Status',
 'GAU-SEC-04 overall status is DEGRADED. Multiple assets in WARNING/CRITICAL condition. TC-021 fault adds to section risk. Engineering assessment of full section recommended. SIMULATED DATA.',
 '30000000-0000-0000-0000-000000000021', NULL, NULL,
 '20000000-0000-0000-0000-000000000004',
 'OPEN', NULL, NULL, TRUE),

('80000000-0000-0000-0000-000000000018',
 'ALT-2024-018',
 'MAINTENANCE', 'NORMAL',
 'Scheduled Inspection Due — BRIDGE-001 Germiston',
 'BRIDGE-001 (Germiston Junction overpass) is due for its 6-monthly inspection. Last inspection: 2023-09-15. Asset condition: WARNING. FBG trend: elevated. Schedule inspection at next available opportunity. SIMULATED DATA.',
 NULL, '50000000-0000-0000-0000-000000000005', NULL,
 '20000000-0000-0000-0000-000000000003',
 'OPEN', NULL, NULL, TRUE),

('80000000-0000-0000-0000-000000000019',
 'ALT-2024-019',
 'FBG_SENSOR', 'NORMAL',
 'FBG-00018 Calibration In Progress — STEEL-RAIL-001',
 'FBG-00018 on STEEL-RAIL-001 is currently in calibration mode. Readings suspended. Expected completion: 30 minutes. Normal operation. SIMULATED DATA.',
 NULL, '50000000-0000-0000-0000-000000000001',
 '60000000-0000-0000-0000-000000000018',
 '20000000-0000-0000-0000-000000000001',
 'ACKNOWLEDGED', 'System Auto-Acknowledge', NOW() - INTERVAL '15 minutes', TRUE),

('80000000-0000-0000-0000-000000000020',
 'ALT-2024-020',
 'COMBINED', 'HIGH',
 'TC-009 + BRIDGE-009 + RETAINING-WALL-030 — GAU-SEC-04 Risk Cluster',
 'Multiple concurrent issues detected in GAU-SEC-04: TC-009 shunt failure, BRIDGE-009 CRITICAL condition (FBG-00002 elevated), RETAINING-WALL-030 CRITICAL condition. This cluster of issues in a single section warrants a coordinated engineering review. SIMULATED DATA.',
 '30000000-0000-0000-0000-000000000009',
 '50000000-0000-0000-0000-000000000009',
 '60000000-0000-0000-0000-000000000002',
 '20000000-0000-0000-0000-000000000004',
 'OPEN', NULL, NULL, TRUE);

-- ============================================================
-- INSPECTIONS (15 inspections)
-- ============================================================
INSERT INTO inspections (id, inspection_ref, alert_id, asset_id, track_circuit_id, sensor_id, title, reason, priority, assigned_to, inspector_name, status, scheduled_date, completed_date, location, findings, fault_confirmed, false_alarm, photos_count, recommendation) VALUES
-- PRIMARY DEMO INSPECTION (in progress)
('90000000-0000-0000-0000-000000000001',
 'INS-2024-001',
 '80000000-0000-0000-0000-000000000001',
 '50000000-0000-0000-0000-000000000021',
 '30000000-0000-0000-0000-000000000021',
 '60000000-0000-0000-0000-000000000021',
 'TC-021 Physical Verification — COMPOSITE-SLEEPER-021',
 'TC-021 fault detected. FBG-00021 shows elevated strain. Physical inspection required to determine condition of COMPOSITE-SLEEPER-021 and verify TC-021 communication issue. SIMULATED.',
 'URGENT',
 'Field Inspector J. Mokoena',
 'J. Mokoena',
 'IN_PROGRESS',
 CURRENT_DATE,
 NULL,
 'Pretoria South - Composite Sleeper Zone km 28.4',
 'Preliminary visual: visible cracking observed on 3 sleeper panels in the TC-021 zone. Track geometry appears disturbed. FBG-00021 sensor cable intact. TC-021 bonding joint requires inspection.',
 NULL,
 FALSE,
 2,
 'Detailed crack assessment required. Consider emergency maintenance if cracking is structural. TC-021 bonding joint may require replacement.'),

-- Bridge-009 inspection (completed — found fault)
('90000000-0000-0000-0000-000000000002',
 'INS-2024-002',
 '80000000-0000-0000-0000-000000000005',
 '50000000-0000-0000-0000-000000000009',
 '30000000-0000-0000-0000-000000000009',
 '60000000-0000-0000-0000-000000000002',
 'BRIDGE-009 Structural Assessment — Midrand Viaduct',
 'FBG-00002 critical strain reading on BRIDGE-009. Asset rated CRITICAL. Structural inspection required.',
 'URGENT',
 'Senior Inspector T. Dlamini',
 'T. Dlamini',
 'COMPLETED',
 CURRENT_DATE - INTERVAL '3 days',
 CURRENT_DATE - INTERVAL '2 days',
 'Midrand Industrial Siding - Bridge West',
 'Inspection found significant spalling on west abutment. Two main girder welds showing stress cracks. Bridge rated CRITICAL. Immediate maintenance intervention required.',
 TRUE,
 FALSE,
 8,
 'Emergency structural repair required. Restrict use of bridge section pending repair. Assign structural engineer.'),

-- Germiston Bridge (scheduled)
('90000000-0000-0000-0000-000000000003',
 'INS-2024-003',
 '80000000-0000-0000-0000-000000000009',
 '50000000-0000-0000-0000-000000000005',
 '30000000-0000-0000-0000-000000000005',
 '60000000-0000-0000-0000-000000000001',
 'BRIDGE-001 6-Monthly Inspection — Germiston Junction',
 'Scheduled 6-monthly inspection. Asset in WARNING condition. FBG showing elevated strain.',
 'NORMAL',
 'Inspector K. Pretorius',
 'K. Pretorius',
 'ASSIGNED',
 CURRENT_DATE + INTERVAL '3 days',
 NULL,
 'Germiston Junction - North Span',
 NULL,
 NULL, FALSE, 0, NULL),

-- TC-007 comms inspection
('90000000-0000-0000-0000-000000000004',
 'INS-2024-004',
 '80000000-0000-0000-0000-000000000006',
 '50000000-0000-0000-0000-000000000007',
 '30000000-0000-0000-0000-000000000007',
 NULL,
 'TC-007 Communication Unit Inspection',
 'TC-007 telemetry link offline. Communication unit fault suspected.',
 'HIGH',
 'Technician R. Williams',
 'R. Williams',
 'COMPLETED',
 CURRENT_DATE - INTERVAL '1 day',
 CURRENT_DATE,
 'Springs Approach East - Signal Equipment Room',
 'Communication unit power supply board failed. Board replaced. TC-007 telemetry restored during inspection.',
 TRUE,
 FALSE,
 3,
 'Replace communication unit power supply. Monitor TC-007 for 24 hours after restoration.'),

-- Lakeside retaining wall
('90000000-0000-0000-0000-000000000005',
 'INS-2024-005',
 '80000000-0000-0000-0000-000000000007',
 '50000000-0000-0000-0000-000000000016',
 '30000000-0000-0000-0000-000000000016',
 '60000000-0000-0000-0000-000000000007',
 'RETAINING-WALL-016 Coastal Condition Survey',
 'FBG-00007 elevated strain. Possible coastal erosion or soil movement.',
 'HIGH',
 'Geotechnical Specialist P. Adams',
 'P. Adams',
 'ASSIGNED',
 CURRENT_DATE + INTERVAL '5 days',
 NULL,
 'Lakeside - Coastal Section km 4.2',
 NULL,
 NULL, FALSE, 0, NULL),

-- Completed and closed historical inspections
('90000000-0000-0000-0000-000000000006',
 'INS-2024-006',
 '80000000-0000-0000-0000-000000000011',
 '50000000-0000-0000-0000-000000000014',
 '30000000-0000-0000-0000-000000000014',
 NULL,
 'TC-014 Vegetation Clearance Inspection',
 'Anomalous occupation signal on TC-014. Vegetation suspected.',
 'NORMAL',
 'Inspector M. Botha',
 'M. Botha',
 'COMPLETED',
 CURRENT_DATE - INTERVAL '5 days',
 CURRENT_DATE - INTERVAL '5 days',
 'Rondebosch Station - Platform Zone',
 'Vegetation (bushes) growing onto track in TC-014 zone. Track cleared.',
 TRUE,
 FALSE,
 4,
 'Schedule regular vegetation clearance for TC-014 zone.'),

('90000000-0000-0000-0000-000000000007',
 'INS-2024-007',
 '80000000-0000-0000-0000-000000000012',
 '50000000-0000-0000-0000-000000000012',
 '30000000-0000-0000-0000-000000000012',
 '60000000-0000-0000-0000-000000000009',
 'FBG-00009 Transient Reading Investigation',
 'Single transient high reading on FBG-00009.',
 'LOW',
 'Engineer L. Naidoo',
 'L. Naidoo',
 'COMPLETED',
 CURRENT_DATE - INTERVAL '10 days',
 CURRENT_DATE - INTERVAL '10 days',
 'Cape Town Station - Bay 2',
 'No physical fault found. Transient reading attributed to temperature compensation artefact. Sensor re-calibrated.',
 FALSE,
 TRUE,
 1,
 'Monitor FBG-00009 temperature compensation algorithm. Consider firmware update.'),

-- Additional inspections
('90000000-0000-0000-0000-000000000008',
 'INS-2024-008',
 '80000000-0000-0000-0000-000000000010',
 '50000000-0000-0000-0000-000000000007',
 '30000000-0000-0000-0000-000000000007',
 '60000000-0000-0000-0000-000000000011',
 'EMBANKMENT-001 Springs Condition Assessment',
 'FBG-00011 elevated strain — possible ground movement.',
 'NORMAL',
 'Geotechnical Specialist N. Fourie',
 'N. Fourie',
 'OPEN',
 CURRENT_DATE + INTERVAL '7 days',
 NULL,
 'Springs Approach - East Embankment km 19.8',
 NULL,
 NULL, FALSE, 0, NULL),

('90000000-0000-0000-0000-000000000009',
 'INS-2024-009',
 NULL,
 '50000000-0000-0000-0000-000000000018',
 '30000000-0000-0000-0000-000000000017',
 NULL,
 'BRIDGE-018 Durban Port Periodic Inspection',
 'Periodic structural inspection during planned maintenance outage.',
 'NORMAL',
 'Inspector C. Govender',
 'C. Govender',
 'IN_PROGRESS',
 CURRENT_DATE,
 NULL,
 'Durban Port - Wharf Siding Bridge',
 'Initial inspection in progress. Minor surface corrosion on steel girders noted. No structural concerns yet.',
 NULL, FALSE, 2, NULL),

('90000000-0000-0000-0000-000000000010',
 'INS-2024-010',
 NULL,
 '50000000-0000-0000-0000-000000000030',
 '30000000-0000-0000-0000-000000000009',
 NULL,
 'RETAINING-WALL-030 Midrand Critical Assessment',
 'Asset rated CRITICAL. Urgent inspection required.',
 'URGENT',
 'Senior Inspector T. Dlamini',
 'T. Dlamini',
 'ASSIGNED',
 CURRENT_DATE + INTERVAL '1 day',
 NULL,
 'Midrand Industrial - Retaining Wall East',
 NULL,
 NULL, FALSE, 0, NULL),

('90000000-0000-0000-0000-000000000011',
 'INS-2024-011',
 NULL,
 '50000000-0000-0000-0000-000000000026',
 NULL,
 '60000000-0000-0000-0000-000000000016',
 'EMBANKMENT-026 False Bay Coastal Survey',
 'FBG-00016 increasing trend. Coastal erosion monitoring.',
 'HIGH',
 'Geotechnical Specialist P. Adams',
 'P. Adams',
 'OPEN',
 CURRENT_DATE + INTERVAL '10 days',
 NULL,
 'False Bay Line - Coastal Embankment km 8.9',
 NULL,
 NULL, FALSE, 0, NULL),

-- More completed inspections
('90000000-0000-0000-0000-000000000012',
 'INS-2023-045',
 NULL,
 '50000000-0000-0000-0000-000000000005',
 '30000000-0000-0000-0000-000000000005',
 '60000000-0000-0000-0000-000000000001',
 'BRIDGE-001 Annual Structural Inspection 2023',
 'Annual scheduled structural inspection.',
 'NORMAL',
 'Inspector K. Pretorius',
 'K. Pretorius',
 'COMPLETED',
 '2023-09-15',
 '2023-09-15',
 'Germiston Junction - North Span',
 'General condition WARNING. Minor cracking at expansion joints noted. FBG strain trending upward. 6-monthly re-inspection recommended.',
 TRUE, FALSE, 6,
 'Monitor FBG-00001. Schedule 6-monthly follow-up. Apply joint sealant to expansion cracks.'),

('90000000-0000-0000-0000-000000000013',
 'INS-2023-032',
 NULL,
 '50000000-0000-0000-0000-000000000021',
 '30000000-0000-0000-0000-000000000021',
 '60000000-0000-0000-0000-000000000021',
 'COMPOSITE-SLEEPER-021 Routine Inspection',
 'Routine inspection - 12 monthly.',
 'NORMAL',
 'Inspector J. Mokoena',
 'J. Mokoena',
 'COMPLETED',
 '2023-12-15',
 '2023-12-15',
 'Pretoria South - Composite Sleeper Zone km 28.4',
 'Visual condition fair. Some surface cracking on 2 panels. FBG-00021 baseline trending slightly upward. No immediate action required.',
 FALSE, FALSE, 3,
 'Monitor FBG-00021. Re-inspect in 6 months. Flag if cracking progresses.'),

('90000000-0000-0000-0000-000000000014',
 'INS-2024-014',
 NULL,
 '50000000-0000-0000-0000-000000000002',
 '30000000-0000-0000-0000-000000000002',
 '60000000-0000-0000-0000-000000000004',
 'COMPOSITE-SLEEPER-002 Park Station Inspection',
 'Routine inspection - FBG-00004 shows stable readings.',
 'LOW',
 'Inspector M. Botha',
 'M. Botha',
 'COMPLETED',
 CURRENT_DATE - INTERVAL '20 days',
 CURRENT_DATE - INTERVAL '20 days',
 'Park Station - Platform 2, Mid-section',
 'Condition: FAIR. Some surface wear on sleeper face. FBG readings stable. No immediate action required.',
 FALSE, FALSE, 2,
 'Continue monitoring. Schedule re-inspection in 12 months.'),

('90000000-0000-0000-0000-000000000015',
 'INS-2024-015',
 NULL,
 '50000000-0000-0000-0000-000000000009',
 '30000000-0000-0000-0000-000000000009',
 '60000000-0000-0000-0000-000000000002',
 'BRIDGE-009 Emergency Structural Repair Verification',
 'Post-maintenance verification of structural repair on BRIDGE-009.',
 'URGENT',
 'Senior Engineer T. Dlamini',
 'T. Dlamini',
 'OPEN',
 CURRENT_DATE + INTERVAL '14 days',
 NULL,
 'Midrand Industrial Siding - Bridge West',
 NULL,
 NULL, FALSE, 0, NULL);

-- ============================================================
-- MAINTENANCE TASKS (10 tasks)
-- ============================================================
INSERT INTO maintenance_tasks (id, maintenance_ref, inspection_id, asset_id, alert_id, title, fault_description, cause, work_description, assigned_technician, priority, status, start_time, completion_time) VALUES
-- PRIMARY DEMO: TC-021 / COMPOSITE-SLEEPER-021 (created from inspection, in progress)
('A0000000-0000-0000-0000-000000000001',
 'MNT-2024-001',
 '90000000-0000-0000-0000-000000000001',
 '50000000-0000-0000-0000-000000000021',
 '80000000-0000-0000-0000-000000000001',
 'COMPOSITE-SLEEPER-021 Crack Assessment and Repair + TC-021 Bonding Joint',
 'Visible cracking on 3 composite sleeper panels. TC-021 bonding joint suspected communication failure. FBG-00021 elevated strain.',
 'Physical deterioration of sleeper material combined with bonding joint degradation. Cause under investigation.',
 'Step 1: Full crack survey of COMPOSITE-SLEEPER-021 zone. Step 2: Replace TC-021 bonding joint. Step 3: Repair/replace damaged sleeper panels. Step 4: Verify FBG-00021 baseline post-repair. Step 5: Confirm TC-021 status returns to NORMAL.',
 'Senior Technician A. Nkosi',
 'URGENT',
 'IN_PROGRESS',
 NOW() - INTERVAL '2 hours',
 NULL),

-- Bridge-009 emergency repair (assigned)
('A0000000-0000-0000-0000-000000000002',
 'MNT-2024-002',
 '90000000-0000-0000-0000-000000000002',
 '50000000-0000-0000-0000-000000000009',
 '80000000-0000-0000-0000-000000000005',
 'BRIDGE-009 Emergency Structural Repair — West Abutment',
 'Spalling on west abutment. Two main girder welds with stress cracks. Critical condition.',
 'Material fatigue and age-related deterioration (19-year-old structure). Load stress cracking at welded joints.',
 'Structural repair: spall repair at west abutment, weld repair and reinforcement on main girders. Engineering drawings required. Post-repair FBG monitoring.',
 'Structural Engineer C. van Niekerk + Team',
 'URGENT',
 'ASSIGNED',
 NULL,
 NULL),

-- TC-007 communication unit replacement (completed)
('A0000000-0000-0000-0000-000000000003',
 'MNT-2024-003',
 '90000000-0000-0000-0000-000000000004',
 '50000000-0000-0000-0000-000000000007',
 '80000000-0000-0000-0000-000000000006',
 'TC-007 Communication Unit Power Supply Replacement',
 'Communication unit power supply board failure. TC-007 telemetry offline.',
 'Electronic component failure — power supply board. Age/heat-related.',
 'Replace failed power supply board in TC-007 communication unit. Test telemetry link. Monitor for 24 hours.',
 'Technician R. Williams',
 'HIGH',
 'VERIFICATION_REQUIRED',
 NOW() - INTERVAL '6 hours',
 NOW() - INTERVAL '1 hour'),

-- Vegetation clearance (closed)
('A0000000-0000-0000-0000-000000000004',
 'MNT-2024-004',
 '90000000-0000-0000-0000-000000000006',
 '50000000-0000-0000-0000-000000000014',
 '80000000-0000-0000-0000-000000000011',
 'TC-014 Zone Vegetation Clearance',
 'Vegetation on track in TC-014 zone causing anomalous occupation signal.',
 'Overgrown vegetation from adjacent embankment.',
 'Clear vegetation from TC-014 section. Apply herbicide. Inspect track geometry.',
 'Track Gang Supervisor D. Molefe',
 'NORMAL',
 'CLOSED',
 NOW() - INTERVAL '5 days',
 NOW() - INTERVAL '5 days 1 hour'),

-- Retaining wall-030 repair (open)
('A0000000-0000-0000-0000-000000000005',
 'MNT-2024-005',
 '90000000-0000-0000-0000-000000000010',
 '50000000-0000-0000-0000-000000000030',
 '80000000-0000-0000-0000-000000000015',
 'RETAINING-WALL-030 Structural Repair — Midrand',
 'Retaining wall in CRITICAL condition. Possible structural compromised.',
 'Under investigation — inspection pending.',
 'Pending inspection findings. Likely involves concrete repair and drainage improvement.',
 'Structural Engineer C. van Niekerk',
 'HIGH',
 'OPEN',
 NULL,
 NULL),

-- Germiston Bridge expansion joint (open)
('A0000000-0000-0000-0000-000000000006',
 'MNT-2024-006',
 '90000000-0000-0000-0000-000000000012',
 '50000000-0000-0000-0000-000000000005',
 '80000000-0000-0000-0000-000000000018',
 'BRIDGE-001 Expansion Joint Sealing — Germiston',
 'Minor cracking at expansion joints on BRIDGE-001.',
 'Weathering and thermal cycling causing joint sealant failure.',
 'Apply approved joint sealant to expansion joints. Monitor FBG-00001 post-treatment.',
 'Technician P. Sithole',
 'NORMAL',
 'OPEN',
 NULL,
 NULL),

-- TC-016 comms unit (completed and verified)
('A0000000-0000-0000-0000-000000000007',
 'MNT-2024-007',
 NULL,
 '50000000-0000-0000-0000-000000000016',
 '80000000-0000-0000-0000-000000000013',
 'TC-016 Communication Unit Power Supply Replacement',
 'TC-016 telemetry intermittent — communication unit power supply fault.',
 'Electronic component failure — similar to TC-007.',
 'Replace power supply in TC-016 unit. Test and verify telemetry.',
 'Technician R. Williams',
 'HIGH',
 'VERIFIED',
 NOW() - INTERVAL '15 days 5 hours',
 NOW() - INTERVAL '15 days 3 hours'),

-- FBG-00009 firmware update (closed)
('A0000000-0000-0000-0000-000000000008',
 'MNT-2024-008',
 '90000000-0000-0000-0000-000000000007',
 '50000000-0000-0000-0000-000000000012',
 '80000000-0000-0000-0000-000000000012',
 'FBG-00009 Firmware Update and Re-calibration',
 'FBG-00009 transient reading attributed to temperature compensation artefact.',
 'Software artefact in temperature compensation algorithm.',
 'Update FBG-00009 firmware to latest version. Re-calibrate sensor. Monitor for 48 hours.',
 'FBG Engineer L. Naidoo',
 'LOW',
 'CLOSED',
 NOW() - INTERVAL '10 days 4 hours',
 NOW() - INTERVAL '10 days 2 hours'),

-- Durban Port bridge surface treatment (in progress)
('A0000000-0000-0000-0000-000000000009',
 'MNT-2024-009',
 '90000000-0000-0000-0000-000000000009',
 '50000000-0000-0000-0000-000000000018',
 NULL,
 'BRIDGE-018 Surface Corrosion Treatment — Durban Port',
 'Minor surface corrosion on steel girders noted during planned maintenance inspection.',
 'Marine coastal environment — salt corrosion.',
 'Apply anti-corrosion coating to affected girder surfaces. Clean and prime first.',
 'Maintenance Team Supervisor S. Maharaj',
 'NORMAL',
 'IN_PROGRESS',
 NOW() - INTERVAL '5 hours',
 NULL),

-- Composite-sleeper-002 monitoring (open — low priority)
('A0000000-0000-0000-0000-000000000010',
 'MNT-2024-010',
 '90000000-0000-0000-0000-000000000014',
 '50000000-0000-0000-0000-000000000002',
 NULL,
 'COMPOSITE-SLEEPER-002 Surface Wear Monitoring Programme',
 'Surface wear on sleeper face noted during routine inspection.',
 'Normal operational wear.',
 'Document wear progression. Schedule re-inspection in 12 months. No immediate repair required.',
 'Inspector M. Botha',
 'LOW',
 'OPEN',
 NULL,
 NULL);

-- ============================================================
-- MAINTENANCE VERIFICATIONS
-- ============================================================
INSERT INTO maintenance_verifications (id, maintenance_task_id, verified_by, verification_date, result, notes, post_strain_reading, tc_status_confirmed) VALUES
-- TC-016 verified
('B0000000-0000-0000-0000-000000000001',
 'A0000000-0000-0000-0000-000000000007',
 'Control Room Supervisor V. Jacobs',
 NOW() - INTERVAL '14 days',
 'PASSED',
 'TC-016 telemetry confirmed stable for 24 hours post-repair. Communication unit operating normally.',
 NULL,
 'NORMAL'),

-- FBG-00009 firmware verified
('B0000000-0000-0000-0000-000000000002',
 'A0000000-0000-0000-0000-000000000008',
 'FBG Engineer L. Naidoo',
 NOW() - INTERVAL '8 days',
 'PASSED',
 'FBG-00009 post-firmware update showing stable readings. No further transient anomalies. Temperature compensation working correctly.',
 239.00,
 NULL),

-- Vegetation clearance verified
('B0000000-0000-0000-0000-000000000003',
 'A0000000-0000-0000-0000-000000000004',
 'Inspector M. Botha',
 NOW() - INTERVAL '5 days',
 'PASSED',
 'TC-014 zone clear of vegetation. Track geometry confirmed normal. TC-014 returning normal occupation readings.',
 NULL,
 'NORMAL');
