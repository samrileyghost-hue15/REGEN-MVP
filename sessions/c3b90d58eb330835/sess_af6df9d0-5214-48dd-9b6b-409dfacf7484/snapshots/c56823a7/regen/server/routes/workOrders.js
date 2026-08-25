const express = require('express');
const router = express.Router();
const store = require('../data/store');
const { fetchAll, insertRow, updateRows } = require('../lib/supabase');

// GET /api/work-orders  — optional ?assetId=B12&status=open
router.get('/', async (req, res) => {
  const opts = {};
  if (req.query.assetId) opts.filter = { ...(opts.filter || {}), asset_id: req.query.assetId };
  if (req.query.status) opts.filter = { ...(opts.filter || {}), status: req.query.status };

  const rows = await fetchAll('work_orders', opts);
  if (rows && rows.length) return res.json(rows.map(normaliseWO));

  let result = store.workOrders;
  if (req.query.assetId) result = result.filter(w => w.assetId === req.query.assetId);
  if (req.query.status) result = result.filter(w => w.status === req.query.status);
  res.json(result);
});

// GET /api/work-orders/:id
router.get('/:id', async (req, res) => {
  const rows = await fetchAll('work_orders', { filter: { id: req.params.id } });
  if (rows && rows.length) return res.json(normaliseWO(rows[0]));
  const wo = store.workOrders.find(w => w.id === req.params.id);
  if (!wo) return res.status(404).json({ error: 'Work order not found' });
  res.json(wo);
});

// POST /api/work-orders
router.post('/', async (req, res) => {
  const now = new Date().toISOString();
  const wo = { ...req.body, createdAt: now, updatedAt: now };
  if (!wo.id || !wo.assetId || !wo.title)
    return res.status(400).json({ error: 'id, assetId, and title are required' });

  store.workOrders.unshift(wo);

  await insertRow('work_orders', {
    id: wo.id,
    asset_id: wo.assetId,
    alert_id: wo.alertId || null,
    prediction_id: wo.predictionId || null,
    title: wo.title,
    description: wo.description,
    priority: wo.priority,
    status: wo.status,
    assigned_team: wo.assignedTeam,
    assigned_to: wo.assignedTo || null,
    created_at: wo.createdAt,
    updated_at: wo.updatedAt,
    notes: wo.notes || null,
  });

  res.status(201).json(wo);
});

// PATCH /api/work-orders/:id
router.patch('/:id', async (req, res) => {
  const idx = store.workOrders.findIndex(w => w.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Work order not found' });

  const updated = { ...store.workOrders[idx], ...req.body, updatedAt: new Date().toISOString() };
  store.workOrders[idx] = updated;

  // Map camelCase → snake_case patch for Supabase
  const patch = {};
  const fieldMap = {
    status: 'status', notes: 'notes', priority: 'priority',
    assignedTeam: 'assigned_team', assignedTo: 'assigned_to',
    resolvedAt: 'resolved_at', updatedAt: 'updated_at',
  };
  for (const [k, v] of Object.entries(req.body)) {
    if (fieldMap[k]) patch[fieldMap[k]] = v;
  }
  patch.updated_at = updated.updatedAt;
  await updateRows('work_orders', { id: req.params.id }, patch);

  res.json(updated);
});

// ── Helper ─────────────────────────────────────────────────────────────────
function normaliseWO(r) {
  return {
    id: r.id,
    assetId: r.asset_id ?? r.assetId,
    alertId: r.alert_id ?? r.alertId,
    predictionId: r.prediction_id ?? r.predictionId,
    title: r.title,
    description: r.description,
    priority: r.priority,
    status: r.status,
    assignedTeam: r.assigned_team ?? r.assignedTeam,
    assignedTo: r.assigned_to ?? r.assignedTo,
    createdAt: r.created_at ?? r.createdAt,
    updatedAt: r.updated_at ?? r.updatedAt,
    resolvedAt: r.resolved_at ?? r.resolvedAt,
    notes: r.notes,
  };
}

module.exports = router;
