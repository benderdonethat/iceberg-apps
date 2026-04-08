import { useScrollReveal } from "@/hooks/useScrollReveal";
import streamLineLogo from "@/assets/stream-line-logo.png";

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
    <section id="apps" className="py-28 px-6" ref={ref}>
      <div className={`max-w-4xl mx-auto transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <span className="text-xs font-semibold tracking-widest uppercase text-primary">Live Now</span>
        <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-foreground">Our first app is here.</h2>
        <p className="mt-3 text-muted-foreground max-w-xl">Built for live sellers. Free forever. No catch.</p>

        <div className="mt-10 rounded-2xl border border-border bg-card p-8 sm:p-10 glow-cyan-hover transition-shadow duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8">
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-muted flex items-center justify-center">
              <img src={streamLineLogo} alt="Stream Line logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-2xl font-bold text-foreground">Stream Line</h3>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  Live · Free Forever
                </span>
              </div>
              <p className="text-muted-foreground mt-1.5">The free operations bot for live streamers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-10">
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
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground hover:shadow-[0_0_25px_-5px_hsl(var(--cyan-glow)/0.6)] transition-all duration-300 min-h-[48px]"
          >
            Add to Slack · Free
          </a>
        </div>
      </div>
    </section>
  );
}
