const express = require('express');
const router = express.Router();
const store = require('../data/store');
const { fetchAll, insertRow, updateRows } = require('../lib/supabase');

// GET /api/alerts  — optional ?assetId=B12&status=active
router.get('/', async (req, res) => {
  const opts = {};
  if (req.query.assetId) opts.filter = { ...(opts.filter || {}), asset_id: req.query.assetId };
  if (req.query.status) opts.filter = { ...(opts.filter || {}), status: req.query.status };

  const rows = await fetchAll('alerts', opts);
  if (rows && rows.length) return res.json(rows.map(normaliseAlert));

  // Fallback
  let result = store.alerts;
  if (req.query.assetId) result = result.filter(a => a.assetId === req.query.assetId);
  if (req.query.status) result = result.filter(a => a.status === req.query.status);
  res.json(result);
});

// GET /api/alerts/:id
router.get('/:id', async (req, res) => {
  const rows = await fetchAll('alerts', { filter: { id: req.params.id } });
  if (rows && rows.length) return res.json(normaliseAlert(rows[0]));
  const alert = store.alerts.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  res.json(alert);
});

// POST /api/alerts
router.post('/', async (req, res) => {
  const alert = req.body;
  if (!alert.id || !alert.assetId || !alert.title)
    return res.status(400).json({ error: 'id, assetId, and title are required' });

  store.alerts.unshift(alert);

  await insertRow('alerts', {
    id: alert.id,
    asset_id: alert.assetId,
    sensor_id: alert.sensorId || null,
    title: alert.title,
    description: alert.description,
    severity: alert.severity,
    status: alert.status,
    created_at: alert.createdAt || new Date().toISOString(),
  });

  res.status(201).json(alert);
});

// PATCH /api/alerts/:id/acknowledge
router.patch('/:id/acknowledge', async (req, res) => {
  const idx = store.alerts.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Alert not found' });

  const now = new Date().toISOString();
  const by = req.body.by ?? 'Unknown';
  store.alerts[idx] = { ...store.alerts[idx], status: 'acknowledged', acknowledgedAt: now, acknowledgedBy: by };

  await updateRows('alerts', { id: req.params.id }, {
    status: 'acknowledged', acknowledged_at: now, acknowledged_by: by,
  });

  res.json(store.alerts[idx]);
});

// PATCH /api/alerts/:id/resolve
router.patch('/:id/resolve', async (req, res) => {
  const idx = store.alerts.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Alert not found' });

  const now = new Date().toISOString();
  store.alerts[idx] = { ...store.alerts[idx], status: 'resolved', resolvedAt: now };

  await updateRows('alerts', { id: req.params.id }, { status: 'resolved', resolved_at: now });

  res.json(store.alerts[idx]);
});

// ── Helper ─────────────────────────────────────────────────────────────────
function normaliseAlert(r) {
  return {
    id: r.id,
    assetId: r.asset_id ?? r.assetId,
    sensorId: r.sensor_id ?? r.sensorId,
    title: r.title,
    description: r.description,
    severity: r.severity,
    status: r.status,
    createdAt: r.created_at ?? r.createdAt,
    acknowledgedAt: r.acknowledged_at ?? r.acknowledgedAt,
    acknowledgedBy: r.acknowledged_by ?? r.acknowledgedBy,
    resolvedAt: r.resolved_at ?? r.resolvedAt,
  };
}

module.exports = router;
