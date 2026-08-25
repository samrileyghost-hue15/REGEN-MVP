const express = require('express');
const router = express.Router();
const store = require('../data/store');
const { fetchAll, updateRows } = require('../lib/supabase');

// GET /api/sensors  — optional ?assetId=B12
router.get('/', async (req, res) => {
  const opts = req.query.assetId
    ? { filter: { asset_id: req.query.assetId } }
    : {};
  const rows = await fetchAll('sensors', opts);

  if (rows && rows.length) {
    // Supabase uses snake_case columns — normalise to camelCase for the frontend
    return res.json(rows.map(normaliseSensor));
  }

  // Fallback
  const result = req.query.assetId
    ? store.sensors.filter(s => s.assetId === req.query.assetId)
    : store.sensors;
  res.json(result);
});

// GET /api/sensors/:id
router.get('/:id', async (req, res) => {
  const rows = await fetchAll('sensors', { filter: { id: req.params.id } });
  if (rows && rows.length) return res.json(normaliseSensor(rows[0]));
  const sensor = store.sensors.find(s => s.id === req.params.id);
  if (!sensor) return res.status(404).json({ error: 'Sensor not found' });
  res.json(sensor);
});

// PATCH /api/sensors/:id
router.patch('/:id', async (req, res) => {
  const idx = store.sensors.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Sensor not found' });
  store.sensors[idx] = { ...store.sensors[idx], ...req.body };

  // Map camelCase → snake_case for Supabase
  const patch = toSnake(req.body);
  await updateRows('sensors', { id: req.params.id }, patch);

  res.json(store.sensors[idx]);
});

// GET /api/sensors/:id/readings
router.get('/:id/readings', async (req, res) => {
  const rows = await fetchAll('sensor_readings', {
    filter: { sensor_id: req.params.id },
    order: { col: 'timestamp', asc: true },
  });
  if (rows && rows.length) {
    return res.json(rows.map(r => ({
      id: r.id,
      sensorId: r.sensor_id,
      value: r.value,
      timestamp: r.timestamp,
      severity: r.severity,
    })));
  }
  res.json(store.readings.filter(r => r.sensorId === req.params.id));
});

// ── Helpers ────────────────────────────────────────────────────────────────
function normaliseSensor(r) {
  return {
    id: r.id,
    assetId: r.asset_id ?? r.assetId,
    name: r.name,
    type: r.type,
    unit: r.unit,
    status: r.status,
    severity: r.severity,
    currentValue: r.current_value ?? r.currentValue,
    normalMin: r.normal_min ?? r.normalMin,
    normalMax: r.normal_max ?? r.normalMax,
    warningMax: r.warning_max ?? r.warningMax,
    criticalMax: r.critical_max ?? r.criticalMax,
    lastUpdate: r.last_update ?? r.lastUpdate,
    mapX: r.map_x ?? r.mapX,
    mapY: r.map_y ?? r.mapY,
  };
}

function toSnake(obj) {
  const map = {
    assetId: 'asset_id', currentValue: 'current_value', normalMin: 'normal_min',
    normalMax: 'normal_max', warningMax: 'warning_max', criticalMax: 'critical_max',
    lastUpdate: 'last_update', mapX: 'map_x', mapY: 'map_y',
  };
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[map[k] || k] = v;
  }
  return out;
}

module.exports = router;
