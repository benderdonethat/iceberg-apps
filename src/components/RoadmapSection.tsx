import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { roadmapApps, categories, type App } from "@/data/apps";
import RemindModal from "./RemindModal";

const pricingStyles: Record<string, string> = {
  Free: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Freemium: "bg-primary/10 text-primary border-primary/20",
  Paid: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function RoadmapSection() {
  const { ref, isVisible } = useScrollReveal();
  const apps = roadmapApps();
  const [modalApp, setModalApp] = useState<App | null>(null);
  const [remindedSlugs, setRemindedSlugs] = useState<Set<string>>(new Set());
  const [savedEmail, setSavedEmail] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handleRemind = (app: App) => {
    if (savedEmail) {
      setRemindedSlugs((prev) => new Set(prev).add(app.slug));
    } else {
      setModalApp(app);
    }
  };

  const roadmapCategories = categories.filter((cat) => apps.some((a) => a.category === cat));
  const visibleCategories = expanded ? roadmapCategories : roadmapCategories.slice(0, 2);
  const hiddenCount = apps.filter((a) => !visibleCategories.includes(a.category)).length;

  if (apps.length === 0) return null;

  return (
    <section className="py-28 px-6 relative" ref={ref}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className={`max-w-5xl mx-auto transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <span className="text-xs font-semibold tracking-widest uppercase text-primary">Roadmap</span>
        <h3 className="mt-4 text-2xl sm:text-3xl font-bold text-foreground mb-10">Everything we're building</h3>

        <div className="space-y-8">
          {visibleCategories.map((cat) => {
            const catApps = apps.filter((a) => a.category === cat);
            if (catApps.length === 0) return null;
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
