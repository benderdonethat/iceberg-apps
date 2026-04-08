import { useState } from "react";
import heroImg from "@/assets/hero-iceberg.png";

export default function HeroSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {}
    setSubmitted(true);
  };

  return (
    <section className="relative min-h-[70svh] flex items-center justify-center overflow-hidden">
      <img
        src={heroImg}
        alt="Glowing iceberg in dark ocean"
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center py-32">
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] animate-fade-up">
          Free Slack apps<br className="hidden sm:block" /> that <span className="text-primary">actually work</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-up-delay-1">
          The Slack apps your business needs. All free.
        </p>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto animate-fade-up-delay-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your email here"
              className="flex-1 rounded-lg border border-border bg-muted/50 backdrop-blur-sm px-4 py-3.5 text-foreground placeholder:text-muted-foreground placeholder:text-center focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[48px] text-center"
            />
            <button
              type="submit"
              className="rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:shadow-[0_0_25px_-5px_hsl(var(--cyan-glow)/0.6)] transition-all duration-300 min-h-[48px] whitespace-nowrap"
            >
              Get Updates
            </button>
          </form>
        ) : (
          <p className="mt-10 text-primary font-medium animate-fade-up">You're in ✓</p>
        )}
        <p className="mt-4 text-xs text-muted-foreground/70 animate-fade-up-delay-3">
          Only get the updates you want. No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
