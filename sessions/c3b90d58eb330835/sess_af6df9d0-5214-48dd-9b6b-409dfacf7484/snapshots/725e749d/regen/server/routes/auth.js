const express = require('express');
const router = express.Router();
const store = require('../data/store');

/**
 * POST /api/auth/login
 * Body: { role: 'maintenance_engineer' | 'operations_manager' | 'administrator' }
 * Returns the matching mock user (no real passwords — demo mode).
 */
router.post('/login', (req, res) => {
  const { role } = req.body;
  if (!role) return res.status(400).json({ error: 'role is required' });

  const user = store.users.find(u => u.role === role);
  if (!user) return res.status(404).json({ error: `No user with role: ${role}` });

  res.json({ user });
});

/**
 * GET /api/auth/me
 * In a real system this would validate a JWT. Here it just returns users list
 * so the frontend can pick a demo identity.
 */
router.get('/users', (_req, res) => {
  res.json(store.users);
});

module.exports = router;
