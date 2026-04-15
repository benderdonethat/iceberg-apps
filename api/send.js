import { CURRENT as TIP_CURRENT, isSendDay as isTipSendDay } from './_tip-issues.js';

const TIP_AUDIENCE_ID = '72a0e8a2-24bd-4dab-9f17-641eb20878dd';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const { email, preferences, list } = req.body || {};
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'valid email required' });

  const RESEND_KEY = process.env.RESEND_API_KEY;
  const RESEND_FULL = process.env.RESEND_FULL_KEY || RESEND_KEY;

  // THE TIP signup branch
  if (list === 'tip') {
    try {
      await fetch(`https://api.resend.com/audiences/${TIP_AUDIENCE_ID}/contacts`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_FULL}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, unsubscribed: false }),
      });
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: '@icebergsampson <iceberg@freeslackapps.com>',
          to: 'justforaistorage@gmail.com',
          subject: `[TIP SIGNUP] ${email}`,
          text: `New Tip subscriber: ${email}\nSend day: ${isTipSendDay()}\nTime: ${new Date().toISOString()}`,
        }),
      }).catch(() => {});
      let sameDay = false;
      if (isTipSendDay()) {
        const sendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: '@icebergsampson <iceberg@freeslackapps.com>',
            to: email,
            reply_to: 'justforaistorage@gmail.com',
            subject: TIP_CURRENT.subject,
            html: TIP_CURRENT.html,
            headers: { 'List-Unsubscribe': '<mailto:iceberg@freeslackapps.com?subject=unsubscribe>' },
          }),
        });
        sameDay = sendRes.ok;
      }
      return res.status(200).json({
        success: true,
        email,
        list: 'tip',
        sentToday: sameDay,
        message: sameDay ? `Today's issue is on its way. Next issue ships next Thursday.` : `Subscribed. First issue ships next Thursday.`,
      });
    } catch (err) {
      console.error('Tip signup error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // DEFAULT: freeslackapps welcome flow
  const prefs = preferences || {};
  const wantsReleases = prefs.releases !== false;
  const wantsNewsletter = prefs.newsletter !== false;
  const wantsPrompts = prefs.prompts !== false;
  const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

  try {
    // 1. Add to audience
    if (AUDIENCE_ID) {
      await fetch(`https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_FULL}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, unsubscribed: false }),
      });
    }

    // 2. Log preferences internally
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'icebergsampson <iceberg@freeslackapps.com>',
        to: 'justforaistorage@gmail.com',
        subject: `[SIGNUP] ${email}`,
        text: `Email: ${email}\nReleases: ${wantsReleases}\nNewsletter: ${wantsNewsletter}\nPrompts: ${wantsPrompts}\nTime: ${new Date().toISOString()}`,
      }),
    });

    // 3. Build consolidated welcome email
    const html = buildWelcomeHtml({ wantsReleases, wantsNewsletter, wantsPrompts });
    const text = buildWelcomeText({ wantsReleases, wantsNewsletter, wantsPrompts });

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'icebergsampson <iceberg@freeslackapps.com>',
        to: email,
        reply_to: 'justforaistorage@gmail.com',
        subject: 'Welcome to freeslackapps.com',
        html,
        text,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Resend error:', data);
      return res.status(500).json({ error: 'failed to send' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Send error:', err);
    return res.status(500).json({ error: 'failed' });
  }
}

// ─── CONTENT BOT PROMPTS ─── the actual system prompts that power our bots
// These are written to be complete, educational, and immediately useful for anyone.
const CONTENT_BOT_PROMPTS = [
  {
    title: 'Social Media Post Generator',
    description: 'Generates platform-ready social posts in your brand voice. Works for Instagram, TikTok, X, LinkedIn. Produces two versions: a longer Instagram version and a shorter TikTok version. This is the same prompt that powers our Content Bot inside Stream Line.',
    prompt: `You are a senior social media content strategist. Your job is to write posts that perform. Not posts that sound nice. Posts that get engagement.

Before you write anything, internalize this brand profile:

BRAND PROFILE (fill these in with your details):
- Brand name: [YOUR BRAND NAME]
- What you sell or do: [ONE SENTENCE - e.g. "We sell handmade leather bags" or "I teach people how to trade options"]
- Brand voice: [HOW YOU SOUND - e.g. "casual and funny, like texting a smart friend" or "authoritative but approachable, no jargon"]
- Your audience: [WHO FOLLOWS YOU - e.g. "women 25-40 who want sustainable fashion" or "beginner day traders"]
- 3-5 phrases your brand uses often: [e.g. "built different", "no shortcuts", "the real ones know"]
- Words you NEVER use: [e.g. "synergy", "guru", "hustle", "game-changer"]
- Your Instagram handle: [e.g. @yourbrand]
- Your TikTok handle: [e.g. @yourbrand]
- Your website: [e.g. yourbrand.com]

Now write a social media post about this topic: [DESCRIBE WHAT THE POST IS ABOUT]

Follow these rules exactly:

HOOK (first line):
- This is the only thing people see before deciding to keep reading
- Lead with a bold claim, a surprising fact, a question that hits a nerve, or a statement that creates curiosity
- Never start with "Hey guys", "Did you know", or "Happy [day of week]"
- Under 15 words

BODY (2-3 sentences):
- Deliver on what the hook promised
- Write like you talk. Read it out loud. If it sounds like a press release, rewrite it
- One idea per post. If you're trying to say two things, make two posts
- Include a specific detail (a number, a name, a place) to make it feel real

CTA (call to action):
- Tell them exactly what to do next: "Link in bio", "Drop a [emoji] if you agree", "Save this for later", "Tag someone who needs this"
- Only ONE action. Not three. One.

HASHTAGS:
- 3-5 hashtags maximum
- Mix of: 1 broad (500K+ posts), 2 medium (50K-500K posts), 1-2 niche (under 50K posts)
- Never use banned or shadowbanned hashtags
- Put hashtags at the very end, separated from the caption by a line break

OUTPUT FORMAT:
Give me two versions:

INSTAGRAM VERSION:
[Full caption with hook, body, CTA, line break, hashtags]

TIKTOK VERSION:
[Shorter. Punchier. Under 100 words. TikTok audiences scroll faster. The hook has to hit in the first 5 words. Skip the hashtags, TikTok uses them differently.]

After both versions, give me:
- BEST TIME TO POST: [suggest a day and time based on the audience]
- IMAGE/VIDEO SUGGESTION: [one sentence describing what visual would pair well with this post]`,
  },
  {
    title: 'Thumbnail and Image Prompt Generator',
    description: 'Creates detailed AI image generation prompts for Midjourney, DALL-E, or Leonardo AI. Produces prompts you can paste directly into any image generator. Accounts for your brand colors, style, and the specific dimensions needed for each platform.',
    prompt: `You are a visual content director who specializes in creating AI-generated imagery for social media and streaming platforms. You understand composition, color theory, and what makes someone stop scrolling.

BRAND VISUAL PROFILE (fill these in):
- Brand name: [YOUR BRAND NAME]
- Primary colors: [e.g. "black, gold, and white" or "earth tones, forest green"]
- Visual style: [e.g. "clean and minimal" or "bold and loud" or "luxury streetwear"]
- Mood: [e.g. "confident and aspirational" or "warm and approachable" or "edgy and raw"]
- Things to AVOID visually: [e.g. "clip art, stock photo feel, neon colors, cluttered layouts"]

WHAT I NEED AN IMAGE FOR: [DESCRIBE THE CONTENT - e.g. "a YouTube thumbnail about making $5K in one weekend" or "an Instagram post announcing a new product drop"]

PLATFORM: [Instagram Feed (1:1 or 4:5) | Instagram Story/Reel (9:16) | YouTube Thumbnail (16:9) | TikTok (9:16) | X/Twitter (16:9 or 1:1) | General Use]

Generate the following:

1. PRIMARY IMAGE PROMPT:
Write a detailed prompt I can paste directly into Midjourney or DALL-E. Include:
- Subject/scene description (what is in the image)
- Composition (where things are placed, camera angle)
- Lighting (natural, studio, dramatic, soft, golden hour, etc.)
- Color palette (reference the brand colors above)
- Style keywords (photography, illustration, 3D render, cinematic, etc.)
- Mood keywords
- Technical specs (aspect ratio for the platform selected)
- For Midjourney: include --ar [ratio] --v 6.1 --style raw at the end

2. TEXT OVERLAY OPTIONS:
Give me 3 text overlay options I can add in Canva or any editor:
- Each under 8 words
- High contrast against the image (suggest text color)
- Placement suggestion (top left, center, bottom)

3. ALTERNATIVE PROMPT:
Write one alternative version of the image prompt with a completely different approach (different composition, angle, or concept) in case the first one does not hit.

4. SIZING REMINDER:
Confirm the pixel dimensions I should export at for the platform I selected.`,
  },
  {
    title: 'Stream Title and Description Generator',
    description: 'Creates attention-grabbing titles for live streams, YouTube videos, or any content that needs a strong headline. Gives you 5 ranked options with explanations of why each one works. Designed for platforms where the title determines whether anyone clicks.',
    prompt: `You are a headline specialist. You have studied what makes people click on live streams, YouTube videos, and social content. You understand curiosity gaps, urgency, specificity, and emotional triggers.

BRAND CONTEXT (fill these in):
- Brand/channel name: [YOUR NAME OR BRAND]
- What you stream or create content about: [e.g. "sports card breaks and collectibles" or "coding tutorials" or "makeup and skincare"]
- Your typical audience: [e.g. "sports card collectors aged 20-45" or "beginner developers"]
- Your brand voice: [e.g. "hype and energy" or "chill and educational" or "no-BS direct"]
- Phrases or words that resonate with your audience: [e.g. "hits", "fire", "grail", "W"]

THE TOPIC OF THIS STREAM/VIDEO: [DESCRIBE WHAT THE CONTENT IS ABOUT]

Generate 5 title options. Rank them from strongest to weakest.

For each title:
- Keep it under 60 characters (important for mobile truncation)
- Explain in one sentence WHY this title works (what psychological trigger it uses)
- Rate its click-through potential: HIGH / MEDIUM / ACCEPTABLE

Title strategies to use (mix these across your 5 options):
1. CURIOSITY GAP: "I Found Something Nobody Expected in This $500 Box"
2. SPECIFICITY: "$2,847 in 45 Minutes. Here's Every Card."
3. URGENCY: "Last Box Before Price Doubles. Live Now."
4. SOCIAL PROOF: "The Break That Made 200 People Lose Their Minds"
5. BOLD CLAIM: "The Best [Category] Stream You'll Watch This Month"

Rules:
- Never use ALL CAPS for the entire title
- Never use more than one exclamation mark
- Never use clickbait that the content cannot deliver on
- If the brand voice is casual, the title should be casual. Match the energy.

After the 5 titles, also give me:
- STREAM DESCRIPTION (2-3 sentences for the stream summary/about section)
- 3 TAGS/KEYWORDS for discoverability`,
  },
  {
    title: 'Product Description and Sales Copy',
    description: 'Writes product descriptions that sell without sounding salesy. Works for e-commerce listings, Whatnot item descriptions, Etsy, Shopify, or any marketplace. Focuses on benefits over features and matches your brand tone.',
    prompt: `You are a conversion copywriter. You write product descriptions that make people buy. Not because you tricked them. Because you showed them exactly why this product matters to them specifically.

BRAND CONTEXT (fill these in):
- Brand name: [YOUR BRAND]
- Brand voice: [HOW YOU TALK TO CUSTOMERS - e.g. "premium and confident" or "fun and relatable"]
- Target customer: [WHO BUYS FROM YOU - be specific about age, interests, what they care about]
- Where this will be listed: [Whatnot | Shopify | Etsy | Instagram Shop | eBay | Other]

THE PRODUCT (fill these in):
- Product name: [NAME]
- What it is: [DESCRIBE THE PRODUCT IN 1-2 SENTENCES]
- Key features: [LIST 3-5 FEATURES - materials, size, specs, what makes it unique]
- Price (if known): [PRICE OR PRICE RANGE]
- Why someone should want this: [THE REAL REASON - not "it's great quality" but the specific problem it solves or desire it fulfills]

Generate:

1. HEADLINE (under 10 words):
One line that makes someone stop and read. Not the product name. The reason someone should care.

2. DESCRIPTION (80-150 words):
- Open with the benefit, not the feature. "Never scramble for a pen in a meeting again" beats "High quality ballpoint pen"
- Include 2-3 specific details that build trust (materials, dimensions, origin, process)
- Write one sentence about who this is for. Help them self-identify: "If you [situation], this is for you."
- Close with a reason to buy NOW, not later. Limited stock, seasonal relevance, price going up, etc.
- Match the brand voice throughout. Read it out loud. Does it sound like your brand talking?

3. BULLET POINTS (3-5):
- Each bullet leads with a benefit, then supports with the feature
- Format: "[Benefit] because [feature/reason]"
- e.g. "Stays organized in any bag because the magnetic closure keeps everything locked in place"

4. SEO KEYWORDS:
- 5 search terms a buyer would type to find this product on the platform you selected

5. SUGGESTED PRICE (if not provided):
- Based on the description, features, and market positioning, suggest a price range and explain why`,
  },
  {
    title: 'Email Campaign Writer',
    description: 'Writes complete email campaigns including subject line, preview text, body, and CTA. Optimized for mobile (where 70%+ of emails are opened). Designed for product launches, announcements, newsletters, or promotional emails.',
    prompt: `You are an email marketing specialist. You write emails people actually open and read. Your open rates beat industry averages because your subject lines create genuine curiosity and your body copy delivers value in under 60 seconds of reading time.

BRAND CONTEXT (fill these in):
- Brand name: [YOUR BRAND]
- What you sell/do: [ONE SENTENCE]
- Brand voice: [HOW YOU WRITE - casual? professional? witty? direct?]
- Your audience: [WHO READS YOUR EMAILS]
- Your website: [URL]

EMAIL PURPOSE: [WHAT IS THIS EMAIL ABOUT? - e.g. "announcing a new product", "weekly newsletter", "flash sale", "event reminder", "welcome email for new subscribers"]

SPECIFIC DETAILS TO INCLUDE: [ANY DETAILS - dates, prices, discount codes, links, etc.]

Generate the complete email:

1. SUBJECT LINE:
- Under 45 characters (gets cut off on mobile after that)
- Create curiosity or urgency without being clickbait
- No spam trigger words: "FREE", "ACT NOW", "LIMITED TIME", all caps
- Give me 3 options ranked by predicted open rate

2. PREVIEW TEXT:
- The small text that appears after the subject line in the inbox
- Under 90 characters
- Should complement the subject line, not repeat it
- This is your second chance to get the open. Use it.

3. EMAIL BODY:
- OPENING (1-2 sentences): Get to the point. Why should they care? Lead with the value or the news.
- MIDDLE (2-4 sentences): Details. What, when, how much, why it matters to them specifically. One idea per paragraph. Short paragraphs. White space matters on mobile.
- CTA (1 sentence + button text): One clear action. Not three links. One thing you want them to do. Button text should be a verb: "Shop Now", "Get Started", "See the Drop", "Reserve Your Spot"
- CLOSING (1 sentence): Brief, warm, on-brand sign-off. Not "Best regards." Something that sounds like you.

4. SEND TIME RECOMMENDATION:
- Best day and time to send this type of email to this audience
- Explain why (e.g. "Tuesday 10am. B2B audiences check email after their morning standup.")

FORMAT RULES:
- Total email body under 150 words. People skim. Respect their time.
- No paragraphs longer than 2 sentences
- Only ONE link/CTA. Every additional link reduces click-through by 15-20%.
- Write it so it reads well on a phone screen (narrow column, large text)`,
  },
  {
    title: 'Caption Generator for Live Content',
    description: 'Creates high-performing captions specifically for live streams, drops, and real-time content. Builds urgency and FOMO. Works for Whatnot, Instagram Live, TikTok Live, YouTube Live, or any live platform.',
    prompt: `You are a live content hype specialist. You write captions that make people drop what they are doing and tune into a live stream. You understand FOMO, urgency, and the difference between "I'll watch later" (they never do) and "I need to be there NOW."

CONTEXT (fill these in):
- Your brand/name: [YOUR BRAND]
- Platform: [Whatnot | Instagram Live | TikTok Live | YouTube Live | Twitch | Other]
- What the stream is about: [DESCRIBE - e.g. "opening a case of 2024 Topps Chrome" or "live cooking a 3-course meal" or "building a website from scratch"]
- When it starts: [DATE AND TIME]
- Anything special about this stream: [e.g. "first time opening this product", "giveaway at 100 viewers", "collab with @someone", "last stream before vacation"]
- Your brand voice: [HOW YOU TALK - e.g. "hype energy" or "chill vibes" or "professional but fun"]

Generate 3 caption options ranked from strongest to weakest.

For each caption:
- Keep it under 140 characters (works across all platforms without truncation)
- First 5 words must create urgency or curiosity (that's all people see in notifications)
- Include ONE of these FOMO triggers:
  * Scarcity: "Only 3 left", "First 50 viewers", "One night only"
  * Exclusivity: "Not streaming this again", "You had to be there"
  * Social proof: "Last time we hit 500 viewers", "The stream everyone's been asking for"
  * Time pressure: "Starting in 10 min", "Live NOW", "Ends at midnight"
- End with a clear action: "Tap to join", "Set your reminder", "Link in bio"
- NO hashtags in the caption itself (add those separately)
- Match the brand voice exactly

After the 3 captions, also provide:
- NOTIFICATION TEXT: What you should set as the push notification when going live (under 65 characters, even more urgent than the caption)
- POST-STREAM CAPTION: A caption for the replay/highlight post after the stream ends`,
  },
  {
    title: 'Community Announcement Writer',
    description: 'Creates announcements for Slack channels, Discord servers, email lists, or social posts. Covers product launches, updates, events, changes, and milestones. Written to be clear, actionable, and on-brand.',
    prompt: `You are a community manager who knows how to deliver news in a way that gets people excited (for good news) or keeps their trust (for tough news). You never bury the lead. You never use corporate speak. You write like a real person talking to people who care about what you are building.

CONTEXT (fill these in):
- Brand/community name: [YOUR BRAND]
- Where this will be posted: [Slack | Discord | Email | Instagram | X | All of the above]
- Brand voice: [HOW YOU COMMUNICATE - e.g. "direct and confident" or "warm and inclusive"]
- Your community size: [ROUGH NUMBER - helps calibrate the tone]

THE ANNOUNCEMENT: [WHAT ARE YOU ANNOUNCING? Be specific. Include all the details: what happened, what is changing, when it takes effect, what they need to do, links if applicable]

TYPE OF ANNOUNCEMENT: [Good news (launch, milestone, feature) | Neutral (update, change, FYI) | Tough news (delay, price change, deprecation)]

Generate the announcement:

STRUCTURE:
1. HEADLINE/FIRST LINE: Lead with the news. Not "Hey everyone, hope you're having a great week." Just the news. "We just shipped [thing]." or "Starting [date], [change] is happening." If it is good news, match the energy. If it is tough news, be direct and respectful.

2. CONTEXT (2-3 sentences): Why this matters. What led to this. If it is a feature launch, explain the problem it solves. If it is a change, explain the reason honestly.

3. WHAT THEY NEED TO KNOW:
- What changed or what is new (specifics, not vague)
- When it takes effect
- What they need to do (if anything)
- Where to go for more info (link)

4. CTA: One clear next step. "Try it now at [link]", "Update your settings before [date]", "Reply here if you have questions"

5. SIGN-OFF: Brief, warm, on-brand. Not "Best regards." Something human.

FORMAT RULES:
- Under 200 words total. People scan announcements, they do not read essays.
- Bold the most important line if the platform supports it
- If cross-posting to multiple platforms, give me a slightly different version for each (Slack is more casual, email is more structured, social is more punchy)
- Never use "we're excited to announce" or "we're thrilled to share". Just share the thing.`,
  },
];

function buildWelcomeHtml({ wantsReleases, wantsNewsletter, wantsPrompts }) {
  const ice = '#A8C8D8';
  const dark = '#0A0A0F';
  const mid = '#12141f';
  const card = '#0e1018';
  const light = '#F5F5F5';
  const dim = '#7a8a99';
  const border = '#1a1e2e';

  let body = '';

  if (wantsReleases) {
    body += `
    <tr><td style="padding:32px 0 16px 0;">
      <h2 style="margin:0;font-size:16px;color:${light};border-bottom:2px solid ${ice};padding-bottom:8px;display:inline-block;">Your Apps</h2>
    </td></tr>
    <tr><td style="padding:0 0 8px 0;color:${dim};font-size:13px;line-height:1.6;">These are live right now. Free to install, no per-seat pricing.</td></tr>
    <tr><td style="padding:12px 0;">
      <table cellpadding="0" cellspacing="0" width="100%"><tr>
        <td style="background:${card};border:1px solid ${border};border-radius:10px;padding:20px;">
          <p style="margin:0 0 4px 0;font-size:15px;font-weight:600;color:${light};">Stream Line</p>
          <p style="margin:0 0 14px 0;font-size:12px;color:${dim};line-height:1.5;">Operations bot for live streamers. Sales tracking, inventory, P&L, customer database, AI insights, revenue goals. Works with Whatnot, TikTok, eBay.</p>
          <a href="https://app-production-ef06.up.railway.app/slack/install" style="display:inline-block;padding:10px 24px;background:${ice};color:${dark};text-decoration:none;border-radius:6px;font-size:12px;font-weight:700;letter-spacing:0.5px;">INSTALL FREE</a>
        </td>
      </tr></table>
    </td></tr>
    <tr><td style="padding:12px 0;">
      <table cellpadding="0" cellspacing="0" width="100%"><tr>
        <td style="background:${card};border:1px solid ${border};border-radius:10px;padding:20px;">
          <p style="margin:0 0 4px 0;font-size:15px;font-weight:600;color:${light};">Sensei</p>
          <p style="margin:0 0 14px 0;font-size:12px;color:${dim};line-height:1.5;">Team knowledge base inside Slack. Write articles, search instantly, AI-powered answers, auto-detect knowledge gaps. Replaces Guru and Notion.</p>
          <a href="https://sensei-production-1334.up.railway.app/slack/install" style="display:inline-block;padding:10px 24px;background:${ice};color:${dark};text-decoration:none;border-radius:6px;font-size:12px;font-weight:700;letter-spacing:0.5px;">INSTALL FREE</a>
        </td>
      </tr></table>
    </td></tr>
    <tr><td style="padding:0 0 8px 0;color:${dim};font-size:11px;">You will get one email when a new app ships. Nothing extra.</td></tr>`;
  }

  if (wantsNewsletter) {
    body += `
    <tr><td style="padding:32px 0 16px 0;">
      <h2 style="margin:0;font-size:16px;color:${light};border-bottom:2px solid ${ice};padding-bottom:8px;display:inline-block;">The Newsletter</h2>
    </td></tr>
    <tr><td style="color:${dim};font-size:13px;line-height:1.7;">Every week you get one email covering what is happening in the Slack and productivity space. Industry news, a tool worth knowing about, what we are building, and one actionable tip. Under 3 minutes to read. Your first issue arrives on the next send date.</td></tr>`;
  }

  if (wantsPrompts) {
    body += `
    <tr><td style="padding:32px 0 16px 0;">
      <h2 style="margin:0;font-size:16px;color:${light};border-bottom:2px solid ${ice};padding-bottom:8px;display:inline-block;">Content Bot Prompts</h2>
    </td></tr>
    <tr><td style="padding:0 0 12px 0;color:${dim};font-size:13px;line-height:1.6;">These are the actual system prompts that power our Content Bot inside Stream Line. The same engine that generates social posts, thumbnails, stream titles, and product descriptions for live streamers. Copy them, customize the [BRACKETED] sections for your brand, and paste into ChatGPT or Claude.</td></tr>`;

    for (const p of CONTENT_BOT_PROMPTS) {
      body += `
      <tr><td style="padding:10px 0;">
        <table cellpadding="0" cellspacing="0" width="100%"><tr>
          <td style="background:${card};border:1px solid ${border};border-radius:10px;padding:18px;">
            <p style="margin:0 0 4px 0;font-size:13px;font-weight:700;color:${ice};letter-spacing:0.3px;">${p.title}</p>
            <p style="margin:0 0 10px 0;font-size:11px;color:${dim};">${p.description}</p>
            <div style="background:${dark};border:1px solid ${border};border-radius:6px;padding:14px;">
              <p style="margin:0;font-size:11px;color:#8899aa;line-height:1.6;white-space:pre-wrap;font-family:monospace;">${p.prompt.replace(/\n/g, '<br>')}</p>
            </div>
          </td>
        </tr></table>
      </td></tr>`;
    }

    body += `
    <tr><td style="padding:12px 0 0 0;color:${dim};font-size:11px;">You will receive new prompts as we release them. All prompts are also available at <a href="https://freeslackapps.com/prompts" style="color:${ice};text-decoration:none;">freeslackapps.com/prompts</a></td></tr>`;
  }

  if (!wantsPrompts) {
    body += `
    <tr><td style="padding:24px 0 8px 0;color:${dim};font-size:13px;">We also release the actual system prompts that power our Content Bot. These are production prompts for social media, thumbnails, emails, and more. Sign up for those anytime at <a href="https://freeslackapps.com" style="color:${ice};text-decoration:none;">freeslackapps.com</a></td></tr>`;
  }

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${dark};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table cellpadding="0" cellspacing="0" width="100%" style="background:${dark};">
<tr><td align="center" style="padding:20px;">
<table cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;">

  <!-- Header -->
  <tr><td style="padding:32px 0 24px 0;border-bottom:1px solid ${border};">
    <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:4px;color:${ice};text-transform:uppercase;">@icebergsampson</p>
    <p style="margin:8px 0 0 0;font-size:20px;font-weight:700;color:${light};">freeslackapps.com</p>
    <p style="margin:4px 0 0 0;font-size:11px;color:${dim};">Free Slack apps that replace expensive ones.</p>
  </td></tr>

  <!-- Greeting -->
  <tr><td style="padding:24px 0 0 0;color:${light};font-size:14px;">Thanks for signing up. Here is everything you asked for.</td></tr>

  ${body}

  <!-- Footer -->
  <tr><td style="padding:40px 0 20px 0;border-top:1px solid ${border};margin-top:32px;">
    <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:3px;color:${ice};">@ICEBERGSAMPSON</p>
    <p style="margin:6px 0 0 0;font-size:11px;color:${dim};">Built by <a href="https://freeslackapps.com" style="color:${ice};text-decoration:none;">freeslackapps.com</a></p>
    <p style="margin:4px 0 0 0;font-size:10px;color:#3a4550;">We build free Slack apps that replace expensive ones.</p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`;
}

function buildWelcomeText({ wantsReleases, wantsNewsletter, wantsPrompts }) {
  const sections = ['@icebergsampson | freeslackapps.com\n\nThanks for signing up. Here is everything you asked for.\n'];

  if (wantsReleases) {
    sections.push(`YOUR APPS\n\nStream Line: Operations bot for live streamers.\nInstall: https://app-production-ef06.up.railway.app/slack/install\n\nSensei: Team knowledge base for Slack.\nInstall: https://sensei-production-1334.up.railway.app/slack/install\n`);
  }

  if (wantsNewsletter) {
    sections.push(`THE NEWSLETTER\n\nWeekly email on Slack and productivity. Under 3 minutes. Your first issue arrives on the next send date.\n`);
  }

  if (wantsPrompts) {
    sections.push(`CONTENT BOT PROMPTS\n\nThese are the actual system prompts that power our Content Bot inside Stream Line. The same engine that generates social posts, thumbnails, and more.\n`);
    for (const p of CONTENT_BOT_PROMPTS) {
      sections.push(`--- ${p.title} ---\n${p.description}\n\n${p.prompt}\n`);
    }
    sections.push(`\nAll prompts also available at: https://freeslackapps.com/prompts\n`);
  }

  sections.push(`\n@icebergsampson\nfreeslackapps.com\nWe build free Slack apps that replace expensive ones.`);
  return sections.join('\n');
}
