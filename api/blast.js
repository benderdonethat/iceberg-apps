/**
 * Blast endpoint — send a new app announcement to all subscribers.
 * Protected by admin key. Call when a new app ships.
 *
 * POST /api/blast
 * Headers: x-admin-key: <your key>
 * Body: { appName, appSlug, appDescription, installUrl }
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  // Admin auth
  const adminKey = req.headers['x-admin-key'];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const { appName, appSlug, appDescription, installUrl } = req.body;
  if (!appName) return res.status(400).json({ error: 'appName required' });

  const RESEND_KEY = process.env.RESEND_API_KEY;
  const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

  if (!AUDIENCE_ID) return res.status(500).json({ error: 'no audience configured' });

  try {
    // Get all contacts from the audience
    const contactsRes = await fetch(`https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`, {
      headers: { 'Authorization': `Bearer ${RESEND_KEY}` },
    });
    const contactsData = await contactsRes.json();
    const contacts = (contactsData.data || []).filter(c => !c.unsubscribed);

    if (contacts.length === 0) {
      return res.status(200).json({ success: true, sent: 0, message: 'no subscribers' });
    }

    // Send to each contact
    let sent = 0;
    let failed = 0;

    for (const contact of contacts) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'igotminimoney <onboarding@resend.dev>',
            to: contact.email,
            reply_to: 'justforaistorage@gmail.com',
            subject: `New app just dropped — ${appName}`,
            html: `
              <div style="background:#0a0c12;padding:40px 24px;font-family:-apple-system,Helvetica,Arial,sans-serif;">
                <div style="max-width:500px;margin:0 auto;">
                  <h1 style="color:#F0F0F5;font-size:24px;font-weight:700;margin-bottom:16px;">${appName} is live.</h1>
                  <p style="color:#6b7d8d;font-size:15px;line-height:1.6;margin-bottom:24px;">
                    ${appDescription || 'A new free Slack app just shipped.'}
                  </p>
                  ${installUrl ? `
                  <a href="${installUrl}" style="display:inline-block;padding:12px 28px;background:#2ba8c3;color:white;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">Add to Slack — Free</a>
                  <br><br>
                  ` : ''}
                  <div style="width:60px;height:2px;background:#4dd4e6;margin:24px 0;"></div>
                  <p style="color:#6b7d8d;font-size:13px;line-height:1.6;">
                    See all apps at <a href="https://igotminimoney.com" style="color:#a8c8d8;text-decoration:none;">igotminimoney.com</a>
                  </p>
                  <p style="color:#3a4550;font-size:11px;margin-top:40px;">
                    You're getting this because you signed up at igotminimoney.com<br>
                    <a href="https://igotminimoney.com" style="color:#3a4550;">Unsubscribe</a>
                  </p>
                </div>
              </div>
            `,
          }),
        });
        sent++;
      } catch (e) {
        failed++;
      }

      // Rate limit — don't blast Resend too fast
      if (sent % 10 === 0) await new Promise(r => setTimeout(r, 1000));
    }

    return res.status(200).json({ success: true, sent, failed, total: contacts.length });
  } catch (err) {
    console.error('Blast error:', err);
    return res.status(500).json({ error: err.message });
  }
}
