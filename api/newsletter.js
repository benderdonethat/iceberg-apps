/**
 * @icebergsampson Weekly Newsletter Generator + Sender
 *
 * Generates 6 AI content pieces branded to @icebergsampson and blasts to all subscribers.
 * Protected by admin key.
 *
 * POST /api/newsletter
 * Headers: x-admin-key
 * Body: { customTopic?: string, appUpdates?: string[], previewOnly?: boolean }
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const adminKey = req.headers['x-admin-key'];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const { customTopic, appUpdates, previewOnly } = req.body || {};
  const RESEND_KEY = process.env.RESEND_API_KEY;
  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

  if (!ANTHROPIC_KEY) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' });

  try {
    const content = await generateNewsletter(ANTHROPIC_KEY, customTopic, appUpdates);
    if (!content) return res.status(500).json({ error: 'content generation failed' });

    const html = buildNewsletterHTML(content);

    if (previewOnly) {
      return res.status(200).json({ success: true, preview: true, content, html });
    }

    if (!AUDIENCE_ID) return res.status(500).json({ error: 'no audience configured' });

    const contactsRes = await fetch(`https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`, {
      headers: { 'Authorization': `Bearer ${RESEND_KEY}` },
    });
    const contactsData = await contactsRes.json();
    const contacts = (contactsData.data || []).filter(c => !c.unsubscribed);

    if (contacts.length === 0) {
      return res.status(200).json({ success: true, sent: 0, message: 'no subscribers', content });
    }

    let sent = 0;
    for (const contact of contacts) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'icebergsampson <iceberg@igotminimoney.com>',
            to: contact.email,
            reply_to: 'justforaistorage@gmail.com',
            subject: content.subject,
            html,
          }),
        });
        sent++;
      } catch (e) { /* continue */ }
      if (sent % 10 === 0) await new Promise(r => setTimeout(r, 1000));
    }

    return res.status(200).json({ success: true, sent, total: contacts.length, subject: content.subject });
  } catch (err) {
    console.error('Newsletter error:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function generateNewsletter(apiKey, customTopic, appUpdates) {
  const today = new Date();
  const weekOf = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const prompt = `Generate a weekly newsletter for @icebergsampson — one person building AI-powered businesses, Slack apps, and automation systems. The brand is premium, dark, ice-blue aesthetic. The voice is direct, confident, no fluff — like a sharp friend who builds things and shares what works.

The creator (David / @icebergsampson) builds free Slack apps at igotminimoney.com. He just launched Stream Line — a free operations bot for live streamers. He documents the build process on YouTube (@manplusbrain) and Instagram (@icebergsampson).

Week of: ${weekOf}

${customTopic ? `This week's special focus: ${customTopic}` : ''}
${appUpdates ? `What we shipped this week: ${appUpdates.join(', ')}` : 'This week we continued building Stream Line and planning the next Slack app in the catalog.'}

Generate exactly 6 sections. Each must be concise, valuable, and feel like it was written by someone who actually builds things — not a marketing team. No filler. Every sentence earns its place.

CRITICAL WRITING RULES — FOLLOW THESE EXACTLY:
- Write like a real person texting a friend, not a blog post or corporate email
- NEVER use em dashes (—). Use periods, commas, or just start a new sentence
- NEVER use "dive into", "deep dive", "leverage", "unlock", "empower", "harness", "game-changer", "seamlessly", "robust", "cutting-edge", "revolutionize", "streamline" (ironic but no), "elevate", "supercharge"
- NEVER use "Here's the thing:", "Let me be honest:", "I'll be real:", or any throat-clearing
- NEVER use bullet points with dashes. If listing things, use plain sentences or numbered items
- Keep sentences short. Mix up sentence length. Some long. Some not.
- Use contractions (don't, can't, won't, it's). Nobody writes "do not" in a casual email
- Use "I" not "we" — this is one person writing
- Swear if it fits but don't force it
- Sound like someone who's tired from building all day but excited about what they made
- The reader should feel like they're reading a text from someone they respect, not a newsletter

SECTIONS:

1. **WHAT I BUILT THIS WEEK** — First person. What @icebergsampson actually worked on. ${appUpdates ? `Include: ${appUpdates.join(', ')}` : 'Reference Stream Line development, a new feature, or progress on the next app.'} Make it specific and real. 3-4 sentences.

2. **AI TOOL WORTH KNOWING** — A real, specific AI tool that builders/creators should know about. Name it, what it does in 2 sentences, one specific use case. Must be a tool that actually exists.

3. **PROMPT YOU CAN STEAL** — A copy-paste-ready prompt for ChatGPT, Claude, or Midjourney. Something actually useful for content creation, business operations, or productivity. Include the full prompt text ready to use.

4. **HOW I SOLVED IT** — Take one technical or business problem and break down how it was solved. Teach something actionable. Written like you're explaining it to a friend who builds things. 3-4 sentences.

5. **AI PULSE** — One thing that happened in AI this week worth paying attention to. A new model, a company move, a trend. Short opinionated take — what it means for builders. One paragraph.

6. **ONE QUESTION** — End with a single thought-provoking question about AI, building, or the future. No answer. Just the question. Make it hit.

Also generate:
- A compelling email subject line (under 50 chars, not clickbait, genuinely interesting)
- A one-sentence preview text for inbox preview

FORMAT: Return as valid JSON:
{
  "subject": "...",
  "preview": "...",
  "sections": [
    { "type": "shipped", "title": "What I Built This Week", "heading": "headline", "body": "..." },
    { "type": "tool", "title": "AI Tool Worth Knowing", "heading": "Tool Name", "body": "..." },
    { "type": "prompt", "title": "Prompt You Can Steal", "heading": "What it does", "body": "...", "prompt_text": "the actual prompt" },
    { "type": "build", "title": "How I Solved It", "heading": "headline", "body": "..." },
    { "type": "pulse", "title": "AI Pulse", "heading": "headline", "body": "..." },
    { "type": "question", "title": "One Question", "body": "the question" }
  ]
}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await response.json();
  const text = data.content?.[0]?.text || '';

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error('Failed to parse newsletter JSON:', e.message);
  }

  return null;
}

function buildNewsletterHTML(content) {
  const sections = content.sections || [];

  const sectionIcons = {
    shipped: '🚀',
    tool: '🔧',
    prompt: '💬',
    build: '🏗️',
    pulse: '⚡',
    question: '🧊',
  };

  let sectionsHTML = '';

  for (const section of sections) {
    const icon = sectionIcons[section.type] || '📌';

    if (section.type === 'prompt' && section.prompt_text) {
      sectionsHTML += `
        <tr><td style="padding:0 0 36px 0;">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#4dd4e6;font-weight:700;margin-bottom:8px;">${icon} ${section.title}</div>
          <div style="font-size:18px;font-weight:700;color:#f0f0f5;margin-bottom:10px;">${section.heading || ''}</div>
          <div style="font-size:14px;color:#8b9caa;line-height:1.7;margin-bottom:14px;">${section.body}</div>
          <div style="background:#0f1a28;border-left:3px solid #4dd4e6;border-radius:6px;padding:16px 18px;font-family:'Courier New',monospace;font-size:13px;color:#a8c8d8;line-height:1.6;white-space:pre-wrap;">${section.prompt_text}</div>
        </td></tr>
      `;
    } else if (section.type === 'question') {
      sectionsHTML += `
        <tr><td style="padding:32px 0;text-align:center;">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#4dd4e6;font-weight:700;margin-bottom:14px;">${icon} ${section.title}</div>
          <div style="font-size:22px;font-weight:700;color:#f0f0f5;font-style:italic;line-height:1.4;padding:0 12px;">${section.body}</div>
        </td></tr>
      `;
    } else {
      sectionsHTML += `
        <tr><td style="padding:0 0 36px 0;">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#4dd4e6;font-weight:700;margin-bottom:8px;">${icon} ${section.title}</div>
          <div style="font-size:18px;font-weight:700;color:#f0f0f5;margin-bottom:10px;">${section.heading || ''}</div>
          <div style="font-size:14px;color:#8b9caa;line-height:1.7;">${section.body}</div>
        </td></tr>
      `;
    }
  }

  return `
    <div style="background:#080a10;padding:0;font-family:-apple-system,'Helvetica Neue',Helvetica,Arial,sans-serif;margin:0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#080a10;">
        <tr><td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

            <!-- HEADER -->
            <tr><td style="padding:40px 24px 32px;text-align:center;border-bottom:1px solid rgba(168,200,216,0.08);">
              <div style="font-size:13px;font-weight:800;color:#4dd4e6;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:6px;">@icebergsampson</div>
              <div style="font-size:24px;font-weight:800;color:#f0f0f5;letter-spacing:-0.02em;">Weekly Drop</div>
              <div style="font-size:12px;color:#4d6070;margin-top:6px;">${content.preview || 'What I built, what I found, what matters.'}</div>
            </td></tr>

            <!-- CONTENT -->
            <tr><td style="padding:36px 24px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${sectionsHTML}
              </table>
            </td></tr>

            <!-- CTA -->
            <tr><td style="padding:12px 24px 36px;text-align:center;">
              <div style="background:#0f1a28;border:1px solid rgba(77,212,230,0.15);border-radius:10px;padding:24px;">
                <div style="font-size:15px;font-weight:700;color:#f0f0f5;margin-bottom:8px;">Free Slack apps that actually work</div>
                <div style="font-size:13px;color:#6b7d8d;margin-bottom:16px;">Stream Line is live. More apps shipping every week.</div>
                <a href="https://igotminimoney.com" style="display:inline-block;padding:10px 24px;background:#2ba8c3;color:white;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">See all apps</a>
              </div>
            </td></tr>

            <!-- FOOTER -->
            <tr><td style="border-top:1px solid rgba(168,200,216,0.06);padding:28px 24px;text-align:center;">
              <div style="margin-bottom:10px;">
                <a href="https://instagram.com/icebergsampson" style="color:#4d6070;text-decoration:none;font-size:12px;margin:0 10px;">Instagram</a>
                <a href="https://youtube.com/@manplusbrain" style="color:#4d6070;text-decoration:none;font-size:12px;margin:0 10px;">YouTube</a>
                <a href="https://igotminimoney.com" style="color:#4d6070;text-decoration:none;font-size:12px;margin:0 10px;">Apps</a>
              </div>
              <div style="font-size:11px;color:#2a3540;margin-top:14px;">
                You signed up at igotminimoney.com<br>
                <a href="https://igotminimoney.com" style="color:#2a3540;">Unsubscribe</a>
              </div>
            </td></tr>

          </table>
        </td></tr>
      </table>
    </div>
  `;
}
