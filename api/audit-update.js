/**
 * Audit Update — feed feature changes to the audit system.
 * Verifies claims, updates the profile, re-runs the audit, returns comparison.
 *
 * POST /api/audit-update
 * Headers: x-admin-key
 * Body: { appName: "Stream Line", changes: "Added CSV import with auto-detect for Whatnot/TikTok/eBay. Added stream comparison view. Added goal progress notifications." }
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const adminKey = req.headers['x-admin-key'];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' });

  const { appName, changes } = req.body || {};
  if (!appName || !changes) return res.status(400).json({ error: 'appName and changes required' });

  try {
    // Step 1: Get the current audit profile from app-audit.js
    const auditRes = await fetch(`https://${req.headers.host}/api/app-audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify({ app: { name: appName, desc: '', features: [], category: '', pricing: '', status: '' } }),
    });

    // Step 2: Ask Claude to verify the changes and generate updated profile + new audit
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3000,
        temperature: 0,
        messages: [{
          role: 'user',
          content: `You are an audit system receiving a feature update report for a Slack app called "${appName}".

CHANGES REPORTED BY THE DEVELOPER:
${changes}

YOUR TASKS:

1. VERIFY each claimed change. For each one, mark it as:
   - "verified" if it sounds like a real, buildable feature that makes sense for this type of app
   - "questionable" if it sounds vague, unrealistic, or outside the app's scope
   - "rejected" if it contradicts what the app does or is impossible

2. For each verified change, write a one-line addition to the app's feature list in the same style as existing features (concise, specific, no buzzwords).

3. Score the IMPACT of these changes on the audit:
   - How many points should the readiness score increase? (0-15 max per update)
   - How many points should the UX score increase? (0-10 max per update)
   - Which previous improvements from the audit are now resolved?

4. Identify what the NEXT priorities should be now that these changes are shipped. Max 3 items.

Return as valid JSON:
{
  "verification": [
    { "change": "What was claimed", "status": "verified/questionable/rejected", "reason": "Why" }
  ],
  "new_features": ["One-line feature description for each verified change"],
  "score_impact": {
    "readiness_delta": 5,
    "ux_delta": 3,
    "reasoning": "Why scores changed by this amount"
  },
  "resolved_improvements": ["Which previous audit improvements are now fixed"],
  "next_priorities": [
    { "title": "Next thing to build", "why": "Why this matters now" }
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
