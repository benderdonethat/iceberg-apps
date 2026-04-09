# /new-app — App Factory Dashboard

You are launching the freeslackapps.com App Factory. Display the branded dashboard below, then guide the user through designing a new Slack app listing.

## Step 1: Display the Dashboard

Print this EXACTLY (do not skip or summarize):

```
================================================================================

             @@@@@@@@@@@@@@@@@@@@
          @@@@@@@@@@@@@@@@@@@@@@@@@@
        @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
       @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
       @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        @@@@@@@@@@@@@@@@@@@@@@@@@@@@
          @@@@@@@@@@@@@@@@@@@@@@@@
            @@@@@@@@@@@@@@@@@@@@
              @@@@@@@@@@@@@@@@
                @@@@@@@@@@@@
                  @@@@@@@@
                    @@@@

  ─────────────────────────────────────────────────────
              A P P   F A C T O R Y
          freeslackapps.com  |  new build
  ─────────────────────────────────────────────────────

  PICK A CATEGORY:

    [1] Team          standups, onboarding, recognition
    [2] Ops           invoices, tickets, budgets
    [3] Sales         leads, pipelines, affiliates
    [4] Productivity  notes, wikis, alerts, changelogs
    [5] Streaming     live selling, streaming tools
    [6] Other         something new

  PICK A PRICING MODEL:

    [A] Free          always free, no limits
    [B] Freemium      free tier + paid features
    [C] Paid          paid only

  ─────────────────────────────────────────────────────
  Type your picks (e.g. "2A") then describe the app
  idea in a sentence or two. I'll draft the full
  listing for you to review before it goes live.
  ─────────────────────────────────────────────────────
```

## Step 2: Wait for User Input

The user will respond with:
- Their category + pricing pick (like "2A" or "3B")
- A brief app idea (like "track affiliate links and payouts")

## Step 3: Niche-Fit Scorecard

BEFORE drafting the listing, evaluate the app idea against these 6 criteria and display the scorecard. Each criterion is scored 1-5. Be honest — a low score is valuable info.

```
  ─────────────────────────────────────────────────────
              N I C H E - F I T   S C O R E
  ─────────────────────────────────────────────────────

  Pain Point      [X/5]  ████░  Does this solve a real, frequent problem?
  Slack-Native    [X/5]  ████░  Is Slack the right place for this?
  Competition     [X/5]  ████░  How underserved is this niche?
  Build Speed     [X/5]  ████░  Can we ship this in under 4 hours?
  Audience Size   [X/5]  ████░  How many Slack teams need this?
  Virality        [X/5]  ████░  Will users tell their friends?

  TOTAL:          [XX/30]

  VERDICT:        [GO / TWEAK / SKIP]
  [One sentence explanation]

  ─────────────────────────────────────────────────────
```

Scoring guide (use your judgment, be calibrated):
- **Pain Point**: 5 = daily frustration, 1 = nice-to-have nobody asked for
- **Slack-Native**: 5 = only makes sense in Slack, 1 = better as a standalone app
- **Competition**: 5 = nothing good exists, 1 = saturated market (Standuply, Polly, etc.)
- **Build Speed**: 5 = simple CRUD/commands, 1 = needs complex integrations or infra
- **Audience Size**: 5 = every Slack team, 1 = tiny niche within a niche
- **Virality**: 5 = visible to whole team, shared naturally, 1 = solo tool nobody sees

Verdicts:
- **GO** (22+): Strong fit. Build it.
- **TWEAK** (15-21): Promising but needs adjustment. Suggest specific changes.
- **SKIP** (below 15): Weak fit. Suggest a better angle or a different app entirely.

If verdict is TWEAK, suggest 1-2 specific changes that would raise the score.
If verdict is SKIP, suggest an alternative app in the same category that scores higher.

## Step 4: Draft the App Listing

If GO or TWEAK (after adjustments), generate the listing:

```
  ─────────────────────────────────────────────────────
              D R A F T   L I S T I N G
  ─────────────────────────────────────────────────────

  Name:       [App Name]
  Emoji:      [emoji]
  Slug:       [app-slug]
  Category:   [Category]
  Pricing:    [Free/Freemium/Paid]
  Tags:       [tag1, tag2, tag3]

  Description:
  [One-liner description]

  Features:
    1. [Feature 1]
    2. [Feature 2]
    3. [Feature 3]
    4. [Feature 4]

  Status:     roadmap (change to "featured" or "live" when ready)

  ─────────────────────────────────────────────────────
  Edit anything above or say "ship it" to add to site.
  ─────────────────────────────────────────────────────
```

## Step 5: Iterate

Let the user change anything — name, emoji, features, description, pricing, tags. Keep showing the updated draft until they say "ship it" or approve.

## Step 6: Add to apps.ts

When approved:
1. Read `/Users/bender/benderai/iceberg-apps/src/data/apps.ts`
2. Add the new app entry to the array in the correct section (by status)
3. Write the updated file
4. Confirm: "Added [App Name] to the catalog. Push to deploy or keep building."

## Step 7: Generate Industry Workflows

Before scaffolding, generate 4-6 industry-specific workflows for the app. These go into the App Home as an "Industry Workflows" button. Each workflow should:
- Target a specific role or team type (engineering, sales, agencies, support, operations, remote teams)
- Describe a real, practical use case in 3-4 sentences
- Sound like a person explaining it to a colleague, not a manual
- Show how the app fits into their existing daily routine
- Be specific enough that the reader can picture themselves doing it

Save these workflows in the app's code so they're ready when the app deploys.

Also generate a "How to Get the Most Out of [App Name]" section with 5-6 tips specific to the app's features.

## Step 8: Scaffold the App (if user wants to build now)

Ask: "Want me to scaffold the code too?"

If yes:
1. Copy `/Users/bender/benderai/slack-app-template/` to `/Users/bender/benderai/[app-slug]/`
2. Replace all `APP_NAME` placeholders with the app name
3. Replace all `APP_SLUG` placeholders with the slug
4. Replace all `APP_DESC` placeholders with the description
5. Run `npm install` in the new directory
6. Confirm: "[App Name] scaffolded at /Users/bender/benderai/[app-slug]/ — ready to build commands."

## Rules
- Always suggest 4 features. The user can add/remove.
- Generate 3 relevant tags
- Pick an emoji that fits. User can change it.
- Slug should be lowercase-kebab-case
- NEVER skip the dashboard display. It's the branded experience.
- NEVER skip the niche-fit scorecard. It protects build quality.
- NEVER skip industry workflows. They drive retention.
- NEVER use "---", em dashes, or dash-based separators in any generated content. Use periods and new sentences.
- All copy must sound human. Not robotic, not overly casual. Professional and clear.
- Keep it fast and conversational
- Be honest in scoring. A bad score saves hours of wasted work.
- Every app MUST include "How to Get the Most Out of [App Name]" and "Industry Workflows" buttons on the App Home.
