/**
 * App Audit v3 — Profile-driven competitive analysis.
 * App profiles and methodology are embedded, not read from disk.
 *
 * POST /api/app-audit
 * Headers: x-admin-key
 * Body: { app: { name, desc, features, category, pricing, status }, profileOverride?: string }
 */

const METHODOLOGY = `# Audit Methodology

## Rule 1: Use the App Profile
Every app has a profile that defines what it is, what it is NOT, who it targets, its correct competitors, and its incorrect competitors. The profile overrides any AI judgment about competitors.

## Rule 2: Competitor Selection
Use ONLY the correct competitors from the profile. If web search returns a competitor on the incorrect list, ignore it.

## Rule 3: Feature Scoring Must Be Specific
When scoring a feature, explain specifically WHY. Not "we do this better" but "we calculate platform fees automatically for 6 platforms while they require manual entry."

## Rule 4: UX Scoring Must Reference Slack Constraints
Slack App Home max 100 blocks, no custom CSS, no collapsible sections, no real tabs (faked with buttons), modals max 100 blocks, modal titles max 24 chars. Score within these constraints.

## Rule 5: Don't Flag Known Limitations
The profile lists known limitations. Don't report these as issues.

## Rule 6: Conservative Projections
Brand new free Slack app with no audience: 5-20 installs in 30 days. With active LinkedIn outreach: 15-50. Do NOT project hundreds.

## Rule 7: Improvements Within Scope Only
Read "What This App Is NOT." Any improvement in that category is invalid.

## Rule 8: Honest Stop List
If a feature works and users aren't complaining, stop list it.

## Rule 9: No Emojis, No Dashes
Never use emojis, ---, or em dashes.

## Rule 10: Show Scoring Math
Readiness: Core problem (40%) + UX (25%) + Price advantage (20%) + Differentiation (15%)
UX: First impression (25%) + Clicks to task (25%) + Visual clarity (25%) + Feedback loops (25%)
Apply weights mathematically.`;

const APP_PROFILES = {
  'stream-line': `# Stream Line

## What This App Is
A free Slack-based business operations tool for live streamers who sell products during streams. Tracks sales, calculates profit/loss with real platform fees, manages inventory, tracks customers, provides AI insights.

## What This App Is NOT
NOT a streaming overlay tool (StreamElements/Streamlabs). NOT a chat bot for viewer engagement. NOT a broadcasting tool. NOT a content creation platform. Does NOT handle live stream production, alerts, or viewer interaction.

## Target Audience
Live sellers on Whatnot, TikTok Shop, eBay Live. Trading card breakers. Resellers and flippers. Small teams (1-5 people) running live sales. Content creators selling merch during streams.

## Correct Competitors
Google Sheets/Excel (free but manual), QuickBooks ($30/month, too complex), Wave Accounting (free but not per-stream), No direct Slack competitor exists.

## Incorrect Competitors (NEVER compare against)
StreamElements, Streamlabs, Whatnot itself, Shopify, OBS, Twitch tools

## Core Features
Log stream sessions with sales/costs/duration/platform. Auto platform fee calculations (Whatnot 19.9%, TikTok 8%, etc.). Real P&L per stream. Inventory with velocity and reorder alerts. Smart CSV import (auto-detects Whatnot/TikTok/eBay format, maps columns, imports as stream log or inventory). Customer database with VIP detection. Revenue goals with progress tracking and automated notifications (DMs user when goal hit or at risk). AI business insights. Stream comparison view (side-by-side last 5 streams with trend analysis). Brand vault and AI content generator. CSV export. Multi-tenant teams with role-based access (owner/supervisor/employee). One-time invite codes for role assignment (owner generates supervisor or owner codes, employees redeem from Settings tab). Tab navigation (Dashboard, Insights, Tools, Settings). Persistent Log Stream and Quick Sale buttons above tabs. How to Get the Most Out of Stream Line and Industry Workflows always visible. Full audit trail on all edits. Database-level Row Level Security. AES-256-GCM encryption on API keys. Startup env var validation. Health check endpoint.

## UX Design
Slack App Home with tab navigation. Primary actions (Log Stream, Quick Sale) always visible above tabs. Tips and Workflows buttons always visible. Dashboard tab shows Go Live, Track and Manage, Money. Insights tab shows AI, Customers, Brand. Tools tab shows calculators and utilities. Settings tab shows team and config (role-gated). Status bar at top shows today's metrics and goal progress. Every action opens a modal. Confirmation feedback after every action.

## Known Limitations
Manual stream logging unless API connected. No direct Whatnot API yet. Mobile Slack not optimized.`,

  'sensei': `# Sensei

## What This App Is
A free Slack-based team knowledge base with role-based access and team collaboration. Teams write, search, and share articles entirely inside Slack. No external dashboard.

## What This App Is NOT
NOT a project management tool. NOT a wiki with web interface. NOT a rich text document editor. NOT a CRM or customer-facing KB.

## Target Audience
Small teams (2-30 people) using Slack daily. Teams using pinned messages or Google Docs for docs. Engineering, agencies, ops, support, remote teams.

## Correct Competitors
Guru ($7/user/month), Tettra ($5/user/month), Slite ($8/user/month), Notion ($8/user for teams), Google Docs (free but scattered).

## Incorrect Competitors (NEVER compare against)
Confluence, SharePoint, Jira, Asana, Monday.com

## Core Features
Article creation with 5 templates. Full-text search via keyword index. Channel-specific knowledge bases. AI-powered answers from articles (rate limited to 50 calls/workspace/day). AI thread-to-article conversion via message shortcut. Article tagging and categories. Internal linking with [[Title]] syntax. Stale article detection (30 day cron, DMs author with Update/Still Accurate/Archive). Knowledge gap tracking (unanswered searches with Write This buttons). Usage analytics on App Home (admin/owner only). AES-256-GCM encryption on article bodies and bot tokens. Multi-tenant with database-level Row Level Security (RLS on all tables). Parameterized SQL for tenant context (no injection). Role-based access control (owner/admin/member) with permission enforcement on both UI and server side. One-time invite codes for role assignment (owner generates, new user redeems on App Home). Manage Team modal for owners (view members, change roles, generate codes, see code history). Collaborative editing (any team member can edit any article, delete restricted to admin+ or own articles). Team Activity feed on App Home showing recent writes, edits, role changes, and new joins (visible to all roles). Team notifications (DMs all team members when a new article is published with a Read button). Health check endpoint (/health) with database connectivity test. Startup validation for all required environment variables. How to Get the Most Out of Sensei and Industry Workflows always visible on App Home.

## UX Design
Slack App Home with role-aware layout. Header shows role badge. Members see invite code entry prompt, write/search/browse, team activity, recent articles. Admins also see analytics (article count, views, searches, tags), most viewed articles, and knowledge gaps. Owners also see Manage Team button. Every action opens a modal. Confirmation DM after every write/edit/delete with contextual follow-up buttons. App Home refreshes after every write/edit/delete.

## Known Limitations
Search works on titles and keyword index, not encrypted body. Sequential editing (no real-time co-edit). No images in articles (Slack modal limitation).`
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const adminKey = req.headers['x-admin-key'];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' });

  const { app, profileOverride } = req.body || {};
  if (!app || !app.name) return res.status(400).json({ error: 'app data required' });

  const slug = app.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const appProfile = profileOverride || APP_PROFILES[slug] || '';

  try {
    // Step 1: Competitor research (only if no profile)
    let competitorData = '';
    if (!appProfile) {
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
            temperature: 0,
            tools: [{ type: 'web_search_20250305' }],
            messages: [{ role: 'user', content: `Find the top 3 paid tools that solve this problem: "${app.desc}". Must target the same audience. Return name, pricing, core features.` }],
          }),
        });
        const searchData = await searchRes.json();
        const textBlocks = (searchData.content || []).filter(b => b.type === 'text').map(b => b.text);
        if (textBlocks.length > 0) competitorData = textBlocks.join('\n');
      } catch (e) {}
    }

    // Step 2: Audit
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
        temperature: 0,
        messages: [{
          role: 'user',
          content: `${METHODOLOGY}

${appProfile ? '# APP PROFILE (this overrides all AI assumptions)\n' + appProfile : '# APP INFO\nName: ' + app.name + '\nDesc: ' + app.desc + '\nFeatures: ' + (app.features || []).join(', ') + '\nCategory: ' + app.category}

${competitorData ? '# WEB RESEARCH\n' + competitorData : ''}

Audit this app following the methodology. Use ONLY correct competitors from the profile. Return valid JSON:
{
  "primary_competitor": "From correct competitors list",
  "competitor_price": "$X/month or N/A",
  "competitor_validation": "Why this competitor from the profile's correct list",
  "readiness_score": 75,
  "summary": "One sentence",
  "verdict": "SHIP / IMPROVE / REBUILD",
  "verdict_reason": "One sentence",
  "feature_audit": [
    { "feature": "Name", "status": "ahead/match/behind/unique", "our_implementation": "How we do it specifically", "their_implementation": "How they do it or N/A" }
  ],
  "improvements": [
    { "title": "Specific fix", "description": "What and how", "impact": "critical/high/medium", "effort": "quick/moderate/significant", "why_it_matters": "Adoption or retention impact" }
  ],
  "functionality": {
    "rating": "solid/mostly works/broken flows",
    "issues": ["Issues NOT in known limitations"],
    "dead_ends": ["Where users get stuck"]
  },
  "ux_score": {
    "total": 75,
    "first_impression": 80,
    "clicks_to_task": 70,
    "visual_clarity": 75,
    "feedback_loops": 70,
    "reasoning": "Math: (FI*0.25)+(CTT*0.25)+(VC*0.25)+(FL*0.25)=total",
    "improvements": [
      { "area": "Which area", "score": 60, "fix": "Specific Slack UI fix", "slack_elements": "Which blocks to use" }
    ]
  },
  "user_projection": {
    "installs_30d_low": 5,
    "installs_30d_mid": 15,
    "installs_30d_high": 40,
    "activation_rate": "50%",
    "adoption_driver": "One sentence",
    "adoption_barrier": "One sentence"
  },
  "stop_improving": ["Features that are good enough"]
}`
        }],
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('Audit API error:', JSON.stringify(data.error));
      return res.status(500).json({ error: 'audit failed', detail: data.error });
    }

    const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n');

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return res.status(200).json({ success: true, data: JSON.parse(jsonMatch[0]) });
      }
    } catch (e) {
      console.error('Failed to parse audit JSON:', e.message);
      return res.status(500).json({ error: 'failed to parse', raw: text.substring(0, 500) });
    }

    return res.status(500).json({ error: 'no valid response' });
  } catch (err) {
    console.error('App audit error:', err);
    return res.status(500).json({ error: err.message });
  }
}
