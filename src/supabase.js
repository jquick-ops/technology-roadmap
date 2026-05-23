const SUPABASE_URL = 'https://porqmwmykmbroidstmlw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_fQnf3_i9IKjMDyVtDUt6og_9LirSXI5';

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

async function query(table, params = '') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${params}`, { headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function insert(table, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST', headers,
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function update(table, id, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH', headers,
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function remove(table, id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'DELETE', headers
  });
  if (!res.ok) throw new Error(await res.text());
  return true;
}

export const db = { query, insert, update, remove };
