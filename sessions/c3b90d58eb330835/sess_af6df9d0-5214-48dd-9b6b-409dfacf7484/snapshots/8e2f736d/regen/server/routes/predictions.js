const express = require('express');
const router = express.Router();
const store = require('../data/store');
const { fetchAll } = require('../lib/supabase');

// GET /api/predictions  — optional ?assetId=B12
router.get('/', async (req, res) => {
  const opts = req.query.assetId
    ? { filter: { asset_id: req.query.assetId } }
    : {};

  const rows = await fetchAll('predictions', opts);
  if (rows && rows.length) return res.json(rows.map(normalisePred));

  const result = req.query.assetId
    ? store.predictions.filter(p => p.assetId === req.query.assetId)
    : store.predictions;
  res.json(result);
});

// GET /api/predictions/:id
router.get('/:id', async (req, res) => {
  const rows = await fetchAll('predictions', { filter: { id: req.params.id } });
  if (rows && rows.length) return res.json(normalisePred(rows[0]));
  const pred = store.predictions.find(p => p.id === req.params.id);
  if (!pred) return res.status(404).json({ error: 'Prediction not found' });
  res.json(pred);
});

// ── Helper ─────────────────────────────────────────────────────────────────
function normalisePred(r) {
  return {
    id: r.id,
    assetId: r.asset_id ?? r.assetId,
    sensorId: r.sensor_id ?? r.sensorId,
    riskLevel: r.risk_level ?? r.riskLevel,
    issue: r.issue,
    rulDays: r.rul_days ?? r.rulDays,
    failureProbability: r.failure_probability ?? r.failureProbability,
    recommendedAction: r.recommended_action ?? r.recommendedAction,
    generatedAt: r.generated_at ?? r.generatedAt,
  };
}

module.exports = router;
