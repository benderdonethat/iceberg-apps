export type AppStatus = "live" | "featured" | "roadmap";
export type AppPricing = "Free" | "Freemium" | "Paid";
export type AppCategory = "Team" | "Ops" | "Sales" | "Productivity" | "Streaming";

export interface App {
  name: string;
  slug: string;
  emoji: string;
  desc: string;
  features: string[];
  pricing: AppPricing;
  category: AppCategory;
  tags: string[];
  status: AppStatus;
  installUrl?: string;
  logo?: string;
}

const apps: App[] = [
  // ── LIVE ─────────────────────────────────────────────
  {
    name: "Stream Line",
    slug: "stream-line",
    emoji: "📡",
    desc: "The free operations bot for live streamers",
    features: [
      "Sales tracking & P&L with platform fees",
      "Real inventory with velocity tracking",
      "AI insights from real data",
      "Customer database & VIP detection",
      "Brand vault & content generator",
      "Giveaway manager & revenue calc",
      "Revenue goals with progress tracking",
      "CSV export for accountants & taxes",
    ],
    pricing: "Free",
    category: "Streaming",
    tags: ["Streamers", "Sales", "Free"],
    status: "live",
    installUrl: "https://app-production-ef06.up.railway.app/slack/install",
    logo: "stream-line-logo.png",
  },

  // ── FEATURED ─────────────────────────────────────────
  {
    name: "Invoice Pilot",
    slug: "invoice-pilot",
    emoji: "🧾",
    desc: "Track invoices, send payment reminders, mark paid.",
    features: ["Create invoices from Slack", "Auto payment reminders", "Track paid/unpaid status", "Monthly revenue summary"],
    pricing: "Free",
    category: "Ops",
    tags: ["Freelancers", "Billing", "Free"],
    status: "featured",
  },
  {
    name: "Time Punch",
    slug: "time-punch",
    emoji: "⏱️",
    desc: "Clock in/out, track hours by client/project.",
    features: ["Clock in/out via Slack", "Track hours by project", "Weekly timesheet reports", "Export for payroll"],
    pricing: "Freemium",
    category: "Ops",
    tags: ["Agencies", "Time Tracking", "Freemium"],
    status: "featured",
  },
  {
    name: "Lead Catcher",
    slug: "lead-catcher",
    emoji: "🎣",
    desc: "Form submissions and DMs routed to Slack with auto-qualification.",
    features: ["Webhook form capture", "Auto-qualify by criteria", "Route to sales channel", "Lead response timer"],
    pricing: "Freemium",
    category: "Sales",
    tags: ["Sales", "Lead Gen", "Freemium"],
    status: "featured",
  },
  {
    name: "Expense Drop",
    slug: "expense-drop",
    emoji: "💸",
    desc: "Snap receipts, log expenses, monthly reports.",
    features: ["Upload receipts via Slack", "Categorize expenses", "Monthly expense reports", "CSV export for taxes"],
    pricing: "Paid",
    category: "Ops",
    tags: ["Finance", "Receipts", "Paid"],
    status: "featured",
  },
  {
    name: "Content Cal",
    slug: "content-cal",
    emoji: "📅",
    desc: "Content calendar in Slack. Schedule posts, assign creators.",
    features: ["Visual content calendar", "Assign posts to creators", "Deadline reminders", "Platform tagging"],
    pricing: "Freemium",
    category: "Productivity",
    tags: ["Content", "Social Media", "Freemium"],
    status: "featured",
  },
  {
    name: "Deal Flow",
    slug: "deal-flow",
    emoji: "🤝",
    desc: "Lightweight sales pipeline. Lead to close.",
    features: ["Kanban-style deal stages", "Move deals via buttons", "Win/loss tracking", "Revenue forecasting"],
    pricing: "Freemium",
    category: "Sales",
    tags: ["Sales", "Pipeline", "Freemium"],
    status: "featured",
  },

  // ── ROADMAP ──────────────────────────────────────────
  // Team
  { name: "Standup Bot", slug: "standup-bot", emoji: "🧍", desc: "Async daily standups in Slack", features: ["Schedule recurring standups", "Threaded responses per person", "Weekly summary digest", "Skip weekends/holidays"], pricing: "Free", category: "Team", tags: ["Team", "Free"], status: "roadmap" },
  { name: "Onboard", slug: "onboard", emoji: "🚀", desc: "New hire onboarding checklists", features: ["Custom checklist templates", "Auto-assign on hire date", "Progress tracking per hire", "Manager notifications"], pricing: "Free", category: "Team", tags: ["Team", "Free"], status: "roadmap" },
  { name: "Kudos", slug: "kudos", emoji: "🏆", desc: "Peer recognition and shoutouts", features: ["Public shoutouts in channel", "Kudos leaderboard", "Custom emoji reactions", "Monthly recognition recap"], pricing: "Free", category: "Team", tags: ["Team", "Free"], status: "roadmap" },
  { name: "Retro Bot", slug: "retro-bot", emoji: "🔄", desc: "Sprint retrospectives made easy", features: ["Anonymous submissions", "Categorize by start/stop/continue", "Vote on action items", "Export retro notes"], pricing: "Free", category: "Team", tags: ["Team", "Free"], status: "roadmap" },
  { name: "PTO Tracker", slug: "pto-tracker", emoji: "🏖️", desc: "Time-off requests and calendar", features: ["Request and approve in Slack", "Team availability calendar", "Balance tracking per person", "Auto-update Slack status"], pricing: "Freemium", category: "Team", tags: ["Team", "Freemium"], status: "roadmap" },
  { name: "Mood Ring", slug: "mood-ring", emoji: "😊", desc: "Anonymous team mood check-ins", features: ["Weekly anonymous pulse", "Trend graphs over time", "Flag low morale early", "Optional follow-up prompts"], pricing: "Free", category: "Team", tags: ["Team", "Free"], status: "roadmap" },
  { name: "Poll Pro", slug: "poll-pro", emoji: "📊", desc: "Quick polls and team voting", features: ["Create polls in seconds", "Anonymous or named votes", "Multi-choice support", "Auto-close with results"], pricing: "Free", category: "Team", tags: ["Team", "Free"], status: "roadmap" },

  // Ops
  { name: "Ticket Desk", slug: "ticket-desk", emoji: "🎫", desc: "Internal support ticket tracker", features: ["Create tickets via emoji react", "Assign and prioritize", "SLA tracking", "Resolution time reports"], pricing: "Freemium", category: "Ops", tags: ["Ops", "Freemium"], status: "roadmap" },
  { name: "Client Board", slug: "client-board", emoji: "📋", desc: "Client project status at a glance", features: ["Per-client status cards", "Milestone tracking", "Client-facing updates", "Slack channel per client"], pricing: "Freemium", category: "Ops", tags: ["Ops", "Freemium"], status: "roadmap" },
  { name: "OKR Pulse", slug: "okr-pulse", emoji: "🎯", desc: "Track objectives and key results", features: ["Set quarterly OKRs", "Weekly check-in prompts", "Progress percentage tracking", "Team alignment view"], pricing: "Free", category: "Ops", tags: ["Ops", "Free"], status: "roadmap" },
  { name: "Budget Line", slug: "budget-line", emoji: "💰", desc: "Project budget tracking", features: ["Set budgets per project", "Log expenses in Slack", "Burn rate alerts", "Monthly budget reports"], pricing: "Paid", category: "Ops", tags: ["Ops", "Paid"], status: "roadmap" },
  { name: "Contract Bot", slug: "contract-bot", emoji: "📄", desc: "Contract status and renewals", features: ["Track contract end dates", "Renewal reminders", "Upload contract docs", "Auto-notify stakeholders"], pricing: "Paid", category: "Ops", tags: ["Ops", "Paid"], status: "roadmap" },

  // Sales
  { name: "Affiliate Bot", slug: "affiliate-bot", emoji: "🤑", desc: "Track affiliate links and payouts", features: ["Generate tracking links", "Click and conversion stats", "Payout calculator", "Monthly affiliate reports"], pricing: "Paid", category: "Sales", tags: ["Sales", "Paid"], status: "roadmap" },
  { name: "Hire Wire", slug: "hire-wire", emoji: "💼", desc: "Hiring pipeline in Slack", features: ["Track candidates by stage", "Interview scheduling", "Team feedback collection", "Offer letter tracking"], pricing: "Freemium", category: "Sales", tags: ["Sales", "Freemium"], status: "roadmap" },

  // Productivity
  { name: "Meeting Notes", slug: "meeting-notes", emoji: "📝", desc: "Auto meeting summaries to Slack", features: ["AI-generated summaries", "Action item extraction", "Post to any channel", "Search past meetings"], pricing: "Freemium", category: "Productivity", tags: ["Productivity", "Freemium"], status: "roadmap" },
  { name: "Wiki Bot", slug: "wiki-bot", emoji: "📖", desc: "Team knowledge base in Slack", features: ["Save answers as wiki entries", "Search with keywords", "Tag by topic", "Auto-suggest when asked"], pricing: "Free", category: "Productivity", tags: ["Productivity", "Free"], status: "roadmap" },
  { name: "Link Vault", slug: "link-vault", emoji: "🔗", desc: "Save and share team bookmarks", features: ["Save links with tags", "Search saved links", "Most-shared leaderboard", "Auto-preview metadata"], pricing: "Free", category: "Productivity", tags: ["Productivity", "Free"], status: "roadmap" },
  { name: "Alert Hub", slug: "alert-hub", emoji: "🔔", desc: "Centralized alert management", features: ["Route alerts from any source", "Severity levels", "On-call rotation", "Escalation rules"], pricing: "Freemium", category: "Productivity", tags: ["Productivity", "Freemium"], status: "roadmap" },
  { name: "Changelog", slug: "changelog", emoji: "📢", desc: "Product updates your team sees", features: ["Post updates from Slack", "Version tagging", "Team read receipts", "Public changelog page"], pricing: "Free", category: "Productivity", tags: ["Productivity", "Free"], status: "roadmap" },
  { name: "Ship Log", slug: "ship-log", emoji: "🚢", desc: "Track what shipped and when", features: ["Log deploys and releases", "Link to PRs or tickets", "Weekly ship digest", "Team velocity stats"], pricing: "Free", category: "Productivity", tags: ["Productivity", "Free"], status: "roadmap" },
  { name: "Feedback Loop", slug: "feedback-loop", emoji: "💬", desc: "Customer feedback collector", features: ["Collect via form or Slack", "Tag by theme", "Upvote and prioritize", "Monthly feedback report"], pricing: "Freemium", category: "Productivity", tags: ["Productivity", "Freemium"], status: "roadmap" },
  { name: "Vault", slug: "vault", emoji: "🔐", desc: "Secure credential sharing", features: ["Encrypted secret storage", "Share with expiration", "Access audit log", "Rotate credentials"], pricing: "Paid", category: "Productivity", tags: ["Productivity", "Paid"], status: "roadmap" },
  { name: "Data Pipe", slug: "data-pipe", emoji: "🔌", desc: "Simple data integrations", features: ["Connect data sources", "Scheduled syncs", "Transform with templates", "Error alerts in Slack"], pricing: "Paid", category: "Productivity", tags: ["Productivity", "Paid"], status: "roadmap" },
  { name: "Pitch Deck", slug: "pitch-deck", emoji: "🎤", desc: "Pitch feedback collection", features: ["Share deck link in Slack", "Slide-by-slide feedback", "Score and rank pitches", "Export feedback summary"], pricing: "Free", category: "Productivity", tags: ["Productivity", "Free"], status: "roadmap" },

  // ── NEW ───────────────────────────────────────────
  { name: "Sensei", slug: "sensei", emoji: "🧠", desc: "Team knowledge base with instant search and collaborative editing, all inside Slack", features: ["Slash command article creation", "Full-text search across all content", "Channel-specific knowledge bases", "AI-powered answers from your articles", "AI thread-to-article conversion", "Collaborative editing via modals", "Markdown formatting with preview", "Article tagging and categories", "Pre-built article templates", "Internal article linking", "Stale article detection", "Knowledge gap tracking", "Usage analytics in App Home"], pricing: "Free", category: "Productivity", tags: ["Productivity", "Free"], status: "live", installUrl: "https://sensei-production-1334.up.railway.app/slack/install" },
];

export default apps;

// ── Helpers ──────────────────────────────────────────
export const liveApps = () => apps.filter((a) => a.status === "live");
export const featuredApps = () => apps.filter((a) => a.status === "featured");
export const roadmapApps = () => apps.filter((a) => a.status === "roadmap");
export const categories: AppCategory[] = ["Streaming", "Team", "Ops", "Sales", "Productivity"];
