const express = require('express');
const router = express.Router();
const store = require('../data/store');
const { fetchAll, updateRows } = require('../lib/supabase');

// GET /api/assets
router.get('/', async (_req, res) => {
  const rows = await fetchAll('assets');
  res.json(rows && rows.length ? rows : store.assets);
});

// GET /api/assets/:id
router.get('/:id', async (req, res) => {
  const rows = await fetchAll('assets', { filter: { id: req.params.id } });
  if (rows && rows.length) return res.json(rows[0]);
  const asset = store.assets.find(a => a.id === req.params.id);
  if (!asset) return res.status(404).json({ error: 'Asset not found' });
  res.json(asset);
});

// PATCH /api/assets/:id  — optimistic update: store + Supabase
router.patch('/:id', async (req, res) => {
  // Update in-memory store
  const idx = store.assets.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Asset not found' });
  store.assets[idx] = { ...store.assets[idx], ...req.body };

  // Persist to Supabase (best-effort)
  await updateRows('assets', { id: req.params.id }, req.body);

  res.json(store.assets[idx]);
});

module.exports = router;
