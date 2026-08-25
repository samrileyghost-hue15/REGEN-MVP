/**
 * Probe script — insert a test row to discover column names from error messages.
 * Delete after use.
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
process.env.SUPABASE_URL      = process.env.VITE_SUPABASE_URL;
process.env.SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function probe() {
  // Send a row with EVERY field name variant — the error will tell us what exists
  for (const table of ['users','assets','sensors','alerts','predictions']) {
    // Use select() with a column that doesn't exist to get schema info
    const { data, error } = await sb.from(table).select('*').limit(0);
    console.log(`\n[${table}]`);
    if (error) console.log('  error:', error.message);
    else {
      // Try inserting an empty object to get "not-null violation" which lists columns
      const { error: ie } = await sb.from(table).insert({}).select();
      if (ie) console.log('  insert probe:', ie.message, ie.details || '');
      else    console.log('  empty insert worked (all nullable?)');
    }
  }
  process.exit(0);
}
probe();
