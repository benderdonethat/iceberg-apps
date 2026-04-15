/**
 * The Tip — subscriber signup.
 * POST /api/tip-signup
 * Body: { email }
 *
 * 1. Adds email to The Tip Resend audience.
 * 2. If today is the send date of the current issue (Thursday release day),
 *    also sends the current issue immediately so same-day signups aren't missed.
 * 3. Otherwise, does NOT send back-issues. The subscriber waits for next Thursday's cron.
 *
 * Notifies admin of new signup.
 */

import { CURRENT, isSendDay } from './tip-issues.js';

const TIP_AUDIENCE_ID = '72a0e8a2-24bd-4dab-9f17-641eb20878dd';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const { email } = req.body || {};
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'valid email required' });

  const RESEND_KEY = process.env.RESEND_API_KEY;
  const RESEND_FULL = process.env.RESEND_FULL_KEY || RESEND_KEY;
  if (!RESEND_KEY || !RESEND_FULL) return res.status(500).json({ error: 'resend keys missing' });

  try {
    // Add to The Tip audience
    await fetch(`https://api.resend.com/audiences/${TIP_AUDIENCE_ID}/contacts`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_FULL}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, unsubscribed: false }),
    });

    // Admin notification (plain-text alert, same pattern as existing send.js)
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: '@icebergsampson <iceberg@freeslackapps.com>',
        to: 'justforaistorage@gmail.com',
        subject: `[TIP SIGNUP] ${email}`,
        text: `New Tip subscriber: ${email}\nTime: ${new Date().toISOString()}\nToday is send day: ${isSendDay()}`,
      }),
    }).catch(() => { /* fire and forget */ });

    // If today is send day, also send the current issue immediately
    let sameDay = false;
    if (isSendDay()) {
      const sendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: '@icebergsampson <iceberg@freeslackapps.com>',
          to: email,
          reply_to: 'justforaistorage@gmail.com',
          subject: CURRENT.subject,
          html: CURRENT.html,
          headers: { 'List-Unsubscribe': '<mailto:iceberg@freeslackapps.com?subject=unsubscribe>' },
        }),
      });
      sameDay = sendRes.ok;
    }

    return res.status(200).json({
      success: true,
      email,
      nextIssue: CURRENT.number + (sameDay ? 1 : 0),
      sentToday: sameDay,
      message: sameDay
        ? `Welcome. Today's issue is on its way. Next issue ships next Thursday.`
        : `Welcome. First issue ships on the next Thursday.`,
    });
  } catch (err) {
    console.error('Tip signup error:', err);
    return res.status(500).json({ error: err.message });
  }
}
