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
  number: 1,
  subject: "The first job is disappearing",
  preview: "From fast food to Big Law, the entry rung is being quietly automated across the whole economy. The people already on the ladder are fine. The people meant to step on next aren't coming.",
  sendDate: "2026-04-16", // Thursday
  html: `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>The Tip · Issue 001</title>
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
<div style="font-family:'JetBrains Mono',Menlo,Consolas,monospace;font-size:10px;font-weight:700;letter-spacing:0.3em;color:#A8C8D8;text-transform:uppercase;">The Tip <span style="color:#3A4A55;">&nbsp;·&nbsp;</span> <span style="color:#F5F5F5;">No. 001</span></div>
<div style="font-family:'JetBrains Mono',Menlo,Consolas,monospace;font-size:10px;color:#4A5A65;letter-spacing:0.15em;margin-top:6px;">April 16, 2026 &nbsp;·&nbsp; 4 MIN READ</div>
</td><td align="right" valign="middle" style="vertical-align:middle;">
<img src="https://icebergsampson.vercel.app/assets/avatar.png" width="44" height="44" alt="@icebergsampson" style="display:block;border-radius:50%;">
</td></tr></table>
</td></tr>

<tr><td style="padding:0 0 14px 0;">
<div style="display:inline-block;padding:6px 12px;background:rgba(168,200,216,0.08);border:1px solid #1A2A35;border-radius:100px;font-family:'JetBrains Mono',Menlo,monospace;font-size:10px;font-weight:700;letter-spacing:0.18em;color:#A8C8D8;text-transform:uppercase;">observation</div>
</td></tr>

<tr><td style="padding:0 0 18px 0;">
<h1 class="headline" style="margin:0;font-family:'Instrument Serif',Georgia,'Times New Roman',serif;font-size:52px;font-weight:400;letter-spacing:-0.025em;color:#F5F5F5;line-height:1.02;">The first job<br>is <em style="font-style:italic;color:#A8C8D8;">disappearing</em></h1>
</td></tr>

<tr><td style="padding:0 0 44px 0;">
<p style="margin:0;font-size:16px;color:#9AAAB8;line-height:1.55;font-weight:400;">From fast food to Big Law, the entry rung is being quietly automated across the whole economy. The people already on the ladder are fine. The people meant to step on next aren't coming.</p>
</td></tr>

<tr><td style="padding:0 0 44px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td width="40%" height="1" style="background:linear-gradient(to right,transparent,#1A2A35);line-height:1px;font-size:0;">&nbsp;</td>
<td width="20%" align="center" style="padding:0 14px;"><div style="width:6px;height:6px;background:#A8C8D8;border-radius:50%;display:inline-block;"></div></td>
<td width="40%" height="1" style="background:linear-gradient(to left,transparent,#1A2A35);line-height:1px;font-size:0;">&nbsp;</td></tr></table>
</td></tr>

<tr><td style="padding:0 0 8px 0;"><div style="font-family:'JetBrains Mono',Menlo,monospace;font-size:10px;font-weight:700;letter-spacing:0.24em;color:#5A7A8A;text-transform:uppercase;">01 &nbsp;/&nbsp; The kiosk</div></td></tr>
<tr><td style="padding:0 0 18px 0;"><h2 class="section-head" style="margin:0;font-family:'Instrument Serif',Georgia,serif;font-size:26px;font-weight:400;color:#F5F5F5;line-height:1.2;letter-spacing:-0.01em;">Something quietly went missing.</h2></td></tr>
<tr><td style="padding:0 0 20px 0;"><p style="margin:0;font-size:16px;color:#D8D8E0;line-height:1.75;">Walked into a restaurant last week. Ordered on a screen. Sat at a table. A human brought the food. The food was actually better than last year. Staff were wiping tables and moving fast. No lines. The place ran like it had more people working than it did.</p></td></tr>
<tr><td style="padding:0 0 48px 0;"><p style="margin:0;font-size:16px;color:#D8D8E0;line-height:1.75;">Everything about the experience said the business was doing better. <strong style="color:#F5F5F5;font-weight:600;">The only thing missing was the person who used to stand behind the counter and ask what you wanted.</strong> Which, five years ago, was almost always somebody getting their first job.</p></td></tr>

<tr><td style="padding:0 0 8px 0;"><div style="font-family:'JetBrains Mono',Menlo,monospace;font-size:10px;font-weight:700;letter-spacing:0.24em;color:#5A7A8A;text-transform:uppercase;">02 &nbsp;/&nbsp; The same shape, everywhere else</div></td></tr>
<tr><td style="padding:0 0 18px 0;"><h2 class="section-head" style="margin:0;font-family:'Instrument Serif',Georgia,serif;font-size:26px;font-weight:400;color:#F5F5F5;line-height:1.2;letter-spacing:-0.01em;">The same thing is happening in marble lobbies.</h2></td></tr>
<tr><td style="padding:0 0 20px 0;"><p style="margin:0;font-size:16px;color:#D8D8E0;line-height:1.75;">The big law firms just had their worst year on record for hiring their next class of first-year lawyers. The median firm extended <strong style="color:#F5F5F5;font-weight:600;">six offers</strong>. That is not a typo. In 2023 the median was fourteen. Goldman Sachs and Morgan Stanley are quietly pulling back junior analyst recruitment. KPMG slashed its graduate intake by twenty-nine percent. PwC cut fifty-six hundred people in one year. The Federal Reserve has started naming the pattern in its own research.</p></td></tr>
<tr><td style="padding:0 0 48px 0;"><p style="margin:0;font-size:16px;color:#D8D8E0;line-height:1.75;">It is the same restaurant. The tasks a junior analyst used to spend whole weeks on are getting handled by an AI that finishes in minutes. The senior specialist reviews the output and signs off. The client pays a little less. The firm runs a little leaner. Everyone currently employed wins. <strong style="color:#F5F5F5;font-weight:600;">The only person missing is the 23-year-old who was supposed to be learning how to think like an analyst by doing that repetition thousands of times.</strong></p></td></tr>

<tr><td class="pull" style="padding:0 0 48px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0F1520;border-radius:8px;">
<tr><td width="4" style="background:#A8C8D8;border-radius:8px 0 0 8px;">&nbsp;</td>
<td style="padding:28px 32px;">
<div style="font-family:'Instrument Serif',Georgia,serif;font-size:40px;color:#A8C8D8;line-height:0.6;font-style:italic;">&ldquo;</div>
<p style="margin:4px 0 0 0;font-family:'Instrument Serif',Georgia,serif;font-size:22px;color:#F5F5F5;line-height:1.4;font-weight:400;font-style:italic;">The ladder is still standing. The bottom rung is what's missing.</p>
</td></tr></table>
</td></tr>

<tr><td style="padding:0 0 8px 0;"><div style="font-family:'JetBrains Mono',Menlo,monospace;font-size:10px;font-weight:700;letter-spacing:0.24em;color:#5A7A8A;text-transform:uppercase;">03 &nbsp;/&nbsp; The math the retraining crowd keeps dodging</div></td></tr>
<tr><td style="padding:0 0 18px 0;"><h2 class="section-head" style="margin:0;font-family:'Instrument Serif',Georgia,serif;font-size:26px;font-weight:400;color:#F5F5F5;line-height:1.2;letter-spacing:-0.01em;">You can't train somebody into a first job.</h2></td></tr>
<tr><td style="padding:0 0 20px 0;"><p style="margin:0;font-size:16px;color:#D8D8E0;line-height:1.75;">The loudest number in the news right now is from the World Economic Forum. 170 million new jobs by 2030. 92 million destroyed. Net 78 million gain. McKinsey has a similar pitch. Brookings says 70% of affected workers can just transition into something else. Everyone ends on the same word. Retrain.</p></td></tr>
<tr><td style="padding:0 0 48px 0;"><p style="margin:0;font-size:16px;color:#D8D8E0;line-height:1.75;">The quiet thing buried in that math is which jobs are on which side of the ledger. The ones getting destroyed are almost all entry level. The ones getting created are almost all mid-career. <strong style="color:#F5F5F5;font-weight:600;">You cannot retrain a 19-year-old into a senior role they never apprenticed for.</strong> You cannot retrain somebody into their first job. The career ladder was never just a series of paychecks. It was how a person learned how to think in a profession. That learning happened at the bottom rung, slowly, by doing the work a computer now does in two minutes.</p></td></tr>

<tr><td style="padding:0 0 8px 0;"><div style="font-family:'JetBrains Mono',Menlo,monospace;font-size:10px;font-weight:700;letter-spacing:0.24em;color:#5A7A8A;text-transform:uppercase;">04 &nbsp;/&nbsp; The small thing to notice this week</div></td></tr>
<tr><td style="padding:0 0 18px 0;"><h2 class="section-head" style="margin:0;font-family:'Instrument Serif',Georgia,serif;font-size:26px;font-weight:400;color:#F5F5F5;line-height:1.2;letter-spacing:-0.01em;">Look for where the human used to be.</h2></td></tr>
<tr><td style="padding:0 0 20px 0;"><p style="margin:0;font-size:16px;color:#D8D8E0;line-height:1.75;">Next time you are at a restaurant, a bank, a pharmacy, an airport, a service counter, look at the spot where a person used to stand. Not to feel bad about it. Just to notice. Who is still there? What are they doing instead? And where did the person who used to greet you go?</p></td></tr>
<tr><td style="padding:0 0 56px 0;"><p style="margin:0;font-size:16px;color:#D8D8E0;line-height:1.75;">Multiply that by every counter in every building in every industry, happening at the same time. That is not a jobs story. <strong style="color:#F5F5F5;font-weight:600;">That is the shape of the next decade.</strong> The people already on the ladder will probably be fine. The people who were supposed to step on next will not feel it as a layoff. They will feel it as a door that never opened.</p></td></tr>

<tr><td style="padding:0 0 56px 0;"><p style="margin:0;font-family:'Instrument Serif',Georgia,serif;font-size:24px;color:#F5F5F5;line-height:1.35;font-weight:400;">Everyone's asking whether AI will take jobs. <em style="color:#A8C8D8;font-style:italic;">Nobody's asking what happens when it quietly destroys the on-ramp.</em></p></td></tr>

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
<p style="margin:0;font-size:14px;color:#B8C8D0;line-height:1.65;">Somebody opened that door for you once. This might be the week you open one for someone else. &nbsp;<a href="https://instagram.com/icebergsampson" style="color:#A8C8D8;text-decoration:none;font-weight:500;">@icebergsampson</a></p>
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
