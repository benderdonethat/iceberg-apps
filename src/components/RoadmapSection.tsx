import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import RemindModal from "./RemindModal";

export interface RoadmapApp {
  emoji: string;
  name: string;
  desc: string;
  slug: string;
  category: string;
  pricing: "Free" | "Freemium" | "Paid";
  features: string[];
}

const roadmapApps: RoadmapApp[] = [
  { emoji: "🧍", name: "Standup Bot", desc: "Async daily standups in Slack", slug: "standup-bot", category: "Team", pricing: "Free", features: ["Schedule recurring standups", "Threaded responses per person", "Weekly summary digest", "Skip weekends/holidays"] },
  { emoji: "🚀", name: "Onboard", desc: "New hire onboarding checklists", slug: "onboard", category: "Team", pricing: "Free", features: ["Custom checklist templates", "Auto-assign on hire date", "Progress tracking per hire", "Manager notifications"] },
  { emoji: "🏆", name: "Kudos", desc: "Peer recognition and shoutouts", slug: "kudos", category: "Team", pricing: "Free", features: ["Public shoutouts in channel", "Kudos leaderboard", "Custom emoji reactions", "Monthly recognition recap"] },
  { emoji: "🔄", name: "Retro Bot", desc: "Sprint retrospectives made easy", slug: "retro-bot", category: "Team", pricing: "Free", features: ["Anonymous submissions", "Categorize by start/stop/continue", "Vote on action items", "Export retro notes"] },
  { emoji: "🏖️", name: "PTO Tracker", desc: "Time-off requests and calendar", slug: "pto-tracker", category: "Team", pricing: "Freemium", features: ["Request and approve in Slack", "Team availability calendar", "Balance tracking per person", "Auto-update Slack status"] },
  { emoji: "😊", name: "Mood Ring", desc: "Anonymous team mood check-ins", slug: "mood-ring", category: "Team", pricing: "Free", features: ["Weekly anonymous pulse", "Trend graphs over time", "Flag low morale early", "Optional follow-up prompts"] },
  { emoji: "📊", name: "Poll Pro", desc: "Quick polls and team voting", slug: "poll-pro", category: "Team", pricing: "Free", features: ["Create polls in seconds", "Anonymous or named votes", "Multi-choice support", "Auto-close with results"] },

  { emoji: "🧾", name: "Invoice Pilot", desc: "Track invoices, send reminders", slug: "invoice-pilot-r", category: "Ops", pricing: "Freemium", features: ["Create invoices from Slack", "Auto payment reminders", "Track paid/unpaid status", "Monthly revenue summary"] },
  { emoji: "🎫", name: "Ticket Desk", desc: "Internal support ticket tracker", slug: "ticket-desk", category: "Ops", pricing: "Freemium", features: ["Create tickets via emoji react", "Assign and prioritize", "SLA tracking", "Resolution time reports"] },
  { emoji: "📋", name: "Client Board", desc: "Client project status at a glance", slug: "client-board", category: "Ops", pricing: "Freemium", features: ["Per-client status cards", "Milestone tracking", "Client-facing updates", "Slack channel per client"] },
  { emoji: "🎯", name: "OKR Pulse", desc: "Track objectives and key results", slug: "okr-pulse", category: "Ops", pricing: "Free", features: ["Set quarterly OKRs", "Weekly check-in prompts", "Progress percentage tracking", "Team alignment view"] },
  { emoji: "💰", name: "Budget Line", desc: "Project budget tracking", slug: "budget-line", category: "Ops", pricing: "Paid", features: ["Set budgets per project", "Log expenses in Slack", "Burn rate alerts", "Monthly budget reports"] },
  { emoji: "📄", name: "Contract Bot", desc: "Contract status and renewals", slug: "contract-bot", category: "Ops", pricing: "Paid", features: ["Track contract end dates", "Renewal reminders", "Upload contract docs", "Auto-notify stakeholders"] },

  { emoji: "🎣", name: "Lead Catcher", desc: "Form submissions routed to Slack", slug: "lead-catcher-r", category: "Sales", pricing: "Freemium", features: ["Webhook form capture", "Auto-qualify by criteria", "Route to sales channel", "Lead response timer"] },
  { emoji: "🤝", name: "Deal Flow", desc: "Lightweight sales pipeline", slug: "deal-flow-r", category: "Sales", pricing: "Freemium", features: ["Kanban-style deal stages", "Move deals via buttons", "Win/loss tracking", "Revenue forecasting"] },
  { emoji: "🤑", name: "Affiliate Bot", desc: "Track affiliate links and payouts", slug: "affiliate-bot", category: "Sales", pricing: "Paid", features: ["Generate tracking links", "Click and conversion stats", "Payout calculator", "Monthly affiliate reports"] },
  { emoji: "💼", name: "Hire Wire", desc: "Hiring pipeline in Slack", slug: "hire-wire", category: "Sales", pricing: "Freemium", features: ["Track candidates by stage", "Interview scheduling", "Team feedback collection", "Offer letter tracking"] },

  { emoji: "📝", name: "Meeting Notes", desc: "Auto meeting summaries to Slack", slug: "meeting-notes", category: "Productivity", pricing: "Freemium", features: ["AI-generated summaries", "Action item extraction", "Post to any channel", "Search past meetings"] },
  { emoji: "📖", name: "Wiki Bot", desc: "Team knowledge base in Slack", slug: "wiki-bot", category: "Productivity", pricing: "Free", features: ["Save answers as wiki entries", "Search with keywords", "Tag by topic", "Auto-suggest when asked"] },
  { emoji: "🔗", name: "Link Vault", desc: "Save and share team bookmarks", slug: "link-vault", category: "Productivity", pricing: "Free", features: ["Save links with tags", "Search saved links", "Most-shared leaderboard", "Auto-preview metadata"] },
  { emoji: "🔔", name: "Alert Hub", desc: "Centralized alert management", slug: "alert-hub", category: "Productivity", pricing: "Freemium", features: ["Route alerts from any source", "Severity levels", "On-call rotation", "Escalation rules"] },
  { emoji: "📢", name: "Changelog", desc: "Product updates your team sees", slug: "changelog", category: "Productivity", pricing: "Free", features: ["Post updates from Slack", "Version tagging", "Team read receipts", "Public changelog page"] },
  { emoji: "🚢", name: "Ship Log", desc: "Track what shipped and when", slug: "ship-log", category: "Productivity", pricing: "Free", features: ["Log deploys and releases", "Link to PRs or tickets", "Weekly ship digest", "Team velocity stats"] },
  { emoji: "💬", name: "Feedback Loop", desc: "Customer feedback collector", slug: "feedback-loop", category: "Productivity", pricing: "Freemium", features: ["Collect via form or Slack", "Tag by theme", "Upvote and prioritize", "Monthly feedback report"] },
  { emoji: "🔐", name: "Vault", desc: "Secure credential sharing", slug: "vault", category: "Productivity", pricing: "Paid", features: ["Encrypted secret storage", "Share with expiration", "Access audit log", "Rotate credentials"] },
  { emoji: "🔌", name: "Data Pipe", desc: "Simple data integrations", slug: "data-pipe", category: "Productivity", pricing: "Paid", features: ["Connect data sources", "Scheduled syncs", "Transform with templates", "Error alerts in Slack"] },
  { emoji: "🎤", name: "Pitch Deck", desc: "Pitch feedback collection", slug: "pitch-deck", category: "Productivity", pricing: "Free", features: ["Share deck link in Slack", "Slide-by-slide feedback", "Score and rank pitches", "Export feedback summary"] },
];

const categories = ["Team", "Ops", "Sales", "Productivity"];

const pricingStyles: Record<string, string> = {
  Free: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Freemium: "bg-primary/10 text-primary border-primary/20",
  Paid: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function RoadmapSection() {
  const { ref, isVisible } = useScrollReveal();
  const [modalApp, setModalApp] = useState<RoadmapApp | null>(null);
  const [remindedSlugs, setRemindedSlugs] = useState<Set<string>>(new Set());
  const [savedEmail, setSavedEmail] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handleRemind = (app: RoadmapApp) => {
    if (savedEmail) {
      setRemindedSlugs((prev) => new Set(prev).add(app.slug));
    } else {
      setModalApp(app);
    }
  };

  const visibleCategories = expanded ? categories : categories.slice(0, 2);
  const hiddenCount = roadmapApps.filter(a => !visibleCategories.includes(a.category)).length;

  return (
    <section className="py-28 px-6 relative" ref={ref}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className={`max-w-5xl mx-auto transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <span className="text-xs font-semibold tracking-widest uppercase text-primary">Roadmap</span>
        <h3 className="mt-4 text-2xl sm:text-3xl font-bold text-foreground mb-10">Everything we're building</h3>

        <div className="space-y-8">
          {visibleCategories.map((cat) => {
            const catApps = roadmapApps.filter(a => a.category === cat);
            return (
              <div key={cat}>
                <h4 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">{cat}</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {catApps.map((app) => {
                    const reminded = remindedSlugs.has(app.slug);
                    return (
                      <button
                        key={app.slug}
                        onClick={() => !reminded && handleRemind(app)}
                        className={`rounded-xl border px-3 py-3 text-left transition-all duration-200 group ${
                          reminded
                            ? "border-emerald-500/20 bg-emerald-500/5"
                            : "border-border bg-card/50 hover:border-primary/30 hover:bg-card"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-lg">{app.emoji}</span>
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${pricingStyles[app.pricing]}`}>
                            {app.pricing}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-foreground block leading-tight">{app.name}</span>
                        <span className="text-[11px] text-muted-foreground leading-snug block mt-0.5 hidden sm:block">{app.desc}</span>
                        <span className={`text-[10px] mt-1.5 block font-medium ${
                          reminded ? "text-emerald-400" : "text-primary/70 group-hover:text-primary"
                        }`}>
                          {reminded ? "✓ Reminded" : "Remind me"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {!expanded && hiddenCount > 0 && (
          <button
            onClick={() => setExpanded(true)}
            className="mt-8 mx-auto flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Show {hiddenCount} more apps
            <span className="text-xs">↓</span>
          </button>
        )}
      </div>

      {modalApp && (
        <RemindModal
          open={!!modalApp}
          onClose={() => setModalApp(null)}
          appName={modalApp.name}
          appSlug={modalApp.slug}
          savedEmail={savedEmail}
          onSuccess={(email) => {
            setRemindedSlugs((prev) => new Set(prev).add(modalApp.slug));
            setSavedEmail(email);
          }}
          features={modalApp.features}
          pricing={modalApp.pricing}
          emoji={modalApp.emoji}
        />
      )}
    </section>
  );
}
