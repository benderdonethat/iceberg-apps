/**
 * Weekly Newsletter Generator + Sender
 *
 * Professional newsletter modeled after Superhuman.ai structure.
 * Clean, scannable, value-first. No emojis. No fluff.
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
  const RESEND_FULL = process.env.RESEND_FULL_KEY || RESEND_KEY;

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
      headers: { 'Authorization': `Bearer ${RESEND_FULL}` },
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
            from: 'icebergsampson <iceberg@freeslackapps.com>',
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

  const prompt = `You are writing a professional weekly newsletter for freeslackapps.com. The company builds free Slack apps that compete with expensive paid alternatives. The founder is @icebergsampson.

This newsletter goes to business professionals, team leads, founders, and operations people who use Slack daily. It must deliver real value in under 3 minutes of reading.

REFERENCE: Study how Superhuman.ai structures their newsletter. That is the quality bar. Clean, scannable, professional, informative, no wasted words.

Week of: ${weekOf}
${customTopic ? `Focus topic: ${customTopic}` : ''}
${appUpdates ? `What shipped this week: ${appUpdates.join(', ')}` : ''}

STRUCTURE (follow this exactly):

1. OPENING (2-3 sentences)
Set up the week. What's happening in the Slack/productivity/AI space that matters to our readers. Direct, confident, no greeting fluff. Start with a strong statement or observation.

2. TODAY IN SLACK (3 items)
Three newsworthy items about Slack, workplace tools, or the productivity space. Each item: bold headline + 2-3 sentence explanation. Focus on what changed, why it matters, and who it affects. Use real companies, real numbers, real developments.

3. THE BUILD (1 item)
What we shipped or are building at freeslackapps.com this week. Specific details about a feature, a new app, or a technical decision. Written in first person. This is the behind-the-scenes section. 3-4 sentences.

4. TOOL OF THE WEEK (1 item)
One specific tool (AI or productivity) worth knowing about. Name it, what it does, one concrete use case. Must be a real tool that exists. 2-3 sentences. No hype words.

5. INDUSTRY INSIGHT (1 item)
One trend, data point, or shift in the workplace tools market. Analytical tone. What it means for small teams who use Slack. Reference real data or reports when possible. One short paragraph.

6. ACTIONABLE TIP (1 item)
One specific thing the reader can do today to improve their Slack workflow, team productivity, or tool stack. Step-by-step if needed. Practical, not theoretical. 2-4 sentences.

WRITING RULES:
- Professional tone. Not corporate, not casual. Think: smart colleague who respects your time.
- No emojis anywhere. Zero. None.
- NEVER use "---", "—", or any dash-based separators or em dashes in the content. Use periods and new sentences instead.
- No exclamation marks except in rare cases where emphasis is earned.
- No "Hey there", "Happy Monday", or any greeting filler.
- No em dashes. Use periods and commas.
- Short paragraphs. One idea per paragraph.
- Bold key terms and company names.
- No buzzwords: leverage, unlock, empower, game-changer, cutting-edge, revolutionize, supercharge, deep dive.
- Every sentence must earn its place. If removing it doesn't change the meaning, remove it.
- Use "we" for company things, "I" for personal observations.
- Numbers and specifics over vague claims.

SUBJECT LINE RULES:
- Under 50 characters
- Informative, not clickbait
- Should tell the reader what they'll learn

Generate a subject line and preview text (one sentence for inbox preview).

FORMAT: Return as valid JSON:
{
  "subject": "subject line under 50 chars",
  "preview": "one sentence preview for inbox",
  "opening": "2-3 sentence opening paragraph",
  "news": [
    { "headline": "Bold headline", "body": "2-3 sentence explanation" },
    { "headline": "Bold headline", "body": "2-3 sentence explanation" },
    { "headline": "Bold headline", "body": "2-3 sentence explanation" }
  ],
  "build": { "headline": "What we shipped", "body": "3-4 sentences" },
  "tool": { "name": "Tool Name", "body": "2-3 sentences about it" },
  "insight": { "headline": "Trend headline", "body": "One paragraph" },
  "tip": { "headline": "Tip headline", "body": "2-4 sentences, actionable" }
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
      max_tokens: 3000,
      tools: [{ type: 'web_search_20250305' }],
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await response.json();

  if (data.error) {
    console.error('Claude API error:', JSON.stringify(data.error));
    // Retry without web search
    const retryRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const retryData = await retryRes.json();
    if (retryData.error) {
      console.error('Claude retry error:', JSON.stringify(retryData.error));
      return null;
    }
    const retryText = (retryData.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n');
    try {
      const match = retryText.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
    } catch (e) {
      console.error('Retry parse error:', e.message);
    }
    return null;
  }

  const textBlocks = (data.content || []).filter(b => b.type === 'text').map(b => b.text);
  const text = textBlocks.join('\n');

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error('Failed to parse newsletter JSON:', e.message);
  }

  return null;
}

function mdBold(text) {
  return (text || '').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

function buildNewsletterHTML(content) {
  let newsHTML = '';
  for (const item of (content.news || [])) {
    newsHTML += `
      <tr><td style="padding:0 0 20px 0;">
        <div style="font-size:15px;font-weight:700;color:#1a1a1a;margin-bottom:6px;">${mdBold(item.headline)}</div>
        <div style="font-size:14px;color:#4a4a4a;line-height:1.65;">${mdBold(item.body)}</div>
      </td></tr>
    `;
  }

  return `
    <div style="background:#ffffff;padding:0;font-family:-apple-system,'Helvetica Neue',Helvetica,Arial,sans-serif;margin:0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
        <tr><td align="center">
          <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

            <!-- HEADER -->
            <tr><td style="padding:40px 24px 24px;">
              <div style="font-size:11px;font-weight:700;color:#999;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px;">freeslackapps.com</div>
              <div style="font-size:22px;font-weight:700;color:#1a1a1a;line-height:1.3;">${content.subject}</div>
            </td></tr>

            <!-- OPENING -->
            <tr><td style="padding:0 24px 28px;">
              <div style="font-size:15px;color:#333;line-height:1.7;">${mdBold(content.opening)}</div>
            </td></tr>

            <!-- DIVIDER -->
            <tr><td style="padding:0 24px;"><div style="border-top:1px solid #eee;"></div></td></tr>

            <!-- TODAY IN SLACK -->
            <tr><td style="padding:28px 24px 8px;">
              <div style="font-size:11px;font-weight:700;color:#999;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:16px;">Today in Slack</div>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${newsHTML}
              </table>
            </td></tr>

            <!-- DIVIDER -->
            <tr><td style="padding:0 24px;"><div style="border-top:1px solid #eee;"></div></td></tr>

            <!-- THE BUILD -->
            <tr><td style="padding:28px 24px;">
              <div style="font-size:11px;font-weight:700;color:#999;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px;">The Build</div>
              <div style="font-size:15px;font-weight:700;color:#1a1a1a;margin-bottom:8px;">${mdBold(content.build?.headline || '')}</div>
              <div style="font-size:14px;color:#4a4a4a;line-height:1.65;">${mdBold(content.build?.body || '')}</div>
            </td></tr>

            <!-- DIVIDER -->
            <tr><td style="padding:0 24px;"><div style="border-top:1px solid #eee;"></div></td></tr>

            <!-- TOOL OF THE WEEK -->
            <tr><td style="padding:28px 24px;">
              <div style="font-size:11px;font-weight:700;color:#999;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px;">Tool of the Week</div>
              <div style="font-size:15px;font-weight:700;color:#1a1a1a;margin-bottom:8px;">${mdBold(content.tool?.name || '')}</div>
              <div style="font-size:14px;color:#4a4a4a;line-height:1.65;">${mdBold(content.tool?.body || '')}</div>
            </td></tr>

            <!-- DIVIDER -->
            <tr><td style="padding:0 24px;"><div style="border-top:1px solid #eee;"></div></td></tr>

            <!-- INDUSTRY INSIGHT -->
            <tr><td style="padding:28px 24px;">
              <div style="font-size:11px;font-weight:700;color:#999;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px;">Industry Insight</div>
              <div style="font-size:15px;font-weight:700;color:#1a1a1a;margin-bottom:8px;">${mdBold(content.insight?.headline || '')}</div>
              <div style="font-size:14px;color:#4a4a4a;line-height:1.65;">${mdBold(content.insight?.body || '')}</div>
            </td></tr>

            <!-- DIVIDER -->
            <tr><td style="padding:0 24px;"><div style="border-top:1px solid #eee;"></div></td></tr>

            <!-- ACTIONABLE TIP -->
            <tr><td style="padding:28px 24px;">
              <div style="font-size:11px;font-weight:700;color:#999;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px;">This Week's Tip</div>
              <div style="font-size:15px;font-weight:700;color:#1a1a1a;margin-bottom:8px;">${mdBold(content.tip?.headline || '')}</div>
              <div style="font-size:14px;color:#4a4a4a;line-height:1.65;">${mdBold(content.tip?.body || '')}</div>
            </td></tr>

            <!-- DIVIDER -->
            <tr><td style="padding:0 24px;"><div style="border-top:1px solid #eee;"></div></td></tr>

            <!-- FOOTER -->
            <tr><td style="padding:28px 24px;">
              <div style="font-size:13px;color:#999;line-height:1.6;">
                We build free Slack apps that compete with expensive alternatives.<br>
                <a href="https://freeslackapps.com" style="color:#333;text-decoration:underline;">See all apps</a>
              </div>
              <div style="font-size:12px;color:#ccc;margin-top:16px;">
                <a href="https://instagram.com/icebergsampson" style="color:#999;text-decoration:none;">Instagram</a> &nbsp;&middot;&nbsp;
                <a href="https://youtube.com/@manplusbrain" style="color:#999;text-decoration:none;">YouTube</a> &nbsp;&middot;&nbsp;
                <a href="https://freeslackapps.com" style="color:#999;text-decoration:none;">freeslackapps.com</a>
              </div>
              <div style="font-size:11px;color:#ccc;margin-top:12px;">
                You signed up at freeslackapps.com<br>
                <a href="https://freeslackapps.com" style="color:#ccc;">Unsubscribe</a>
              </div>
            </td></tr>

          </table>
        </td></tr>
      </table>
    </div>
  `;
}
