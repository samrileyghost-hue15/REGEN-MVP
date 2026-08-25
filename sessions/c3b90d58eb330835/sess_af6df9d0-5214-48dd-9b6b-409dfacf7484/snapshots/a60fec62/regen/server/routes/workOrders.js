const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/work-orders
// Optional query: ?assetId=B12&status=open
router.get('/', (req, res) => {
  let result = store.workOrders;
  if (req.query.assetId) result = result.filter(w => w.assetId === req.query.assetId);
  if (req.query.status)  result = result.filter(w => w.status  === req.query.status);
  res.json(result);
});

// GET /api/work-orders/:id
router.get('/:id', (req, res) => {
  const wo = store.workOrders.find(w => w.id === req.params.id);
  if (!wo) return res.status(404).json({ error: 'Work order not found' });
  res.json(wo);
});

// POST /api/work-orders — create
router.post('/', (req, res) => {
  const wo = { ...req.body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  if (!wo.id || !wo.assetId || !wo.title) {
    return res.status(400).json({ error: 'id, assetId, and title are required' });
  }
  store.workOrders.unshift(wo);
  res.status(201).json(wo);
});

// PATCH /api/work-orders/:id — update status, notes, assignee, etc.
router.patch('/:id', (req, res) => {
  const idx = store.workOrders.findIndex(w => w.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Work order not found' });
  store.workOrders[idx] = {
    ...store.workOrders[idx],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  res.json(store.workOrders[idx]);
});

module.exports = router;
