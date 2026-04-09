import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * App Audit v3 — Profile-driven competitive analysis.
 * Loads app-specific profile + audit methodology before running.
 * Two-step: competitor research, then focused audit.
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

  // Load app profile and methodology
  const slug = app.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const profilePath = join(process.cwd(), 'audit-profiles', `${slug}.md`);
  const methodPath = join(process.cwd(), 'audit-profiles', 'audit-methodology.md');

  let appProfile = '';
  let methodology = '';

  try { if (existsSync(profilePath)) appProfile = readFileSync(profilePath, 'utf8'); } catch (e) {}
  try { if (existsSync(methodPath)) methodology = readFileSync(methodPath, 'utf8'); } catch (e) {}

  try {
    // Step 1: Competitor research (only if no profile or profile says to search)
    let competitorData = '';
    if (!appProfile || appProfile.includes('No direct Slack-based competitor')) {
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
            messages: [{ role: 'user', content: `Find the top 3 paid tools that solve this problem: "${app.desc}". They must target the same audience. Return name, pricing, and core features for each. Only include tools people actually pay for.` }],
          }),
        });
        const searchData = await searchRes.json();
        const textBlocks = (searchData.content || []).filter(b => b.type === 'text').map(b => b.text);
        if (textBlocks.length > 0) competitorData = textBlocks.join('\n');
      } catch (e) {}
    }

    // Step 2: Run the audit with profile context
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
          content: `${methodology ? '# AUDIT METHODOLOGY (follow this exactly)\n' + methodology + '\n\n' : ''}${appProfile ? '# APP PROFILE (this overrides any AI assumptions)\n' + appProfile + '\n\n' : ''}# COMPETITOR RESEARCH FROM WEB
${competitorData || 'No web research performed. Use the competitors listed in the app profile.'}

# YOUR TASK

Audit this app following the methodology above. The app profile defines what competitors are correct and incorrect. Do not deviate.

Return as valid JSON:
{
  "primary_competitor": "Name from the correct competitors list in the profile",
  "competitor_price": "$X/user/month or N/A",
  "competitor_validation": "One sentence explaining why this competitor was chosen from the profile's correct list",
  "readiness_score": 75,
  "summary": "One sentence assessment",
  "verdict": "SHIP / IMPROVE / REBUILD",
  "verdict_reason": "One sentence explaining the verdict",
  "feature_audit": [
    {
      "feature": "Feature name",
      "status": "ahead / match / behind / unique",
      "our_implementation": "Specific description of how we do it",
      "their_implementation": "Specific description of how they do it (or N/A)"
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
    "issues": ["Specific issue not already in known limitations"],
    "dead_ends": ["Any place where user gets stuck with no feedback"]
  },
  "ux_score": {
    "total": 75,
    "first_impression": 80,
    "clicks_to_task": 70,
    "visual_clarity": 75,
    "feedback_loops": 70,
    "reasoning": "Show math: (first_impression * 0.25) + (clicks_to_task * 0.25) + (visual_clarity * 0.25) + (feedback_loops * 0.25) = total",
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
    "installs_30d_low": 5,
    "installs_30d_mid": 15,
    "installs_30d_high": 40,
    "activation_rate": "50%",
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
      console.error('Audit API error:', JSON.stringify(data.error));
      return res.status(500).json({ error: 'audit failed', detail: data.error });
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
      return res.status(500).json({ error: 'failed to parse response', raw: text.substring(0, 500) });
    }

    return res.status(500).json({ error: 'no valid response' });
  } catch (err) {
    console.error('App audit error:', err);
    return res.status(500).json({ error: err.message });
  }
}
