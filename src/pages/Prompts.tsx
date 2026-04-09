import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface Prompt {
  title: string;
  category: string;
  description: string;
  prompt: string;
}

const prompts: Prompt[] = [
  {
    title: "Competitive Analysis",
    category: "Strategy",
    description: "Find free or cheaper alternatives to any tool you're paying for.",
    prompt: `I run a small business that uses [TOOL NAME] and I pay [PRICE] per month. Find me 3 free or cheaper alternatives that offer the same core features. For each alternative, tell me: what it does, what it costs, what it does better than my current tool, and what it does worse. Be specific and only recommend tools that actually exist.`,
  },
  {
    title: "SOPs from Scratch",
    category: "Operations",
    description: "Create a step-by-step process document a new employee could follow on day one.",
    prompt: `I need to document our process for [PROCESS NAME]. Write a step-by-step standard operating procedure that a new employee could follow on their first day. Keep it under 500 words. Use plain language. Include what tools are needed, who is responsible for each step, and what the expected outcome looks like.`,
  },
  {
    title: "Meeting Notes Cleanup",
    category: "Productivity",
    description: "Turn rough meeting notes into structured summaries with action items.",
    prompt: `Here are my rough meeting notes: [PASTE NOTES]. Clean these up into a structured summary with three sections: Decisions Made, Action Items (with who is responsible), and Open Questions. Remove any filler or repeated points.`,
  },
  {
    title: "Cold Outreach Message",
    category: "Sales",
    description: "Write a LinkedIn message that leads with their pain point, not your product.",
    prompt: `I sell [PRODUCT/SERVICE] to [TARGET AUDIENCE]. Write a LinkedIn message under 200 characters that leads with their pain point, not my product. Make it sound like a real person wrote it. No emojis, no exclamation marks, no buzzwords.`,
  },
  {
    title: "Weekly Team Update",
    category: "Communication",
    description: "Turn bullet points into a professional team update email.",
    prompt: `Write a weekly team update email based on these bullet points: [PASTE BULLETS]. Make it professional but not corporate. Lead with the most important update. Keep it under 150 words. End with one specific thing the team should focus on next week.`,
  },
  {
    title: "Job Description Writer",
    category: "Hiring",
    description: "Write a job post that attracts the right people without corporate fluff.",
    prompt: `Write a job description for a [JOB TITLE] at a [COMPANY SIZE] company in [INDUSTRY]. Skip the mission statement and values section. Start with what the person will actually do in their first 90 days. List 5 real requirements (not "nice to haves" disguised as requirements). Include salary range [RANGE]. Keep it under 400 words.`,
  },
  {
    title: "Customer Email Response",
    category: "Support",
    description: "Draft a professional response to a customer complaint or question.",
    prompt: `A customer sent this message: [PASTE MESSAGE]. Write a response that acknowledges their frustration, explains what happened (or what you're going to find out), and gives a specific next step with a timeline. Keep it under 100 words. Sound like a real person, not a template.`,
  },
  {
    title: "Slack Channel Audit",
    category: "Productivity",
    description: "Get a plan to clean up your Slack workspace.",
    prompt: `My Slack workspace has [NUMBER] channels and most of them are inactive. Give me a step-by-step plan to audit and clean up our channels. Include: how to identify which channels to archive, how to communicate the cleanup to the team, what naming conventions to adopt going forward, and how to prevent channel sprawl from happening again.`,
  },
];

const categoryColors: Record<string, string> = {
  Strategy: "border-blue-500/30 text-blue-400",
  Operations: "border-amber-500/30 text-amber-400",
  Productivity: "border-emerald-500/30 text-emerald-400",
  Sales: "border-purple-500/30 text-purple-400",
  Communication: "border-cyan-500/30 text-cyan-400",
  Hiring: "border-pink-500/30 text-pink-400",
  Support: "border-orange-500/30 text-orange-400",
};

export default function Prompts() {
  const { ref, isVisible } = useScrollReveal();
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const copy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="py-28 px-6" ref={ref}>
        <div className={`max-w-4xl mx-auto transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-xs font-semibold tracking-widest uppercase text-primary">Prompts</span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-foreground">Copy. Paste. Use.</h1>
          <p className="mt-3 text-muted-foreground max-w-xl">
            Ready-to-use prompts for ChatGPT and Claude. Each one solves a real business problem. New prompts added regularly.
          </p>

          <div className="mt-12 space-y-6">
            {prompts.map((p, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{p.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border shrink-0 ml-4 ${categoryColors[p.category] || "border-border text-muted-foreground"}`}>
                    {p.category}
                  </span>
                </div>
                <div className="rounded-xl bg-muted/50 border border-border p-4 mt-4">
                  <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">{p.prompt}</pre>
                </div>
                <div className="flex justify-end mt-3">
                  <button
                    onClick={() => copy(p.prompt, i)}
                    className={`text-xs font-medium px-4 py-2 rounded-lg border transition-all ${
                      copiedIdx === i
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                        : "border-primary/30 text-primary hover:bg-primary/10"
                    }`}
                  >
                    {copiedIdx === i ? "Copied" : "Copy Prompt"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground">Want new prompts delivered to your inbox?</p>
            <a href="/" className="inline-block mt-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              Sign up at freeslackapps.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
