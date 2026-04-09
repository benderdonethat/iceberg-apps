export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const { email, preferences } = req.body;
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'valid email required' });

  // Handle both old format { newsletter: true } and new format { preferences: { releases, newsletter, prompts } }
  const prefs = preferences || {};
  const wantsReleases = prefs.releases !== false;
  const wantsNewsletter = prefs.newsletter === true;
  const wantsPrompts = prefs.prompts === true;

  const RESEND_KEY = process.env.RESEND_API_KEY;
  const RESEND_FULL = process.env.RESEND_FULL_KEY || RESEND_KEY;
  const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

  try {
    // 1. Add to audience with preference tags
    if (AUDIENCE_ID) {
      await fetch(`https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_FULL}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, unsubscribed: false }),
      });
    }

    // 2. Log preferences to tracking email
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'icebergsampson <iceberg@freeslackapps.com>',
        to: 'justforaistorage@gmail.com',
        subject: `[SIGNUP] ${email}`,
        text: `Email: ${email}\nReleases: ${wantsReleases}\nNewsletter: ${wantsNewsletter}\nPrompts: ${wantsPrompts}\nTime: ${new Date().toISOString()}`,
      }),
    });

    // 3. Send confirmation — short, human, professional
    const selectedList = [];
    if (wantsReleases) selectedList.push('new app releases');
    if (wantsNewsletter) selectedList.push('the weekly newsletter');
    if (wantsPrompts) selectedList.push('prompts and resources');

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'icebergsampson <iceberg@freeslackapps.com>',
        to: email,
        reply_to: 'justforaistorage@gmail.com',
        subject: 'Confirmed',
        text: `You're signed up for ${selectedList.join(', ')}.\n\nWe build free Slack apps that replace expensive ones. No trials, no per-seat pricing. Just tools that work.\n\nfreeslackapps.com`,
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
