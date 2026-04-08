import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import RemindModal from "./RemindModal";

interface AppCard {
  name: string;
  slug: string;
  desc: string;
  tags: string[];
  emoji: string;
  features: string[];
  pricing: string;
}

const apps: AppCard[] = [
  { name: "Invoice Pilot", slug: "invoice-pilot", desc: "Track invoices, send payment reminders, mark paid.", tags: ["Freelancers", "Billing", "Free"], emoji: "🧾", pricing: "Free", features: ["Create invoices from Slack", "Auto payment reminders", "Track paid/unpaid status", "Monthly revenue summary"] },
  { name: "Time Punch", slug: "time-punch", desc: "Clock in/out, track hours by client/project.", tags: ["Agencies", "Time Tracking", "Freemium"], emoji: "⏱️", pricing: "Freemium", features: ["Clock in/out via Slack", "Track hours by project", "Weekly timesheet reports", "Export for payroll"] },
  { name: "Lead Catcher", slug: "lead-catcher", desc: "Form submissions and DMs routed to Slack with auto-qualification.", tags: ["Sales", "Lead Gen", "Freemium"], emoji: "🎣", pricing: "Freemium", features: ["Webhook form capture", "Auto-qualify by criteria", "Route to sales channel", "Lead response timer"] },
  { name: "Expense Drop", slug: "expense-drop", desc: "Snap receipts, log expenses, monthly reports.", tags: ["Finance", "Receipts", "Paid"], emoji: "💸", pricing: "Paid", features: ["Upload receipts via Slack", "Categorize expenses", "Monthly expense reports", "CSV export for taxes"] },
  { name: "Content Cal", slug: "content-cal", desc: "Content calendar in Slack. Schedule posts, assign creators.", tags: ["Content", "Social Media", "Freemium"], emoji: "📅", pricing: "Freemium", features: ["Visual content calendar", "Assign posts to creators", "Deadline reminders", "Platform tagging"] },
  { name: "Deal Flow", slug: "deal-flow", desc: "Lightweight sales pipeline. Lead to close.", tags: ["Sales", "Pipeline", "Freemium"], emoji: "🤝", pricing: "Freemium", features: ["Kanban-style deal stages", "Move deals via buttons", "Win/loss tracking", "Revenue forecasting"] },
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
    <section id="coming" className="py-28 px-6 relative" ref={ref}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

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
                className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_-10px_hsl(var(--cyan-glow)/0.15)] flex flex-col"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <div className="text-3xl mb-3">{app.emoji}</div>
                <h3 className="text-lg font-bold text-foreground">{app.name}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 flex-1 leading-relaxed">{app.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {app.tags.map((t) => (
                    <span key={t} className="text-[11px] px-2.5 py-0.5 rounded-full border border-border text-muted-foreground">{t}</span>
                  ))}
                </div>
                <button
                  onClick={() => !reminded && setModalApp(app)}
                  disabled={reminded}
                  className={`mt-5 self-start rounded-lg px-5 py-2.5 text-sm font-medium transition-all min-h-[44px] ${
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
          features={modalApp.features}
          pricing={modalApp.pricing}
          emoji={modalApp.emoji}
        />
      )}
    </section>
  );
}
