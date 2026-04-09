/**
 * Company Prospector — finds real companies that match target criteria.
 * Uses web search to find companies in target verticals, then generates
 * LinkedIn search queries and company page URLs.
 *
 * POST /api/prospect
 * Headers: x-admin-key
 * Body: { app: { name, desc, category }, vertical?: string }
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const adminKey = req.headers['x-admin-key'];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' });

  const { app, vertical } = req.body || {};
  if (!app || !app.name) return res.status(400).json({ error: 'app data required' });

  try {
    // Step 1: Web search for real companies in the target vertical
    let searchResults = '';
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
          max_tokens: 3000,
          tools: [{ type: 'web_search_20250305' }],
          messages: [{ role: 'user', content: `Find 15-20 real companies that would benefit from this tool: "${app.desc}".
${vertical ? `Focus on this vertical: ${vertical}` : `Category: ${app.category}`}

Search for:
1. Companies that use Slack (look for "we use Slack" on their careers pages, or companies on the Slack customer page)
2. Small to mid-size companies (10-200 employees) in verticals where this app solves a real problem
3. Companies currently paying for competitor tools in this category
4. Companies hiring for roles that would use this type of tool

For each company return: company name, what they do, approximate size, city, and why they'd benefit from this specific app. Only return companies that actually exist. Do not make up companies.` }],
        }),
      });
      const searchData = await searchRes.json();
      const textBlocks = (searchData.content || []).filter(b => b.type === 'text').map(b => b.text);
      if (textBlocks.length > 0) searchResults = textBlocks.join('\n');
    } catch (e) {
      return res.status(500).json({ error: 'web search failed' });
    }

    // Step 2: Structure the results and generate LinkedIn queries
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
          content: `You are a sales research assistant. Take these web search results about companies and structure them into a prospect list.

APP: ${app.name} — ${app.desc}

WEB SEARCH RESULTS:
${searchResults}

For each company found, generate:
1. Company name (real company, verified from search results)
2. What they do (one sentence)
3. Estimated team size
4. City/location
5. Why this app helps them (specific to their business, not generic)
6. LinkedIn company search query (to find their company page)
7. LinkedIn people search query (to find the decision maker at this company)
8. Best role to contact (specific title, not generic)
9. Confidence level: high (confirmed Slack user or confirmed paying for competitor), medium (likely fits), low (possible fit)

RULES:
- Only include companies from the search results. Do not invent companies.
- If a company can't be verified from the search results, skip it.
- LinkedIn search queries should be specific enough to find the actual company page and real people.
- For people search, use: "title" AND "company name" format.
- NEVER use "---" or em dashes in any output.

Return valid JSON:
{
  "app_name": "${app.name}",
  "vertical": "${vertical || app.category}",
  "prospects": [
    {
      "company": "Company Name",
      "description": "What they do",
      "size": "~50 employees",
      "location": "City, State",
      "why_they_need_it": "Specific reason",
      "linkedin_company_search": "search query for company page",
      "linkedin_people_search": "search query for decision maker",
      "target_role": "Specific job title to contact",
      "confidence": "high/medium/low"
    }
  ],
  "verticals_to_explore": ["3 more verticals worth searching next"],
  "search_tips": ["2-3 tips for finding more companies like these on LinkedIn"]
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
