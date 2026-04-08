export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'password required' });

  if (password === process.env.ADMIN_KEY) {
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ error: 'wrong password' });
}
