const express = require('express');
const router = express.Router();
const store = require('../data/store');
const { fetchAll } = require('../lib/supabase');

/**
 * POST /api/auth/login
 * Body: { role }  — demo login, no real passwords
 */
router.post('/login', async (req, res) => {
  const { role } = req.body;
  if (!role) return res.status(400).json({ error: 'role is required' });

  // Try Supabase first
  const rows = await fetchAll('users', { filter: { role } });
  if (rows && rows.length) return res.json({ user: normaliseUser(rows[0]) });

  // Fallback to in-memory store
  const user = store.users.find(u => u.role === role);
  if (!user) return res.status(404).json({ error: `No user with role: ${role}` });
  res.json({ user });
});

/**
 * GET /api/auth/users — list all users
 */
router.get('/users', async (_req, res) => {
  const rows = await fetchAll('users');
  if (rows && rows.length) return res.json(rows.map(normaliseUser));
  res.json(store.users);
});

// ── Helper ─────────────────────────────────────────────────────────────────
function normaliseUser(r) {
  return {
    id: r.id,
    name: r.name,
    role: r.role,
    email: r.email,
    avatar: r.avatar || undefined,
  };
}

module.exports = router;
