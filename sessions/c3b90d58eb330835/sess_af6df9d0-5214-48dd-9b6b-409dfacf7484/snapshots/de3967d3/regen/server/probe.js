require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
process.env.SUPABASE_URL = process.env.VITE_SUPABASE_URL;
process.env.SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Query information_schema via postgrest rpc or just try known column names
async function probe() {
  // Try selecting individual columns to see which exist
  const tables = {
    users: ['id', 'name', 'role', 'email'],
    assets: ['id', 'name', 'type', 'location', 'lineId', 'line_id', 'severity', 'lastInspection', 'last_inspection', 'mapX', 'map_x'],
    sensors: ['id', 'assetId', 'asset_id', 'name', 'type', 'unit', 'status', 'severity', 'currentValue', 'current_value', 'normalMin', 'normal_min', 'warningMax', 'warning_max', 'criticalMax', 'critical_max', 'lastUpdate', 'last_update', 'mapX', 'map_x'],
    alerts: ['id', 'assetId', 'asset_id', 'sensorId', 'sensor_id', 'title', 'description', 'severity', 'status', 'createdAt', 'created_at', 'acknowledgedAt', 'acknowledged_at', 'acknowledgedBy', 'acknowledged_by', 'resolvedAt', 'resolved_at'],
    predictions: ['id', 'assetId', 'asset_id', 'sensorId', 'sensor_id', 'riskLevel', 'risk_level', 'issue', 'rulDays', 'rul_days', 'failureProbability', 'failure_probability', 'recommendedAction', 'recommended_action', 'generatedAt', 'generated_at'],
  };

  for (const [table, cols] of Object.entries(tables)) {
    console.log(`\n[${table}]`);
    for (const col of cols) {
      const { error } = await sb.from(table).select(col).limit(0);
      if (!error) console.log(`  ✓ ${col}`);
    }
  }
  process.exit(0);
}
probe();
