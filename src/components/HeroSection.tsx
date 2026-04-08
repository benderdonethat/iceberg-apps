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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src={heroImg}
        alt="Glowing iceberg in dark ocean"
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center py-32">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-tight animate-fade-up">
          Free Slack apps that actually work
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-up-delay-1">
          We build tools for streamers, freelancers, and teams — and give them away. New apps drop every week.
        </p>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto animate-fade-up-delay-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="flex-1 rounded-lg border border-border bg-muted/50 backdrop-blur-sm px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[44px]"
            />
            <button
              type="submit"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity min-h-[44px] whitespace-nowrap"
            >
              Get Updates
            </button>
          </form>
        ) : (
          <p className="mt-10 text-primary font-medium animate-fade-up">You're in ✓</p>
        )}
        <p className="mt-4 text-xs text-muted-foreground animate-fade-up-delay-3">
          5 emails total. No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
