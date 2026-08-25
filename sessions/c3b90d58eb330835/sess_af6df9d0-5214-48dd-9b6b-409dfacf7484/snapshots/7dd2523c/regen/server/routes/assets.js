const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/assets
router.get('/', (_req, res) => {
  res.json(store.assets);
});

// GET /api/assets/:id
router.get('/:id', (req, res) => {
  const asset = store.assets.find(a => a.id === req.params.id);
  if (!asset) return res.status(404).json({ error: 'Asset not found' });
  res.json(asset);
});

// PATCH /api/assets/:id
router.patch('/:id', (req, res) => {
  const idx = store.assets.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Asset not found' });
  store.assets[idx] = { ...store.assets[idx], ...req.body };
  res.json(store.assets[idx]);
});

module.exports = router;
