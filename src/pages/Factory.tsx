import { useState } from "react";
import icebergLogo from "@/assets/hero-iceberg.png";

const categories = ["Team", "Ops", "Sales", "Productivity", "Streaming", "Other"] as const;
const pricingOptions = ["Free", "Freemium", "Paid"] as const;

const emojiSuggestions = [
  "🧾", "⏱️", "🎣", "💸", "📅", "🤝", "🧍", "🚀", "🏆", "🔄",
  "🏖️", "😊", "📊", "🎫", "📋", "🎯", "💰", "📄", "🤑", "💼",
  "📝", "📖", "🔗", "🔔", "📢", "🚢", "💬", "🔐", "🔌", "🎤",
  "🤖", "⚡", "🛡️", "🎮", "📡", "🧊", "🔥", "💎", "🧲", "🌊",
  "📦", "🏗️", "🛒", "🎁", "📈", "🧪", "🗂️", "✅", "🪝", "🔧",
];

const pricingColors: Record<string, string> = {
  Free: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  Freemium: "border-cyan-500/40 bg-cyan-500/10 text-cyan-400",
  Paid: "border-amber-500/40 bg-amber-500/10 text-amber-400",
};

// ── Feature Library (by category) ───────────────────
const featureLibrary: Record<string, string[]> = {
  Team: [
    "Schedule recurring check-ins",
    "Threaded responses per person",
    "Weekly summary digest",
    "Skip weekends/holidays",
    "Anonymous submissions",
    "Public shoutouts in channel",
    "Leaderboard tracking",
    "Custom emoji reactions",
    "Monthly recognition recap",
    "Vote on action items",
    "Team availability calendar",
    "Auto-update Slack status",
    "Progress tracking per person",
    "Manager notifications",
    "Custom checklist templates",
    "Trend graphs over time",
    "Flag low morale early",
    "Multi-choice support",
    "Auto-close with results",
    "Role-based permissions",
  ],
  Ops: [
    "Create from Slack command",
    "Auto reminders on schedule",
    "Track status (open/closed/paid)",
    "Monthly summary reports",
    "CSV export",
    "Per-client status cards",
    "Milestone tracking",
    "SLA tracking",
    "Assign and prioritize",
    "Resolution time reports",
    "Set budgets per project",
    "Burn rate alerts",
    "Contract end date tracking",
    "Renewal reminders",
    "Upload documents",
    "Auto-notify stakeholders",
    "Approval workflows",
    "Audit log of all actions",
    "Custom fields per record",
    "Dashboard with key metrics",
  ],
  Sales: [
    "Webhook form capture",
    "Auto-qualify by criteria",
    "Route to sales channel",
    "Lead response timer",
    "Kanban-style deal stages",
    "Move deals via buttons",
    "Win/loss tracking",
    "Revenue forecasting",
    "Generate tracking links",
    "Click and conversion stats",
    "Payout calculator",
    "Track candidates by stage",
    "Interview scheduling",
    "Team feedback collection",
    "Pipeline value summary",
    "Auto follow-up reminders",
    "Lead scoring",
    "Commission tracking",
    "Contact history log",
    "Monthly sales reports",
  ],
  Productivity: [
    "AI-generated summaries",
    "Action item extraction",
    "Post to any channel",
    "Search past entries",
    "Save as wiki entries",
    "Tag by topic",
    "Auto-suggest when asked",
    "Save with tags",
    "Most-shared leaderboard",
    "Route alerts from any source",
    "Severity levels",
    "On-call rotation",
    "Escalation rules",
    "Version tagging",
    "Team read receipts",
    "Log deploys and releases",
    "Weekly digest",
    "Upvote and prioritize",
    "Encrypted storage",
    "Share with expiration",
    "Access audit log",
    "Scheduled syncs",
    "Error alerts in Slack",
    "Slide-by-slide feedback",
    "Export summary",
  ],
  Streaming: [
    "Sales tracking with platform fees",
    "P&L per stream session",
    "Real inventory tracking",
    "Velocity and sell-through rate",
    "AI insights from real data",
    "Customer database",
    "VIP detection",
    "Brand vault",
    "Content generator",
    "Giveaway manager",
    "Revenue goals with progress",
    "CSV export for taxes",
    "Multi-platform support",
    "Stream scheduling",
    "Product catalog management",
    "Break tracking",
    "Viewer analytics",
    "Auto price calculations",
    "Shipping label integration",
    "Live chat commands",
  ],
  Other: [
    "Custom slash commands",
    "Modal-based forms",
    "Scheduled notifications",
    "Webhook integrations",
    "Data import/export",
    "Multi-workspace support",
    "Admin dashboard",
    "Usage analytics",
    "Custom branding",
    "API access",
    "Role-based access control",
    "Audit logging",
    "Automated workflows",
    "Template system",
    "Backup and restore",
  ],
};

// ── Tag Library (by category) ───────────────────────
const tagLibrary: Record<string, string[]> = {
  Team: ["Team", "HR", "Culture", "Remote", "Standups", "Recognition", "Onboarding", "Morale", "Polls", "Retrospectives"],
  Ops: ["Operations", "Invoicing", "Billing", "Tickets", "Support", "Budgets", "Contracts", "Project Management", "Clients", "Finance"],
  Sales: ["Sales", "Lead Gen", "Pipeline", "CRM", "Affiliates", "Hiring", "Revenue", "Deals", "Outreach", "Commissions"],
  Productivity: ["Productivity", "Notes", "Wiki", "Alerts", "Changelog", "Shipping", "Feedback", "Security", "Integrations", "Automation"],
  Streaming: ["Streamers", "Live Selling", "Inventory", "Sales", "Whatnot", "TikTok", "eBay", "Analytics", "Revenue", "Giveaways"],
  Other: ["Utility", "Integration", "Workflow", "Custom", "Admin", "Analytics"],
};

// ── Shared tag options (always available) ───────────
const sharedTags = ["Free", "Freemium", "Paid", "Slack", "AI-Powered", "No Setup"];

export default function Factory() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🤖");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState<string>("Team");
  const [pricing, setPricing] = useState<string>("Free");
  const [features, setFeatures] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customFeature, setCustomFeature] = useState("");
  const [status, setStatus] = useState<string>("roadmap");
  const [copied, setCopied] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(false);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setAuthed(true);
        sessionStorage.setItem("factory_auth", "1");
      } else {
        setAuthError(true);
      }
    } catch {
      setAuthError(true);
    } finally {
      setAuthLoading(false);
    }
  };

  // Check session on mount
  useState(() => {
    if (sessionStorage.getItem("factory_auth") === "1") setAuthed(true);
  });

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const toggleFeature = (f: string) => {
    setFeatures((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);
  };

  const addCustomFeature = () => {
    if (customFeature.trim() && !features.includes(customFeature.trim())) {
      setFeatures([...features, customFeature.trim()]);
      setCustomFeature("");
    }
  };

  const toggleTag = (t: string) => {
    setSelectedTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  };

  const availableFeatures = featureLibrary[category] || featureLibrary.Other;
  const availableTags = [...(tagLibrary[category] || tagLibrary.Other), ...sharedTags];
  // Dedupe tags
  const uniqueTags = [...new Set(availableTags)];

  const output = `  {
    name: "${name}",
    slug: "${slug}",
    emoji: "${emoji}",
    desc: "${desc}",
    features: [${features.map((f) => `"${f}"`).join(", ")}],
    pricing: "${pricing}",
    category: "${category}",
    tags: [${selectedTags.map((t) => `"${t}"`).join(", ")}],
    status: "${status}",
  },`;

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#080a10] text-[#f0f0f5] flex items-center justify-center">
        <form onSubmit={handleLogin} className="w-full max-w-sm px-6">
          <div className="text-center mb-8">
            <img src={icebergLogo} alt="logo" className="w-16 h-16 rounded-xl object-cover mx-auto mb-4" />
            <h1 className="text-xl font-bold">App Factory</h1>
            <p className="text-xs text-[#6b7d8d] mt-1">freeslackapps.com — admin access</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-[#f0f0f5] placeholder:text-[#3a4550] focus:outline-none focus:border-[#4dd4e6]/50 text-sm mb-3"
          />
          <button
            type="submit"
            disabled={authLoading}
            className="w-full rounded-lg bg-[#4dd4e6] py-3 text-sm font-semibold text-[#080a10] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {authLoading ? "Checking..." : "Enter"}
          </button>
          {authError && <p className="text-red-400 text-xs text-center mt-3">Wrong password</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080a10] text-[#f0f0f5]">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#080a10]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <img src={icebergLogo} alt="logo" className="w-10 h-10 rounded-lg object-cover" />
          <div>
            <h1 className="text-lg font-bold tracking-tight">App Factory</h1>
            <p className="text-xs text-[#6b7d8d]">freeslackapps.com — build dashboard</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
              status === "live" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" :
              status === "featured" ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400" :
              "border-white/10 bg-white/5 text-[#6b7d8d]"
            }`}>
              {status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT — Form */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-[#4dd4e6] mb-2 block">App Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Standup Bot"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-[#f0f0f5] placeholder:text-[#3a4550] focus:outline-none focus:border-[#4dd4e6]/50 text-sm"
              />
              {slug && <p className="text-[10px] text-[#3a4550] mt-1.5 font-mono">slug: {slug}</p>}
            </div>

            {/* Emoji Picker */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-[#4dd4e6] mb-2 block">Emoji</label>
              <div className="flex flex-wrap gap-1.5 p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                {emojiSuggestions.map((e, i) => (
                  <button
                    key={`${e}-${i}`}
                    onClick={() => setEmoji(e)}
                    className={`w-9 h-9 rounded-md text-lg flex items-center justify-center transition-all ${
                      emoji === e ? "bg-[#4dd4e6]/20 ring-1 ring-[#4dd4e6]/50 scale-110" : "hover:bg-white/5"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-[#4dd4e6] mb-2 block">Description</label>
              <input
                type="text"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="One-liner that explains what it does"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-[#f0f0f5] placeholder:text-[#3a4550] focus:outline-none focus:border-[#4dd4e6]/50 text-sm"
              />
            </div>

            {/* Category + Pricing */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-[#4dd4e6] mb-2 block">Category</label>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        category === c
                          ? "border-[#4dd4e6]/50 bg-[#4dd4e6]/10 text-[#4dd4e6]"
                          : "border-white/10 text-[#6b7d8d] hover:border-white/20"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-[#4dd4e6] mb-2 block">Pricing</label>
                <div className="flex flex-wrap gap-1.5">
                  {pricingOptions.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPricing(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        pricing === p
                          ? pricingColors[p]
                          : "border-white/10 text-[#6b7d8d] hover:border-white/20"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-[#4dd4e6] mb-2 block">Status</label>
              <div className="flex gap-1.5">
                {(["roadmap", "featured", "live"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      status === s
                        ? s === "live" ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                          : s === "featured" ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                          : "border-white/20 bg-white/5 text-[#a8c8d8]"
                        : "border-white/10 text-[#6b7d8d] hover:border-white/20"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Features — Click to Add */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-[#4dd4e6]">Features</label>
                <span className="text-[10px] text-[#3a4550]">{features.length} selected</span>
              </div>

              {/* Selected features */}
              {features.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {features.map((f) => (
                    <button
                      key={f}
                      onClick={() => toggleFeature(f)}
                      className="text-[11px] px-2.5 py-1 rounded-lg border border-[#4dd4e6]/30 bg-[#4dd4e6]/10 text-[#4dd4e6] hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all flex items-center gap-1"
                    >
                      {f} <span className="text-[9px] opacity-60">✕</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Available features */}
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 max-h-48 overflow-y-auto">
                <div className="flex flex-wrap gap-1.5">
                  {availableFeatures.filter((f) => !features.includes(f)).map((f) => (
                    <button
                      key={f}
                      onClick={() => toggleFeature(f)}
                      className="text-[11px] px-2.5 py-1 rounded-lg border border-white/10 text-[#6b7d8d] hover:border-[#4dd4e6]/30 hover:text-[#4dd4e6] hover:bg-[#4dd4e6]/5 transition-all"
                    >
                      + {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom feature input */}
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={customFeature}
                  onChange={(e) => setCustomFeature(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomFeature())}
                  placeholder="Custom feature..."
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-[#f0f0f5] placeholder:text-[#3a4550] focus:outline-none focus:border-[#4dd4e6]/50"
                />
                <button
                  onClick={addCustomFeature}
                  className="px-3 py-2 rounded-lg border border-white/10 text-xs text-[#6b7d8d] hover:border-[#4dd4e6]/30 hover:text-[#4dd4e6] transition-all"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Tags — Click to Toggle */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-[#4dd4e6]">Tags</label>
                <span className="text-[10px] text-[#3a4550]">{selectedTags.length} selected</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {uniqueTags.map((t) => {
                  const active = selectedTags.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => toggleTag(t)}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                        active
                          ? "border-[#4dd4e6]/40 bg-[#4dd4e6]/10 text-[#4dd4e6]"
                          : "border-white/10 text-[#6b7d8d] hover:border-white/20"
                      }`}
                    >
                      {active ? "✓ " : ""}{t}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT — Preview + Output */}
          <div className="space-y-6">
            {/* Live Card Preview */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-[#4dd4e6] mb-3 block">Card Preview</label>
              <div className="rounded-2xl border border-white/10 bg-[#0c0e16] p-6">
                <div className="text-3xl mb-3">{emoji}</div>
                <h3 className="text-lg font-bold text-[#f0f0f5]">{name || "App Name"}</h3>
                <p className="text-sm text-[#6b7d8d] mt-1.5 leading-relaxed">{desc || "Description goes here"}</p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {selectedTags.length > 0 ? selectedTags.map((t) => (
                    <span key={t} className="text-[11px] px-2.5 py-0.5 rounded-full border border-white/10 text-[#6b7d8d]">{t}</span>
                  )) : (
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-white/10 text-[#3a4550]">tags</span>
                  )}
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-semibold ${pricingColors[pricing]}`}>
                    {pricing}
                  </span>
                </div>
                <button className="mt-5 rounded-lg px-5 py-2.5 text-sm font-medium border border-[#4dd4e6]/40 text-[#4dd4e6] cursor-default">
                  Remind Me
                </button>
              </div>
            </div>

            {/* Feature Preview */}
            {features.length > 0 && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-[#4dd4e6] mb-3 block">Feature Preview</label>
                <div className="rounded-2xl border border-white/10 bg-[#0c0e16] p-6">
                  <div className="space-y-2.5">
                    {features.map((f) => (
                      <div key={f} className="flex items-start gap-2.5 text-sm text-[#6b7d8d]">
                        <span className="text-[#4dd4e6] mt-0.5 shrink-0 text-xs">✦</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Config Output */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold uppercase tracking-widest text-[#4dd4e6]">Config Output</label>
                <button
                  onClick={copyOutput}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                    copied
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                      : "border-[#4dd4e6]/30 text-[#4dd4e6] hover:bg-[#4dd4e6]/10"
                  }`}
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <pre className="rounded-xl border border-white/10 bg-[#0c0e16] p-4 text-xs text-[#8b9caa] font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
                {output}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
