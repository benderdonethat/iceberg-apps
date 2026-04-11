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

  const { currentApps, stashedApps } = req.body || {};

  // Map our apps to the competitors they already cover
  const COMPETITOR_MAP = {
    'Stream Line': 'Competes with: Google Sheets for stream tracking, QuickBooks for P&L. Covers: live stream sales tracking, inventory, customer DB, AI insights.',
    'Sensei': 'Competes with: Guru ($7/user), Tettra ($5/user), Slite ($8/user), Notion. Covers: team knowledge base, article management, AI search, documentation.',
    'Pulse': 'Competes with: Polly ($3/user), Simple Poll, SurveyMonkey ($25/mo), Doodle ($6.95/user). Covers: polls (5 types), surveys, anonymous feedback, recurring polls, rating scales, rankings, open text.',
    'Sync': 'Competes with: Fellow ($7/user), Hypercontext, SoapBox ($4/user), Lattice ($11/user), 15Five ($4/user). Covers: 1:1 meetings, talking points, action items, goal tracking, meeting notes.',
    'Quick Poll': 'MERGED INTO PULSE. Do not suggest polling apps.',
    'Tally': 'COVERED BY PULSE. Do not suggest voting/polling apps.',
  };

  try {
    // Step 0: Fetch our own live install data
    let ourInstallData = '';
    try {
      const APPS_STATS = [
        { name: 'Stream Line', url: 'https://app-production-ef06.up.railway.app/stats' },
        { name: 'Sensei', url: 'https://sensei-production-1334.up.railway.app/stats' },
        { name: 'Pulse', url: 'https://app-production-831c.up.railway.app/stats' },
      ];
      const statsLines = [];
      for (const app of APPS_STATS) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 3000);
          const r = await fetch(app.url, { signal: controller.signal });
          clearTimeout(timeout);
          if (r.ok) {
            const d = await r.json();
            statsLines.push(`${app.name}: ${d.installs || 0} installs, ${d.active || 0} active workspaces, ${d.users || 0} users`);
          }
        } catch {}
      }
      if (statsLines.length > 0) {
        ourInstallData = `\n\nOUR LIVE INSTALL DATA (real numbers from our deployed apps):\n${statsLines.join('\n')}`;
      }
    } catch {}

    // Step 1: Search for real competitor data
    const searchQueries = [
      // Tier 1: Core pricing and market data
      { query: 'most popular paid Slack apps 2026 pricing per user monthly', prompt: 'Find the top 15 most popular PAID Slack apps with their exact current pricing. Include app name, exact price per user, total install count if available, and primary function. Only include apps that charge money.' },
      { query: 'Slack App Directory most installed apps 2026 reviews ratings', prompt: 'Find Slack App Directory listings. For each paid app found, report: app name, install count, star rating, number of reviews, pricing, and the most recent negative review. Focus on apps with 1000+ installs.' },

      // Tier 2: Active pain signals (where users are angry RIGHT NOW)
      { query: 'site:reddit.com r/Slack OR r/SaaS "too expensive" OR "looking for alternative" OR "free alternative" OR "switched from" 2026', prompt: 'Find Reddit posts from 2025-2026 where people complain about paid Slack apps or ask for free alternatives. Extract: which app they are complaining about, the specific complaint, whether they found an alternative. These are ACTIVE switchers. Prioritize posts with many upvotes or comments.' },
      { query: 'site:reddit.com Slack app "price increase" OR "raised prices" OR "new pricing" OR "billing change" 2026', prompt: 'Find any Slack apps that recently changed their pricing. Users posting about price increases are the most likely to switch. Extract: app name, old price vs new price, user reaction.' },

      // Tier 3: Review site deep complaints
      { query: 'site:g2.com Slack app reviews 1 star 2 star "too expensive" OR "not worth" OR "overpriced" OR "cancelling" 2026', prompt: 'Find negative G2 reviews (1-2 stars) for paid Slack apps from 2025-2026. For each review extract: app name, exact complaint, what the reviewer wishes existed instead. Focus on pricing and UX complaints.' },
      { query: 'site:capterra.com Slack integration reviews cons "small team" OR "too complex" OR "not intuitive" OR "overpriced" 2026', prompt: 'Find Capterra reviews with specific cons for paid Slack apps. Focus on: pricing complaints for small teams, setup complexity, poor UX, missing features, bad support. Quote the reviewer.' },

      // Tier 4: Churn and switching signals
      { query: '"cancelled" OR "switched from" OR "replaced" OR "migrated from" Slack app 2026 alternative', prompt: 'Find stories of teams actively switching away from paid Slack apps. What did they leave? Why? What did they move to? Focus on 2025-2026 switches. These represent validated demand for alternatives.' },
      { query: 'site:producthunt.com Slack app alternative free 2026', prompt: 'Find ProductHunt launches for Slack app alternatives. What existing paid tools are people trying to replace? Check the comments for which competitors users mention wanting to leave.' },

      // Tier 5: Competitive vulnerability signals
      { query: 'Slack app "acquired by" OR "shutting down" OR "sunset" OR layoffs 2026', prompt: 'Find Slack apps that were recently acquired, are shutting down, or had layoffs. These create user uncertainty and migration opportunities. Extract: app name, what happened, estimated user base affected.' },
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

OUR EXISTING CATALOG (do NOT suggest apps that compete in these spaces — we already cover them):
${(currentApps || []).map(name => {
  const coverage = COMPETITOR_MAP[name];
  return coverage ? `- ${name}: ${coverage}` : `- ${name}`;
}).join('\n')}

ALREADY PICKED FOR BUILD (do NOT suggest these or anything that competes in the same space):
${(stashedApps || []).length > 0 ? (stashedApps || []).map((s: string) => `- ${s}`).join('\n') : 'None'}

CRITICAL: If a paid Slack app competes with ANY of our existing apps OR stashed apps listed above, DO NOT suggest it. We already have a free alternative. For example, do NOT suggest Polly, Simple Poll, or any polling/survey/feedback app because Pulse already covers that. Do NOT suggest Guru, Tettra, or knowledge base apps because Sensei covers that. Only suggest opportunities in spaces we have NOT built for yet.
${ourInstallData}

YOUR TASK:
Go through the Slack App Directory mentally. Find 10 REAL paid apps that are actively listed, actively charging money, and have real users. For each one, design our free killer alternative.

For each opportunity you MUST provide:

1. **THE TARGET** — Name the REAL paid Slack app we're undercutting. It must be a real app in the Slack App Directory.
2. **WHAT THEY CHARGE** — Their actual current pricing (per user/month, flat rate, etc.). Must be real pricing from their actual pricing page.
3. **WHAT THEY DO** — Their core features (list their top 4-6 features as they advertise them)
4. **THEIR WEAKNESS** — MUST be sourced from real user reviews in the search data above. Quote or paraphrase actual G2/Capterra/Slack directory complaints. Include the source (e.g. "G2 reviewer, 2 stars"). If the search data contains a real complaint about this app, use it verbatim. Focus on: UX frustrations, pricing complaints, setup complexity, missing features, poor mobile experience, slow support. Do NOT make up generic weaknesses — every weakness must trace back to real user feedback.
5. **TIMING SIGNAL** — Why is NOW the right time to build this? Look for: recent price increase, acquisition, product decline, rising complaints, competitor shutdown, market shift. If the research data contains a timing signal, cite it. If none exists, say "No timing signal. Stable competitor." Timing signals DOUBLE the opportunity value.
6. **SWITCHING COST** — Rate LOW / MEDIUM / HIGH. How hard is it for a team to leave this competitor?
   - LOW: No data lock-in, simple tool, can switch in minutes (e.g. a poll tool, standup bot)
   - MEDIUM: Some historical data, but exportable. Switch takes a day (e.g. project tracker with CSV export)
   - HIGH: Deep integrations, years of data, workflow dependencies. Switch is painful (e.g. full CRM, HRIS)
   Only target LOW and MEDIUM switching costs. HIGH switching cost means users won't leave even if we're free.
7. **OUR APP** — Name, emoji, one-line description of our free alternative
8. **HOW WE MATCH OR BEAT THEM** — List 4-6 features that match or exceed theirs. Be specific. Not "better UI" but "one-click setup from Slack command, no external dashboard needed"
9. **OUR PRICING STRATEGY** — Free, Freemium (free core + paid power features), or Paid (but cheaper). If Freemium, specify exactly which features are free and which are paid. If Paid, specify our price and how much cheaper it is than the competitor.

PRICING MIX REQUIREMENT: Your 10 suggestions MUST include a mix of all 3 pricing tiers:
- At least 4 FREE apps (completely free, no paid tier — these are our volume/install drivers)
- At least 3 FREEMIUM apps (free core with paid power features — specify the split clearly)
- At least 2 PAID apps (cheaper than competitor — these generate revenue, specify our price vs theirs)
Order the list by score, not by pricing tier. Label each clearly.
10. **OPPORTUNITY SCORE** (1-100) — based on:
   - Their install base / market size (how many users we can steal) — 25%
   - Price differential (how much cheaper we are) — 20%
   - Build feasibility (can we ship this in 1-2 days as a Slack-native app?) — 20%
   - Switching cost (LOW = easy steal, HIGH = don't bother) — 15%
   - Timing signal strength (active pain vs stable competitor) — 10%
   - Virality (does usage spread within a workspace?) — 10%
11. **CATEGORY**: Team, Ops, Sales, Productivity, or Streaming
12. **DATA CONFIDENCE** — Rate HIGH / MEDIUM / LOW. Based on how much of your analysis comes from the actual search data vs your general knowledge. HIGH = pricing, reviews, and complaints all verified from search results. LOW = mostly from your training data, not confirmed by search.

HARD RULES. FOLLOW THESE EXACTLY:
- ONE APP PER COMPETITOR. Each of the 10 suggestions MUST target a DIFFERENT paid competitor. If two suggestions would both compete with the same paid app, merge them into one stronger suggestion or replace one with a different opportunity entirely. No two suggestions should overlap in the problem they solve. Before finalizing your list, review all 10 and verify there are no overlaps. If Suggestion 3 and Suggestion 7 both target the same space (e.g. both are standup/checkin tools), remove one and replace it.
- NEVER use "---", "—", or any dash-based separators or em dashes in any output. Use periods and new sentences instead.
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
      "target_weakness": "Direct quote or paraphrase from real review with source cited (e.g. 'Reddit r/Slack user: too complex for a 5-person team')",
      "target_installs": "Actual install count if available from search data, otherwise estimate range like '10K-50K installs'",
      "target_rating": "G2 or Capterra rating if found (e.g. '4.3/5 on G2, 245 reviews')",
      "target_review_count": "Number of reviews if found",
      "timing_signal": "Why NOW is the right time (price increase, acquisition, product decline, rising complaints). Or 'No timing signal. Stable competitor.'",
      "switching_cost": "LOW / MEDIUM / HIGH",
      "switching_reason": "One sentence explaining what makes switching easy or hard",
      "our_name": "Our App Name",
      "our_slug": "our-app-slug",
      "our_emoji": "emoji",
      "our_desc": "One sentence — what it does",
      "our_features": ["our feature 1", "our feature 2", "our feature 3", "our feature 4"],
      "our_pricing": "Free / Freemium / Paid ($X)",
      "our_pricing_detail": "If Freemium: what's free vs what's paid",
      "score": 85,
      "score_breakdown": {
        "market_size": 25,
        "price_gap": 20,
        "build_speed": 20,
        "switching_cost": 15,
        "timing": 10,
        "virality": 10
      },
      "data_confidence": "HIGH / MEDIUM / LOW",
      "data_sources": ["reddit", "g2", "capterra", "slack_directory"],
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
