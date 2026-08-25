-- ============================================================
-- REGEN — Seed data (run AFTER schema migration)
-- ============================================================

-- ── Users ────────────────────────────────────────────────────
insert into users (id, name, role, email) values
  ('USR-001', 'J. van der Berg', 'maintenance_engineer', 'j.vanderberg@regen.rail'),
  ('USR-002', 'S. Mahlangu',     'operations_manager',  's.mahlangu@regen.rail'),
  ('USR-003', 'A. Patel',        'administrator',       'a.patel@regen.rail')
on conflict (id) do update set name=excluded.name, role=excluded.role, email=excluded.email;

-- ── Assets ───────────────────────────────────────────────────
insert into assets (id, name, type, location, line_id, severity, last_inspection, install_date, description, map_x, map_y) values
  ('B12', 'Track B12',          'track',   'Centurion–Midrand Section, km 4.2',  'north-south', 'critical', '2024-03-15', '2018-06-01', 'High-speed mainline track section between Centurion and Midrand stations.', 140, 198),
  ('A3',  'Track A3',           'track',   'Pretoria–Centurion Section, km 2.8', 'north-south', 'warning',  '2024-04-01', '2018-06-01', 'Track section approaching Centurion from Pretoria.',                        140, 105),
  ('C7',  'Switch C7',          'switch',  'Midrand Junction',                   'north-south', 'healthy',  '2024-04-20', '2019-03-01', 'Point switch assembly at Midrand junction.',                                140, 245),
  ('S04', 'Bridge S04',         'bridge',  'Jukskei River Crossing',             'north-south', 'warning',  '2024-01-10', '2017-11-15', 'Steel-girder rail bridge over Jukskei River.',                             140, 290),
  ('D8',  'Sleeper Section D8', 'sleeper', 'Marlboro–Sandton Section, km 1.9',   'north-south', 'healthy',  '2024-05-01', '2020-08-12', 'Composite sleeper panel installation.',                                    140, 388),
  ('E2',  'Track E2',           'track',   'Sandton–Rosebank Section',           'east-west',   'healthy',  '2024-04-15', '2018-06-01', null, 210, 435),
  ('F5',  'Track F5',           'track',   'Rosebank–Park Section',              'east-west',   'info',     '2024-03-28', '2018-06-01', null, 350, 435),
  ('G9',  'Switch G9',          'switch',  'Park Station Junction',              'east-west',   'healthy',  '2024-05-05', '2019-09-01', null, 420, 435),
  ('H1',  'Track H1',           'track',   'Park–Rhodesfield Section',           'east-west',   'healthy',  '2024-04-22', '2018-06-01', null, 490, 435),
  ('J3',  'Bridge J3',          'bridge',  'N3 Highway Crossing',                'east-west',   'info',     '2024-02-15', '2017-09-01', null, 630, 435),
  ('K2',  'Track K2',           'track',   'Hatfield–Park Loop Section',         'loop',        'healthy',  '2024-04-30', '2018-06-01', null, 420, 245),
  ('L7',  'Switch L7',          'switch',  'Marlboro Interchange',               'north-south', 'healthy',  '2024-05-10', '2020-01-15', null, 200, 340),
  ('M4',  'Track M4',           'track',   'OR Tambo Approach',                  'east-west',   'healthy',  '2024-04-08', '2018-06-01', null, 700, 390),
  ('N6',  'Sleeper Section N6', 'sleeper', 'Centurion Station Zone',             'north-south', 'healthy',  '2024-05-02', '2021-03-20', null, 195, 150),
  ('P1',  'Bridge P1',          'bridge',  'Pretoria Approach Viaduct',          'north-south', 'info',     '2024-01-25', '2017-08-01', null, 195, 60),
  ('Q5',  'Track Q5',           'track',   'Rhodesfield–OR Tambo',               'east-west',   'healthy',  '2024-04-18', '2018-06-01', null, 630, 480),
  ('R3',  'Switch R3',          'switch',  'Sandton North Junction',             'north-south', 'healthy',  '2024-05-08', '2019-07-01', null, 195, 435),
  ('T8',  'Track T8',           'track',   'Midrand–Marlboro Section',           'north-south', 'healthy',  '2024-04-25', '2018-06-01', null, 195, 292),
  ('U2',  'Sleeper Section U2', 'sleeper', 'Park Station Zone',                  'east-west',   'healthy',  '2024-05-05', '2020-11-10', null, 420, 480),
  ('V9',  'Track V9',           'track',   'Rosebank–Sandton Approach',          'east-west',   'healthy',  '2024-04-12', '2018-06-01', null, 210, 480)
on conflict (id) do update set severity=excluded.severity, last_inspection=excluded.last_inspection;

-- ── Sensors ──────────────────────────────────────────────────
insert into sensors (id, asset_id, name, type, unit, status, severity, current_value, normal_min, normal_max, warning_max, critical_max, last_update, map_x, map_y) values
  ('NFC_B12_001', 'B12', 'B12 Vibration Primary', 'vibration',   'g',    'online',  'critical', 1.24, 0, 0.80, 1.00, 1.00, now() - interval '2 minutes',  110, 192),
  ('TMP_B12_001', 'B12', 'B12 Temperature',       'temperature', '°C',   'online',  'warning',  36,   0, 30,   35,   45,   now() - interval '2 minutes',  155, 205),
  ('STR_B12_001', 'B12', 'B12 Strain Gauge',      'strain',      'µε',   'online',  'healthy',  142,  0, 250,  300,  400,  now() - interval '2 minutes',  128, 210),
  ('NFC_A3_001',  'A3',  'A3 Vibration',          'vibration',   'g',    'online',  'warning',  0.87, 0, 0.80, 1.00, 1.00, now() - interval '5 minutes',  110, 99),
  ('TMP_A3_001',  'A3',  'A3 Temperature',        'temperature', '°C',   'online',  'healthy',  28,   0, 30,   35,   45,   now() - interval '5 minutes',  155, 112),
  ('STR_C7_001',  'C7',  'C7 Strain',             'strain',      'µε',   'online',  'healthy',  98,   0, 250,  300,  400,  now() - interval '3 minutes',  110, 240),
  ('NFC_C7_001',  'C7',  'C7 Vibration',          'vibration',   'g',    'online',  'healthy',  0.42, 0, 0.80, 1.00, 1.00, now() - interval '3 minutes',  155, 252),
  ('STR_S04_001', 'S04', 'S04 Bridge Strain',     'strain',      'µε',   'online',  'warning',  285,  0, 250,  300,  400,  now() - interval '8 minutes',  110, 285),
  ('SES_S04_001', 'S04', 'S04 Seismic',           'seismic',     'mm/s', 'online',  'healthy',  0.8,  0, 5,    8,    15,   now() - interval '8 minutes',  155, 298),
  ('STR_D8_001',  'D8',  'D8 Sleeper Strain',     'strain',      'µε',   'online',  'healthy',  62,   0, 250,  300,  400,  now() - interval '4 minutes',  110, 383),
  ('NFC_F5_001',  'F5',  'F5 Vibration',          'vibration',   'g',    'online',  'info',     0.76, 0, 0.80, 1.00, 1.00, now() - interval '6 minutes',  345, 410),
  ('TMP_F5_001',  'F5',  'F5 Temperature',        'temperature', '°C',   'online',  'healthy',  24,   0, 30,   35,   45,   now() - interval '6 minutes',  365, 455),
  ('STR_J3_001',  'J3',  'J3 Bridge Strain',      'strain',      'µε',   'online',  'info',     195,  0, 250,  300,  400,  now() - interval '12 minutes', 625, 410),
  ('NFC_E2_001',  'E2',  'E2 Vibration',          'vibration',   'g',    'online',  'healthy',  0.38, 0, 0.80, 1.00, 1.00, now() - interval '3 minutes',  205, 410),
  ('NFC_P1_001',  'P1',  'P1 Bridge Vibration',   'vibration',   'g',    'online',  'info',     0.64, 0, 0.80, 1.00, 1.00, now() - interval '15 minutes', 190, 38),
  ('SES_K2_001',  'K2',  'K2 Seismic',            'seismic',     'mm/s', 'offline', 'offline',  0,    0, 5,    8,    15,   now() - interval '42 minutes', 415, 222)
on conflict (id) do update set current_value=excluded.current_value, severity=excluded.severity, status=excluded.status, last_update=excluded.last_update;

-- ── Alerts ───────────────────────────────────────────────────
insert into alerts (id, asset_id, sensor_id, title, description, severity, status, created_at) values
  ('ALT-001', 'B12', 'NFC_B12_001', 'B12 — High vibration detected',      'Vibration sensor NFC_B12_001 exceeded critical threshold (1.00g). Current reading: 1.24g. Immediate inspection required.', 'critical', 'active',       now() - interval '2 minutes'),
  ('ALT-002', 'A3',  'NFC_A3_001',  'A3 — Anomaly detected',              'Vibration on Track A3 has entered warning range (0.87g). Trend is increasing. Monitor closely.',                          'warning',  'active',       now() - interval '15 minutes'),
  ('ALT-003', 'S04', 'STR_S04_001', 'S04 — Bridge strain elevated',       'Strain gauge on Bridge S04 reading 285µε. Warning threshold is 300µε. Schedule inspection.',                            'warning',  'acknowledged', now() - interval '48 minutes'),
  ('ALT-004', 'F5',  'NFC_F5_001',  'F5 — Vibration approaching warning', 'Vibration on Track F5 at 0.76g, approaching warning threshold of 0.80g.',                                                'info',     'active',       now() - interval '35 minutes'),
  ('ALT-005', 'K2',  null,          'K2 — Seismic sensor offline',        'Sensor SES_K2_001 has been offline for 42 minutes. Last reading was 0.8mm/s.',                                           'info',     'active',       now() - interval '42 minutes')
on conflict (id) do nothing;

update alerts set acknowledged_at = now() - interval '30 minutes', acknowledged_by = 'M. Engineer'
  where id = 'ALT-003';

-- ── Predictions ──────────────────────────────────────────────
insert into predictions (id, asset_id, sensor_id, risk_level, issue, rul_days, failure_probability, recommended_action, generated_at) values
  ('PRD-001', 'B12', 'NFC_B12_001', 'high',   'Track degradation — progressive rail fatigue',       18,  78, 'Immediate inspection of Track B12. Verify rail fastening and ballast condition. Schedule repair within 72 hours.', now() - interval '2 minutes'),
  ('PRD-002', 'A3',  'NFC_A3_001',  'medium', 'Elevated vibration — possible ballast deterioration', 45,  42, 'Schedule planned inspection of Track A3 within 2 weeks. Check ballast profile.',                                  now() - interval '20 minutes'),
  ('PRD-003', 'S04', 'STR_S04_001', 'medium', 'Bridge structural strain — load concentration',       90,  28, 'Perform visual bridge inspection within 30 days. Review load distribution.',                                       now() - interval '50 minutes'),
  ('PRD-004', 'F5',  'NFC_F5_001',  'low',    'Minor vibration increase — rail joint wear',          120, 15, 'Include in next scheduled maintenance round. Inspect rail joints.',                                               now() - interval '40 minutes'),
  ('PRD-005', 'P1',  null,          'low',    'Viaduct — minor vibration pattern',                   180, 8,  'Continue monitoring. Include in semi-annual inspection.',                                                         now() - interval '60 minutes')
on conflict (id) do nothing;

-- ── Work Orders ──────────────────────────────────────────────
insert into work_orders (id, asset_id, alert_id, prediction_id, title, description, priority, status, assigned_team, assigned_to, created_at, updated_at, notes) values
  ('WO-1042', 'B12', 'ALT-001', 'PRD-001', 'Inspect and repair Track B12 — high vibration',  'Critical vibration reading on NFC_B12_001 (1.24g). Inspect rail fasteners, ballast condition, and rail profile on Track B12 (km 4.2, Centurion–Midrand).', 'critical', 'open',        'Maintenance Team Alpha', 'J. van der Berg', now() - interval '5 minutes',   now() - interval '5 minutes',   null),
  ('WO-1041', 'A3',  'ALT-002', null,       'Investigate Track A3 vibration anomaly',         'Warning vibration reading (0.87g) on Track A3. Inspect ballast profile and rail joints.',                                                                    'high',     'in_progress', 'Maintenance Team Beta',  'P. Nkosi',        now() - interval '2 hours',     now() - interval '30 minutes',  'Team on-site. Initial inspection shows minor ballast degradation on km 2.8.'),
  ('WO-1040', 'S04', 'ALT-003', null,       'Bridge S04 — structural inspection',             'Elevated strain reading on Bridge S04 (285µε). Perform visual and NDT inspection.',                                                                          'medium',   'open',        'Bridge Inspection Unit', null,              now() - interval '24 hours',    now() - interval '24 hours',    null),
  ('WO-1039', 'D8',  null,      null,       'Sleeper D8 — quarterly inspection',              'Routine quarterly inspection of Sleeper Section D8. Check fastener torque and composite integrity.',                                                          'low',      'resolved',    'Maintenance Team Gamma', 'T. Dlamini',      now() - interval '5 days',      now() - interval '3 days',      'Inspection complete. All fasteners within spec. No defects found.'),
  ('WO-1038', 'C7',  null,      null,       'Switch C7 — lubrication and calibration',        'Scheduled maintenance: lubricate switch points and calibrate detection system.',                                                                              'medium',   'resolved',    'Maintenance Team Alpha', 'J. van der Berg', now() - interval '7 days',      now() - interval '6 days',      null)
on conflict (id) do nothing;

update work_orders set resolved_at = now() - interval '3 days' where id = 'WO-1039';
update work_orders set resolved_at = now() - interval '6 days' where id = 'WO-1038';

-- ── Maintenance Records ──────────────────────────────────────
insert into maintenance_records (id, asset_id, work_order_id, type, description, performed_by, performed_at, outcome) values
  ('MR-001', 'B12', 'WO-1039', 'Inspection',  'Routine vibration check and rail fastener inspection.',        'J. van der Berg',        now() - interval '30 days',  'completed'),
  ('MR-002', 'B12', null,      'Repair',      'Replaced 3 worn rail fasteners. Topped up ballast on km 4.2.','J. van der Berg',        now() - interval '60 days',  'completed'),
  ('MR-003', 'A3',  null,      'Inspection',  'Ballast profile survey and rail joint inspection.',            'P. Nkosi',               now() - interval '45 days',  'completed'),
  ('MR-004', 'S04', null,      'Inspection',  'Annual bridge structural inspection. NDT on main girders.',   'Bridge Inspection Unit', now() - interval '90 days',  'completed'),
  ('MR-005', 'D8',  null,      'Inspection',  'Quarterly sleeper check. All fasteners within torque spec.',  'T. Dlamini',             now() - interval '3 days',   'completed'),
  ('MR-006', 'C7',  null,      'Maintenance', 'Lubricated switch points. Recalibrated detection.',           'J. van der Berg',        now() - interval '6 days',   'completed'),
  ('MR-007', 'B12', null,      'Monitoring',  'Vibration trend review. Values within normal range at time of check.', 'J. van der Berg', now() - interval '90 days', 'completed'),
  ('MR-008', 'J3',  null,      'Inspection',  'N3 bridge visual inspection. Minor surface corrosion noted.', 'Bridge Inspection Unit', now() - interval '120 days', 'partial'),
  ('MR-009', 'A3',  null,      'Repair',      'Rail joint grinding on km 2.8.',                              'P. Nkosi',               now() - interval '100 days', 'completed'),
  ('MR-010', 'C7',  null,      'Inspection',  'Annual switch inspection. All components serviceable.',       'J. van der Berg',        now() - interval '180 days', 'completed')
on conflict (id) do nothing;
