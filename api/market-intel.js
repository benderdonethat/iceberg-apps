/**
 * Market Intel — finds overpriced Slack apps to undercut with free/cheaper alternatives.
 * Uses Claude to analyze the Slack App Directory competitively.
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
    // Step 1: Search for real competitor data
    const searchQueries = [
      { query: 'most popular paid Slack apps 2026 pricing per user monthly', prompt: 'Find the top 10 most popular PAID Slack apps with their exact current pricing. Include app name, price per user, and what they do. Only include apps that charge money.' },
      { query: 'site:g2.com Slack app reviews 1 star 2 star complaints "too expensive" OR "not worth" OR "overpriced"', prompt: 'Find negative G2 reviews (1-2 stars) for paid Slack apps. Extract the specific complaints: what app, what they hate about it, what they wish was different. Focus on pricing complaints and UX frustrations.' },
      { query: 'site:capterra.com Slack integration reviews cons disadvantages "small team" OR "too complex"', prompt: 'Find Capterra reviews highlighting cons and disadvantages of paid Slack apps. Focus on complaints about complexity, pricing for small teams, poor UX, and missing features.' },
      { query: 'Slack App Directory most installed apps 2026 user count reviews', prompt: 'Find Slack App Directory listings with install counts, ratings, and review counts. Focus on paid apps with high install numbers.' },
      { query: '"switched from" OR "cancelled" OR "replaced" Slack app "too expensive" OR "free alternative" 2026', prompt: 'Find real user stories about switching away from paid Slack apps. What did they leave, why, and what did they switch to? Focus on price and UX as reasons.' },
    ];

    let searchContext = '';
    for (const { query, prompt } of searchQueries) {
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
            messages: [{ role: 'user', content: `${prompt}\n\nSearch: ${query}` }],
          }),
        });
        const searchData = await searchRes.json();
        const textBlocks = (searchData.content || []).filter(b => b.type === 'text').map(b => b.text);
        if (textBlocks.length > 0) searchContext += textBlocks.join('\n') + '\n\n';
      } catch (e) {
        // Search failed, continue without this query
      }
    }

    // Step 2: Generate intel with real search data
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 5000,
        messages: [{
          role: 'user',
          content: `You are a competitive intelligence analyst for Slack apps. Your job is to find REAL, EXISTING paid Slack apps that are overcharging and identify exactly how we can build a free or cheaper alternative that is EQUAL OR BETTER — not a watered-down version.

TODAY'S DATE: ${new Date().toISOString().split('T')[0]}

LIVE RESEARCH DATA (from web search — use this as your primary source for app names, pricing, install counts, and reviews):
${searchContext || 'No search data available — use your knowledge of the Slack App Directory instead.'}

OUR STRATEGY:
We build free Slack apps and give them away. Our business model is volume — we want installs, audience, and a data moat. We undercut every paid Slack app that charges per-seat pricing by offering the same or better functionality for FREE or at a fraction of the cost. We are not building lite versions. We are building full-featured apps that make paid competitors irrelevant for small teams.

OUR EXISTING CATALOG (do NOT suggest these — we already have them):
${(currentApps || []).join('\n')}

YOUR TASK:
Go through the Slack App Directory mentally. Find 10 REAL paid apps that are actively listed, actively charging money, and have real users. For each one, design our free killer alternative.

For each opportunity you MUST provide:

1. **THE TARGET** — Name the REAL paid Slack app we're undercutting. It must be a real app in the Slack App Directory.
2. **WHAT THEY CHARGE** — Their actual current pricing (per user/month, flat rate, etc.). Must be real pricing from their actual pricing page.
3. **WHAT THEY DO** — Their core features (list their top 4-6 features as they advertise them)
4. **THEIR WEAKNESS** — MUST be sourced from real user reviews in the search data above. Quote or paraphrase actual G2/Capterra/Slack directory complaints. Include the source (e.g. "G2 reviewer, 2 stars"). If the search data contains a real complaint about this app, use it verbatim. Focus on: UX frustrations, pricing complaints, setup complexity, missing features, poor mobile experience, slow support. Do NOT make up generic weaknesses — every weakness must trace back to real user feedback.
5. **OUR APP** — Name, emoji, one-line description of our free alternative
6. **HOW WE MATCH OR BEAT THEM** — List 4-6 features that match or exceed theirs. Be specific. Not "better UI" but "one-click setup from Slack command, no external dashboard needed"
7. **OUR PRICING STRATEGY** — Free, Freemium (free core + paid power features), or Paid (but cheaper). If Freemium, specify exactly which features are free and which are paid. If Paid, specify our price and how much cheaper it is than the competitor.

PRICING MIX REQUIREMENT: Your 10 suggestions MUST include a mix of all 3 pricing tiers:
- At least 4 FREE apps (completely free, no paid tier — these are our volume/install drivers)
- At least 3 FREEMIUM apps (free core with paid power features — specify the split clearly)
- At least 2 PAID apps (cheaper than competitor — these generate revenue, specify our price vs theirs)
Order the list by score, not by pricing tier. Label each clearly.
8. **OPPORTUNITY SCORE** (1-100) — based on:
   - Their install base / market size (how many users we can steal) — 35%
   - Price differential (how much cheaper we are) — 25%
   - Build feasibility (can we ship this in 1-2 days as a Slack-native app?) — 25%
   - Virality (does usage spread within a workspace?) — 15%
9. **CATEGORY**: Team, Ops, Sales, Productivity, or Streaming

HARD RULES — FOLLOW THESE EXACTLY:
- Every "target" app must be REAL and currently listed in the Slack App Directory or on the Slack marketplace
- Every price must be their REAL current price, not made up
- Do NOT suggest apps that compete with Slack's built-in features:
  * Video/audio calls (Slack has Huddles)
  * Screen sharing (Huddles)
  * DMs, channels, threads, reactions, search, status, profiles, file uploads — all native Slack
  * Workflow Builder automations
- Our alternative must be buildable as a pure Slack app (slash commands, modals, App Home, messages, buttons). No external web dashboards required.
- Do NOT suggest generic categories. Name specific, buildable apps.
- Features must be CONCRETE and SPECIFIC. Not "better experience" but "one-command expense logging with auto-categorization"
- Only cite data, reviews, and prices from 2025-2026. If you can't verify a date, state the fact without a date.
- Be brutally honest about scores. A 90+ means massive market, huge price gap, and easy to build. Most should score 60-85.

FORMAT: Return as valid JSON:
{
  "generated_at": "ISO date string",
  "market_summary": "2-3 sentences on the state of paid Slack apps and where overpricing is worst",
  "opportunities": [
    {
      "rank": 1,
      "target_app": "Real Slack App Name",
      "target_price": "$X/user/month",
      "target_features": ["their feature 1", "their feature 2", "their feature 3", "their feature 4"],
      "target_weakness": "Direct quote or paraphrase from real G2/Capterra review with source cited (e.g. 'G2 reviewer: too complex for a 5-person team')",
      "target_installs": "Actual install count or user count if available from search data, otherwise estimate range like '10K-50K installs'",
      "target_rating": "G2 or Capterra rating if found (e.g. '4.3/5 on G2, 245 reviews')",
      "target_review_count": "Number of reviews if found",
      "our_name": "Our App Name",
      "our_slug": "our-app-slug",
      "our_emoji": "emoji",
      "our_desc": "One sentence — what it does",
      "our_features": ["our feature 1", "our feature 2", "our feature 3", "our feature 4"],
      "our_pricing": "Free / Freemium / Paid ($X)",
      "our_pricing_detail": "If Freemium: what's free vs what's paid",
      "score": 85,
      "score_breakdown": {
        "market_size": 30,
        "price_gap": 22,
        "build_speed": 20,
        "virality": 13
      },
      "category": "Ops",
      "undercut_strategy": "One sentence — exactly how we win"
    }
  ],
  "catalog_gaps": [
    {
      "category": "Category name",
      "gap": "What paid apps exist here that we haven't built a free alternative for yet",
      "priority": "high/medium/low",
      "top_paid_app": "Name of the most overpriced app in this gap",
      "their_price": "$X/user/month"
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
