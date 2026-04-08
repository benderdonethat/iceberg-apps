import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import RemindModal from "./RemindModal";

interface RoadmapApp {
  emoji: string;
  name: string;
  desc: string;
  slug: string;
}

const roadmapApps: RoadmapApp[] = [
  { emoji: "🧍", name: "Standup Bot", desc: "Async daily standups in Slack", slug: "standup-bot" },
  { emoji: "🚀", name: "Onboard", desc: "New hire onboarding checklists", slug: "onboard" },
  { emoji: "🏆", name: "Kudos", desc: "Peer recognition and shoutouts", slug: "kudos" },
  { emoji: "🎫", name: "Ticket Desk", desc: "Internal support ticket tracker", slug: "ticket-desk" },
  { emoji: "📋", name: "Client Board", desc: "Client project status at a glance", slug: "client-board" },
  { emoji: "🎯", name: "OKR Pulse", desc: "Track objectives and key results", slug: "okr-pulse" },
  { emoji: "🔄", name: "Retro Bot", desc: "Sprint retrospectives made easy", slug: "retro-bot" },
  { emoji: "🏖️", name: "PTO Tracker", desc: "Time-off requests and calendar", slug: "pto-tracker" },
  { emoji: "📖", name: "Wiki Bot", desc: "Team knowledge base in Slack", slug: "wiki-bot" },
  { emoji: "📊", name: "Poll Pro", desc: "Quick polls and team voting", slug: "poll-pro" },
  { emoji: "🔔", name: "Alert Hub", desc: "Centralized alert management", slug: "alert-hub" },
  { emoji: "💰", name: "Budget Line", desc: "Project budget tracking", slug: "budget-line" },
  { emoji: "📝", name: "Meeting Notes", desc: "Auto meeting summaries to Slack", slug: "meeting-notes" },
  { emoji: "🔗", name: "Link Vault", desc: "Save and share team bookmarks", slug: "link-vault" },
  { emoji: "📢", name: "Changelog", desc: "Product updates your team sees", slug: "changelog" },
  { emoji: "📄", name: "Contract Bot", desc: "Contract status and renewals", slug: "contract-bot" },
  { emoji: "😊", name: "Mood Ring", desc: "Anonymous team mood check-ins", slug: "mood-ring" },
  { emoji: "🎤", name: "Pitch Deck", desc: "Pitch feedback collection", slug: "pitch-deck" },
  { emoji: "🤑", name: "Affiliate Bot", desc: "Track affiliate links and payouts", slug: "affiliate-bot" },
  { emoji: "🔌", name: "Data Pipe", desc: "Simple data integrations", slug: "data-pipe" },
  { emoji: "🚢", name: "Ship Log", desc: "Track what shipped and when", slug: "ship-log" },
  { emoji: "💼", name: "Hire Wire", desc: "Hiring pipeline in Slack", slug: "hire-wire" },
  { emoji: "💬", name: "Feedback Loop", desc: "Customer feedback collector", slug: "feedback-loop" },
  { emoji: "🔐", name: "Vault", desc: "Secure credential sharing", slug: "vault" },
];

export default function RoadmapSection() {
  const { ref, isVisible } = useScrollReveal();
  const [modalApp, setModalApp] = useState<RoadmapApp | null>(null);
  const [remindedSlugs, setRemindedSlugs] = useState<Set<string>>(new Set());
  const [savedEmail, setSavedEmail] = useState("");

  const handleRemind = (app: RoadmapApp) => {
    if (savedEmail) {
      setRemindedSlugs((prev) => new Set(prev).add(app.slug));
    } else {
      setModalApp(app);
    }
  };

  return (
    <section className="py-28 px-6 relative" ref={ref}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className={`max-w-6xl mx-auto transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <span className="text-xs font-semibold tracking-widest uppercase text-primary">Roadmap</span>
        <h3 className="mt-4 text-2xl sm:text-3xl font-bold text-foreground mb-10">Everything we're building</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
          {roadmapApps.map((app) => {
            const reminded = remindedSlugs.has(app.slug);
            return (
              <div
                key={app.slug}
                className="rounded-xl border border-border bg-card/50 px-4 py-3 flex items-center gap-3 group hover:border-primary/20 hover:bg-card transition-all duration-200"
              >
                <span className="text-lg shrink-0">{app.emoji}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-foreground">{app.name}</span>
                  <p className="text-xs text-muted-foreground leading-snug">{app.desc}</p>
                </div>
                <button
                  onClick={() => !reminded && handleRemind(app)}
                  className={`text-xs shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors ${
                    reminded ? "text-emerald-400" : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {reminded ? "✓" : "Remind me"}
                </button>
              </div>
            );
          })}
        </div>
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
