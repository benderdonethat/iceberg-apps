export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const { email, appName, appSlug } = req.body;
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'valid email required' });
  if (!appName) return res.status(400).json({ error: 'app name required' });

  const RESEND_KEY = process.env.RESEND_API_KEY;
  const RESEND_FULL = process.env.RESEND_FULL_KEY || RESEND_KEY;
  const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

  try {
    // 1. Add to audience so they get the launch blast
    if (AUDIENCE_ID) {
      await fetch(`https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_FULL}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, unsubscribed: false }),
      });
    }

    // 2. Track which app they want (internal only)
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'icebergsampson <iceberg@freeslackapps.com>',
        to: 'justforaistorage@gmail.com',
        subject: `[REMIND] ${email} wants ${appName}`,
        text: `Email: ${email}\nApp: ${appName}\nSlug: ${appSlug}\nTime: ${new Date().toISOString()}`,
      }),
    });

    // 3. No confirmation email to the user — they'll get ONE email when the app launches.
    // The UI already shows "You'll be notified" which is enough confirmation.

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Remind error:', err);
    return res.status(500).json({ error: 'failed' });
  }
}
