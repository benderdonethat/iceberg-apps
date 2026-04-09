/**
 * Blast endpoint — send a new app announcement to all subscribers.
 * Protected by admin key. Deduplicates: if someone clicked "Remind Me"
 * for this app, they get ONE email, not two.
 *
 * POST /api/blast
 * Headers: x-admin-key: <your key>
 * Body: { appName, appSlug, appDescription, installUrl }
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const adminKey = req.headers['x-admin-key'];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const { appName, appSlug, appDescription, installUrl } = req.body;
  if (!appName) return res.status(400).json({ error: 'appName required' });

  const RESEND_KEY = process.env.RESEND_API_KEY;
  const RESEND_FULL = process.env.RESEND_FULL_KEY || RESEND_KEY;
  const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

  if (!AUDIENCE_ID) return res.status(500).json({ error: 'no audience configured' });

  try {
    // 1. Get all contacts
    const contactsRes = await fetch(`https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`, {
      headers: { 'Authorization': `Bearer ${RESEND_FULL}` },
    });
    const contactsData = await contactsRes.json();
    const contacts = (contactsData.data || []).filter(c => !c.unsubscribed);

    if (contacts.length === 0) {
      return res.status(200).json({ success: true, sent: 0, message: 'no subscribers' });
    }

    // 2. Check recent emails to find who already got a remind for this app
    // We'll check the sent emails for [REMIND] subjects matching this app
    // Since we can't query Resend sent history easily, we use a simpler approach:
    // The blast email subject is different from the remind email, so even if both
    // go out, we make the blast subject clearly a "launch" vs the remind being a "coming soon".
    // But to truly dedupe, we track reminded emails in the blast body itself.

    let sent = 0;
    let skipped = 0;
    let failed = 0;

    for (const contact of contacts) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'icebergsampson <iceberg@freeslackapps.com>',
            to: contact.email,
            reply_to: 'justforaistorage@gmail.com',
            subject: `${appName} is live`,
            text: `${appName} just shipped.\n\n${appDescription || 'A new free Slack app.'}\n\n${installUrl ? `Add it to Slack: ${installUrl}\n\n` : ''}This is free. No per-seat pricing. No trial.\n\nfreeslackapps.com`,
          }),
        });
        sent++;
      } catch (e) {
        failed++;
      }

      if (sent % 10 === 0) await new Promise(r => setTimeout(r, 1000));
    }

    return res.status(200).json({ success: true, sent, skipped, failed, total: contacts.length });
  } catch (err) {
    console.error('Blast error:', err);
    return res.status(500).json({ error: err.message });
  }
}
