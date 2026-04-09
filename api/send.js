export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const { email, preferences } = req.body;
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'valid email required' });

  const prefs = preferences || {};
  const wantsReleases = prefs.releases !== false;
  const wantsNewsletter = prefs.newsletter === true;
  const wantsPrompts = prefs.prompts === true;

  const RESEND_KEY = process.env.RESEND_API_KEY;
  const RESEND_FULL = process.env.RESEND_FULL_KEY || RESEND_KEY;
  const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

  try {
    // 1. Add to audience
    if (AUDIENCE_ID) {
      await fetch(`https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_FULL}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, unsubscribed: false }),
      });
    }

    // 2. Log preferences internally
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

    // 3. Build consolidated welcome email
    const html = buildWelcomeHtml({ wantsReleases, wantsNewsletter, wantsPrompts });
    const text = buildWelcomeText({ wantsReleases, wantsNewsletter, wantsPrompts });

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'icebergsampson <iceberg@freeslackapps.com>',
        to: email,
        reply_to: 'justforaistorage@gmail.com',
        subject: 'Welcome to freeslackapps.com',
        html,
        text,
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

function buildWelcomeHtml({ wantsReleases, wantsNewsletter, wantsPrompts }) {
  const brand = '#2ba8c3';
  const dark = '#080a10';
  const gray = '#6b7d8d';
  const light = '#f0f0f5';

  let body = '';

  if (wantsReleases) {
    body += `
    <tr><td style="padding:32px 0 16px 0;">
      <h2 style="margin:0;font-size:18px;color:${light};border-bottom:2px solid ${brand};padding-bottom:8px;display:inline-block;">Your Apps</h2>
    </td></tr>
    <tr><td style="padding:0 0 8px 0;color:${gray};font-size:14px;">These are live right now. Free to install, no per-seat pricing.</td></tr>
    <tr><td style="padding:16px 0;">
      <table cellpadding="0" cellspacing="0" width="100%"><tr>
        <td style="background:#0c0e16;border:1px solid #1a1d28;border-radius:8px;padding:20px;">
          <p style="margin:0 0 4px 0;font-size:16px;font-weight:600;color:${light};">Stream Line</p>
          <p style="margin:0 0 12px 0;font-size:13px;color:${gray};">Operations bot for live streamers. Sales tracking, inventory, P&L, customer database, AI insights, revenue goals. Works with Whatnot, TikTok, eBay.</p>
          <a href="https://app-production-ef06.up.railway.app/slack/install" style="display:inline-block;padding:10px 24px;background:${brand};color:#fff;text-decoration:none;border-radius:6px;font-size:13px;font-weight:600;">Install Free</a>
        </td>
      </tr></table>
    </td></tr>
    <tr><td style="padding:16px 0;">
      <table cellpadding="0" cellspacing="0" width="100%"><tr>
        <td style="background:#0c0e16;border:1px solid #1a1d28;border-radius:8px;padding:20px;">
          <p style="margin:0 0 4px 0;font-size:16px;font-weight:600;color:${light};">Sensei</p>
          <p style="margin:0 0 12px 0;font-size:13px;color:${gray};">Team knowledge base inside Slack. Write articles, search instantly, AI-powered answers, auto-detect knowledge gaps. Replaces Guru and Notion.</p>
          <a href="https://sensei-production-1334.up.railway.app/slack/install" style="display:inline-block;padding:10px 24px;background:${brand};color:#fff;text-decoration:none;border-radius:6px;font-size:13px;font-weight:600;">Install Free</a>
        </td>
      </tr></table>
    </td></tr>
    <tr><td style="padding:0 0 8px 0;color:${gray};font-size:12px;">You will get an email when a new app ships. One email per launch, nothing extra.</td></tr>`;
  }

  if (wantsNewsletter) {
    body += `
    <tr><td style="padding:32px 0 16px 0;">
      <h2 style="margin:0;font-size:18px;color:${light};border-bottom:2px solid ${brand};padding-bottom:8px;display:inline-block;">The Newsletter</h2>
    </td></tr>
    <tr><td style="color:${gray};font-size:14px;line-height:1.6;">Every week you get one email covering what is happening in the Slack and productivity space. Industry news, a tool worth knowing about, what we are building, and one actionable tip. Under 3 minutes to read. Your first issue arrives on the next send date.</td></tr>`;
  }

  if (wantsPrompts) {
    body += `
    <tr><td style="padding:32px 0 16px 0;">
      <h2 style="margin:0;font-size:18px;color:${light};border-bottom:2px solid ${brand};padding-bottom:8px;display:inline-block;">Prompts</h2>
    </td></tr>
    <tr><td style="padding:0 0 8px 0;color:${gray};font-size:14px;">Copy and paste these directly into ChatGPT or Claude.</td></tr>`;

    const prompts = [
      { title: 'Competitive Analysis', text: 'I run a small business that uses [TOOL NAME] and I pay [PRICE] per month. Find me 3 free or cheaper alternatives that offer the same core features. For each alternative, tell me: what it does, what it costs, what it does better than my current tool, and what it does worse. Be specific and only recommend tools that actually exist.' },
      { title: 'SOPs from Scratch', text: 'I need to document our process for [PROCESS NAME]. Write a step-by-step standard operating procedure that a new employee could follow on their first day. Keep it under 500 words. Use plain language. Include what tools are needed, who is responsible for each step, and what the expected outcome looks like.' },
      { title: 'Meeting Notes Cleanup', text: 'Here are my rough meeting notes: [PASTE NOTES]. Clean these up into a structured summary with three sections: Decisions Made, Action Items (with who is responsible), and Open Questions. Remove any filler or repeated points.' },
      { title: 'Cold Outreach Message', text: 'I sell [PRODUCT/SERVICE] to [TARGET AUDIENCE]. Write a LinkedIn message under 200 characters that leads with their pain point, not my product. Make it sound like a real person wrote it. No emojis, no exclamation marks, no buzzwords.' },
      { title: 'Weekly Team Update', text: 'Write a weekly team update email based on these bullet points: [PASTE BULLETS]. Make it professional but not corporate. Lead with the most important update. Keep it under 150 words. End with one specific thing the team should focus on next week.' },
    ];

    for (const p of prompts) {
      body += `
      <tr><td style="padding:12px 0;">
        <table cellpadding="0" cellspacing="0" width="100%"><tr>
          <td style="background:#0c0e16;border:1px solid #1a1d28;border-radius:8px;padding:16px;">
            <p style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:${brand};">${p.title}</p>
            <p style="margin:0;font-size:12px;color:${gray};line-height:1.5;font-style:italic;">"${p.text}"</p>
          </td>
        </tr></table>
      </td></tr>`;
    }

    body += `<tr><td style="padding:8px 0 0 0;color:${gray};font-size:12px;">You will receive new prompts as we release them.</td></tr>`;
  }

  if (!wantsPrompts) {
    body += `
    <tr><td style="padding:32px 0 16px 0;">
      <h2 style="margin:0;font-size:18px;color:${light};border-bottom:2px solid ${brand};padding-bottom:8px;display:inline-block;">Prompts</h2>
    </td></tr>
    <tr><td style="color:${gray};font-size:14px;">We also release copy-and-paste prompts for ChatGPT and Claude that help with business operations and productivity. Sign up for those anytime at <a href="https://freeslackapps.com" style="color:${brand};text-decoration:none;">freeslackapps.com</a></td></tr>`;
  }

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${dark};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table cellpadding="0" cellspacing="0" width="100%" style="background:${dark};">
<tr><td align="center" style="padding:20px;">
<table cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;">

  <!-- Header -->
  <tr><td style="padding:32px 0 24px 0;border-bottom:2px solid ${brand};">
    <p style="margin:0;font-size:22px;font-weight:700;color:${light};">freeslackapps.com</p>
    <p style="margin:4px 0 0 0;font-size:12px;color:${gray};">@icebergsampson</p>
  </td></tr>

  <!-- Greeting -->
  <tr><td style="padding:24px 0 0 0;color:${light};font-size:15px;">Thanks for signing up. Here is everything you asked for.</td></tr>

  ${body}

  <!-- Footer -->
  <tr><td style="padding:40px 0 20px 0;border-top:1px solid #1a1d28;margin-top:32px;">
    <p style="margin:0;font-size:13px;color:${gray};">Built by <a href="https://freeslackapps.com" style="color:${brand};text-decoration:none;">freeslackapps.com</a></p>
    <p style="margin:4px 0 0 0;font-size:11px;color:#3a4550;">We build free Slack apps that replace expensive ones.</p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`;
}

function buildWelcomeText({ wantsReleases, wantsNewsletter, wantsPrompts }) {
  const sections = ['Thanks for signing up. Here is everything you asked for.\n'];

  if (wantsReleases) {
    sections.push(`YOUR APPS\n\nStream Line: Operations bot for live streamers.\nInstall: https://app-production-ef06.up.railway.app/slack/install\n\nSensei: Team knowledge base for Slack.\nInstall: https://sensei-production-1334.up.railway.app/slack/install\n`);
  }

  if (wantsNewsletter) {
    sections.push(`THE NEWSLETTER\n\nWeekly email on Slack and productivity. Under 3 minutes. Your first issue arrives on the next send date.\n`);
  }

  if (wantsPrompts) {
    sections.push(`PROMPTS\n\nVisit freeslackapps.com/prompts to see all available prompts.\n`);
  }

  sections.push(`\nfreeslackapps.com\nWe build free Slack apps that replace expensive ones.`);
  return sections.join('\n');
}
