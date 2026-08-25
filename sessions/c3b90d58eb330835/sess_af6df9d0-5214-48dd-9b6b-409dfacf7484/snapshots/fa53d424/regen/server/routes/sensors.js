const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/sensors
// Optional query: ?assetId=B12
router.get('/', (req, res) => {
  const { assetId } = req.query;
  const result = assetId
    ? store.sensors.filter(s => s.assetId === assetId)
    : store.sensors;
  res.json(result);
});

// GET /api/sensors/:id
router.get('/:id', (req, res) => {
  const sensor = store.sensors.find(s => s.id === req.params.id);
  if (!sensor) return res.status(404).json({ error: 'Sensor not found' });
  res.json(sensor);
});

// PATCH /api/sensors/:id
router.patch('/:id', (req, res) => {
  const idx = store.sensors.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Sensor not found' });
  store.sensors[idx] = { ...store.sensors[idx], ...req.body };
  res.json(store.sensors[idx]);
});

// GET /api/sensors/:id/readings
router.get('/:id/readings', (req, res) => {
  const result = store.readings.filter(r => r.sensorId === req.params.id);
  res.json(result);
});

module.exports = router;
