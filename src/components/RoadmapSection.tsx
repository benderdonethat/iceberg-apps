import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import RemindModal from "./RemindModal";

interface RoadmapApp {
  emoji: string;
  name: string;
  desc: string;
  slug: string;
  category: string;
}

const roadmapApps: RoadmapApp[] = [
  { emoji: "🧍", name: "Standup Bot", desc: "Async daily standups in Slack", slug: "standup-bot", category: "Team" },
  { emoji: "🚀", name: "Onboard", desc: "New hire onboarding checklists", slug: "onboard", category: "Team" },
  { emoji: "🏆", name: "Kudos", desc: "Peer recognition and shoutouts", slug: "kudos", category: "Team" },
  { emoji: "🔄", name: "Retro Bot", desc: "Sprint retrospectives made easy", slug: "retro-bot", category: "Team" },
  { emoji: "🏖️", name: "PTO Tracker", desc: "Time-off requests and calendar", slug: "pto-tracker", category: "Team" },
  { emoji: "😊", name: "Mood Ring", desc: "Anonymous team mood check-ins", slug: "mood-ring", category: "Team" },
  { emoji: "📊", name: "Poll Pro", desc: "Quick polls and team voting", slug: "poll-pro", category: "Team" },

  { emoji: "🧾", name: "Invoice Pilot", desc: "Track invoices, send reminders", slug: "invoice-pilot-r", category: "Ops" },
  { emoji: "🎫", name: "Ticket Desk", desc: "Internal support ticket tracker", slug: "ticket-desk", category: "Ops" },
  { emoji: "📋", name: "Client Board", desc: "Client project status at a glance", slug: "client-board", category: "Ops" },
  { emoji: "🎯", name: "OKR Pulse", desc: "Track objectives and key results", slug: "okr-pulse", category: "Ops" },
  { emoji: "💰", name: "Budget Line", desc: "Project budget tracking", slug: "budget-line", category: "Ops" },
  { emoji: "📄", name: "Contract Bot", desc: "Contract status and renewals", slug: "contract-bot", category: "Ops" },

  { emoji: "🎣", name: "Lead Catcher", desc: "Form submissions routed to Slack", slug: "lead-catcher-r", category: "Sales" },
  { emoji: "🤝", name: "Deal Flow", desc: "Lightweight sales pipeline", slug: "deal-flow-r", category: "Sales" },
  { emoji: "🤑", name: "Affiliate Bot", desc: "Track affiliate links and payouts", slug: "affiliate-bot", category: "Sales" },
  { emoji: "💼", name: "Hire Wire", desc: "Hiring pipeline in Slack", slug: "hire-wire", category: "Sales" },

  { emoji: "📝", name: "Meeting Notes", desc: "Auto meeting summaries to Slack", slug: "meeting-notes", category: "Productivity" },
  { emoji: "📖", name: "Wiki Bot", desc: "Team knowledge base in Slack", slug: "wiki-bot", category: "Productivity" },
  { emoji: "🔗", name: "Link Vault", desc: "Save and share team bookmarks", slug: "link-vault", category: "Productivity" },
  { emoji: "🔔", name: "Alert Hub", desc: "Centralized alert management", slug: "alert-hub", category: "Productivity" },
  { emoji: "📢", name: "Changelog", desc: "Product updates your team sees", slug: "changelog", category: "Productivity" },
  { emoji: "🚢", name: "Ship Log", desc: "Track what shipped and when", slug: "ship-log", category: "Productivity" },
  { emoji: "💬", name: "Feedback Loop", desc: "Customer feedback collector", slug: "feedback-loop", category: "Productivity" },
  { emoji: "🔐", name: "Vault", desc: "Secure credential sharing", slug: "vault", category: "Productivity" },
  { emoji: "🔌", name: "Data Pipe", desc: "Simple data integrations", slug: "data-pipe", category: "Productivity" },
  { emoji: "🎤", name: "Pitch Deck", desc: "Pitch feedback collection", slug: "pitch-deck", category: "Productivity" },
];

const categories = ["Team", "Ops", "Sales", "Productivity"];

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

  // On mobile, show only first 2 categories unless expanded
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
                        <span className="text-lg block mb-1">{app.emoji}</span>
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
        />
      )}
    </section>
  );
}
