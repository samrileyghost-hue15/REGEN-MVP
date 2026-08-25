/**
 * In-memory data store — single source of truth for the Express API.
 * All data matches the frontend mock data exactly.
 */

// ── Users ──────────────────────────────────────────────────────────────────
const users = [
  { id: 'USR-001', name: 'J. van der Berg', role: 'maintenance_engineer', email: 'j.vanderberg@regen.rail' },
  { id: 'USR-002', name: 'S. Mahlangu',     role: 'operations_manager',  email: 's.mahlangu@regen.rail'   },
  { id: 'USR-003', name: 'A. Patel',        role: 'administrator',       email: 'a.patel@regen.rail'      },
];

// ── Assets ─────────────────────────────────────────────────────────────────
const assets = [
  { id: 'B12', name: 'Track B12',          type: 'track',   location: 'Centurion–Midrand Section, km 4.2',  lineId: 'north-south', severity: 'critical', lastInspection: '2024-03-15', installDate: '2018-06-01', description: 'High-speed mainline track section between Centurion and Midrand stations.', mapX: 140, mapY: 198 },
  { id: 'A3',  name: 'Track A3',           type: 'track',   location: 'Pretoria–Centurion Section, km 2.8', lineId: 'north-south', severity: 'warning',  lastInspection: '2024-04-01', installDate: '2018-06-01', mapX: 140, mapY: 105 },
  { id: 'C7',  name: 'Switch C7',          type: 'switch',  location: 'Midrand Junction',                   lineId: 'north-south', severity: 'healthy',  lastInspection: '2024-04-20', installDate: '2019-03-01', mapX: 140, mapY: 245 },
  { id: 'S04', name: 'Bridge S04',         type: 'bridge',  location: 'Jukskei River Crossing',             lineId: 'north-south', severity: 'warning',  lastInspection: '2024-01-10', installDate: '2017-11-15', mapX: 140, mapY: 290 },
  { id: 'D8',  name: 'Sleeper Section D8', type: 'sleeper', location: 'Marlboro–Sandton Section, km 1.9',   lineId: 'north-south', severity: 'healthy',  lastInspection: '2024-05-01', installDate: '2020-08-12', mapX: 140, mapY: 388 },
  { id: 'E2',  name: 'Track E2',           type: 'track',   location: 'Sandton–Rosebank Section',           lineId: 'east-west',   severity: 'healthy',  lastInspection: '2024-04-15', installDate: '2018-06-01', mapX: 210, mapY: 435 },
  { id: 'F5',  name: 'Track F5',           type: 'track',   location: 'Rosebank–Park Section',              lineId: 'east-west',   severity: 'info',     lastInspection: '2024-03-28', installDate: '2018-06-01', mapX: 350, mapY: 435 },
  { id: 'G9',  name: 'Switch G9',          type: 'switch',  location: 'Park Station Junction',              lineId: 'east-west',   severity: 'healthy',  lastInspection: '2024-05-05', installDate: '2019-09-01', mapX: 420, mapY: 435 },
  { id: 'H1',  name: 'Track H1',           type: 'track',   location: 'Park–Rhodesfield Section',           lineId: 'east-west',   severity: 'healthy',  lastInspection: '2024-04-22', installDate: '2018-06-01', mapX: 490, mapY: 435 },
  { id: 'J3',  name: 'Bridge J3',          type: 'bridge',  location: 'N3 Highway Crossing',                lineId: 'east-west',   severity: 'info',     lastInspection: '2024-02-15', installDate: '2017-09-01', mapX: 630, mapY: 435 },
  { id: 'K2',  name: 'Track K2',           type: 'track',   location: 'Hatfield–Park Loop Section',         lineId: 'loop',        severity: 'healthy',  lastInspection: '2024-04-30', installDate: '2018-06-01', mapX: 420, mapY: 245 },
  { id: 'L7',  name: 'Switch L7',          type: 'switch',  location: 'Marlboro Interchange',               lineId: 'north-south', severity: 'healthy',  lastInspection: '2024-05-10', installDate: '2020-01-15', mapX: 200, mapY: 340 },
  { id: 'M4',  name: 'Track M4',           type: 'track',   location: 'OR Tambo Approach',                  lineId: 'east-west',   severity: 'healthy',  lastInspection: '2024-04-08', installDate: '2018-06-01', mapX: 700, mapY: 390 },
  { id: 'N6',  name: 'Sleeper Section N6', type: 'sleeper', location: 'Centurion Station Zone',             lineId: 'north-south', severity: 'healthy',  lastInspection: '2024-05-02', installDate: '2021-03-20', mapX: 195, mapY: 150 },
  { id: 'P1',  name: 'Bridge P1',          type: 'bridge',  location: 'Pretoria Approach Viaduct',          lineId: 'north-south', severity: 'info',     lastInspection: '2024-01-25', installDate: '2017-08-01', mapX: 195, mapY: 60  },
  { id: 'Q5',  name: 'Track Q5',           type: 'track',   location: 'Rhodesfield–OR Tambo',               lineId: 'east-west',   severity: 'healthy',  lastInspection: '2024-04-18', installDate: '2018-06-01', mapX: 630, mapY: 480 },
  { id: 'R3',  name: 'Switch R3',          type: 'switch',  location: 'Sandton North Junction',             lineId: 'north-south', severity: 'healthy',  lastInspection: '2024-05-08', installDate: '2019-07-01', mapX: 195, mapY: 435 },
  { id: 'T8',  name: 'Track T8',           type: 'track',   location: 'Midrand–Marlboro Section',           lineId: 'north-south', severity: 'healthy',  lastInspection: '2024-04-25', installDate: '2018-06-01', mapX: 195, mapY: 292 },
  { id: 'U2',  name: 'Sleeper Section U2', type: 'sleeper', location: 'Park Station Zone',                  lineId: 'east-west',   severity: 'healthy',  lastInspection: '2024-05-05', installDate: '2020-11-10', mapX: 420, mapY: 480 },
  { id: 'V9',  name: 'Track V9',           type: 'track',   location: 'Rosebank–Sandton Approach',          lineId: 'east-west',   severity: 'healthy',  lastInspection: '2024-04-12', installDate: '2018-06-01', mapX: 210, mapY: 480 },
];

// ── Sensors ────────────────────────────────────────────────────────────────
const sensors = [
  { id: 'NFC_B12_001', assetId: 'B12', name: 'B12 Vibration Primary', type: 'vibration',   unit: 'g',    status: 'online',  severity: 'critical', currentValue: 1.24, normalMin: 0, normalMax: 0.80, warningMax: 1.00, criticalMax: 1.00, lastUpdate: new Date(Date.now() - 2*60000).toISOString(),  mapX: 110, mapY: 192 },
  { id: 'TMP_B12_001', assetId: 'B12', name: 'B12 Temperature',       type: 'temperature', unit: '°C',   status: 'online',  severity: 'warning',  currentValue: 36,   normalMin: 0, normalMax: 30,   warningMax: 35,   criticalMax: 45,   lastUpdate: new Date(Date.now() - 2*60000).toISOString(),  mapX: 155, mapY: 205 },
  { id: 'STR_B12_001', assetId: 'B12', name: 'B12 Strain Gauge',      type: 'strain',      unit: 'µε',   status: 'online',  severity: 'healthy',  currentValue: 142,  normalMin: 0, normalMax: 250,  warningMax: 300,  criticalMax: 400,  lastUpdate: new Date(Date.now() - 2*60000).toISOString(),  mapX: 128, mapY: 210 },
  { id: 'NFC_A3_001',  assetId: 'A3',  name: 'A3 Vibration',          type: 'vibration',   unit: 'g',    status: 'online',  severity: 'warning',  currentValue: 0.87, normalMin: 0, normalMax: 0.80, warningMax: 1.00, criticalMax: 1.00, lastUpdate: new Date(Date.now() - 5*60000).toISOString(),  mapX: 110, mapY: 99  },
  { id: 'TMP_A3_001',  assetId: 'A3',  name: 'A3 Temperature',        type: 'temperature', unit: '°C',   status: 'online',  severity: 'healthy',  currentValue: 28,   normalMin: 0, normalMax: 30,   warningMax: 35,   criticalMax: 45,   lastUpdate: new Date(Date.now() - 5*60000).toISOString(),  mapX: 155, mapY: 112 },
  { id: 'STR_C7_001',  assetId: 'C7',  name: 'C7 Strain',             type: 'strain',      unit: 'µε',   status: 'online',  severity: 'healthy',  currentValue: 98,   normalMin: 0, normalMax: 250,  warningMax: 300,  criticalMax: 400,  lastUpdate: new Date(Date.now() - 3*60000).toISOString(),  mapX: 110, mapY: 240 },
  { id: 'NFC_C7_001',  assetId: 'C7',  name: 'C7 Vibration',          type: 'vibration',   unit: 'g',    status: 'online',  severity: 'healthy',  currentValue: 0.42, normalMin: 0, normalMax: 0.80, warningMax: 1.00, criticalMax: 1.00, lastUpdate: new Date(Date.now() - 3*60000).toISOString(),  mapX: 155, mapY: 252 },
  { id: 'STR_S04_001', assetId: 'S04', name: 'S04 Bridge Strain',     type: 'strain',      unit: 'µε',   status: 'online',  severity: 'warning',  currentValue: 285,  normalMin: 0, normalMax: 250,  warningMax: 300,  criticalMax: 400,  lastUpdate: new Date(Date.now() - 8*60000).toISOString(),  mapX: 110, mapY: 285 },
  { id: 'SES_S04_001', assetId: 'S04', name: 'S04 Seismic',           type: 'seismic',     unit: 'mm/s', status: 'online',  severity: 'healthy',  currentValue: 0.8,  normalMin: 0, normalMax: 5,    warningMax: 8,    criticalMax: 15,   lastUpdate: new Date(Date.now() - 8*60000).toISOString(),  mapX: 155, mapY: 298 },
  { id: 'STR_D8_001',  assetId: 'D8',  name: 'D8 Sleeper Strain',     type: 'strain',      unit: 'µε',   status: 'online',  severity: 'healthy',  currentValue: 62,   normalMin: 0, normalMax: 250,  warningMax: 300,  criticalMax: 400,  lastUpdate: new Date(Date.now() - 4*60000).toISOString(),  mapX: 110, mapY: 383 },
  { id: 'NFC_F5_001',  assetId: 'F5',  name: 'F5 Vibration',          type: 'vibration',   unit: 'g',    status: 'online',  severity: 'info',     currentValue: 0.76, normalMin: 0, normalMax: 0.80, warningMax: 1.00, criticalMax: 1.00, lastUpdate: new Date(Date.now() - 6*60000).toISOString(),  mapX: 345, mapY: 410 },
  { id: 'TMP_F5_001',  assetId: 'F5',  name: 'F5 Temperature',        type: 'temperature', unit: '°C',   status: 'online',  severity: 'healthy',  currentValue: 24,   normalMin: 0, normalMax: 30,   warningMax: 35,   criticalMax: 45,   lastUpdate: new Date(Date.now() - 6*60000).toISOString(),  mapX: 365, mapY: 455 },
  { id: 'STR_J3_001',  assetId: 'J3',  name: 'J3 Bridge Strain',      type: 'strain',      unit: 'µε',   status: 'online',  severity: 'info',     currentValue: 195,  normalMin: 0, normalMax: 250,  warningMax: 300,  criticalMax: 400,  lastUpdate: new Date(Date.now() - 12*60000).toISOString(), mapX: 625, mapY: 410 },
  { id: 'NFC_E2_001',  assetId: 'E2',  name: 'E2 Vibration',          type: 'vibration',   unit: 'g',    status: 'online',  severity: 'healthy',  currentValue: 0.38, normalMin: 0, normalMax: 0.80, warningMax: 1.00, criticalMax: 1.00, lastUpdate: new Date(Date.now() - 3*60000).toISOString(),  mapX: 205, mapY: 410 },
  { id: 'NFC_P1_001',  assetId: 'P1',  name: 'P1 Bridge Vibration',   type: 'vibration',   unit: 'g',    status: 'online',  severity: 'info',     currentValue: 0.64, normalMin: 0, normalMax: 0.80, warningMax: 1.00, criticalMax: 1.00, lastUpdate: new Date(Date.now() - 15*60000).toISOString(), mapX: 190, mapY: 38  },
  { id: 'SES_K2_001',  assetId: 'K2',  name: 'K2 Seismic',            type: 'seismic',     unit: 'mm/s', status: 'offline', severity: 'offline',  currentValue: 0,    normalMin: 0, normalMax: 5,    warningMax: 8,    criticalMax: 15,   lastUpdate: new Date(Date.now() - 42*60000).toISOString(), mapX: 415, mapY: 222 },
];

// ── Alerts ─────────────────────────────────────────────────────────────────
const alerts = [
  { id: 'ALT-001', assetId: 'B12', sensorId: 'NFC_B12_001', title: 'B12 — High vibration detected',       description: 'Vibration sensor NFC_B12_001 exceeded critical threshold (1.00g). Current reading: 1.24g. Immediate inspection required.', severity: 'critical', status: 'active',       createdAt: new Date(Date.now() - 2*60000).toISOString()  },
  { id: 'ALT-002', assetId: 'A3',  sensorId: 'NFC_A3_001',  title: 'A3 — Anomaly detected',               description: 'Vibration on Track A3 has entered warning range (0.87g). Trend is increasing. Monitor closely.',                          severity: 'warning',  status: 'active',       createdAt: new Date(Date.now() - 15*60000).toISOString() },
  { id: 'ALT-003', assetId: 'S04', sensorId: 'STR_S04_001', title: 'S04 — Bridge strain elevated',        description: 'Strain gauge on Bridge S04 reading 285µε. Warning threshold is 300µε. Schedule inspection.',                            severity: 'warning',  status: 'acknowledged', createdAt: new Date(Date.now() - 48*60000).toISOString(), acknowledgedAt: new Date(Date.now() - 30*60000).toISOString(), acknowledgedBy: 'M. Engineer' },
  { id: 'ALT-004', assetId: 'F5',  sensorId: 'NFC_F5_001',  title: 'F5 — Vibration approaching warning',  description: 'Vibration on Track F5 at 0.76g, approaching warning threshold of 0.80g.',                                                  severity: 'info',     status: 'active',       createdAt: new Date(Date.now() - 35*60000).toISOString() },
  { id: 'ALT-005', assetId: 'K2',                            title: 'K2 — Seismic sensor offline',         description: 'Sensor SES_K2_001 has been offline for 42 minutes. Last reading was 0.8mm/s.',                                           severity: 'info',     status: 'active',       createdAt: new Date(Date.now() - 42*60000).toISOString() },
];

// ── Work Orders ────────────────────────────────────────────────────────────
const workOrders = [
  { id: 'WO-1042', assetId: 'B12', alertId: 'ALT-001', predictionId: 'PRD-001', title: 'Inspect and repair Track B12 — high vibration',     description: 'Critical vibration reading on NFC_B12_001 (1.24g). Inspect rail fasteners, ballast condition, and rail profile on Track B12 (km 4.2, Centurion–Midrand).', priority: 'critical', status: 'open',        assignedTeam: 'Maintenance Team Alpha', assignedTo: 'J. van der Berg', createdAt: new Date(Date.now() - 5*60000).toISOString(),         updatedAt: new Date(Date.now() - 5*60000).toISOString() },
  { id: 'WO-1041', assetId: 'A3',  alertId: 'ALT-002',                          title: 'Investigate Track A3 vibration anomaly',             description: 'Warning vibration reading (0.87g) on Track A3. Inspect ballast profile and rail joints.',                                                                    priority: 'high',     status: 'in_progress', assignedTeam: 'Maintenance Team Beta',  assignedTo: 'P. Nkosi',        createdAt: new Date(Date.now() - 2*3600000).toISOString(),       updatedAt: new Date(Date.now() - 30*60000).toISOString(), notes: 'Team on-site. Initial inspection shows minor ballast degradation on km 2.8.' },
  { id: 'WO-1040', assetId: 'S04', alertId: 'ALT-003',                          title: 'Bridge S04 — structural inspection',                 description: 'Elevated strain reading on Bridge S04 (285µε). Perform visual and NDT inspection.',                                                                          priority: 'medium',   status: 'open',        assignedTeam: 'Bridge Inspection Unit',                            createdAt: new Date(Date.now() - 24*3600000).toISOString(),      updatedAt: new Date(Date.now() - 24*3600000).toISOString() },
  { id: 'WO-1039', assetId: 'D8',                                                title: 'Sleeper D8 — quarterly inspection',                  description: 'Routine quarterly inspection of Sleeper Section D8. Check fastener torque and composite integrity.',                                                         priority: 'low',      status: 'resolved',    assignedTeam: 'Maintenance Team Gamma', assignedTo: 'T. Dlamini',      createdAt: new Date(Date.now() - 5*24*3600000).toISOString(),   updatedAt: new Date(Date.now() - 3*24*3600000).toISOString(), resolvedAt: new Date(Date.now() - 3*24*3600000).toISOString(), notes: 'Inspection complete. All fasteners within spec. No defects found.' },
  { id: 'WO-1038', assetId: 'C7',                                                title: 'Switch C7 — lubrication and calibration',            description: 'Scheduled maintenance: lubricate switch points and calibrate detection system.',                                                                            priority: 'medium',   status: 'resolved',    assignedTeam: 'Maintenance Team Alpha', assignedTo: 'J. van der Berg', createdAt: new Date(Date.now() - 7*24*3600000).toISOString(),   updatedAt: new Date(Date.now() - 6*24*3600000).toISOString(), resolvedAt: new Date(Date.now() - 6*24*3600000).toISOString() },
];

// ── Predictions ────────────────────────────────────────────────────────────
const predictions = [
  { id: 'PRD-001', assetId: 'B12', sensorId: 'NFC_B12_001', riskLevel: 'high',   issue: 'Track degradation — progressive rail fatigue',          rulDays: 18,  failureProbability: 78, recommendedAction: 'Immediate inspection of Track B12. Verify rail fastening and ballast condition. Schedule repair within 72 hours.', generatedAt: new Date(Date.now() - 2*60000).toISOString()  },
  { id: 'PRD-002', assetId: 'A3',  sensorId: 'NFC_A3_001',  riskLevel: 'medium', issue: 'Elevated vibration — possible ballast deterioration',    rulDays: 45,  failureProbability: 42, recommendedAction: 'Schedule planned inspection of Track A3 within 2 weeks. Check ballast profile.',                                  generatedAt: new Date(Date.now() - 20*60000).toISOString() },
  { id: 'PRD-003', assetId: 'S04', sensorId: 'STR_S04_001', riskLevel: 'medium', issue: 'Bridge structural strain — load concentration',          rulDays: 90,  failureProbability: 28, recommendedAction: 'Perform visual bridge inspection within 30 days. Review load distribution.',                                       generatedAt: new Date(Date.now() - 50*60000).toISOString() },
  { id: 'PRD-004', assetId: 'F5',  sensorId: 'NFC_F5_001',  riskLevel: 'low',    issue: 'Minor vibration increase — rail joint wear',             rulDays: 120, failureProbability: 15, recommendedAction: 'Include in next scheduled maintenance round. Inspect rail joints.',                                               generatedAt: new Date(Date.now() - 40*60000).toISOString() },
  { id: 'PRD-005', assetId: 'P1',                            riskLevel: 'low',    issue: 'Viaduct — minor vibration pattern',                      rulDays: 180, failureProbability: 8,  recommendedAction: 'Continue monitoring. Include in semi-annual inspection.',                                                        generatedAt: new Date(Date.now() - 60*60000).toISOString() },
];

// ── Maintenance records ────────────────────────────────────────────────────
const maintenanceRecords = [
  { id: 'MR-001', assetId: 'B12', workOrderId: 'WO-1039', type: 'Inspection', description: 'Routine vibration check and rail fastener inspection.',        performedBy: 'J. van der Berg',        performedAt: new Date(Date.now() - 30*24*3600000).toISOString(),  outcome: 'completed' },
  { id: 'MR-002', assetId: 'B12',                          type: 'Repair',     description: 'Replaced 3 worn rail fasteners. Topped up ballast on km 4.2.', performedBy: 'J. van der Berg',        performedAt: new Date(Date.now() - 60*24*3600000).toISOString(),  outcome: 'completed' },
  { id: 'MR-003', assetId: 'A3',                           type: 'Inspection', description: 'Ballast profile survey and rail joint inspection.',            performedBy: 'P. Nkosi',               performedAt: new Date(Date.now() - 45*24*3600000).toISOString(),  outcome: 'completed' },
  { id: 'MR-004', assetId: 'S04',                          type: 'Inspection', description: 'Annual bridge structural inspection. NDT on main girders.',    performedBy: 'Bridge Inspection Unit', performedAt: new Date(Date.now() - 90*24*3600000).toISOString(),  outcome: 'completed' },
  { id: 'MR-005', assetId: 'D8',                           type: 'Inspection', description: 'Quarterly sleeper check. All fasteners within torque spec.',   performedBy: 'T. Dlamini',             performedAt: new Date(Date.now() - 3*24*3600000).toISOString(),   outcome: 'completed' },
  { id: 'MR-006', assetId: 'C7',                           type: 'Maintenance',description: 'Lubricated switch points. Recalibrated detection.',           performedBy: 'J. van der Berg',        performedAt: new Date(Date.now() - 6*24*3600000).toISOString(),   outcome: 'completed' },
  { id: 'MR-007', assetId: 'B12',                          type: 'Monitoring', description: 'Vibration trend review. Values within normal range at time of check.', performedBy: 'J. van der Berg', performedAt: new Date(Date.now() - 90*24*3600000).toISOString(), outcome: 'completed' },
  { id: 'MR-008', assetId: 'J3',                           type: 'Inspection', description: 'N3 bridge visual inspection. Minor surface corrosion noted.',  performedBy: 'Bridge Inspection Unit', performedAt: new Date(Date.now() - 120*24*3600000).toISOString(), outcome: 'partial'    },
  { id: 'MR-009', assetId: 'A3',                           type: 'Repair',     description: 'Rail joint grinding on km 2.8.',                              performedBy: 'P. Nkosi',               performedAt: new Date(Date.now() - 100*24*3600000).toISOString(), outcome: 'completed' },
  { id: 'MR-010', assetId: 'C7',                           type: 'Inspection', description: 'Annual switch inspection. All components serviceable.',        performedBy: 'J. van der Berg',        performedAt: new Date(Date.now() - 180*24*3600000).toISOString(), outcome: 'completed' },
];

// ── Helpers to generate sensor readings ───────────────────────────────────
function makeReadings(sensorId, baseValue, drift, count, intervalMinutes = 5) {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const ago = (count - i) * intervalMinutes * 60 * 1000;
    const progress = i / count;
    const value = baseValue + drift * progress + (Math.random() - 0.5) * 0.04;
    const clamped = Math.max(0, +value.toFixed(3));
    const severity =
      clamped > 1.00 ? 'critical' : clamped > 0.80 ? 'warning' : clamped > 0.65 ? 'info' : 'healthy';
    return { id: `${sensorId}-r${i}`, sensorId, value: clamped, timestamp: new Date(now - ago).toISOString(), severity };
  });
}

const readings = [
  ...makeReadings('NFC_B12_001', 0.48, 0.76, 50),
  ...makeReadings('NFC_A3_001',  0.70, 0.18, 30),
  ...makeReadings('STR_S04_001', 260,  25,   30, 10),
  ...makeReadings('NFC_F5_001',  0.62, 0.14, 20),
  ...makeReadings('NFC_C7_001',  0.38, 0.04, 20),
];

// ── Railway lines & stations ───────────────────────────────────────────────
const railwayLines = [
  { id: 'north-south', name: 'North–South Line', color: '#00FFC6' },
  { id: 'east-west',   name: 'East–West Line',   color: '#00D1FF' },
  { id: 'loop',        name: 'City Loop',         color: '#FFB020' },
];

const stations = [
  { id: 's-pretoria',    name: 'Pretoria',    x: 140, y: 60,  lineId: 'north-south' },
  { id: 's-centurion',   name: 'Centurion',   x: 140, y: 150, lineId: 'north-south' },
  { id: 's-midrand',     name: 'Midrand',     x: 140, y: 245, lineId: 'north-south' },
  { id: 's-marlboro',    name: 'Marlboro',    x: 140, y: 340, lineId: 'north-south' },
  { id: 's-sandton',     name: 'Sandton',     x: 140, y: 435, lineId: 'north-south' },
  { id: 's-rosebank',    name: 'Rosebank',    x: 280, y: 435, lineId: 'east-west'   },
  { id: 's-park',        name: 'Park',        x: 420, y: 435, lineId: 'east-west'   },
  { id: 's-rhodesfield', name: 'Rhodesfield', x: 560, y: 435, lineId: 'east-west'   },
  { id: 's-or-tambo',    name: 'O.R. Tambo',  x: 700, y: 435, lineId: 'east-west'   },
  { id: 's-hatfield',    name: 'Hatfield',    x: 420, y: 60,  lineId: 'loop'        },
];

module.exports = { users, assets, sensors, alerts, workOrders, predictions, maintenanceRecords, readings, railwayLines, stations };
