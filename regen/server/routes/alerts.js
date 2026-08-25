const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/alerts
// Optional query: ?assetId=B12&status=active
router.get('/', (req, res) => {
  let result = store.alerts;
  if (req.query.assetId) result = result.filter(a => a.assetId === req.query.assetId);
  if (req.query.status)  result = result.filter(a => a.status  === req.query.status);
  res.json(result);
});

// GET /api/alerts/:id
router.get('/:id', (req, res) => {
  const alert = store.alerts.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  res.json(alert);
});

// POST /api/alerts  — create a new alert (used by demo mode)
router.post('/', (req, res) => {
  const alert = req.body;
  if (!alert.id || !alert.assetId || !alert.title) {
    return res.status(400).json({ error: 'id, assetId, and title are required' });
  }
  store.alerts.unshift(alert);
  res.status(201).json(alert);
});

// PATCH /api/alerts/:id/acknowledge
router.patch('/:id/acknowledge', (req, res) => {
  const idx = store.alerts.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Alert not found' });
  const { by } = req.body;
  store.alerts[idx] = {
    ...store.alerts[idx],
    status: 'acknowledged',
    acknowledgedAt: new Date().toISOString(),
    acknowledgedBy: by ?? 'Unknown',
  };
  res.json(store.alerts[idx]);
});

// PATCH /api/alerts/:id/resolve
router.patch('/:id/resolve', (req, res) => {
  const idx = store.alerts.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Alert not found' });
  store.alerts[idx] = {
    ...store.alerts[idx],
    status: 'resolved',
    resolvedAt: new Date().toISOString(),
  };
  res.json(store.alerts[idx]);
});

module.exports = router;
