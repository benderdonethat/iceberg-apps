/**
 * The Tip — issue registry.
 *
 * Current issue = what gets sent this Thursday.
 * When a new issue is ready, replace CURRENT with the new issue object and redeploy.
 *
 * Each issue: number, subject, preview, sendDate (ISO date of the Thursday),
 * and html (full rendered email HTML).
 */

export const CURRENT = {
  number: 3,
  subject: "The worst AI you'll ever use is the one you're on right now",
  preview: "Not doom. Actually the opposite. Here's why that might be the most freeing thing you read this week.",
  sendDate: "2026-04-16", // Thursday
  html: `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>The Tip · Issue 003</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
@media (max-width:620px){
  .container{width:100%!important;max-width:100%!important;padding:32px 20px!important}
  h1.headline{font-size:34px!important;line-height:1.08!important}
  h2.section-head{font-size:22px!important}
  .pull p{font-size:18px!important}
}
</style></head>
<body style="margin:0;padding:0;background:#0A0A0F;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#F5F5F5;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0A0A0F;">
<tr><td align="center" style="padding:0;">
<table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#0A0A0F;padding:56px 48px;">

<tr><td style="padding:0 0 56px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td align="left" valign="middle" style="vertical-align:middle;">
<div style="font-family:'JetBrains Mono',Menlo,Consolas,monospace;font-size:10px;font-weight:700;letter-spacing:0.3em;color:#A8C8D8;text-transform:uppercase;">The Tip <span style="color:#3A4A55;">&nbsp;·&nbsp;</span> <span style="color:#F5F5F5;">No. 003</span></div>
<div style="font-family:'JetBrains Mono',Menlo,Consolas,monospace;font-size:10px;color:#4A5A65;letter-spacing:0.15em;margin-top:6px;">April 16, 2026 &nbsp;·&nbsp; 3 MIN READ</div>
</td><td align="right" valign="middle" style="vertical-align:middle;">
<img src="https://icebergsampson.vercel.app/assets/avatar.png" width="44" height="44" alt="@icebergsampson" style="display:block;border-radius:50%;">
</td></tr></table>
</td></tr>

<tr><td style="padding:0 0 14px 0;">
<div style="display:inline-block;padding:6px 12px;background:rgba(168,200,216,0.08);border:1px solid #1A2A35;border-radius:100px;font-family:'JetBrains Mono',Menlo,monospace;font-size:10px;font-weight:700;letter-spacing:0.18em;color:#A8C8D8;text-transform:uppercase;">observation</div>
</td></tr>

<tr><td style="padding:0 0 18px 0;">
<h1 class="headline" style="margin:0;font-family:'Instrument Serif',Georgia,'Times New Roman',serif;font-size:46px;font-weight:400;letter-spacing:-0.02em;color:#F5F5F5;line-height:1.05;">The worst AI you'll ever use<br>is the one you're on <em style="font-style:italic;color:#A8C8D8;">right now</em></h1>
</td></tr>

<tr><td style="padding:0 0 44px 0;">
<p style="margin:0;font-size:16px;color:#9AAAB8;line-height:1.55;font-weight:400;">Not doom. Actually the opposite. Here's why that might be the most freeing thing you read this week.</p>
</td></tr>

<tr><td style="padding:0 0 44px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td width="40%" height="1" style="background:linear-gradient(to right,transparent,#1A2A35);line-height:1px;font-size:0;">&nbsp;</td>
<td width="20%" align="center" style="padding:0 14px;"><div style="width:6px;height:6px;background:#A8C8D8;border-radius:50%;display:inline-block;"></div></td>
<td width="40%" height="1" style="background:linear-gradient(to left,transparent,#1A2A35);line-height:1px;font-size:0;">&nbsp;</td></tr></table>
</td></tr>

<tr><td style="padding:0 0 8px 0;"><div style="font-family:'JetBrains Mono',Menlo,monospace;font-size:10px;font-weight:700;letter-spacing:0.24em;color:#5A7A8A;text-transform:uppercase;">01 &nbsp;/&nbsp; The reframe</div></td></tr>
<tr><td style="padding:0 0 18px 0;"><h2 class="section-head" style="margin:0;font-family:'Instrument Serif',Georgia,serif;font-size:26px;font-weight:400;color:#F5F5F5;line-height:1.2;letter-spacing:-0.01em;">This is as primitive as it gets.</h2></td></tr>
<tr><td style="padding:0 0 20px 0;"><p style="margin:0;font-size:16px;color:#D8D8E0;line-height:1.75;">Think about whatever AI you opened last week. ChatGPT, Claude, Gemini, something inside Notion or Lovable. That version, the one that felt <strong style="color:#F5F5F5;font-weight:600;">kind of magic some days and kind of mid others</strong>, is the worst AI that's ever going to exist.</p></td></tr>
<tr><td style="padding:0 0 20px 0;"><p style="margin:0;font-size:16px;color:#D8D8E0;line-height:1.75;">Every model gets replaced. Every interface gets redesigned. The gap between what's available today and what's available a year from now is going to be bigger than the gap between this year and five years ago. That's not a prediction. That's the slope everyone's already standing on.</p></td></tr>
<tr><td style="padding:0 0 48px 0;"><p style="margin:0;font-size:16px;color:#D8D8E0;line-height:1.75;">Which is weird, because the whole vibe online is that people are falling behind. Missing the wave. Not expert enough. But the wave never stops long enough for anyone to be expert. <strong style="color:#F5F5F5;font-weight:600;">The people who feel most "expert" right now are mostly expert at tools that'll be footnotes by summer.</strong></p></td></tr>

<tr><td style="padding:0 0 8px 0;"><div style="font-family:'JetBrains Mono',Menlo,monospace;font-size:10px;font-weight:700;letter-spacing:0.24em;color:#5A7A8A;text-transform:uppercase;">02 &nbsp;/&nbsp; The weird upside</div></td></tr>
<tr><td style="padding:0 0 18px 0;"><h2 class="section-head" style="margin:0;font-family:'Instrument Serif',Georgia,serif;font-size:26px;font-weight:400;color:#F5F5F5;line-height:1.2;letter-spacing:-0.01em;">Being a beginner is almost an asset.</h2></td></tr>
<tr><td style="padding:0 0 20px 0;"><p style="margin:0;font-size:16px;color:#D8D8E0;line-height:1.75;">If the tools keep shipping the floor underneath everyone, being a beginner is almost an asset. Nothing you learn today compounds if it's about the tool. <strong style="color:#F5F5F5;font-weight:600;">But something you learn today absolutely compounds if it's about you.</strong></p></td></tr>
<tr><td style="padding:0 0 48px 0;"><p style="margin:0;font-size:16px;color:#D8D8E0;line-height:1.75;">The person who figures out how they actually want to think, what they actually care about, what their voice actually sounds like, doesn't care which model they're using. They're just using whatever's there to go faster at something they were already doing.</p></td></tr>

<tr><td class="pull" style="padding:0 0 48px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0F1520;border-radius:8px;">
<tr><td width="4" style="background:#A8C8D8;border-radius:8px 0 0 8px;">&nbsp;</td>
<td style="padding:28px 32px;">
<div style="font-family:'Instrument Serif',Georgia,serif;font-size:40px;color:#A8C8D8;line-height:0.6;font-style:italic;">&ldquo;</div>
<p style="margin:4px 0 0 0;font-family:'Instrument Serif',Georgia,serif;font-size:22px;color:#F5F5F5;line-height:1.4;font-weight:400;font-style:italic;">The AI changes every six months. The person using it doesn't have to.</p>
</td></tr></table>
</td></tr>

<tr><td style="padding:0 0 8px 0;"><div style="font-family:'JetBrains Mono',Menlo,monospace;font-size:10px;font-weight:700;letter-spacing:0.24em;color:#5A7A8A;text-transform:uppercase;">03 &nbsp;/&nbsp; What stays standing</div></td></tr>
<tr><td style="padding:0 0 18px 0;"><h2 class="section-head" style="margin:0;font-family:'Instrument Serif',Georgia,serif;font-size:26px;font-weight:400;color:#F5F5F5;line-height:1.2;letter-spacing:-0.01em;">Build on the layer that isn't moving.</h2></td></tr>
<tr><td style="padding:0 0 20px 0;"><p style="margin:0;font-size:16px;color:#D8D8E0;line-height:1.75;">Almost everything moving fast right now is moving fast because it's a commodity. Writing. Summarizing. Boilerplate code. Research synthesis. Anything that was expensive because it took time and attention is on its way to free.</p></td></tr>
<tr><td style="padding:0 0 48px 0;"><p style="margin:0;font-size:16px;color:#D8D8E0;line-height:1.75;">What doesn't go to zero is the stuff that was never about time. Opinion. Taste. Judgment. <strong style="color:#F5F5F5;font-weight:600;">Knowing which problem actually matters before anyone's written the prompt.</strong> These don't get cheaper when models get better. They get rarer, because everyone else is busy getting faster at things that no longer matter.</p></td></tr>

<tr><td style="padding:0 0 8px 0;"><div style="font-family:'JetBrains Mono',Menlo,monospace;font-size:10px;font-weight:700;letter-spacing:0.24em;color:#5A7A8A;text-transform:uppercase;">04 &nbsp;/&nbsp; The quiet practice</div></td></tr>
<tr><td style="padding:0 0 18px 0;"><h2 class="section-head" style="margin:0;font-family:'Instrument Serif',Georgia,serif;font-size:26px;font-weight:400;color:#F5F5F5;line-height:1.2;letter-spacing:-0.01em;">A small thing to try this week.</h2></td></tr>
<tr><td style="padding:0 0 20px 0;"><p style="margin:0;font-size:16px;color:#D8D8E0;line-height:1.75;">Next time an AI hands you something that's just fine, resist the urge to either accept it or reprompt it. Try a different question instead. <strong style="color:#F5F5F5;font-weight:600;">What would this look like if someone who actually cared about the topic had written it?</strong> What would be in there that isn't? What would they cut?</p></td></tr>
<tr><td style="padding:0 0 56px 0;"><p style="margin:0;font-size:16px;color:#D8D8E0;line-height:1.75;">That little loop is the only skill that doesn't expire. It's also not something any Instagram account is going to teach you, because it's not flashy and it can't be sold as a course. It just happens to be the whole game.</p></td></tr>

<tr><td style="padding:0 0 56px 0;"><p style="margin:0;font-family:'Instrument Serif',Georgia,serif;font-size:22px;color:#F5F5F5;line-height:1.35;font-weight:400;">The model isn't the thing to get good at. <em style="color:#A8C8D8;font-style:italic;">The person using it is.</em></p></td></tr>

<tr><td style="padding:0 0 36px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td width="40%" height="1" style="background:linear-gradient(to right,transparent,#1A2A35);line-height:1px;font-size:0;">&nbsp;</td>
<td width="20%" align="center" style="padding:0 14px;"><div style="width:6px;height:6px;background:#A8C8D8;border-radius:50%;display:inline-block;"></div></td>
<td width="40%" height="1" style="background:linear-gradient(to left,transparent,#1A2A35);line-height:1px;font-size:0;">&nbsp;</td></tr></table>
</td></tr>

<tr><td style="padding:0 0 48px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0F1520;border:1px solid #1A2A35;border-radius:10px;">
<tr><td style="padding:22px 26px;">
<div style="font-family:'JetBrains Mono',Menlo,monospace;font-size:10px;font-weight:700;letter-spacing:0.2em;color:#A8C8D8;text-transform:uppercase;margin-bottom:8px;">P.S.</div>
<p style="margin:0;font-size:14px;color:#B8C8D0;line-height:1.65;">If something here changed how you were about to ask an AI anything this week, the inbox is open. &nbsp;<a href="https://instagram.com/icebergsampson" style="color:#A8C8D8;text-decoration:none;font-weight:500;">@icebergsampson</a></p>
</td></tr></table>
</td></tr>

<tr><td align="center" style="padding:0;">
<img src="https://icebergsampson.vercel.app/assets/avatar.png" width="28" height="28" alt="@icebergsampson" style="display:block;border-radius:50%;opacity:0.5;margin:0 auto;">
<div style="font-family:'JetBrains Mono',Menlo,monospace;font-size:9px;font-weight:700;letter-spacing:0.3em;color:#3A4A55;text-transform:uppercase;margin-top:12px;">The Tip &nbsp;·&nbsp; @icebergsampson</div>
<div style="font-size:11px;color:#3A4A55;margin-top:10px;line-height:1.6;"><a href="https://icebergsampson.vercel.app" style="color:#4A5A65;text-decoration:underline;">icebergsampson.vercel.app</a></div>
</td></tr>

</table></td></tr></table>
</body></html>`,
};

/**
 * Returns true if today matches the current issue's sendDate in America/New_York time zone.
 * Used by signup endpoint: if today IS Thursday send-day, new subscribers get the current issue immediately.
 */
export function isSendDay() {
  const nyDate = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
  return nyDate === CURRENT.sendDate;
}
