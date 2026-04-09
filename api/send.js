export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const { email, newsletter } = req.body;
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'valid email required' });

  const RESEND_KEY = process.env.RESEND_API_KEY;
  const RESEND_FULL = process.env.RESEND_FULL_KEY || RESEND_KEY;
  const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

  try {
    // 1. Add to audience (needs full-access key)
    if (AUDIENCE_ID) {
      await fetch(`https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_FULL}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, unsubscribed: false }),
      });
    }

    // 2. Send welcome email — full branded, not empty
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'icebergsampson <iceberg@igotminimoney.com>',
        to: email,
        reply_to: 'justforaistorage@gmail.com',
        subject: newsletter ? "You're in" : "You're on the list",
        text: newsletter
          ? "Hey — welcome to the list.\n\nEvery week I send one email: what I built, what AI tools are worth using, a prompt you can steal, and one question to think about. No filler.\n\nI also build free Slack apps and give them away. Stream Line is live now — it's a free operations bot for live streamers. More apps shipping every week.\n\nfreeslackapps.com\n\n— @icebergsampson"
          : "Hey — you're on the list.\n\nWhen we ship a new app, you'll get an email with a direct link to install it. That's it. No spam.\n\nfreeslackapps.com\n\n— @icebergsampson",
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Resend error:', data);
      return res.status(500).json({ error: 'failed to send' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Send error:', err);
    return res.status(500).json({ error: 'failed' });
  }
}

