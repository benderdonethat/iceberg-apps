import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import RemindModal from "./RemindModal";

interface AppCard {
  name: string;
  slug: string;
  desc: string;
  tags: string[];
  emoji: string;
}

const apps: AppCard[] = [
  { name: "Invoice Pilot", slug: "invoice-pilot", desc: "Track invoices, send payment reminders, mark paid.", tags: ["Freelancers", "Billing", "Free"], emoji: "🧾" },
  { name: "Time Punch", slug: "time-punch", desc: "Clock in/out, track hours by client/project.", tags: ["Agencies", "Time Tracking", "Freemium"], emoji: "⏱️" },
  { name: "Lead Catcher", slug: "lead-catcher", desc: "Form submissions and DMs routed to Slack with auto-qualification.", tags: ["Sales", "Lead Gen", "Freemium"], emoji: "🎣" },
  { name: "Expense Drop", slug: "expense-drop", desc: "Snap receipts, log expenses, monthly reports.", tags: ["Finance", "Receipts", "Paid"], emoji: "💸" },
  { name: "Content Cal", slug: "content-cal", desc: "Content calendar in Slack. Schedule posts, assign creators.", tags: ["Content", "Social Media", "Freemium"], emoji: "📅" },
  { name: "Deal Flow", slug: "deal-flow", desc: "Lightweight sales pipeline. Lead to close.", tags: ["Sales", "Pipeline", "Freemium"], emoji: "🤝" },
];

export default function FeaturedAppsSection() {
  const { ref, isVisible } = useScrollReveal();
  const [modalApp, setModalApp] = useState<AppCard | null>(null);
  const [remindedSlugs, setRemindedSlugs] = useState<Set<string>>(new Set());
  const [savedEmail, setSavedEmail] = useState("");

  const handleSuccess = (slug: string, email: string) => {
    setRemindedSlugs((prev) => new Set(prev).add(slug));
    setSavedEmail(email);
  };

  return (
    <section id="coming" className="py-24 px-6" ref={ref}>
      <div className={`max-w-6xl mx-auto transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <span className="text-xs font-semibold tracking-widest uppercase text-primary">What's Next</span>
        <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-foreground">Building in public. Shipping every week.</h2>
        <p className="mt-3 text-muted-foreground max-w-xl">
          Every app fills a real gap. Tap "Remind Me" to get notified the moment it drops.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {apps.map((app, i) => {
            const reminded = remindedSlugs.has(app.slug);
            return (
              <div
                key={app.slug}
                className="rounded-2xl border border-border bg-card p-6 glow-cyan-hover transition-all duration-300 hover:border-primary/30 flex flex-col"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <div className="text-2xl mb-2">{app.emoji}</div>
                <h3 className="text-xl font-bold text-foreground">{app.name}</h3>
                <p className="text-sm text-muted-foreground/70 mt-1.5 flex-1 leading-relaxed">{app.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {app.tags.map((t) => (
                    <span key={t} className="text-[11px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">{t}</span>
                  ))}
                </div>
                <button
                  onClick={() => !reminded && setModalApp(app)}
                  disabled={reminded}
                  className={`mt-5 self-start rounded-lg px-5 py-2 text-sm font-medium transition-all min-h-[44px] ${
                    reminded
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default"
                      : "border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {reminded ? "✓ You'll be notified" : "Remind Me"}
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
          onSuccess={(email) => handleSuccess(modalApp.slug, email)}
        />
      )}
    </section>
  );
}
