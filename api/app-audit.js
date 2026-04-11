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

## Rule 4: UX Scoring Must Be Platform-Relative
These apps run inside Slack. Slack App Home max 100 blocks, no custom CSS, no collapsible sections, no real tabs (faked with buttons), modals max 100 blocks, modal titles max 24 chars. Score UX relative to what is achievable within Slack, NOT relative to web apps. A Slack app that maximizes the platform (button-driven, modal flows, App Home dashboard, confirmation DMs) should score 85-95 on UX. Competitors with web UIs have different constraints and are not a valid UX comparison. The question is: "Does this app use Slack's capabilities as well as possible?"

## Rule 5: Don't Penalize Known Limitations
The profile lists known limitations. Do NOT report these as issues AND do NOT reduce scores for them. These are declared platform constraints, not defects. If the known limitations say "no images in articles" due to Slack modal limitations, that cannot reduce the readiness or UX score. Only penalize for limitations that are NOT listed in the profile and that the developer could actually fix.

## Rule 5b: Price Advantage Floor
If the app is completely free and competitors charge per-user, Price Advantage must score 95-100. There is no scenario where free loses to paid on price.

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
Apply weights mathematically.

## Rule 11: Differentiation Scoring
Features marked "unique" (no competitor equivalent) must score high on differentiation. If an app has 2+ unique features that competitors don't offer at any price, differentiation should be 85+. If those unique features use AI, add 5 points. The question is: "Would a user get this capability anywhere else?"

## Rule 12: Security and Team Features Are Readiness Multipliers
If the app has database-level RLS, encryption, role-based access, invite codes, and audit logging, these are enterprise-grade features that free competitors (Google Docs, Sheets) never have and paid competitors often lack. Add 5-10 points to Core Problem score when these are present because they directly reduce adoption risk for teams.`;

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
Search works on titles and keyword index, not encrypted body. Sequential editing (no real-time co-edit). No images in articles (Slack modal limitation).`,

  'pulse': `# Pulse

## What This App Is
A free Slack-based polling, survey, and anonymous feedback tool. Teams create polls (single choice, multiple choice, rating scale, ranking, open text), multi-question surveys, and recurring scheduled polls. Everything happens inside Slack via DMs and modals.

## What This App Is NOT
NOT a form builder with a web interface. NOT an employee engagement platform with dashboards. NOT a performance review tool. NOT a project management or standup tool.

## Target Audience
Small to mid-size teams (2-100 people) using Slack daily. Managers running team health checks and retros. HR and People Ops doing engagement surveys. Product teams running feature prioritization votes. Any team making group decisions in Slack.

## Correct Competitors
Polly ($3/user/month, polls and surveys in Slack), Simple Poll (freemium, basic Slack polls), Doodle ($6.95/user/month, scheduling polls), SurveyMonkey ($25/month, web surveys with Slack integration), Google Forms (free but not Slack-native).

## Incorrect Competitors (NEVER compare against)
Lattice, Culture Amp, 15Five, Typeform, Jotform, Airtable

## Core Features
Five poll types: single choice, multiple choice, rating scale (1-5 or 1-10), ranking, open text. Smart distribution: DM everyone in a channel, DM specific people, DM all Pulse users, or post in channel. Multi-question surveys with step-by-step builder (add one question at a time via DM). One-question-at-a-time survey experience with progress bar in modal chain. Recurring scheduled polls (daily, weekdays, weekly Mon/Fri, biweekly, monthly). Anonymous mode for sensitive feedback. Auto-close with deadline (15 min to 7 days). CSV export for all poll and survey results. Real-time result updates with visual progress bars. Poll confirmation DMs with direct View links. Survey results dashboard with per-question breakdowns and completion tracking. Saved poll templates for reuse. App Home with stats bar, recent polls, recent surveys, quick actions. How to Get the Most Out of Pulse tips. Industry Workflows with 7 team-type examples. AES-256-GCM encryption on bot tokens. Multi-tenant with row-level security.

## UX Design
App Home with stats bar (total polls, open, voters, total votes). Create Poll and Create Survey buttons always visible. Recent polls and surveys with View links to jump to message. Polls DM'd to each recipient individually (Messages tab). Survey builder is step-by-step via DM with Add Question button. Survey taking uses modal chain with progress bar, one question per screen, no page breaks. All voting via buttons in DMs or channel messages. Confirmation DMs after poll/survey creation with recipient count. Templates and Recurring Polls accessible from App Home. My Polls and My Surveys show channel, type, response count, and completion rate.

## Known Limitations
Ranking polls require a modal flow (cannot rank inline). Surveys have practical limit of ~20 questions. CSV export uses URL with workspace token (not file upload). No conditional/branching logic in surveys yet. No image or file attachment in poll options.`,

  'sync': `# Sync

## What This App Is
A free Slack-based 1:1 meeting management tool. Managers and reports set up recurring syncs, prep talking points before each meeting, track action items, set goals with progress bars, and review meeting history. Everything happens inside Slack via DMs and modals.

## What This App Is NOT
NOT a calendar or scheduling tool (no Google Calendar integration). NOT a performance review platform. NOT a project management tool. NOT an HR system.

## Target Audience
Managers with direct reports (2-15 people). Engineering leads, team leads, founders. Any manager/report pair that meets regularly. Small to mid-size teams (2-100 people) using Slack daily.

## Correct Competitors
Fellow ($7/user/month, 1:1 meeting tool), Hypercontext (free tier + $7/user paid), SoapBox ($4/user/month), Lattice ($11/user/month, broader people management), 15Five ($4/user/month, performance + 1:1s).

## Incorrect Competitors (NEVER compare against)
Google Calendar, Zoom, Calendly, Asana, Monday.com, Notion

## Core Features
Recurring 1:1 pair setup (weekly, biweekly, monthly with day and time selection). Both sides add talking points before the meeting. Pre-meeting reminder DMs 24 hours before. Session start notification with talking points and open action items. Action items with assignment, due dates, and status tracking. Goal setting with progress bars and categories (career, project, skill, performance). Meeting notes. Session completion with auto-summary. Overdue action item follow-up alerts. Meeting history per pair. App Home dashboard with stats, active 1:1s, open action items, and goals. How to Get the Most Out of Sync tips. Industry Workflows for 7 team types. AES-256-GCM encryption on bot tokens. Multi-tenant with row-level security.

## UX Design
App Home with stats bar (pairs, sessions, actions, goals). New 1:1, Action Items, and Goals buttons always visible. Active 1:1 pairs listed with View button and next date. Open action items shown with inline Done button. Goals with progress bars and Update button. Tips and Industry Workflows accessible from App Home. All creation and editing via modals. Confirmation DMs after every action.

## Known Limitations
No Google Calendar integration (scheduling is in-app only). No video call link generation. No multi-party meetings (1:1 only). No file attachments in notes or talking points.`
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
