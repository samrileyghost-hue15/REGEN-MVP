const express = require('express');
const router = express.Router();
const store = require('../data/store');
const { fetchAll } = require('../lib/supabase');

// GET /api/maintenance  — optional ?assetId=B12
router.get('/', async (req, res) => {
  const opts = req.query.assetId
    ? { filter: { asset_id: req.query.assetId }, order: { col: 'performed_at', asc: false } }
    : { order: { col: 'performed_at', asc: false } };

  const rows = await fetchAll('maintenance_records', opts);
  if (rows && rows.length) return res.json(rows.map(normaliseMR));

  const result = req.query.assetId
    ? store.maintenanceRecords.filter(r => r.assetId === req.query.assetId)
    : store.maintenanceRecords;
  res.json(result);
});

// GET /api/maintenance/:id
router.get('/:id', async (req, res) => {
  const rows = await fetchAll('maintenance_records', { filter: { id: req.params.id } });
  if (rows && rows.length) return res.json(normaliseMR(rows[0]));
  const record = store.maintenanceRecords.find(r => r.id === req.params.id);
  if (!record) return res.status(404).json({ error: 'Maintenance record not found' });
  res.json(record);
});

// ── Helper ─────────────────────────────────────────────────────────────────
function normaliseMR(r) {
  return {
    id: r.id,
    assetId: r.asset_id ?? r.assetId,
    workOrderId: r.work_order_id ?? r.workOrderId,
    type: r.type,
    description: r.description,
    performedBy: r.performed_by ?? r.performedBy,
    performedAt: r.performed_at ?? r.performedAt,
    outcome: r.outcome,
  };
}

module.exports = router;
