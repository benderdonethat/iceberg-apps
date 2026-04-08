/**
 * Market Intel — analyzes gaps in the app catalog against real Slack ecosystem data.
 * Uses Claude to research and score opportunities.
 *
 * POST /api/market-intel
 * Headers: x-admin-key
 * Body: { currentApps: string[] }
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const adminKey = req.headers['x-admin-key'];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' });

  const { currentApps } = req.body || {};

  try {
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
          content: `You are a Slack ecosystem market analyst. Analyze the current state of the Slack App Directory and identify gaps and opportunities for FREE Slack apps.

CONTEXT:
- Slack has 200M+ weekly active users across 750,000+ organizations (Salesforce Q3 2025 earnings)
- The Slack App Directory has 2,600+ apps but most are enterprise-priced ($5-25/user/month)
- Small teams (2-50 people) are massively underserved — they can't afford per-seat pricing
- The fastest growing Slack segments: remote teams, agencies, freelancers, creators, small e-commerce
- 65% of Slack workspaces have fewer than 50 members (Slack internal data, 2024)
- Top Slack app categories by install volume: productivity, project management, communication, developer tools, HR, sales, analytics

THE CATALOG WE ALREADY HAVE (do NOT suggest these):
${(currentApps || []).join('\n')}

TASK: Identify the 10 biggest opportunities for free Slack apps that don't exist yet or where existing solutions are overpriced/underbuilt. For each opportunity:

1. Name a specific app concept (not generic categories)
2. Describe what it does in one sentence
3. Score it 1-100 on OPPORTUNITY SIZE — based on:
   - How many of Slack's 200M users could benefit (weight: 40%)
   - How underserved the niche currently is (weight: 30%)
   - How feasible it is to build as a simple Slack app (weight: 20%)
   - How viral/visible it would be within a workspace (weight: 10%)
4. List the TARGET AUDIENCE (be specific: "freelance designers", not "businesses")
5. Cite a REAL data point or source that supports why this gap exists (Slack blog, G2 reviews, industry reports, competitor pricing pages). Only cite sources that actually exist.
6. Name the closest COMPETITOR and what they charge
7. Assign a CATEGORY from: Team, Ops, Sales, Productivity, Streaming

IMPORTANT RULES:
- Only suggest apps that can realistically be built as Slack-native (slash commands, modals, App Home, messages)
- Focus on problems that are DAILY pain points, not occasional nice-to-haves
- Prefer apps that are visible to the whole team (higher virality)
- Do NOT suggest apps that require complex external integrations (calendar sync, email parsing, etc.)
- Be specific. "Project tracker" is too generic. "Client deliverable tracker with deadline alerts" is specific.
- Every data point you cite must be real and verifiable. Do not fabricate sources.

FORMAT: Return as valid JSON:
{
  "generated_at": "ISO date string",
  "market_summary": "2-3 sentence overview of the current Slack app market state and where the biggest whitespace is",
  "opportunities": [
    {
      "rank": 1,
      "name": "App Name",
      "slug": "app-name",
      "desc": "One sentence description",
      "score": 85,
      "category": "Ops",
      "target_audience": "Who specifically needs this",
      "why_now": "Why this gap exists right now — cite real data",
      "competitor": "Closest competitor name",
      "competitor_price": "$X/user/month or Free",
      "gap_reason": "Why the competitor doesn't fill the need",
      "suggested_features": ["feature 1", "feature 2", "feature 3", "feature 4"],
      "emoji": "relevant emoji"
    }
  ],
  "catalog_gaps": [
    {
      "category": "Category name",
      "gap": "What's missing from our catalog in this category",
      "priority": "high/medium/low"
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
      console.error('Failed to parse market intel JSON:', e.message);
      return res.status(500).json({ error: 'failed to parse response', raw: text });
    }

    return res.status(500).json({ error: 'no valid response' });
  } catch (err) {
    console.error('Market intel error:', err);
    return res.status(500).json({ error: err.message });
  }
}
