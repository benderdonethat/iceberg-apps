/**
 * The Tip — weekly cron send.
 * GET /api/tip-send
 *
 * Sends the CURRENT issue (from tip-issues.js) to every non-unsubscribed contact
 * in The Tip Resend audience. Fires via Vercel cron every Thursday.
 *
 * Protected two ways:
 *  1. Vercel cron header (x-vercel-cron) — always allowed
 *  2. Manual trigger: header x-admin-key matching ADMIN_KEY
 */

import { CURRENT } from './tip-issues.js';

const TIP_AUDIENCE_ID = '72a0e8a2-24bd-4dab-9f17-641eb20878dd';

export default async function handler(req, res) {
  const isCron = req.headers['x-vercel-cron'] === '1' || req.query?.cron === process.env.CRON_SECRET;
  const isAdmin = req.headers['x-admin-key'] && req.headers['x-admin-key'] === process.env.ADMIN_KEY;
  if (!isCron && !isAdmin) return res.status(401).json({ error: 'unauthorized' });

  const RESEND_KEY = process.env.RESEND_API_KEY;
  const RESEND_FULL = process.env.RESEND_FULL_KEY || RESEND_KEY;
  if (!RESEND_KEY || !RESEND_FULL) return res.status(500).json({ error: 'resend keys missing' });

  try {
    const contactsRes = await fetch(`https://api.resend.com/audiences/${TIP_AUDIENCE_ID}/contacts`, {
      headers: { 'Authorization': `Bearer ${RESEND_FULL}` },
    });
    const contactsData = await contactsRes.json();
    const contacts = (contactsData.data || []).filter(c => !c.unsubscribed);

    if (contacts.length === 0) {
      return res.status(200).json({ success: true, sent: 0, issue: CURRENT.number, message: 'no subscribers' });
    }

    let sent = 0;
    let failed = 0;

    for (const contact of contacts) {
      try {
        const r = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: '@icebergsampson <iceberg@freeslackapps.com>',
            to: contact.email,
            reply_to: 'justforaistorage@gmail.com',
            subject: CURRENT.subject,
            html: CURRENT.html,
            headers: { 'List-Unsubscribe': '<mailto:iceberg@freeslackapps.com?subject=unsubscribe>' },
          }),
        });
        if (r.ok) sent++; else failed++;
      } catch (e) {
        failed++;
      }
      if ((sent + failed) % 10 === 0) await new Promise(r => setTimeout(r, 1000));
    }

    return res.status(200).json({
      success: true,
      issue: CURRENT.number,
      subject: CURRENT.subject,
      sent,
      failed,
      total: contacts.length,
    });
  } catch (err) {
    console.error('The Tip send error:', err);
    return res.status(500).json({ error: err.message });
  }
}
