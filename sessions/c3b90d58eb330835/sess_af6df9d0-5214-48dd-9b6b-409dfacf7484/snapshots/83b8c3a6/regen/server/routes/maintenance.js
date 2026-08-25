const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/maintenance
// Optional query: ?assetId=B12
router.get('/', (req, res) => {
  const result = req.query.assetId
    ? store.maintenanceRecords.filter(r => r.assetId === req.query.assetId)
    : store.maintenanceRecords;
  res.json(result);
});

// GET /api/maintenance/:id
router.get('/:id', (req, res) => {
  const record = store.maintenanceRecords.find(r => r.id === req.params.id);
  if (!record) return res.status(404).json({ error: 'Maintenance record not found' });
  res.json(record);
});

module.exports = router;
