export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const { email, appName, appSlug } = req.body;
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'valid email required' });
  if (!appName) return res.status(400).json({ error: 'app name required' });

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

    // 2. Store the app-specific reminder in our tracking system
    // We use a simple approach: send a tagged email to ourselves to track who wants what
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'icebergsampson <iceberg@freeslackapps.com>',
        to: 'justforaistorage@gmail.com',
        subject: `[REMIND] ${email} wants ${appName}`,
        html: `<p>Email: ${email}<br>App: ${appName}<br>Slug: ${appSlug}<br>Time: ${new Date().toISOString()}</p>`,
      }),
    });

    // 3. Send confirmation to the user
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'icebergsampson <iceberg@freeslackapps.com>',
        to: email,
        reply_to: 'justforaistorage@gmail.com',
        subject: `You're on the list — ${appName} is coming`,
        text: `Hey — ${appName} is being built right now.\n\nWhen it drops, you'll get an email with a direct link to install it on Slack. No spam, just the launch notification.\n\nfreeslackapps.com\n\n— @icebergsampson`,
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: 'failed to send' });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Remind error:', err);
    return res.status(500).json({ error: 'failed' });
  }
}
