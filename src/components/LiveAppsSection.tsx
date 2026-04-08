import { useScrollReveal } from "@/hooks/useScrollReveal";

const features = [
  "Sales tracking & P&L with platform fees",
  "Real inventory with velocity tracking",
  "AI insights from real data",
  "Customer database & VIP detection",
  "Brand vault & content generator",
  "Giveaway manager & revenue calc",
  "Revenue goals with progress tracking",
  "CSV export for accountants & taxes",
];

export default function LiveAppsSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="apps" className="py-24 px-6" ref={ref}>
      <div className={`max-w-4xl mx-auto transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <span className="text-xs font-semibold tracking-widest uppercase text-primary">Live Now</span>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-10 glow-cyan-hover transition-shadow duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-2xl">📡</div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-2xl font-bold text-foreground">Stream Line</h3>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  Live — Free Forever
                </span>
              </div>
              <p className="text-muted-foreground mt-1">The free operations bot for live streamers</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {features.map((f) => (
              <div key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <span className="text-primary mt-0.5 shrink-0">✦</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
          <a
            href="https://app-production-ef06.up.railway.app/slack/install"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity min-h-[44px]"
          >
            Add to Slack — Free
          </a>
        </div>
      </div>
    </section>
  );
}
