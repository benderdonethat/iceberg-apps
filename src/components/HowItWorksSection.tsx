import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  { num: "01", title: "Pick an app", desc: "Browse our growing catalog of free Slack tools. Each one solves a real problem for streamers, freelancers, and teams." },
  { num: "02", title: "Add to Slack", desc: "One-click install to your workspace. Most apps are ready in under 5 minutes with a simple guided setup." },
  { num: "03", title: "Start using it", desc: "No slash commands to memorize. Every app uses buttons, modals, and menus — tools that feel native to Slack." },
];

export default function HowItWorksSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-24 px-6" ref={ref}>
      <div className={`max-w-5xl mx-auto transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <h2 className="text-3xl font-bold text-foreground text-center mb-14">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {steps.map((s) => (
            <div key={s.num} className="text-center">
              <div className="text-sm font-semibold text-primary mb-2">{s.num}</div>
              <h3 className="text-xl font-bold text-foreground">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
