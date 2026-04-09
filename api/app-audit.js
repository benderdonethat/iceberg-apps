/**
 * App Audit — competitive edge analysis for any app in the catalog.
 * Compares feature-by-feature vs the top competitor, suggests only
 * high-impact improvements, and flags when to stop iterating.
 *
 * POST /api/app-audit
 * Headers: x-admin-key
 * Body: { app: { name, desc, features, category, pricing, status } }
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
    // Step 1: Search for the primary competitor
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
          max_tokens: 2000,
          tools: [{ type: 'web_search_20250305' }],
          messages: [{ role: 'user', content: `Find the top paid Slack app competitor for an app that does this: "${app.desc}" (category: ${app.category}). Search for their current pricing page, their full feature list, their G2/Capterra reviews (especially 1-3 star reviews with specific complaints), and their Slack App Directory listing. Return: app name, exact pricing, full feature list, review score, number of reviews, and the top 5 specific user complaints from real reviews.` }],
        }),
      });
      const searchData = await searchRes.json();
      const textBlocks = (searchData.content || []).filter(b => b.type === 'text').map(b => b.text);
      if (textBlocks.length > 0) competitorData = textBlocks.join('\n');
    } catch (e) {
      // Continue without search data
    }

    // Step 2: Run the audit
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
          content: `You are a product strategist auditing a Slack app against its primary competitor. Be brutally honest and actionable.

OUR APP:
- Name: ${app.name}
- Description: ${app.desc}
- Features: ${(app.features || []).join(', ')}
- Category: ${app.category}
- Pricing: ${app.pricing}
- Status: ${app.status}

COMPETITOR RESEARCH:
${competitorData || 'No search data available. Use your knowledge of paid Slack apps in the ' + app.category + ' category.'}

AUDIT INSTRUCTIONS:

1. Identify the PRIMARY COMPETITOR — the most popular paid Slack app in this space. Use the search data above.

2. FEATURE-BY-FEATURE COMPARISON — For each of our features, compare it to how the competitor handles the same thing. Rate each as:
   - "ahead" — we do this better or they don't have it
   - "match" — roughly equal
   - "behind" — they do this better
   - "unique" — we have this, they don't (our advantage)

3. READINESS SCORE (1-100) — How ready is this app to compete? Score based on:
   - Feature parity (do we match their core features?) — 40%
   - UX advantage (is ours simpler/faster to use in Slack?) — 25%
   - Price advantage (are we free/cheaper?) — 20%
   - Differentiation (do we have unique features they lack?) — 15%

4. VERDICT — One of:
   - "SHIP" (80+): Ready to compete. Ship it and start outreach.
   - "IMPROVE" (50-79): Close but has gaps. Fix the improvements listed, then ship.
   - "REBUILD" (below 50): Fundamental gaps. Needs significant work before competing.

5. HIGH-IMPACT IMPROVEMENTS ONLY — List max 3-5 improvements. Each must:
   - Directly affect whether a user would choose us over the competitor
   - Be buildable in under 4 hours
   - Have clear impact on user retention or acquisition
   Rate each as: "critical" (blocks shipping), "high" (ship but fix soon), or "medium" (nice to have)
   Include effort estimate: "1 hour", "2-3 hours", "half day"

6. STOP LIST — Features or areas that are ALREADY GOOD ENOUGH. More work here would be wasted effort. Be specific. This prevents infinite improvement loops.

IMPORTANT RULES:
- NEVER use "---", "—", or any dash-based separators or em dashes in any output. Use periods and new sentences instead.
- Do NOT suggest improvements that are just "nice to have". Every improvement must directly help us steal users from the competitor.
- Do NOT suggest more than 5 improvements. If we need more than 5 things, the verdict should be REBUILD.
- Be specific about implementations. Not "improve UX" but "add one-click rerun button to the results modal".
- The stop list is critical. Tell us what to STOP working on so we focus on what matters.

FORMAT: Return as valid JSON:
{
  "primary_competitor": "Competitor App Name",
  "competitor_price": "$X/user/month",
  "readiness_score": 75,
  "summary": "One sentence assessment of competitive position",
  "verdict": "SHIP / IMPROVE / REBUILD",
  "verdict_reason": "One sentence explaining the verdict",
  "feature_audit": [
    {
      "feature": "Feature name",
      "status": "ahead / match / behind / unique",
      "our_implementation": "How we do it",
      "their_implementation": "How they do it (or 'N/A' if they don't)"
    }
  ],
  "improvements": [
    {
      "title": "Specific improvement",
      "description": "What to build and how",
      "impact": "critical / high / medium",
      "effort": "1 hour / 2-3 hours / half day",
      "why_it_matters": "How this directly helps us steal users from the competitor"
    }
  ],
  "stop_improving": [
    "Feature or area that's already good enough — stop working on it"
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
      console.error('Failed to parse audit JSON:', e.message);
      return res.status(500).json({ error: 'failed to parse response', raw: text });
    }

    return res.status(500).json({ error: 'no valid response' });
  } catch (err) {
    console.error('App audit error:', err);
    return res.status(500).json({ error: err.message });
  }
}
