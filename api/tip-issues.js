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
  subject: "The shape of a business that's compounding",
  preview: "And the one quiet thing almost every company is missing between its phases.",
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
<div style="font-family:'JetBrains Mono',Menlo,Consolas,monospace;font-size:10px;color:#4A5A65;letter-spacing:0.15em;margin-top:6px;">April 16, 2026 &nbsp;·&nbsp; 4 MIN READ</div>
</td><td align="right" valign="middle" style="vertical-align:middle;">
<img src="https://icebergsampson.vercel.app/icebergsampson-avatar-tight.png" width="44" height="44" alt="@icebergsampson" style="display:block;border-radius:50%;">
</td></tr></table>
</td></tr>
<tr><td style="padding:0 0 14px 0;">
<div style="display:inline-block;padding:6px 12px;background:rgba(168,200,216,0.08);border:1px solid #1A2A35;border-radius:100px;font-family:'JetBrains Mono',Menlo,monospace;font-size:10px;font-weight:700;letter-spacing:0.18em;color:#A8C8D8;text-transform:uppercase;">observation</div>
</td></tr>
<tr><td style="padding:0 0 18px 0;">
<h1 class="headline" style="margin:0;font-family:'Instrument Serif',Georgia,'Times New Roman',serif;font-size:46px;font-weight:400;letter-spacing:-0.02em;color:#F5F5F5;line-height:1.05;">The shape of a business<br>that's <em style="font-style:italic;color:#A8C8D8;">compounding</em></h1>
</td></tr>
<tr><td style="padding:0 0 44px 0;">
<p style="margin:0;font-size:16px;color:#9AAAB8;line-height:1.55;font-weight:400;">And the one quiet thing almost every company is missing between its phases.</p>
</td></tr>
<tr><td style="padding:0 0 44px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td width="40%" height="1" style="background:linear-gradient(to right,transparent,#1A2A35);line-height:1px;font-size:0;">&nbsp;</td>
<td width="20%" align="center" style="padding:0 14px;"><div style="width:6px;height:6px;background:#A8C8D8;border-radius:50%;display:inline-block;"></div></td>
<td width="40%" height="1" style="background:linear-gradient(to left,transparent,#1A2A35);line-height:1px;font-size:0;">&nbsp;</td></tr></table>
</td></tr>
<tr><td style="padding:0 0 8px 0;"><div style="font-family:'JetBrains Mono',Menlo,monospace;font-size:10px;font-weight:700;letter-spacing:0.24em;color:#5A7A8A;text-transform:uppercase;">01 &nbsp;/&nbsp; The shape</div></td></tr>
<tr><td style="padding:0 0 18px 0;"><h2 class="section-head" style="margin:0;font-family:'Instrument Serif',Georgia,serif;font-size:26px;font-weight:400;color:#F5F5F5;line-height:1.2;letter-spacing:-0.01em;">Every company has a hidden loop.</h2></td></tr>
<tr><td style="padding:0 0 20px 0;"><p style="margin:0;font-size:16px;color:#D8D8E0;line-height:1.75;">There's a shape to every business that isn't on the org chart. It's closer to a loop. Attention comes in. Work runs through the middle. Something ships out. And if the company is paying attention, <strong style="color:#F5F5F5;font-weight:600;">what comes back from that shipment quietly changes what happens the next time around</strong>.</p></td></tr>
<tr><td style="padding:0 0 48px 0;"><p style="margin:0;font-size:16px;color:#D8D8E0;line-height:1.75;">Most companies can name the phases. Some can name who owns each one. Almost none can say what signal actually moves between them.</p></td></tr>
<tr><td class="pull" style="padding:0 0 48px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0F1520;border-radius:8px;">
<tr><td width="4" style="background:#A8C8D8;border-radius:8px 0 0 8px;">&nbsp;</td>
<td style="padding:28px 32px;">
<div style="font-family:'Instrument Serif',Georgia,serif;font-size:40px;color:#A8C8D8;line-height:0.6;font-style:italic;">&ldquo;</div>
<p style="margin:4px 0 0 0;font-family:'Instrument Serif',Georgia,serif;font-size:22px;color:#F5F5F5;line-height:1.4;font-weight:400;font-style:italic;">The fastest teams aren't the ones doing the most. They're the ones where signal between phases is shorter than a week.</p>
</td></tr></table>
</td></tr>
<tr><td style="padding:0 0 8px 0;"><div style="font-family:'JetBrains Mono',Menlo,monospace;font-size:10px;font-weight:700;letter-spacing:0.24em;color:#5A7A8A;text-transform:uppercase;">02 &nbsp;/&nbsp; The handoff</div></td></tr>
<tr><td style="padding:0 0 18px 0;"><h2 class="section-head" style="margin:0;font-family:'Instrument Serif',Georgia,serif;font-size:26px;font-weight:400;color:#F5F5F5;line-height:1.2;letter-spacing:-0.01em;">It almost never breaks where people think.</h2></td></tr>
<tr><td style="padding:0 0 20px 0;"><p style="margin:0;font-size:16px;color:#D8D8E0;line-height:1.75;">The strange thing about businesses that feel chaotic isn't the people inside them. The people are usually competent. The phases are usually staffed. What's missing is almost always the handoff. <strong style="color:#F5F5F5;font-weight:600;">The moment when what happened in one phase is supposed to teach the next one what to do differently.</strong></p></td></tr>
<tr><td style="padding:0 0 48px 0;"><p style="margin:0;font-size:16px;color:#D8D8E0;line-height:1.75;">A marketing team runs a campaign. The sales team closes a few deals. Nobody writes down what the closed deals had in common. Three months later, marketing runs the same campaign again. The operation hasn't failed. It just hasn't learned.</p></td></tr>
<tr><td style="padding:0 0 8px 0;"><div style="font-family:'JetBrains Mono',Menlo,monospace;font-size:10px;font-weight:700;letter-spacing:0.24em;color:#5A7A8A;text-transform:uppercase;">03 &nbsp;/&nbsp; The signal</div></td></tr>
<tr><td style="padding:0 0 18px 0;"><h2 class="section-head" style="margin:0;font-family:'Instrument Serif',Georgia,serif;font-size:26px;font-weight:400;color:#F5F5F5;line-height:1.2;letter-spacing:-0.01em;">The discipline is boring. It's also the whole thing.</h2></td></tr>
<tr><td style="padding:0 0 20px 0;"><p style="margin:0;font-size:16px;color:#D8D8E0;line-height:1.75;">The companies that look notably organized from the outside usually have one small discipline in common. <strong style="color:#F5F5F5;font-weight:600;">Every shipped thing leaves a trace somewhere the next person in the loop can see without asking.</strong> Not a meeting. Not a report. Just a shared surface.</p></td></tr>
<tr><td style="padding:0 0 48px 0;"><p style="margin:0;font-size:16px;color:#D8D8E0;line-height:1.75;">When it's working, nobody notices. When it isn't, everything starts to feel like it's happening for the first time, every time.</p></td></tr>
<tr><td style="padding:0 0 8px 0;"><div style="font-family:'JetBrains Mono',Menlo,monospace;font-size:10px;font-weight:700;letter-spacing:0.24em;color:#5A7A8A;text-transform:uppercase;">04 &nbsp;/&nbsp; The cleanup</div></td></tr>
<tr><td style="padding:0 0 18px 0;"><h2 class="section-head" style="margin:0;font-family:'Instrument Serif',Georgia,serif;font-size:26px;font-weight:400;color:#F5F5F5;line-height:1.2;letter-spacing:-0.01em;">Compounding looks almost boring.</h2></td></tr>
<tr><td style="padding:0 0 20px 0;"><p style="margin:0;font-size:16px;color:#D8D8E0;line-height:1.75;">The shape of a company that's compounding looks almost boring from the outside. The team isn't sprinting. Headcount isn't climbing. Knowledge just keeps stacking because the surface it lives on is doing the stacking. Every campaign informs the next one. Every project ships a little faster than the last.</p></td></tr>
<tr><td style="padding:0 0 56px 0;"><p style="margin:0;font-family:'Instrument Serif',Georgia,serif;font-size:22px;color:#F5F5F5;line-height:1.35;font-weight:400;">Most companies aren't a day away from a breakthrough. <em style="color:#A8C8D8;font-style:italic;">They're one cleanup away from compounding.</em></p></td></tr>
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
<p style="margin:0;font-size:14px;color:#B8C8D0;line-height:1.65;">If something here made you look at your own team's quiet handoffs differently, the inbox is open. &nbsp;<a href="https://instagram.com/icebergsampson" style="color:#A8C8D8;text-decoration:none;font-weight:500;">@icebergsampson</a></p>
</td></tr></table>
</td></tr>
<tr><td align="center" style="padding:0;">
<img src="https://icebergsampson.vercel.app/icebergsampson-avatar-tight.png" width="28" height="28" alt="@icebergsampson" style="display:block;border-radius:50%;opacity:0.5;margin:0 auto;">
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
