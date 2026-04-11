/**
 * Install Tracker — aggregates stats from all live Slack apps.
 * Calls each app's /stats endpoint and returns combined data.
 *
 * GET /api/installs
 * Headers: x-admin-key
 */

const APPS = [
  { name: 'Stream Line', slug: 'stream-line', url: 'https://app-production-ef06.up.railway.app/stats' },
  { name: 'Sensei', slug: 'sensei', url: 'https://sensei-production-1334.up.railway.app/stats' },
  { name: 'Pulse', slug: 'pulse', url: 'https://app-production-831c.up.railway.app/stats' },
];

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'method not allowed' });

  const adminKey = req.headers['x-admin-key'];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const results = [];
  let totalInstalls = 0;
  let totalActive = 0;
  let totalUsers = 0;

  for (const app of APPS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(app.url, { signal: controller.signal });
      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        results.push({
          name: app.name,
          slug: app.slug,
          status: 'online',
          installs: data.installs || 0,
          active: data.active || 0,
          users: data.users || 0,
          details: data,
        });
        totalInstalls += data.installs || 0;
        totalActive += data.active || 0;
        totalUsers += data.users || 0;
      } else {
        results.push({ name: app.name, slug: app.slug, status: 'error', installs: 0, active: 0, users: 0 });
      }
    } catch (e) {
      results.push({ name: app.name, slug: app.slug, status: 'offline', installs: 0, active: 0, users: 0 });
    }
  }

  return res.status(200).json({
    success: true,
    timestamp: new Date().toISOString(),
    totals: { installs: totalInstalls, active: totalActive, users: totalUsers, apps_online: results.filter(r => r.status === 'online').length },
    apps: results,
  });
}
