/**
 * App Audit — competitive edge analysis for any app in the catalog.
 * Compares feature-by-feature vs the CORRECT competitor, suggests only
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
    // Step 1: Find the RIGHT competitor with thorough search
    let competitorData = '';
    const searchQueries = [
      {
        query: `"${app.desc}" Slack app paid alternative pricing 2026`,
        prompt: `Find paid Slack apps or tools that do EXACTLY this: "${app.desc}". Not apps in the same general category. Apps that solve the SAME specific problem for the SAME specific audience. For each one found, return: name, what they do in one sentence, exact pricing, top 5 features, and what platform they run on (Slack app, web app, etc).`
      },
      {
        query: `site:g2.com "${app.category}" Slack app reviews complaints`,
        prompt: `Find G2 reviews for paid Slack apps that handle "${app.desc}". What do users complain about? What do they wish was different? Include star ratings and specific quotes.`
      },
      {
        query: `how do teams currently handle "${app.desc}" without a dedicated tool`,
        prompt: `How do small teams (5-50 people) currently solve this problem: "${app.desc}"? What tools do they cobble together? What's the manual process? What are the pain points of doing it without a dedicated solution? Be specific about the workarounds people use.`
      },
    ];

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
        if (textBlocks.length > 0) competitorData += textBlocks.join('\n') + '\n\n';
      } catch (e) {
        // Continue without this search
      }
    }

    // Step 2: Run the audit with strict competitor validation
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
          content: `You are a precise product strategist. You audit Slack apps against their ACTUAL competitors. Getting the competitor wrong wastes engineering time on the wrong features, so accuracy here is critical.

OUR APP:
- Name: ${app.name}
- Description: ${app.desc}
- Features: ${(app.features || []).join(', ')}
- Category: ${app.category}
- Pricing: ${app.pricing}
- Status: ${app.status}

COMPETITOR RESEARCH:
${competitorData || 'No search data available.'}

STEP 1: IDENTIFY THE CORRECT COMPETITOR

This is the most important step. Get this wrong and the entire audit is useless.

The correct competitor must pass ALL of these tests:
- It solves the SAME core problem as our app (not a related problem, not the same category, the SAME problem)
- It targets the SAME audience (if our app is for streamers who sell products, the competitor must also be for streamers who sell products, not streamers in general)
- A user would realistically choose between our app and this competitor (they are substitutes, not complements)
- It is a Slack app OR a tool that integrates with Slack OR a tool our users currently use instead of a Slack app for this purpose

WRONG competitor examples to AVOID:
- Picking a tool that operates in the same industry but solves a different problem (e.g. StreamElements for a sales tracking app. StreamElements does overlays and chat, not sales tracking)
- Picking a massive platform when our app does one specific thing (e.g. Salesforce for a simple lead tracker)
- Picking a free tool as the competitor (we need to compare against what people PAY for)

If no paid competitor exists that passes all tests, you MUST still provide:
- What users currently do instead (spreadsheets, Google Docs, pinned Slack messages, nothing, etc.)
- WHY no paid competitor exists (is the market too small? Is the problem not painful enough to pay for? Is it a new category? Are existing tools too broad to count as direct competitors?)
- Whether this is a strength (untapped market) or a risk (maybe nobody needs this)
- Set primary_competitor to a descriptive label like "Spreadsheets and manual tracking" or "Google Docs and tribal knowledge" instead of just "N/A"

STEP 2: FEATURE COMPARISON

For each of OUR features, compare against how the competitor handles that SAME need:
- "ahead": we do this better or more elegantly
- "match": roughly equal capability
- "behind": they do this meaningfully better
- "unique": we have this, they don't. This is our differentiation.
- "n/a": this feature doesn't apply to what the competitor does

IMPORTANT: If a feature is "n/a" because the competitor doesn't operate in that space, that is a signal you may have picked the wrong competitor. Re-evaluate.

STEP 3: READINESS SCORE (1-100)

Score based on:
- Do we solve our users' core problem well? (40%)
- Is our UX simpler and faster than alternatives? (25%)
- Is our price advantage clear? (20%)
- Do we have unique features competitors lack? (15%)

STEP 4: VERDICT

- "SHIP" (80+): Core problem solved, unique advantages exist. Ship and start outreach.
- "IMPROVE" (50-79): Close but specific gaps hurt adoption. Fix improvements, then ship.
- "REBUILD" (below 50): Fundamental gaps in solving the core problem.

STEP 5: IMPROVEMENTS (max 3-5)

Each improvement must:
- Fix a gap that would cause a user to NOT switch from their current solution to our app
- Be specific and buildable (not "improve UX" but "add bulk import via CSV upload button on the inventory screen")
- Only relate to features within our app's scope. Do NOT suggest features that belong to a different type of product.

Rate: "critical" (users can't adopt without this), "high" (users will adopt but churn without this), "medium" (nice for retention)

STEP 6: FUNCTIONALITY CHECK

Test every feature listed in our app against these questions:
- Can a new user figure out how to use this feature without instructions?
- Does the feature complete its job in 3 clicks or fewer?
- Is there a dead end anywhere (user takes an action and nothing happens, no feedback, no confirmation)?
- Does the feature loop back to where the user started or guide them to the next logical action?

Rate overall functionality: "solid" (everything works as expected), "mostly works" (minor gaps), "broken flows" (users will get stuck)

STEP 7: UX/UI SCORE (1-100)

Score the user experience specifically within what Slack allows. Consider:
- First impression when opening the App Home (25%)
- Number of clicks to complete the most common task (25%)
- Visual clarity of the interface: is it scannable, organized, not cluttered? (25%)
- Feedback loops: does every action give confirmation, does the user always know what happened? (25%)

For each area scoring below 70, provide a SPECIFIC improvement that is possible within Slack's UI constraints (blocks, modals, buttons, context elements, App Home). Do not suggest things Slack does not support.

Available Slack UI elements to work with: buttons, static selects, multi selects, date pickers, time pickers, checkboxes, radio buttons, plain text inputs, modals (single or stacked), App Home blocks, ephemeral messages, threaded replies, context blocks, header blocks, divider blocks, image blocks, section blocks with accessories.

STEP 8: 30-DAY USER PROJECTION

Estimate how many Slack teams would realistically install this app within 30 days with MINIMAL marketing (just the website listing, LinkedIn DMs from our Outreach tab, and organic Slack directory discovery). Be conservative and specific.

Consider:
- How many Slack workspaces exist that have this exact problem?
- What percentage would discover a free alternative through organic search or directory browsing?
- What percentage of those would actually install?
- What is the expected activation rate (install to actually using it)?

Provide:
- Estimated installs in 30 days (low / mid / high range)
- Expected activation rate (percentage who use it after installing)
- One sentence on the biggest driver of adoption
- One sentence on the biggest barrier to adoption

STEP 9: STOP LIST

What is already good enough. Be specific. This prevents wasting time on diminishing returns.

CRITICAL RULES:
- NEVER use "---" or em dashes in output. Use periods and new sentences.
- NEVER suggest features from a different product category. If our app tracks sales, don't suggest adding chat overlays. If our app is a knowledge base, don't suggest adding project management.
- NEVER compare against a tool that solves a fundamentally different problem.
- If you are unsure about the competitor, say so. A wrong competitor is worse than no competitor.
- Be honest. If the app is already strong for its purpose, say so. Don't invent problems.

FORMAT: Return as valid JSON:
{
  "primary_competitor": "Name (or 'No direct paid competitor' if none passes the tests)",
  "competitor_price": "$X/user/month or 'N/A'",
  "competitor_validation": "One sentence explaining WHY this is the right competitor OR why no direct competitor exists and what users do instead",
  "competitor_gap_reason": "If no direct paid competitor: WHY does no paid tool exist for this? Is this an untapped market or a sign the problem isn't big enough?",
  "readiness_score": 75,
  "summary": "One sentence assessment",
  "verdict": "SHIP / IMPROVE / REBUILD",
  "verdict_reason": "One sentence explaining the verdict",
  "feature_audit": [
    {
      "feature": "Feature name",
      "status": "ahead / match / behind / unique / n/a",
      "our_implementation": "How we do it",
      "their_implementation": "How they do it (or 'N/A')"
    }
  ],
  "improvements": [
    {
      "title": "Specific improvement",
      "description": "What to build and how",
      "impact": "critical / high / medium",
      "effort": "quick / moderate / significant",
      "why_it_matters": "How this directly helps adoption or retention"
    }
  ],
  "functionality": {
    "rating": "solid / mostly works / broken flows",
    "issues": ["Specific issue if any"],
    "dead_ends": ["Any place where user gets stuck with no feedback"]
  },
  "ux_score": {
    "total": 75,
    "first_impression": 80,
    "clicks_to_task": 70,
    "visual_clarity": 75,
    "feedback_loops": 70,
    "improvements": [
      {
        "area": "Which UX area",
        "score": 60,
        "fix": "Specific fix using available Slack UI elements",
        "slack_elements": "Which Slack blocks or features to use"
      }
    ]
  },
  "user_projection": {
    "installs_30d_low": 10,
    "installs_30d_mid": 30,
    "installs_30d_high": 75,
    "activation_rate": "60%",
    "adoption_driver": "One sentence on biggest driver",
    "adoption_barrier": "One sentence on biggest barrier"
  },
  "stop_improving": [
    "Feature or area that is already good enough"
  ]
}`
        }],
      }),
    });

    const data = await response.json();

    if (data.error) {
      // Retry without web search
      const retryRes = await fetch('https://api.anthropic.com/v1/messages', {
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
            content: `Audit this app: ${app.name} - ${app.desc}. Features: ${(app.features || []).join(', ')}. Return JSON with the audit.`,
          }],
        }),
      });
      const retryData = await retryRes.json();
      const retryText = (retryData.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n');
      try {
        const match = retryText.match(/\{[\s\S]*\}/);
        if (match) return res.status(200).json({ success: true, data: JSON.parse(match[0]) });
      } catch (e) {}
      return res.status(500).json({ error: 'audit failed' });
    }

    const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n');

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
