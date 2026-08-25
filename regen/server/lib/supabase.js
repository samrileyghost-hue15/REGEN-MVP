/**
 * Supabase client for the Express server.
 * Reads credentials from environment variables (set in .env.local, loaded by
 * the dev script via dotenv, or injected at runtime in production).
 */
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL  = process.env.SUPABASE_URL  || 'https://tdchbeknugydofcabxft.supabase.co';
const SUPABASE_KEY  = process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkY2hiZWtudWd5ZG9mY2FieGZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2NDM3ODMsImV4cCI6MjEwMzIxOTc4M30.' +
  'O9TgCIZagu13wIfwYdij6KsTUfJBGIoUIZjRKa6fW-c';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Generic helper: fetch all rows from a table.
 * Returns [] on error so callers can fall back to mock data.
 */
async function fetchAll(table, options = {}) {
  let query = supabase.from(table).select(options.select || '*');
  if (options.filter) {
    for (const [col, val] of Object.entries(options.filter)) {
      query = query.eq(col, val);
    }
  }
  if (options.order) query = query.order(options.order.col, { ascending: options.order.asc ?? true });
  const { data, error } = await query;
  if (error) { console.warn(`[supabase] fetchAll(${table}):`, error.message); return null; }
  return data;
}

/**
 * Upsert a single row. Returns the upserted row or null on error.
 */
async function upsertRow(table, row) {
  const { data, error } = await supabase.from(table).upsert(row).select().single();
  if (error) { console.warn(`[supabase] upsert(${table}):`, error.message); return null; }
  return data;
}

/**
 * Insert a single row.
 */
async function insertRow(table, row) {
  const { data, error } = await supabase.from(table).insert(row).select().single();
  if (error) { console.warn(`[supabase] insert(${table}):`, error.message); return null; }
  return data;
}

/**
 * Update rows matching a filter.
 */
async function updateRows(table, filter, patch) {
  let query = supabase.from(table).update(patch);
  for (const [col, val] of Object.entries(filter)) {
    query = query.eq(col, val);
  }
  const { data, error } = await query.select();
  if (error) { console.warn(`[supabase] update(${table}):`, error.message); return null; }
  return data;
}

module.exports = { supabase, fetchAll, upsertRow, insertRow, updateRows };
