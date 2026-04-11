/**
 * Market Intel — finds overpriced Slack apps to undercut with free/cheaper alternatives.
 * Uses Claude to analyze the Slack App Directory competitively.
 *
 * POST /api/market-intel
 * Headers: x-admin-key
 * Body: { currentApps: string[] }
 */

export const config = { maxDuration: 300 };

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
    'Daily': 'Competes with: Geekbot ($2.50/user), Standuply ($1.50/user), StandupBot ($3/user). Covers: async standups, daily check-ins, mood tracking.',
    'Timer': 'Competes with: Clockify ($5/user), Toggl ($9/user), Harvest ($12/user), TimeBot ($4/user). Covers: time tracking, project tracking, billable hours, weekly summaries.',
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

    // Step 1: Search for real competitor data (3 consolidated searches to minimize API cost)
    const searchQueries = [
      // Search 1: Market landscape — pricing, installs, ratings
      { query: 'most popular paid Slack apps 2026 pricing per user monthly reviews Slack App Directory', prompt: 'Find the top 15 most popular PAID Slack apps with: app name, exact price per user/month, install count if available, star rating, and what they do. Only include apps that charge money. Prioritize apps with real install data.' },

      // Search 2: Pain signals — complaints, price increases, churn
      { query: 'Slack app "too expensive" OR "overpriced" OR "switched from" OR "free alternative" OR "price increase" site:reddit.com OR site:g2.com OR site:capterra.com 2026', prompt: 'Find complaints about paid Slack apps from Reddit, G2, and Capterra (2025-2026). For each complaint extract: app name, specific complaint (quote it), source (Reddit/G2/Capterra), and whether the user found an alternative. Also look for any apps that recently raised prices. Prioritize active pain and recent posts.' },

      // Search 3: Vulnerability signals — acquisitions, shutdowns, alternatives launching
      { query: 'Slack app acquired OR "shutting down" OR alternative launched OR "switched to" 2026 site:producthunt.com OR site:reddit.com', prompt: 'Find Slack apps that were recently acquired, shut down, had layoffs, or are losing users to alternatives. Also find new free alternatives launching on ProductHunt. Extract: app name, what happened, user reaction, and any migration patterns.' },
    ];

    // Run all searches in parallel for speed
    const searchResults = await Promise.allSettled(
      searchQueries.map(async ({ query, prompt }) => {
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
        return textBlocks.join('\n');
      })
    );

    let searchContext = '';
    for (const result of searchResults) {
      if (result.status === 'fulfilled' && result.value) {
        searchContext += result.value.slice(0, 2000) + '\n\n';
      }
    }
    // Cap total context to avoid prompt being too long
    if (searchContext.length > 15000) searchContext = searchContext.slice(0, 15000) + '\n\n[Search context truncated for length]';

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
        max_tokens: 8000,
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
${(stashedApps || []).length > 0 ? (stashedApps || []).map(s => `- ${s}`).join('\n') : 'None'}

CRITICAL: If a paid Slack app competes with ANY of our existing apps OR stashed apps listed above, DO NOT suggest it. We already have a free alternative. For example, do NOT suggest Polly, Simple Poll, or any polling/survey/feedback app because Pulse already covers that. Do NOT suggest Guru, Tettra, or knowledge base apps because Sensei covers that. Only suggest opportunities in spaces we have NOT built for yet.
${ourInstallData}

YOUR TASK:
Go through the Slack App Directory mentally. Find 5 REAL paid apps that are actively listed, actively charging money, and have real users. For each one, design our free killer alternative. Quality over quantity. Only suggest opportunities you are confident about.

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

PRICING MIX REQUIREMENT: Your 5 suggestions MUST include a mix:
- At least 2 FREE apps (completely free — volume drivers)
- At least 1 FREEMIUM app (free core + paid power features — specify the split)
- At least 1 PAID app (cheaper than competitor — specify our price vs theirs)
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

    // Debug: check for API errors
    if (data.error) {
      console.error('Anthropic API error:', JSON.stringify(data.error));
      return res.status(500).json({ error: 'anthropic_api_error', detail: data.error, searchContextLength: searchContext.length });
    }

    const text = data.content?.[0]?.text || '';

    if (!text) {
      return res.status(500).json({ error: 'empty_response', stop_reason: data.stop_reason, usage: data.usage, model: data.model, searchContextLength: searchContext.length });
    }

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return res.status(200).json({ success: true, data: result });
      }
    } catch (e) {
      console.error('Failed to parse market intel JSON:', e.message);
      return res.status(500).json({ error: 'failed to parse response', raw: text.slice(0, 2000) });
    }

    return res.status(500).json({ error: 'no json in response', raw: text.slice(0, 2000) });
  } catch (err) {
    console.error('Market intel error:', err);
    return res.status(500).json({ error: err.message });
  }
}
