/**
 * Seeds all Supabase tables with the mock data from store.js.
 * Run once: node server/seed.js
 *
 * Uses upsert so it's safe to run multiple times.
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
process.env.SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
process.env.SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const { createClient } = require('@supabase/supabase-js');
const store = require('./data/store');

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function upsert(table, rows, label) {
  if (!rows.length) { console.log(`  skip ${label} (empty)`); return; }
  const { error } = await sb.from(table).upsert(rows, { onConflict: 'id' });
  if (error) console.error(`  ✗ ${label}:`, error.message);
  else console.log(`  ✓ ${label}: ${rows.length} rows`);
}

async function seed() {
  console.log('\n[regen-seed] Starting...\n');

  // Users — use plain insert (upsert needs PK which migration adds)
  await upsert('users', store.users, 'users');

  // Assets — map to snake_case columns
  const assets = store.assets.map(a => ({
    id: a.id, name: a.name, type: a.type, location: a.location,
    line_id: a.lineId, severity: a.severity,
    last_inspection: a.lastInspection, install_date: a.installDate,
    description: a.description || null, map_x: a.mapX, map_y: a.mapY,
  }));
  await upsert('assets', assets, 'assets');

  // Sensors
  const sensors = store.sensors.map(s => ({
    id: s.id, asset_id: s.assetId, name: s.name, type: s.type, unit: s.unit,
    status: s.status, severity: s.severity, current_value: s.currentValue,
    normal_min: s.normalMin, normal_max: s.normalMax,
    warning_max: s.warningMax, critical_max: s.criticalMax,
    last_update: s.lastUpdate, map_x: s.mapX, map_y: s.mapY,
  }));
  await upsert('sensors', sensors, 'sensors');

  // Alerts
  const alerts = store.alerts.map(a => ({
    id: a.id, asset_id: a.assetId, sensor_id: a.sensorId || null,
    title: a.title, description: a.description, severity: a.severity,
    status: a.status, created_at: a.createdAt,
    acknowledged_at: a.acknowledgedAt || null,
    acknowledged_by: a.acknowledgedBy || null,
    resolved_at: a.resolvedAt || null,
  }));
  await upsert('alerts', alerts, 'alerts');

  // Predictions
  const predictions = store.predictions.map(p => ({
    id: p.id, asset_id: p.assetId, sensor_id: p.sensorId || null,
    risk_level: p.riskLevel, issue: p.issue, rul_days: p.rulDays,
    failure_probability: p.failureProbability,
    recommended_action: p.recommendedAction, generated_at: p.generatedAt,
  }));
  await upsert('predictions', predictions, 'predictions');

  // Work orders — table may not exist yet; skip gracefully
  const workOrders = store.workOrders.map(w => ({
    id: w.id, asset_id: w.assetId, alert_id: w.alertId || null,
    prediction_id: w.predictionId || null,
    title: w.title, description: w.description,
    priority: w.priority, status: w.status,
    assigned_team: w.assignedTeam, assigned_to: w.assignedTo || null,
    created_at: w.createdAt, updated_at: w.updatedAt,
    resolved_at: w.resolvedAt || null, notes: w.notes || null,
  }));
  await upsert('work_orders', workOrders, 'work_orders');

  // Maintenance records
  const maintenance = store.maintenanceRecords.map(r => ({
    id: r.id, asset_id: r.assetId, work_order_id: r.workOrderId || null,
    type: r.type, description: r.description, performed_by: r.performedBy,
    performed_at: r.performedAt, outcome: r.outcome,
  }));
  await upsert('maintenance_records', maintenance, 'maintenance_records');

  // Sensor readings (subset — B12 only to keep it manageable)
  const b12Readings = store.readings.filter(r => r.sensorId === 'NFC_B12_001').map(r => ({
    id: r.id, sensor_id: r.sensorId, value: r.value,
    timestamp: r.timestamp, severity: r.severity,
  }));
  await upsert('sensor_readings', b12Readings, 'sensor_readings (B12)');

  console.log('\n[regen-seed] Done.\n');
  process.exit(0);
}

seed().catch(err => { console.error('[regen-seed] Fatal:', err); process.exit(1); });
