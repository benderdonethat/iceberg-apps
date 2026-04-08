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

## Step 3: Draft the App Listing

Based on their input, generate a complete app listing and display it like this:

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

## Step 4: Iterate

Let the user change anything — name, emoji, features, description, pricing, tags. Keep showing the updated draft until they say "ship it" or approve.

## Step 5: Add to apps.ts

When approved:
1. Read `/Users/bender/benderai/iceberg-apps/src/data/apps.ts`
2. Add the new app entry to the array in the correct section (by status)
3. Write the updated file
4. Confirm: "Added [App Name] to the catalog. Push to deploy or keep building."

## Rules
- Always suggest 4 features — the user can add/remove
- Generate 3 relevant tags
- Pick an emoji that fits — user can change it
- Slug should be lowercase-kebab-case
- NEVER skip the dashboard display — it's the branded experience
- Keep it fast and conversational
