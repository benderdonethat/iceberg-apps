/**
 * ManPlusBrain Weekly Newsletter Generator + Sender
 *
 * Generates 5-7 AI content pieces and blasts to all subscribers.
 * Protected by admin key.
 *
 * POST /api/newsletter
 * Headers: x-admin-key
 * Body: { customTopic?: string, appUpdates?: string[] }
 *
 * Content categories (picks 5-7 each week):
 * 1. AI Tool of the Week — a real tool worth knowing about
 * 2. Prompt of the Week — a reusable prompt for any creator
 * 3. What We Shipped — app updates, new features, new bots
 * 4. Build Breakdown — how we built something, simplified
 * 5. AI Industry Pulse — one notable thing that happened in AI
 * 6. Creator Tip — tactical advice for streamers/creators using AI
 * 7. The Question — a thought-provoking question about AI + humans
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
    // 1. Generate newsletter content
    const content = await generateNewsletter(ANTHROPIC_KEY, customTopic, appUpdates);

    if (!content) return res.status(500).json({ error: 'content generation failed' });

    // 2. Build the HTML email
    const html = buildNewsletterHTML(content);

    // 3. Preview mode — return HTML without sending
    if (previewOnly) {
      return res.status(200).json({ success: true, preview: true, content, html });
    }

    // 4. Get subscribers
    if (!AUDIENCE_ID) return res.status(500).json({ error: 'no audience configured' });

    const contactsRes = await fetch(`https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`, {
      headers: { 'Authorization': `Bearer ${RESEND_KEY}` },
    });
    const contactsData = await contactsRes.json();
    const contacts = (contactsData.data || []).filter(c => !c.unsubscribed);

    if (contacts.length === 0) {
      return res.status(200).json({ success: true, sent: 0, message: 'no subscribers', content });
    }

    // 5. Send to all subscribers
    let sent = 0;
    for (const contact of contacts) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'ManPlusBrain <onboarding@resend.dev>',
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

  const prompt = `Generate a weekly newsletter for "ManPlusBrain" — a brand about one person building AI-powered businesses and tools.

The creator (David / @icebergsampson) builds Slack apps, automation systems, and AI tools. He documents everything on YouTube (@manplusbrain).

Generate exactly 6 sections for this week's newsletter. Each section should be concise, valuable, and written in a direct, confident voice. No fluff. No corporate speak. Write like a smart friend sharing what they found this week.

${customTopic ? `This week's special focus: ${customTopic}` : ''}
${appUpdates ? `App updates to mention: ${appUpdates.join(', ')}` : ''}

SECTIONS TO GENERATE:

1. **AI TOOL OF THE WEEK** — A real, specific AI tool that creators/builders should know about. Name it, explain what it does in 2 sentences, and give one specific use case. Must be a real tool that exists.

2. **PROMPT OF THE WEEK** — A copy-paste-ready prompt for ChatGPT, Claude, or Midjourney. Something actually useful — for content creation, business, or productivity. Include the full prompt text.

3. **WHAT WE SHIPPED** — What the ManPlusBrain team built or launched this week. ${appUpdates ? `Include: ${appUpdates.join(', ')}` : 'Make up a plausible update about building a new Slack app or feature.'} Keep it real and specific.

4. **BUILD BREAKDOWN** — Take one technical thing and explain it simply. How we solved a specific problem, built a specific feature, or made a specific decision. Teach something actionable in 3-4 sentences.

5. **AI PULSE** — One notable thing that happened in AI this week. A new model release, a company move, a breakthrough, or a trend. One paragraph, opinionated take.

6. **THE QUESTION** — End with a thought-provoking one-line question about AI, building, or the future. No answer. Just the question.

Also generate:
- A compelling email subject line (under 50 chars, no clickbait, just interesting)
- A one-sentence preview text (shows in email inbox preview)

FORMAT: Return as JSON with this structure:
{
  "subject": "...",
  "preview": "...",
  "sections": [
    { "type": "tool", "title": "AI Tool of the Week", "heading": "Tool Name", "body": "..." },
    { "type": "prompt", "title": "Prompt of the Week", "heading": "What it does", "body": "...", "prompt_text": "the actual prompt" },
    { "type": "shipped", "title": "What We Shipped", "heading": "headline", "body": "..." },
    { "type": "build", "title": "Build Breakdown", "heading": "headline", "body": "..." },
    { "type": "pulse", "title": "AI Pulse", "heading": "headline", "body": "..." },
    { "type": "question", "title": "The Question", "body": "the question" }
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

  // Parse JSON from the response
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
    tool: '🔧',
    prompt: '💬',
    shipped: '🚀',
    build: '🏗️',
    pulse: '⚡',
    question: '🤔',
  };

  let sectionsHTML = '';

  for (const section of sections) {
    const icon = sectionIcons[section.type] || '📌';

    if (section.type === 'prompt' && section.prompt_text) {
      sectionsHTML += `
        <div style="margin-bottom:32px;">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#4dd4e6;font-weight:700;margin-bottom:6px;">${icon} ${section.title}</div>
          <div style="font-size:17px;font-weight:700;color:#f0f0f5;margin-bottom:8px;">${section.heading || ''}</div>
          <div style="font-size:14px;color:#8b9caa;line-height:1.6;margin-bottom:12px;">${section.body}</div>
          <div style="background:#142030;border:1px solid rgba(168,200,216,0.12);border-radius:8px;padding:14px 16px;font-family:monospace;font-size:13px;color:#a8c8d8;line-height:1.5;white-space:pre-wrap;">${section.prompt_text}</div>
        </div>
      `;
    } else if (section.type === 'question') {
      sectionsHTML += `
        <div style="margin-bottom:32px;text-align:center;padding:24px 0;">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#4dd4e6;font-weight:700;margin-bottom:12px;">${icon} ${section.title}</div>
          <div style="font-size:20px;font-weight:700;color:#f0f0f5;font-style:italic;line-height:1.4;">${section.body}</div>
        </div>
      `;
    } else {
      sectionsHTML += `
        <div style="margin-bottom:32px;">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#4dd4e6;font-weight:700;margin-bottom:6px;">${icon} ${section.title}</div>
          <div style="font-size:17px;font-weight:700;color:#f0f0f5;margin-bottom:8px;">${section.heading || ''}</div>
          <div style="font-size:14px;color:#8b9caa;line-height:1.6;">${section.body}</div>
        </div>
      `;
    }
  }

  return `
    <div style="background:#0a0c12;padding:0;font-family:-apple-system,Helvetica,Arial,sans-serif;">
      <!-- Header -->
      <div style="padding:32px 24px 24px;text-align:center;border-bottom:1px solid rgba(168,200,216,0.08);">
        <div style="font-size:22px;font-weight:800;color:#f0f0f5;letter-spacing:-0.02em;">ManPlusBrain</div>
        <div style="font-size:12px;color:#4d6070;margin-top:4px;">Weekly AI intelligence for builders</div>
      </div>

      <!-- Content -->
      <div style="max-width:520px;margin:0 auto;padding:32px 24px;">
        ${sectionsHTML}
      </div>

      <!-- Footer -->
      <div style="border-top:1px solid rgba(168,200,216,0.08);padding:24px;text-align:center;">
        <div style="margin-bottom:12px;">
          <a href="https://youtube.com/@manplusbrain" style="color:#4dd4e6;text-decoration:none;font-size:13px;font-weight:600;">Watch on YouTube →</a>
        </div>
        <div style="margin-bottom:12px;">
          <a href="https://instagram.com/icebergsampson" style="color:#6b7d8d;text-decoration:none;font-size:12px;">@icebergsampson</a>
          <span style="color:#3a4550;margin:0 8px;">·</span>
          <a href="https://igotminimoney.com" style="color:#6b7d8d;text-decoration:none;font-size:12px;">igotminimoney.com</a>
        </div>
        <div style="font-size:11px;color:#3a4550;margin-top:16px;">
          You signed up at igotminimoney.com<br>
          <a href="https://igotminimoney.com" style="color:#3a4550;">Unsubscribe</a>
        </div>
      </div>
    </div>
  `;
}
