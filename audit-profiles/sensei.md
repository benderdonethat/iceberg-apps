# Sensei - Audit Profile

## What This App Is
A free Slack-based team knowledge base. Teams write, search, and share articles entirely inside Slack. No external dashboard, no web app. Everything happens in Slack modals and App Home.

## What This App Is NOT
- NOT a project management tool
- NOT a wiki with a web interface
- NOT a document editor (it uses Slack modals, not rich text editors)
- NOT a CRM or customer-facing knowledge base

## Target Audience
- Small teams (2-30 people) who use Slack daily
- Teams that currently use pinned messages, Google Docs, or nothing for documentation
- Engineering teams documenting processes and troubleshooting
- Agencies managing client knowledge per channel
- Operations teams with recurring process questions
- Remote teams needing searchable documentation

## The Problem We Solve
Teams lose knowledge. The answer exists somewhere in a Slack thread from 3 months ago but nobody can find it. New hires ask the same questions. Processes live in someone's head. Paid knowledge base tools cost $5-15/user/month which small teams won't pay.

## Correct Competitors (tools that solve the SAME problem)
- Guru ($7/user/month, knowledge base with Slack integration)
- Tettra ($5/user/month, team knowledge base)
- Slite ($8/user/month, team documentation)
- Notion (free tier exists but not Slack-native, $8/user for teams)
- Google Docs (free but scattered, no search, no organization)

## Incorrect Competitors (do NOT compare against these)
- Confluence (enterprise-scale, different audience entirely)
- SharePoint (enterprise, requires Microsoft ecosystem)
- Jira (issue tracking, not knowledge management)
- Asana/Monday (project management, not knowledge base)

## Core Features
1. Article creation via button with template picker (Meeting Notes, Project Spec, Troubleshooting, How-To Guide, Decision Log)
2. Full-text search via keyword index (body is encrypted, titles and keywords searchable)
3. Channel-specific knowledge bases (articles tied to channels)
4. AI-powered answers (asks a question with ?, gets answer sourced from articles)
5. AI thread-to-article conversion (right-click thread, save as article)
6. Article tagging and categories
7. Internal article linking with [[Title]] syntax
8. Stale article detection (flags articles not updated in 30 days, DMs author)
9. Knowledge gap tracking (shows what people searched for but didn't find)
10. Usage analytics on App Home (articles, views, searches, top articles, gaps)
11. AES-256-GCM encryption on all article content
12. Multi-tenant with row-level security

## UX Design
- Slack App Home with Write Article, Search, Browse All buttons
- Template quick-start buttons on empty state
- Tips and Industry Workflows buttons always visible
- Modals for all reading, writing, editing
- Confirmation DM after every write/edit/delete
- App Home auto-refreshes after changes
- Tag browse buttons on App Home

## Known Limitations
- Search works on titles and keyword index, not full encrypted body text
- Collaborative editing is sequential (last save wins, no real-time co-editing)
- No image support in articles (Slack modal limitation)
- Template selection in modal doesn't live-preview body content
