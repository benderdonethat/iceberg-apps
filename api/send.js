export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const { email, newsletter } = req.body;
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'valid email required' });

  const RESEND_KEY = process.env.RESEND_API_KEY;
  const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

  try {
    // 1. Add to audience
    if (AUDIENCE_ID) {
      await fetch(`https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
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
        subject: newsletter ? "Your first Weekly Drop" : "You're on the list",
        html: buildWelcomeHTML(newsletter),
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

function buildWelcomeHTML(isNewsletter) {
  return `
    <div style="background:#080a10;padding:0;font-family:-apple-system,'Helvetica Neue',Helvetica,Arial,sans-serif;margin:0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#080a10;">
        <tr><td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

            <!-- HEADER -->
            <tr><td style="padding:40px 24px 28px;text-align:center;border-bottom:1px solid rgba(168,200,216,0.08);">
              <div style="font-size:13px;font-weight:800;color:#4dd4e6;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:6px;">@icebergsampson</div>
              <div style="font-size:24px;font-weight:800;color:#f0f0f5;letter-spacing:-0.02em;">${isNewsletter ? 'Welcome to the Weekly Drop' : "You're in."}</div>
            </td></tr>

            <!-- BODY -->
            <tr><td style="padding:32px 24px;">
              <div style="font-size:15px;color:#8b9caa;line-height:1.7;margin-bottom:24px;">
                ${isNewsletter
                  ? "Every week you'll get one email with what I built, what AI tools I found worth using, a prompt you can steal, and one question to think about. No filler. No fluff. Just things that are actually useful."
                  : "You'll hear from us when we ship something new — new Slack apps, major updates, and things worth knowing about. Nothing else."
                }
              </div>

              <!-- WHAT YOU GET -->
              <div style="background:#0f1a28;border:1px solid rgba(77,212,230,0.1);border-radius:10px;padding:24px;margin-bottom:24px;">
                <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#4dd4e6;font-weight:700;margin-bottom:14px;">What to expect</div>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr><td style="padding:6px 0;font-size:14px;color:#a8c8d8;">🚀</td><td style="padding:6px 8px;font-size:14px;color:#8b9caa;">What I built this week</td></tr>
                  <tr><td style="padding:6px 0;font-size:14px;color:#a8c8d8;">🔧</td><td style="padding:6px 8px;font-size:14px;color:#8b9caa;">AI tools worth knowing about</td></tr>
                  <tr><td style="padding:6px 0;font-size:14px;color:#a8c8d8;">💬</td><td style="padding:6px 8px;font-size:14px;color:#8b9caa;">A prompt you can copy and use today</td></tr>
                  <tr><td style="padding:6px 0;font-size:14px;color:#a8c8d8;">🏗️</td><td style="padding:6px 8px;font-size:14px;color:#8b9caa;">How I solved a real problem</td></tr>
                  <tr><td style="padding:6px 0;font-size:14px;color:#a8c8d8;">⚡</td><td style="padding:6px 8px;font-size:14px;color:#8b9caa;">One AI industry take that matters</td></tr>
                  <tr><td style="padding:6px 0;font-size:14px;color:#a8c8d8;">🧊</td><td style="padding:6px 8px;font-size:14px;color:#8b9caa;">One question to sit with</td></tr>
                </table>
              </div>

              <!-- STREAM LINE PROMO -->
              <div style="background:#0f1a28;border:1px solid rgba(77,212,230,0.1);border-radius:10px;padding:24px;margin-bottom:24px;">
                <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#4dd4e6;font-weight:700;margin-bottom:10px;">Now live</div>
                <div style="font-size:17px;font-weight:700;color:#f0f0f5;margin-bottom:8px;">Stream Line — Free Slack Bot for Streamers</div>
                <div style="font-size:13px;color:#6b7d8d;line-height:1.6;margin-bottom:14px;">Track sales, manage inventory, calculate platform fees, set revenue goals, and get AI insights. Works with Whatnot, TikTok, Twitch, YouTube, eBay, and more.</div>
                <a href="https://app-production-ef06.up.railway.app/slack/install" style="display:inline-block;padding:10px 20px;background:#2ba8c3;color:white;text-decoration:none;border-radius:6px;font-weight:600;font-size:13px;">Add to Slack — Free</a>
              </div>

              <!-- SEE ALL APPS -->
              <div style="text-align:center;margin-bottom:16px;">
                <a href="https://freeslackapps.com" style="display:inline-block;padding:10px 24px;background:transparent;border:1px solid rgba(77,212,230,0.25);color:#4dd4e6;text-decoration:none;border-radius:6px;font-weight:600;font-size:13px;">See all apps at freeslackapps.com</a>
              </div>
            </td></tr>

            <!-- FOOTER -->
            <tr><td style="border-top:1px solid rgba(168,200,216,0.06);padding:24px;text-align:center;">
              <div style="margin-bottom:10px;">
                <a href="https://instagram.com/icebergsampson" style="color:#4d6070;text-decoration:none;font-size:12px;margin:0 10px;">Instagram</a>
                <a href="https://youtube.com/@manplusbrain" style="color:#4d6070;text-decoration:none;font-size:12px;margin:0 10px;">YouTube</a>
                <a href="https://freeslackapps.com" style="color:#4d6070;text-decoration:none;font-size:12px;margin:0 10px;">Apps</a>
              </div>
              <div style="font-size:11px;color:#2a3540;margin-top:14px;">
                You signed up at freeslackapps.com<br>
                <a href="https://freeslackapps.com" style="color:#2a3540;">Unsubscribe</a>
              </div>
            </td></tr>

          </table>
        </td></tr>
      </table>
    </div>
  `;
}
