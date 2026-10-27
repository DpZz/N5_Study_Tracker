export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || '';
  if (!url || !key) {
    return res.status(200).json({ configured: false, url: '', key: '' });
  }
  // A Supabase publishable/anon key is intended for browser use. Never return a service-role/secret key.
  return res.status(200).json({ configured: true, url, key });
}
