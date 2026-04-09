# Audit Methodology

## How to Audit a freeslackapps.com App

This document defines exactly how to audit our apps. Follow it precisely.

## Rule 1: Use the App Profile
Every app has a profile file that defines what it is, what it is NOT, who it targets, its correct competitors, and its incorrect competitors. Read this FIRST before doing anything else. If the profile says "do NOT compare against X" then do NOT compare against X.

## Rule 2: Competitor Selection
The profile lists correct and incorrect competitors. Use ONLY the correct competitors. If the web search returns a competitor that's on the incorrect list, ignore it. The profile was written by the app's builder and overrides any AI judgment about competitors.

## Rule 3: Feature Scoring Must Be Specific
When scoring a feature as "ahead", "behind", "match", or "unique", explain specifically WHY. Not "we do this better" but "we calculate platform fees automatically for 6 platforms while they require manual entry." Every score needs evidence.

## Rule 4: UX Scoring Must Reference Actual Slack Constraints
Slack App Home has hard limits: max 100 blocks, no custom CSS, no collapsible sections, no real tabs (we fake them with buttons that rebuild the view), no images inline with text (only as separate blocks), modals max 100 blocks, modal titles max 24 chars. Score UX within these constraints.

## Rule 5: Functionality Assessment Must Be Based on the App Profile
The profile lists known limitations. Don't flag known limitations as "broken flows." Only flag issues that aren't already documented.

## Rule 6: Projections Must Be Conservative
For 30-day projections with minimal marketing (website + LinkedIn DMs + Slack directory):
- A brand new free Slack app with no existing audience: 5-20 installs is realistic
- With active LinkedIn outreach: 15-50 installs
- Getting into the Slack App Directory takes approval and time
- Activation rate for free tools is typically 40-60%
- Do NOT project hundreds of installs in 30 days. That requires paid marketing.

## Rule 7: Improvements Must Be Within Scope
Read the "What This App Is NOT" section of the profile. Any improvement that falls into the "NOT" category is invalid. If we're a sales tracking tool, suggesting we add streaming overlays is invalid.

## Rule 8: Stop List Must Be Honest
If a feature is working and users aren't complaining about it, put it on the stop list. The goal is to prevent infinite improvement loops, not to find problems with everything.

## Rule 9: No Emojis, No Dashes
Never use emojis, ---, or em dashes in any output. Use periods and new sentences.

## Rule 10: Scoring Weights
- Readiness Score: Core problem (40%) + UX (25%) + Price advantage (20%) + Differentiation (15%)
- UX Score: First impression (25%) + Clicks to task (25%) + Visual clarity (25%) + Feedback loops (25%)
- Apply weights mathematically, not vibes. Show your reasoning.
