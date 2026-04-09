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

    // 3. Build ONE consolidated welcome email based on their selections
    const emailBody = buildWelcomeEmail({ wantsReleases, wantsNewsletter, wantsPrompts });

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'icebergsampson <iceberg@freeslackapps.com>',
        to: email,
        reply_to: 'justforaistorage@gmail.com',
        subject: 'Welcome to freeslackapps.com',
        text: emailBody,
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

function buildWelcomeEmail({ wantsReleases, wantsNewsletter, wantsPrompts }) {
  const sections = [];

  // Opening
  sections.push('Thanks for signing up. Here is everything you asked for.\n');

  // Live apps (if they want releases)
  if (wantsReleases) {
    sections.push(
`YOUR APPS

These are live right now. Free to install, no per-seat pricing.

Stream Line: Operations bot for live streamers. Sales tracking, inventory, P&L, customer database, AI insights, revenue goals, CSV export. Works with Whatnot, TikTok, eBay, and more.
Install: https://app-production-ef06.up.railway.app/slack/install

Sensei: Team knowledge base that lives inside Slack. Write articles, search instantly, link topics, auto-detect knowledge gaps. Replaces Guru and Notion for teams that don't want to pay $7/user/month.
Install: https://sensei-production-1334.up.railway.app/slack/install

You will get an email when a new app ships. One email per launch, nothing extra.`
    );
  }

  // Newsletter (if they want it)
  if (wantsNewsletter) {
    sections.push(
`\nTHE NEWSLETTER

Every week you get one email covering what is happening in the Slack and productivity space. It includes industry news, a tool worth knowing about, what we are building, and one actionable tip you can use that day. Under 3 minutes to read.

Your first issue will arrive on the next send date.`
    );
  }

  // Prompts (if they want them)
  if (wantsPrompts) {
    sections.push(
`\nPROMPTS

Here are the prompts currently available. Copy and paste these directly into ChatGPT or Claude.

PROMPT 1: Competitive Analysis
"I run a small business that uses [TOOL NAME] and I pay [PRICE] per month. Find me 3 free or cheaper alternatives that offer the same core features. For each alternative, tell me: what it does, what it costs, what it does better than my current tool, and what it does worse. Be specific and only recommend tools that actually exist."

PROMPT 2: SOPs from Scratch
"I need to document our process for [PROCESS NAME]. Write a step-by-step standard operating procedure that a new employee could follow on their first day. Keep it under 500 words. Use plain language. Include what tools are needed, who is responsible for each step, and what the expected outcome looks like."

PROMPT 3: Meeting Notes Cleanup
"Here are my rough meeting notes: [PASTE NOTES]. Clean these up into a structured summary with three sections: Decisions Made, Action Items (with who is responsible), and Open Questions. Remove any filler or repeated points."

PROMPT 4: Cold Outreach Message
"I sell [PRODUCT/SERVICE] to [TARGET AUDIENCE]. Write a LinkedIn message under 200 characters that leads with their pain point, not my product. Make it sound like a real person wrote it. No emojis, no exclamation marks, no buzzwords."

PROMPT 5: Weekly Team Update
"Write a weekly team update email based on these bullet points: [PASTE BULLETS]. Make it professional but not corporate. Lead with the most important update. Keep it under 150 words. End with one specific thing the team should focus on next week."

You will receive new prompts as we release them.`
    );
  }

  // Subscribe to prompts CTA (only if they didn't select prompts)
  if (!wantsPrompts) {
    sections.push(
`\nPROMPTS

We also release copy-and-paste prompts for ChatGPT and Claude that help with business operations, team communication, and productivity. You can sign up for those anytime at freeslackapps.com`
    );
  }

  // Footer
  sections.push(
`\nfreeslackapps.com
We build free Slack apps that replace expensive ones.`
  );

  return sections.join('\n');
}
