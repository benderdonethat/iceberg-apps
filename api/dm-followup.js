/**
 * DM Follow-Up Generator — contextual follow-ups and reworks based on previous DMs.
 *
 * POST /api/dm-followup
 * Headers: x-admin-key
 * Body: { originalDm, role, competitor, mode: "followup" | "rework", appName }
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const adminKey = req.headers['x-admin-key'];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' });

  const { originalDm, role, competitor, mode, appName } = req.body || {};
  if (!originalDm || !mode) return res.status(400).json({ error: 'originalDm and mode required' });

  const modePrompts = {
    followup: `You sent this LinkedIn DM 3-5 days ago and got no response. Write a follow-up.

ORIGINAL DM YOU SENT:
"${originalDm}"

RULES:
- Shorter than the original. 1-2 sentences max.
- Don't repeat the pitch. They already read it (or didn't).
- Reference the original message casually ("circling back on this" or "did you get a chance to look at this")
- Still no URL. If they respond to the follow-up, THEN you send the link.
- Don't be apologetic. Don't say "sorry to bother you." You're offering something free.
- Sound like you're texting, not emailing.
- Use a contraction. Vary capitalization naturally.
- NEVER use "---", em dashes, or buzzwords.

Return JSON:
{
  "followup": "the follow-up message text",
  "timing_note": "when to send this relative to the original (e.g. 3-5 days after)"
}`,

    rework: `This LinkedIn DM approach is not getting responses. Write a completely different version targeting the same person.

ORIGINAL DM THAT ISN'T WORKING:
"${originalDm}"

TARGET ROLE: ${role || 'unknown'}
COMPETITOR: ${competitor || 'unknown'}
APP: ${appName || 'unknown'}

RULES:
- Completely different angle. Don't rephrase the same pitch.
- If the original led with the problem, lead with a question instead.
- If the original mentioned the competitor, try not mentioning it.
- If the original was direct, try being more casual.
- Keep it under 280 characters.
- No URL in the message.
- Sound human. Use contractions. No buzzwords.
- NEVER use "---", em dashes, or filler phrases.
- If the original was too salesy, make this one feel like peer advice.
- End with a question that invites a reply.

Return JSON:
{
  "reworked_dm": "the new DM text",
  "what_changed": "one sentence explaining the new angle",
  "followup": "a follow-up for this new version if they don't respond"
}`,
  };

  const prompt = modePrompts[mode];
  if (!prompt) return res.status(400).json({ error: 'mode must be followup or rework' });

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
        max_tokens: 1000,
        temperature: 0.7,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return res.status(200).json({ success: true, data: JSON.parse(jsonMatch[0]) });
      }
    } catch (e) {
      return res.status(500).json({ error: 'failed to parse', raw: text.substring(0, 500) });
    }

    return res.status(500).json({ error: 'no valid response' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
