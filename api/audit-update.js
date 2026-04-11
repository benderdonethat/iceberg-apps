/**
 * Audit Update — feed feature changes, get verified, update profile.
 * Returns updated profile that the frontend stores and sends to future audits.
 *
 * POST /api/audit-update
 * Headers: x-admin-key
 * Body: { appName, changes, currentProfile? }
 */

// Same profiles as app-audit.js — kept in sync
const BASE_PROFILES = {
  'stream-line': `Stream Line: Free Slack-based business operations tool for live streamers who sell products. Tracks sales, calculates P&L with platform fees, manages inventory, tracks customers, AI insights. NOT a streaming overlay or chat bot. Competitors: Google Sheets, QuickBooks. NOT StreamElements/Streamlabs.`,
  'sensei': `Sensei: Free Slack-based team knowledge base. Articles, search, templates, AI answers, thread-to-article, tagging, linking, stale detection, knowledge gaps. NOT project management or web wiki. Competitors: Guru ($7), Tettra ($5), Slite ($8).`,
  'daily': `Daily: Free Slack-based async standups. Custom questions, scheduled posting, mood tracking, threaded responses, DM reminders. NOT project management. Competitors: Geekbot ($2.50/user), Standuply ($1.50/user), StandupBot ($3/user).`,
  'timer': `Timer: Free Slack-based time tracking. Start/stop timers, project tracking, manual entries, weekly summaries, billable tagging. NOT invoicing or payroll. Competitors: Clockify ($5/user), Toggl ($9/user), Harvest ($12/user).`,
  'sync': `Sync: Free Slack-based 1:1 meeting management. Recurring pairs, talking points, action items, goal tracking, meeting notes, session summaries. NOT a calendar or HR tool. Competitors: Fellow ($7/user), Hypercontext, SoapBox ($4/user), Lattice ($11/user), 15Five ($4/user).`,
  'pulse': `Pulse: Free Slack-based polling, survey, and anonymous feedback tool. 5 poll types (single, multiple, rating, ranking, open text). Smart DM distribution (channel members, specific people, all users). Step-by-step survey builder. One-question-at-a-time modal flow with progress bar. Recurring scheduled polls. Anonymous mode. Auto-close. CSV export. Templates. NOT a form builder or engagement platform. Competitors: Polly ($3/user), Simple Poll, SurveyMonkey ($25/mo).`,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const adminKey = req.headers['x-admin-key'];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' });

  const { appName, changes, currentProfile } = req.body || {};
  if (!appName || !changes) return res.status(400).json({ error: 'appName and changes required' });

  const slug = appName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const existingProfile = currentProfile || BASE_PROFILES[slug] || `${appName}: No profile available.`;

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
        temperature: 0,
        messages: [{
          role: 'user',
          content: `You are an audit system. You receive feature updates and produce an updated app profile.

CURRENT PROFILE:
${existingProfile}

CHANGES REPORTED BY DEVELOPER:
${changes}

TASKS:

1. VERIFY each change:
   - "verified": real, buildable, makes sense for this app
   - "questionable": vague or unclear
   - "rejected": impossible or out of scope

2. GENERATE UPDATED PROFILE: Take the current profile and add the verified features to it. Keep the same format. Add new features to the Core Features section. Update the UX Design section if UX changes were made. Update Known Limitations if any were resolved. The updated profile must be a complete replacement of the current one.

3. SCORE IMPACT:
   - Readiness delta (0-15 max). Base it on: does this fix a gap users would notice? Does it add differentiation?
   - UX delta (0-10 max). Base it on: does this reduce clicks, improve feedback, or improve first impression?
   - Show math for both.

4. RESOLVED: Which items from a typical audit improvement list would these changes resolve?

5. NEXT PRIORITIES: What 3 things should be built next? Be specific.

Return valid JSON:
{
  "verification": [
    { "change": "What was claimed", "status": "verified/questionable/rejected", "reason": "Why" }
  ],
  "updated_profile": "The full updated profile text with verified changes incorporated. This replaces the old profile entirely.",
  "new_features": ["One-line description per verified change"],
  "score_impact": {
    "readiness_delta": 5,
    "ux_delta": 3,
    "readiness_math": "Explain: CSV import adds onboarding ease (+3), comparison adds retention (+2) = +5",
    "ux_math": "Explain: persistent buttons reduce clicks (+2), confirmation feedback (+1) = +3"
  },
  "resolved_improvements": ["What previous improvements are now resolved"],
  "next_priorities": [
    { "title": "Specific next build", "why": "Why this matters now" }
  ]
}`
        }],
      }),
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: 'analysis failed', detail: data.error });

    const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n');

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return res.status(200).json({ success: true, data: result });
      }
    } catch (e) {
      return res.status(500).json({ error: 'failed to parse', raw: text.substring(0, 500) });
    }

    return res.status(500).json({ error: 'no valid response' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
