export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const { email, appName, appSlug } = req.body;
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'valid email required' });
  if (!appName) return res.status(400).json({ error: 'app name required' });

  const RESEND_KEY = process.env.RESEND_API_KEY;
  const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

  try {
    // 1. Add to audience (in case they haven't signed up for general updates)
    if (AUDIENCE_ID) {
      await fetch(`https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, unsubscribed: false }),
      });
    }

    // 2. Store the app-specific reminder in our tracking system
    // We use a simple approach: send a tagged email to ourselves to track who wants what
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: '$mini <onboarding@resend.dev>',
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
        from: '$mini <onboarding@resend.dev>',
        to: email,
        reply_to: 'justforaistorage@gmail.com',
        subject: `You're on the list — ${appName} is coming`,
        html: `
          <div style="background:#0a0c12;padding:40px 24px;font-family:-apple-system,Helvetica,Arial,sans-serif;">
            <div style="max-width:500px;margin:0 auto;">
              <h1 style="color:#F0F0F5;font-size:22px;font-weight:700;margin-bottom:16px;">You'll be first to know.</h1>
              <p style="color:#6b7d8d;font-size:15px;line-height:1.6;margin-bottom:24px;">
                <strong style="color:#a8c8d8;">${appName}</strong> is being built right now. When it drops, you'll get an email with a direct link to install it on Slack.
              </p>
              <div style="width:60px;height:2px;background:#4dd4e6;margin-bottom:24px;"></div>
              <p style="color:#6b7d8d;font-size:13px;line-height:1.6;">
                follow the build at <a href="https://instagram.com/icebergsampson" style="color:#a8c8d8;text-decoration:none;">@icebergsampson</a>
              </p>
              <p style="color:#3a4550;font-size:11px;margin-top:40px;">igotminimoney.com</p>
            </div>
          </div>
        `,
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
