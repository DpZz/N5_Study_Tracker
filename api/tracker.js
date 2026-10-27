// Vercel serverless endpoint for the single shared "Demt" tracker profile.
// Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and DEMT_ACCESS_CODE in Vercel.
// The access code is a shared passcode, not an individual account. Do not expose the service-role key.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Vary', 'x-tracker-access-code');
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET, PUT, OPTIONS');
    return res.status(204).end();
  }
  if (!['GET', 'PUT'].includes(req.method)) {
    res.setHeader('Allow', 'GET, PUT, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const url = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const expectedCode = process.env.DEMT_ACCESS_CODE || '';
  if (!url || !serviceKey || !expectedCode) {
    return res.status(503).json({ error: 'Vercel is missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or DEMT_ACCESS_CODE.' });
  }
  const suppliedCode = req.headers['x-tracker-access-code'] || req.query?.code || '';
  if (suppliedCode !== expectedCode) {
    return res.status(401).json({ error: 'Shared Demt access code is not configured or is incorrect.' });
  }
  const endpoint = url + '/rest/v1/tracker_shared_data?profile=eq.Demt';
  const headers = {
    'apikey': serviceKey,
    'Authorization': 'Bearer ' + serviceKey,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };
  try {
    if (req.method === 'GET') {
      const response = await fetch(endpoint + '&select=profile,data,updated_at', { headers });
      const text = await response.text();
      if (!response.ok) return res.status(response.status).json({ error: 'Supabase read failed: ' + text.slice(0, 500) });
      const rows = text ? JSON.parse(text) : [];
      return res.status(200).json({ connected: true, profile: 'Demt', data: rows[0]?.data || null, updated_at: rows[0]?.updated_at || null });
    }
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    if (!body.data || typeof body.data !== 'object' || Array.isArray(body.data)) {
      return res.status(400).json({ error: 'Request must contain a data object.' });
    }
    const response = await fetch(url + '/rest/v1/tracker_shared_data?on_conflict=profile', {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify([{ profile: 'Demt', data: body.data, updated_at: new Date().toISOString() }])
    });
    const text = await response.text();
    if (!response.ok) return res.status(response.status).json({ error: 'Supabase write failed: ' + text.slice(0, 500) });
    return res.status(200).json({ connected: true, profile: 'Demt', saved: true });
  } catch (error) {
    return res.status(500).json({ error: 'Cloud backup failed: ' + (error?.message || 'unexpected server error') });
  }
}
