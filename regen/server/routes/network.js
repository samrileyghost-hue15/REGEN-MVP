const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/network/lines
router.get('/lines', (_req, res) => {
  res.json(store.railwayLines);
});

// GET /api/network/stations
router.get('/stations', (_req, res) => {
  res.json(store.stations);
});

module.exports = router;
