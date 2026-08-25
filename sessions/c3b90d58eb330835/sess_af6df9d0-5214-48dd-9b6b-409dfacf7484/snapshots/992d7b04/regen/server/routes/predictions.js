const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/predictions
// Optional query: ?assetId=B12
router.get('/', (req, res) => {
  const result = req.query.assetId
    ? store.predictions.filter(p => p.assetId === req.query.assetId)
    : store.predictions;
  res.json(result);
});

// GET /api/predictions/:id
router.get('/:id', (req, res) => {
  const pred = store.predictions.find(p => p.id === req.params.id);
  if (!pred) return res.status(404).json({ error: 'Prediction not found' });
  res.json(pred);
});

module.exports = router;
