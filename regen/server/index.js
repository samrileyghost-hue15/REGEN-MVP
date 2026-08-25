const express = require('express');
const cors    = require('cors');

const authRoutes        = require('./routes/auth');
const assetRoutes       = require('./routes/assets');
const sensorRoutes      = require('./routes/sensors');
const alertRoutes       = require('./routes/alerts');
const workOrderRoutes   = require('./routes/workOrders');
const predictionRoutes  = require('./routes/predictions');
const maintenanceRoutes = require('./routes/maintenance');
const networkRoutes     = require('./routes/network');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/assets',      assetRoutes);
app.use('/api/sensors',     sensorRoutes);
app.use('/api/alerts',      alertRoutes);
app.use('/api/work-orders', workOrderRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/network',     networkRoutes);

// ── Health check ───────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 fallback ───────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`[regen-api] Server running at http://localhost:${PORT}`);
});
