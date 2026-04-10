const attempts = new Map(); // ip -> { count, firstAttempt }
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';

  // Rate limiting
  const now = Date.now();
  const record = attempts.get(ip);
  if (record) {
    if (now - record.firstAttempt > WINDOW_MS) {
      attempts.delete(ip);
    } else if (record.count >= MAX_ATTEMPTS) {
      return res.status(429).json({ error: 'too many attempts, try again later' });
    }
  }

  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'password required' });

  if (password === process.env.ADMIN_KEY) {
    attempts.delete(ip);
    return res.status(200).json({ success: true });
  }

  // Track failed attempt
  const existing = attempts.get(ip);
  if (existing) {
    existing.count++;
  } else {
    attempts.set(ip, { count: 1, firstAttempt: now });
  }

  return res.status(401).json({ error: 'wrong password' });
}
