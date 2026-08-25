require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
process.env.SUPABASE_URL = process.env.VITE_SUPABASE_URL;
process.env.SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function probe() {
  // Check more columns including uuid/id variants
  const extra = {
    assets: ['id', 'uuid', 'asset_id', 'location', 'severity', 'lineId', 'line_id', 'last_inspection', 'lastInspection', 'install_date', 'installDate', 'description', 'map_x', 'mapX', 'map_y', 'mapY'],
    alerts: ['id', 'uuid', 'title', 'description', 'acknowledgedAt', 'acknowledged_at', 'acknowledgedBy', 'acknowledged_by', 'resolvedAt', 'resolved_at'],
    predictions: ['id', 'uuid', 'sensorId', 'sensor_id', 'riskLevel', 'risk_level', 'issue', 'rulDays', 'rul_days', 'failureProbability', 'failure_probability'],
    sensors: ['id', 'uuid', 'assetId', 'severity', 'currentValue', 'current_value', 'normalMin', 'normal_min', 'normalMax', 'normal_max', 'warningMax', 'warning_max', 'criticalMax', 'critical_max', 'mapX', 'map_x', 'mapY', 'map_y'],
  };

  for (const [table, cols] of Object.entries(extra)) {
    console.log(`\n[${table}]`);
    for (const col of cols) {
      const { error } = await sb.from(table).select(col).limit(0);
      if (!error) process.stdout.write(`  ✓ ${col}\n`);
    }
  }
  process.exit(0);
}
probe();
