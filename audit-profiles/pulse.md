# Pulse - Audit Profile

## What This App Is
A free Slack-based polling, survey, and anonymous feedback tool. Teams create polls (single choice, multiple choice, rating scale, ranking, open text), multi-question surveys, and recurring scheduled polls. Everything happens inside Slack via DMs and modals.

## What This App Is NOT
- NOT a form builder with a web interface
- NOT an employee engagement platform with dashboards
- NOT a performance review tool
- NOT a project management or standup tool

## Target Audience
- Small to mid-size teams (2-100 people) using Slack daily
- Managers running team health checks and retros
- HR and People Ops doing engagement surveys
- Product teams running feature prioritization votes
- Any team making group decisions in Slack

## The Problem We Solve
Teams waste time debating in threads when a quick poll would settle it in minutes. Paid survey tools cost $5-25/user/month, require leaving Slack, and have low response rates. Anonymous feedback is hard to collect without a dedicated tool. Recurring check-ins require manual effort every week.

## Correct Competitors (tools that solve the SAME problem)
- Polly ($3/user/month, polls and surveys in Slack)
- Simple Poll (freemium, basic Slack polls)
- Doodle ($6.95/user/month, scheduling polls)
- SurveyMonkey ($25/month, web surveys with Slack integration)
- Google Forms (free but not Slack-native, requires leaving the app)

## Incorrect Competitors (do NOT compare against these)
- Lattice (performance management, not polls)
- Culture Amp (enterprise engagement platform)
- 15Five (performance/engagement, different scope)
- Typeform (web-first form builder, different use case)

## Core Features
1. Five poll types: single choice, multiple choice, rating scale (1-5 or 1-10), ranking, and open text
2. Smart distribution: DM everyone in a channel, DM specific people, DM all Pulse users, or post in channel
3. Multi-question surveys with step-by-step builder (add one question at a time)
4. One-question-at-a-time survey experience with progress bar
5. Recurring scheduled polls (daily, weekdays, weekly, biweekly, monthly)
6. Anonymous mode for sensitive feedback
7. Auto-close with deadline (15 min to 7 days)
8. CSV export for all poll and survey results
9. Real-time result updates with visual progress bars
10. Poll confirmation DMs with direct "View" links
11. Survey results dashboard with per-question breakdowns
12. Saved poll templates for reuse
13. App Home with stats, recent polls, recent surveys, and quick actions
14. "How to Get the Most Out of Pulse" tips and best practices
15. "Industry Workflows" with 7 team-type examples
16. AES-256-GCM encryption on bot tokens
17. Multi-tenant with row-level security

## UX Design
- App Home with stats bar (total polls, open, voters, total votes)
- Create Poll and Create Survey buttons always visible
- Recent polls and surveys on App Home with "View" links
- Polls DM'd to each recipient individually (Messages tab)
- Survey builder: step-by-step via DM, one question at a time
- Survey taking: modal chain with progress bar, no page breaks
- All voting via buttons in DMs
- Confirmation DMs after poll/survey creation
- Templates and Recurring Polls accessible from App Home
- My Polls and My Surveys show channel, type, response count

## Known Limitations
- Ranking polls require a modal flow (can't rank inline in a message)
- Surveys max out at practical limit of ~20 questions per survey
- CSV export uses a URL with workspace token (not a file upload)
- No conditional/branching logic in surveys yet
- No image or file attachment support in poll options
