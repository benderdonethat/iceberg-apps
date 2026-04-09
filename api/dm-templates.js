/**
 * LinkedIn DM Template Generator
 * Generates role-specific outreach messages for free Slack apps.
 * Includes competitor comparison and feature highlights.
 *
 * POST /api/dm-templates
 * Headers: x-admin-key
 * Body: { app: { name, desc, features, category, pricing } }
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const adminKey = req.headers['x-admin-key'];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' });

  const { app } = req.body || {};
  if (!app || !app.name) return res.status(400).json({ error: 'app data required' });

  try {
    // Step 1: Search for the competitor landscape for this app
    let competitorData = '';
    try {
      const searchRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          tools: [{ type: 'web_search_20250305' }],
          messages: [{ role: 'user', content: `Search for the top 3 paid Slack apps that compete with this type of app: "${app.desc}". Category: ${app.category}. Find their names, pricing, and what LinkedIn job titles would be the buyers/decision makers for these tools. Return specific app names, prices, and job titles.` }],
        }),
      });
      const searchData = await searchRes.json();
      const textBlocks = (searchData.content || []).filter(b => b.type === 'text').map(b => b.text);
      if (textBlocks.length > 0) competitorData = textBlocks.join('\n');
    } catch (e) {
      // Continue without search data
    }

    // Step 2: Generate DM templates
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: `Generate LinkedIn DM templates for outreach about a FREE Slack app.

THE APP:
- Name: ${app.name}
- Description: ${app.desc}
- Features: ${(app.features || []).join(', ')}
- Category: ${app.category}
- Pricing: Completely free. No paid tier. No catch.

COMPETITOR RESEARCH:
${competitorData || 'No specific competitor data available. Use your knowledge of paid Slack apps in this category.'}

RULES FOR WRITING DMs:
- Keep each DM under 280 characters when possible. LinkedIn DMs that are short get read. Long ones get ignored.
- Sound like a real person, not a marketer. No "I hope this finds you well" or "I wanted to reach out"
- Lead with the pain point, not the product
- Mention the specific paid competitor they're probably using and how much it costs
- Make it clear this is FREE — not freemium, not a trial, free forever
- Include the app URL: https://freeslackapps.com
- No emojis in the DM body (LinkedIn culture)
- One clear call to action
- Don't be pushy. The pitch is: "you're probably paying for this, here's a free version that does the same thing"
- Write like @icebergsampson — direct, no fluff, confident but not arrogant

GENERATE 5 TEMPLATES for these LinkedIn roles:

1. **CEO / Founder** (small company, 5-50 employees) — they feel every subscription cost
2. **Head of Operations / COO** — they manage the tool stack, they know what's overpriced
3. **Team Lead / Manager** — they use these tools daily and wish they were simpler
4. **IT / Tech Lead** — they evaluate and approve Slack app installs
5. **Freelancer / Solopreneur** — every dollar matters, they do everything themselves

For each template provide:
- The target role
- The specific competitor being referenced (real app name)
- What that competitor charges
- The DM text (ready to copy-paste)
- A follow-up message if they don't respond in 3 days (shorter, even more direct)
- LinkedIn search query to find these people (what to type in LinkedIn search)

FORMAT: Return as valid JSON:
{
  "app_name": "${app.name}",
  "templates": [
    {
      "role": "CEO / Founder",
      "competitor": "Competitor Name",
      "competitor_price": "$X/user/month",
      "linkedin_search": "what to search on LinkedIn to find these people",
      "dm": "The DM text ready to send",
      "followup": "Follow-up if no response in 3 days",
      "why_this_role": "One sentence on why this role cares about this app"
    }
  ]
}`
        }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return res.status(200).json({ success: true, data: result });
      }
    } catch (e) {
      console.error('Failed to parse DM templates JSON:', e.message);
      return res.status(500).json({ error: 'failed to parse response', raw: text });
    }

    return res.status(500).json({ error: 'no valid response' });
  } catch (err) {
    console.error('DM templates error:', err);
    return res.status(500).json({ error: err.message });
  }
}
