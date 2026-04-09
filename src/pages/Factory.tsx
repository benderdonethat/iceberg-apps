import { useState, useCallback } from "react";
import icebergLogo from "@/assets/hero-iceberg.png";
import apps from "@/data/apps";

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
  const [activeTab, setActiveTab] = useState<"build" | "intel" | "outreach" | "audit">("intel");
  const [intel, setIntel] = useState<any>(null);
  const [intelLoading, setIntelLoading] = useState(false);
  const [intelError, setIntelError] = useState("");
  const [dmTemplates, setDmTemplates] = useState<any>(null);
  const [dmLoading, setDmLoading] = useState(false);
  const [dmError, setDmError] = useState("");
  const [dmApp, setDmApp] = useState<string>("");
  const [copiedDm, setCopiedDm] = useState<string>("");
  const [prospects, setProspects] = useState<any>(null);
  const [prospectLoading, setProspectLoading] = useState(false);
  const [prospectVertical, setProspectVertical] = useState("");
  const [activeDm, setActiveDm] = useState<Record<number, { dm: string; role: string; competitor: string }>>({});
  const [followUpData, setFollowUpData] = useState<Record<number, any>>({});
  const [followUpLoading, setFollowUpLoading] = useState<Record<number, string>>({});
  const [competitorContext, setCompetitorContext] = useState<{ name: string; price: string; weakness: string; features: string[] } | null>(null);
  const [auditData, setAuditData] = useState<any>(null);
  const [auditPrev, setAuditPrev] = useState<any>(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState("");
  const [auditApp, setAuditApp] = useState<string>("");
  const [auditCompare, setAuditCompare] = useState<any>(null);
  const [updateChanges, setUpdateChanges] = useState("");
  const [updateResult, setUpdateResult] = useState<any>(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const submitAuditUpdate = async () => {
    if (!auditApp || !updateChanges.trim()) return;
    setUpdateLoading(true);
    setUpdateResult(null);
    try {
      const currentProfile = localStorage.getItem(`audit_profile_${auditApp}`) || "";
      const res = await fetch("/api/audit-update", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": password || sessionStorage.getItem("factory_pw") || "" },
        body: JSON.stringify({ appName: auditApp, changes: updateChanges, currentProfile }),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setUpdateResult(json.data);
      setUpdateChanges("");
      // Save the updated profile for future audits
      if (json.data?.updated_profile) {
        localStorage.setItem(`audit_profile_${auditApp}`, json.data.updated_profile);
      }
    } catch (e: any) {
      setAuditError(e.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const fetchIntel = useCallback(async () => {
    setIntelLoading(true);
    setIntelError("");
    try {
      const currentAppNames = apps.map((a) => `${a.name} (${a.category}, ${a.status})`);
      const res = await fetch("/api/market-intel", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": password || sessionStorage.getItem("factory_pw") || "" },
        body: JSON.stringify({ currentApps: currentAppNames }),
      });
      if (!res.ok) throw new Error("Failed to fetch intel");
      const json = await res.json();
      setIntel(json.data);
    } catch (e: any) {
      setIntelError(e.message || "Failed to load");
    } finally {
      setIntelLoading(false);
    }
  }, [password]);

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
        sessionStorage.setItem("factory_pw", password);
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

  const freeApps = apps.filter((a) => a.pricing === "Free");

  const fetchDmTemplates = useCallback(async (appName: string) => {
    const app = apps.find((a) => a.name === appName);
    if (!app) return;
    setDmLoading(true);
    setDmError("");
    setDmApp(appName);
    try {
      const res = await fetch("/api/dm-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": password || sessionStorage.getItem("factory_pw") || "" },
        body: JSON.stringify({ app: { name: app.name, desc: app.desc, features: app.features, category: app.category, pricing: app.pricing } }),
      });
      if (!res.ok) throw new Error("Failed to generate templates");
      const json = await res.json();
      setDmTemplates(json.data);
    } catch (e: any) {
      setDmError(e.message || "Failed to load");
    } finally {
      setDmLoading(false);
    }
  }, [password]);

  const fetchProspects = useCallback(async (appName: string, vertical?: string) => {
    const app = apps.find((a) => a.name === appName);
    if (!app) return;
    setProspectLoading(true);
    try {
      const res = await fetch("/api/prospect", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": password || sessionStorage.getItem("factory_pw") || "" },
        body: JSON.stringify({ app: { name: app.name, desc: app.desc, category: app.category }, vertical }),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setProspects(json.data);
    } catch (e: any) {
      setDmError(e.message);
    } finally {
      setProspectLoading(false);
    }
  }, [password]);

  const copyDm = (text: string, id: string, templateIndex?: number, template?: any, openLinkedIn?: boolean) => {
    navigator.clipboard.writeText(text);
    setCopiedDm(id);
    setTimeout(() => setCopiedDm(""), 2000);
    // Cache the DM when it's a first message copy
    if (templateIndex !== undefined && template && id.startsWith("dm-")) {
      setActiveDm(prev => ({ ...prev, [templateIndex]: { dm: text, role: template.role, competitor: template.competitor } }));
    }
    if (openLinkedIn) {
      window.open("https://www.linkedin.com/messaging/", "_blank");
    }
  };

  const fetchFollowUp = async (index: number, mode: "followup" | "rework") => {
    const cached = activeDm[index];
    if (!cached) return;
    setFollowUpLoading(prev => ({ ...prev, [index]: mode }));
    try {
      const res = await fetch("/api/dm-followup", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": password || sessionStorage.getItem("factory_pw") || "" },
        body: JSON.stringify({ originalDm: cached.dm, role: cached.role, competitor: cached.competitor, mode, appName: dmApp }),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setFollowUpData(prev => ({ ...prev, [index]: { ...prev[index], [mode]: json.data } }));
    } catch (e) {
      // silent
    } finally {
      setFollowUpLoading(prev => ({ ...prev, [index]: "" }));
    }
  };

  const buildFromIntel = (opp: any) => {
    setName(opp.our_name || "");
    setEmoji(opp.our_emoji || "🤖");
    setDesc(opp.our_desc || "");
    setCategory(opp.category || "Other");
    const p = (opp.our_pricing || "Free").split(" ")[0];
    setPricing(["Free", "Freemium", "Paid"].includes(p) ? p : "Free");
    setFeatures(opp.our_features || []);
    setSelectedTags([opp.category || "Other", p]);
    setStatus("roadmap");
    setCompetitorContext({
      name: opp.target_app || "",
      price: opp.target_price || "",
      weakness: opp.target_weakness || "",
      features: opp.target_features || [],
    });
    setActiveTab("build");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectAuditApp = (appName: string) => {
    setAuditApp(appName);
    setAuditError("");
    setAuditCompare(null);
    // Load cached audit from localStorage
    const cached = localStorage.getItem(`audit_${appName}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setAuditData(parsed.data);
        setAuditPrev(null);
      } catch { setAuditData(null); }
    } else {
      setAuditData(null);
    }
  };

  const runNewAudit = async () => {
    const appName = auditApp;
    const app = apps.find((a) => a.name === appName);
    if (!app || !appName) return;
    setAuditLoading(true);
    setAuditError("");
    setAuditCompare(null);
    const prevData = auditData ? { ...auditData } : null;
    setAuditPrev(prevData);
    try {
      // No profileOverride — always use server-side APP_PROFILES as source of truth
      const res = await fetch("/api/app-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": password || sessionStorage.getItem("factory_pw") || "" },
        body: JSON.stringify({ app: { name: app.name, desc: app.desc, features: app.features, category: app.category, pricing: app.pricing, status: app.status } }),
      });
      if (!res.ok) throw new Error("Failed to run audit");
      const json = await res.json();
      setAuditData(json.data);
      localStorage.setItem(`audit_${appName}`, JSON.stringify({ data: json.data, timestamp: new Date().toISOString() }));
      if (prevData) {
        const compare: any = { score_change: json.data.readiness_score - prevData.readiness_score, ux_change: (json.data.ux_score?.total || 0) - (prevData.ux_score?.total || 0), improved: [], regressed: [] };
        for (const f of (json.data.feature_audit || [])) {
          const prev = (prevData.feature_audit || []).find((p: any) => p.feature === f.feature);
          if (!prev) { compare.improved.push(`${f.feature}: new (${f.status})`); continue; }
          const rank: Record<string, number> = { behind: 0, match: 1, ahead: 2, unique: 3 };
          if ((rank[f.status] || 0) > (rank[prev.status] || 0)) compare.improved.push(`${f.feature}: ${prev.status} → ${f.status}`);
          if ((rank[f.status] || 0) < (rank[prev.status] || 0)) compare.regressed.push(`${f.feature}: ${prev.status} → ${f.status}`);
        }
        setAuditCompare(compare);
      }
    } catch (e: any) {
      setAuditError(e.message || "Failed to load");
    } finally {
      setAuditLoading(false);
    }
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
            <button
              onClick={() => { setActiveTab("intel"); if (!intel && !intelLoading) fetchIntel(); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                activeTab === "intel" ? "border-amber-500/50 bg-amber-500/10 text-amber-400" : "border-white/10 text-[#6b7d8d] hover:border-white/20"
              }`}
            >
              Market Intel
            </button>
            <button
              onClick={() => setActiveTab("build")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                activeTab === "build" ? "border-[#4dd4e6]/50 bg-[#4dd4e6]/10 text-[#4dd4e6]" : "border-white/10 text-[#6b7d8d] hover:border-white/20"
              }`}
            >
              Build
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                activeTab === "audit" ? "border-blue-500/50 bg-blue-500/10 text-blue-400" : "border-white/10 text-[#6b7d8d] hover:border-white/20"
              }`}
            >
              Audit
            </button>
            <button
              onClick={() => setActiveTab("outreach")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                activeTab === "outreach" ? "border-purple-500/50 bg-purple-500/10 text-purple-400" : "border-white/10 text-[#6b7d8d] hover:border-white/20"
              }`}
            >
              Outreach
            </button>
            {activeTab === "build" && (
              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                status === "live" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" :
                status === "featured" ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400" :
                "border-white/10 bg-white/5 text-[#6b7d8d]"
              }`}>
                {status.toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* ── MARKET INTEL TAB ─────────────────────── */}
        {activeTab === "intel" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Market Intel</h2>
                <p className="text-sm text-[#6b7d8d] mt-1">Paid Slack apps to undercut — equal or better, for free</p>
              </div>
              <button
                onClick={fetchIntel}
                disabled={intelLoading}
                className="px-4 py-2 rounded-lg text-xs font-medium border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-all disabled:opacity-50"
              >
                {intelLoading ? "Analyzing..." : intel ? "Refresh" : "Load Intel"}
              </button>
            </div>

            {intelLoading && (
              <div className="text-center py-20">
                <div className="text-2xl mb-3 animate-pulse">🔍</div>
                <p className="text-[#6b7d8d] text-sm">Searching competitor data and analyzing market...</p>
                <p className="text-[#3a4550] text-xs mt-1">Pulling real pricing, reviews, and install data — 20-30 seconds</p>
              </div>
            )}

            {intelError && <p className="text-red-400 text-sm text-center py-10">{intelError}</p>}

            {intel && !intelLoading && (
              <>
                {/* Market Summary */}
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 mb-2">Market Summary</div>
                  <p className="text-sm text-[#a8c8d8] leading-relaxed">{intel.market_summary}</p>
                  <p className="text-[10px] text-[#3a4550] mt-3">Generated {new Date(intel.generated_at).toLocaleString()}</p>
                </div>

                {/* Catalog Gaps */}
                {intel.catalog_gaps && intel.catalog_gaps.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">Undercut Opportunities by Category</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {intel.catalog_gaps.map((gap: any, i: number) => (
                        <div key={i} className={`rounded-xl border p-4 ${
                          gap.priority === "high" ? "border-red-500/30 bg-red-500/5" :
                          gap.priority === "medium" ? "border-amber-500/30 bg-amber-500/5" :
                          "border-white/10 bg-white/[0.02]"
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-[#f0f0f5]">{gap.category}</span>
                            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${
                              gap.priority === "high" ? "border-red-500/40 text-red-400" :
                              gap.priority === "medium" ? "border-amber-500/40 text-amber-400" :
                              "border-white/20 text-[#6b7d8d]"
                            }`}>{gap.priority}</span>
                          </div>
                          <p className="text-[11px] text-[#6b7d8d] leading-relaxed">{gap.gap}</p>
                          {gap.top_paid_app && (
                            <p className="text-[10px] text-red-400/80 mt-2">Top target: {gap.top_paid_app} — {gap.their_price}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Competitive Opportunities */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-4">Apps to Undercut</h3>
                  <div className="space-y-6">
                    {intel.opportunities?.map((opp: any) => (
                      <div key={opp.rank} className="rounded-2xl border border-white/10 bg-[#0c0e16] overflow-hidden hover:border-amber-500/20 transition-all">
                        {/* Header: Our app vs theirs */}
                        <div className="flex items-stretch">
                          {/* Their app (left) */}
                          <div className="flex-1 p-5 border-r border-white/5 bg-red-500/[0.03]">
                            <div className="text-[9px] font-semibold uppercase tracking-widest text-red-400 mb-2">Kill Target</div>
                            <h4 className="text-sm font-bold text-[#f0f0f5]">{opp.target_app}</h4>
                            <div className="text-lg font-bold text-red-400 mt-1">{opp.target_price}</div>
                            <p className="text-[10px] text-[#6b7d8d] mt-1">{opp.target_installs}</p>
                            {opp.target_rating && <p className="text-[10px] text-amber-400/60 mt-0.5">{opp.target_rating}</p>}
                          </div>
                          {/* Our app (right) */}
                          <div className="flex-1 p-5 bg-emerald-500/[0.03]">
                            <div className="text-[9px] font-semibold uppercase tracking-widest text-emerald-400 mb-2">Our Alternative</div>
                            <h4 className="text-sm font-bold text-[#f0f0f5] flex items-center gap-2">
                              <span>{opp.our_emoji}</span> {opp.our_name}
                            </h4>
                            <div className="text-lg font-bold text-emerald-400 mt-1">{opp.our_pricing}</div>
                            {opp.our_pricing_detail && <p className="text-[10px] text-[#6b7d8d] mt-1">{opp.our_pricing_detail}</p>}
                          </div>
                          {/* Score */}
                          <div className="w-20 flex flex-col items-center justify-center p-3 border-l border-white/5">
                            <div className={`text-2xl font-bold ${
                              opp.score >= 80 ? "text-emerald-400" :
                              opp.score >= 60 ? "text-amber-400" :
                              "text-[#6b7d8d]"
                            }`}>{opp.score}</div>
                            <div className="text-[8px] text-[#3a4550] uppercase">score</div>
                          </div>
                        </div>

                        {/* Score breakdown bar */}
                        {opp.score_breakdown && (
                          <div className="flex h-1.5">
                            <div className="bg-blue-500" style={{ width: `${opp.score_breakdown.market_size}%` }} title="Market Size" />
                            <div className="bg-emerald-500" style={{ width: `${opp.score_breakdown.price_gap}%` }} title="Price Gap" />
                            <div className="bg-amber-500" style={{ width: `${opp.score_breakdown.build_speed}%` }} title="Build Speed" />
                            <div className="bg-purple-500" style={{ width: `${opp.score_breakdown.virality}%` }} title="Virality" />
                          </div>
                        )}

                        <div className="p-5 space-y-4">
                          {/* Description & Strategy */}
                          <p className="text-xs text-[#a8c8d8]">{opp.our_desc}</p>
                          <p className="text-xs text-amber-400/80 font-medium">{opp.undercut_strategy}</p>

                          {/* Feature comparison */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-[9px] font-semibold uppercase tracking-widest text-red-400/60 mb-2">Their Features</div>
                              <div className="space-y-1.5">
                                {opp.target_features?.map((f: string) => (
                                  <div key={f} className="flex items-start gap-1.5 text-[11px] text-[#6b7d8d]">
                                    <span className="text-red-400/40 mt-0.5 shrink-0">—</span>
                                    <span>{f}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-[9px] font-semibold uppercase tracking-widest text-emerald-400/60 mb-2">Our Features</div>
                              <div className="space-y-1.5">
                                {opp.our_features?.map((f: string) => (
                                  <div key={f} className="flex items-start gap-1.5 text-[11px] text-[#a8c8d8]">
                                    <span className="text-emerald-400 mt-0.5 shrink-0">✦</span>
                                    <span>{f}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Their weakness */}
                          <div className="rounded-lg border border-red-500/10 bg-red-500/[0.03] p-3">
                            <div className="text-[9px] font-semibold uppercase tracking-widest text-red-400/60 mb-1">Their Weakness</div>
                            <p className="text-[11px] text-[#6b7d8d] leading-relaxed">{opp.target_weakness}</p>
                          </div>

                          {/* Bottom row */}
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-[#6b7d8d]">{opp.category}</span>
                              <button
                                onClick={() => buildFromIntel(opp)}
                                className="text-[10px] px-3 py-1 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-all font-medium"
                              >
                                Build This
                              </button>
                            </div>
                            {opp.score_breakdown && (
                              <div className="flex gap-3 text-[9px] text-[#3a4550]">
                                <span><span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mr-1" />Market {opp.score_breakdown.market_size}</span>
                                <span><span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />Price {opp.score_breakdown.price_gap}</span>
                                <span><span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mr-1" />Build {opp.score_breakdown.build_speed}</span>
                                <span><span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-500 mr-1" />Viral {opp.score_breakdown.virality}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── OUTREACH TAB ──────────────────────────── */}
        {activeTab === "outreach" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold">LinkedIn Outreach</h2>
              <p className="text-sm text-[#6b7d8d] mt-1">Copy-ready DMs for free apps — competitor-aware, role-targeted</p>
            </div>

            {/* App Selector */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-3 block">Select a Free App</label>
              <div className="flex flex-wrap gap-2">
                {freeApps.map((a) => (
                  <button
                    key={a.slug}
                    onClick={() => fetchDmTemplates(a.name)}
                    disabled={dmLoading}
                    className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all flex items-center gap-2 ${
                      dmApp === a.name
                        ? "border-purple-500/50 bg-purple-500/10 text-purple-400"
                        : "border-white/10 text-[#6b7d8d] hover:border-white/20"
                    }`}
                  >
                    <span>{a.emoji}</span> {a.name}
                  </button>
                ))}
              </div>
              {freeApps.length === 0 && (
                <p className="text-sm text-[#3a4550] mt-2">No free apps in catalog yet. Add one on the Build tab first.</p>
              )}
            </div>

            {dmLoading && (
              <div className="text-center py-20">
                <div className="text-2xl mb-3 animate-pulse">💬</div>
                <p className="text-[#6b7d8d] text-sm">Researching competitors and writing DMs...</p>
                <p className="text-[#3a4550] text-xs mt-1">Finding who to target and what to say — 15-20 seconds</p>
              </div>
            )}

            {dmError && <p className="text-red-400 text-sm text-center py-10">{dmError}</p>}

            {/* Prospect Finder */}
            {dmApp && !dmLoading && (
              <div className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.03] p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-orange-400">Find Companies to Contact</h3>
                    <p className="text-[10px] text-[#6b7d8d] mt-0.5">Real companies that match your target audience. Verified via web search.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={prospectVertical}
                      onChange={(e) => setProspectVertical(e.target.value)}
                      placeholder="Vertical (optional, e.g. agencies)"
                      className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-[#a8c8d8] placeholder-[#3a4550] w-48"
                    />
                    <button
                      onClick={() => fetchProspects(dmApp, prospectVertical || undefined)}
                      disabled={prospectLoading}
                      className="px-4 py-1.5 rounded-lg text-xs font-medium border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 transition-all disabled:opacity-50"
                    >
                      {prospectLoading ? "Searching..." : "Find Prospects"}
                    </button>
                  </div>
                </div>

                {prospectLoading && (
                  <div className="text-center py-8">
                    <p className="text-[#6b7d8d] text-xs animate-pulse">Searching the web for companies that need {dmApp}...</p>
                  </div>
                )}

                {prospects && !prospectLoading && (
                  <div className="space-y-3">
                    {prospects.prospects?.map((p: any, i: number) => (
                      <div key={i} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-[#f0f0f5]">{p.company}</span>
                              <span className={`text-[8px] px-1.5 py-0.5 rounded-full border ${
                                p.confidence === 'high' ? 'border-emerald-500/40 text-emerald-400' :
                                p.confidence === 'medium' ? 'border-yellow-500/40 text-yellow-400' :
                                'border-white/10 text-[#6b7d8d]'
                              }`}>{p.confidence}</span>
                            </div>
                            <p className="text-[10px] text-[#6b7d8d] mt-0.5">{p.description} · {p.size} · {p.location}</p>
                            <p className="text-[10px] text-[#a8c8d8] mt-1">{p.why_they_need_it}</p>
                            <p className="text-[10px] text-orange-400/70 mt-1">Contact: {p.target_role}</p>
                          </div>
                          <div className="flex flex-col gap-1 ml-3">
                            <button
                              onClick={() => copyDm(p.linkedin_company_search, `co-${i}`)}
                              className={`text-[9px] px-2 py-0.5 rounded border transition-all whitespace-nowrap ${
                                copiedDm === `co-${i}` ? "border-emerald-500/40 text-emerald-400" : "border-white/10 text-[#6b7d8d] hover:text-[#a8c8d8]"
                              }`}
                            >
                              {copiedDm === `co-${i}` ? "Copied" : "Company"}
                            </button>
                            <button
                              onClick={() => copyDm(p.linkedin_people_search, `pe-${i}`)}
                              className={`text-[9px] px-2 py-0.5 rounded border transition-all whitespace-nowrap ${
                                copiedDm === `pe-${i}` ? "border-emerald-500/40 text-emerald-400" : "border-white/10 text-[#6b7d8d] hover:text-[#a8c8d8]"
                              }`}
                            >
                              {copiedDm === `pe-${i}` ? "Copied" : "People"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {prospects.verticals_to_explore && (
                      <div className="mt-4 pt-3 border-t border-white/5">
                        <p className="text-[9px] font-semibold uppercase tracking-widest text-[#3a4550] mb-2">Verticals to explore next</p>
                        <div className="flex flex-wrap gap-2">
                          {prospects.verticals_to_explore.map((v: string, i: number) => (
                            <button
                              key={i}
                              onClick={() => { setProspectVertical(v); fetchProspects(dmApp, v); }}
                              className="text-[10px] px-3 py-1 rounded-full border border-orange-500/20 text-orange-400/70 hover:bg-orange-500/10 transition-all"
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {prospects.search_tips && (
                      <div className="mt-3">
                        <p className="text-[9px] font-semibold uppercase tracking-widest text-[#3a4550] mb-1">LinkedIn tips</p>
                        {prospects.search_tips.map((tip: string, i: number) => (
                          <p key={i} className="text-[10px] text-[#6b7d8d]">· {tip}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {dmTemplates && !dmLoading && (
              <div className="space-y-6">
                {dmTemplates.templates?.map((t: any, i: number) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-[#0c0e16] overflow-hidden">
                    {/* Role header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/5 bg-purple-500/[0.03]">
                      <div>
                        <h4 className="text-sm font-bold text-[#f0f0f5]">{t.role}</h4>
                        <p className="text-[10px] text-[#6b7d8d] mt-0.5">{t.why_this_role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-red-400">vs {t.competitor}</p>
                        <p className="text-[10px] text-red-400/60">{t.competitor_price}</p>
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      {/* LinkedIn search query */}
                      <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] font-semibold uppercase tracking-widest text-[#3a4550]">LinkedIn Search</span>
                          <button
                            onClick={() => copyDm(t.linkedin_search, `search-${i}`)}
                            className={`text-[9px] px-2 py-0.5 rounded border transition-all ${
                              copiedDm === `search-${i}` ? "border-emerald-500/40 text-emerald-400" : "border-white/10 text-[#6b7d8d] hover:text-[#a8c8d8]"
                            }`}
                          >
                            {copiedDm === `search-${i}` ? "Copied" : "Copy"}
                          </button>
                        </div>
                        <p className="text-xs text-[#a8c8d8] font-mono">{t.linkedin_search}</p>
                      </div>

                      {/* DM */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-semibold uppercase tracking-widest text-purple-400">First Message</span>
                          <button
                            onClick={() => copyDm(t.dm, `dm-${i}`, i, t, true)}
                            className={`text-[10px] px-3 py-1 rounded-lg border font-medium transition-all ${
                              copiedDm === `dm-${i}` ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : "border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                            }`}
                          >
                            {copiedDm === `dm-${i}` ? "Copied + Opened" : "Send on LinkedIn"}
                          </button>
                        </div>
                        <div className="rounded-lg border border-purple-500/10 bg-purple-500/[0.03] p-4">
                          <p className="text-sm text-[#a8c8d8] leading-relaxed whitespace-pre-wrap">{t.dm}</p>
                        </div>
                        <p className="text-[10px] text-[#3a4550] mt-1">{t.dm?.length || 0} chars</p>
                      </div>

                      {/* Follow-up */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-semibold uppercase tracking-widest text-[#3a4550]">Follow-up (3 days later)</span>
                          <button
                            onClick={() => copyDm(t.followup, `fu-${i}`)}
                            className={`text-[10px] px-3 py-1 rounded-lg border font-medium transition-all ${
                              copiedDm === `fu-${i}` ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : "border-white/10 text-[#6b7d8d] hover:text-[#a8c8d8]"
                            }`}
                          >
                            {copiedDm === `fu-${i}` ? "Copied" : "Copy"}
                          </button>
                        </div>
                        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                          <p className="text-sm text-[#6b7d8d] leading-relaxed whitespace-pre-wrap">{t.followup}</p>
                        </div>
                      </div>

                      {/* Pipeline buttons — appear after copying the DM */}
                      {activeDm[i] && (
                        <div className="pt-3 border-t border-white/5">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-[9px] font-semibold uppercase tracking-widest text-cyan-400">Pipeline</span>
                            <span className="text-[9px] text-[#3a4550]">DM copied. What next?</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => fetchFollowUp(i, "followup")}
                              disabled={followUpLoading[i] === "followup"}
                              className="px-3 py-1.5 rounded-lg text-[10px] font-medium border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all disabled:opacity-50"
                            >
                              {followUpLoading[i] === "followup" ? "Generating..." : "Follow Up?"}
                            </button>
                            <button
                              onClick={() => fetchFollowUp(i, "rework")}
                              disabled={followUpLoading[i] === "rework"}
                              className="px-3 py-1.5 rounded-lg text-[10px] font-medium border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-all disabled:opacity-50"
                            >
                              {followUpLoading[i] === "rework" ? "Reworking..." : "Not Landing?"}
                            </button>
                          </div>

                          {/* Follow-up result */}
                          {followUpData[i]?.followup && (
                            <div className="mt-3 rounded-lg border border-cyan-500/10 bg-cyan-500/[0.03] p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[9px] font-semibold uppercase tracking-widest text-cyan-400">Generated Follow-Up</span>
                                <button
                                  onClick={() => copyDm(followUpData[i].followup.followup, `genfu-${i}`)}
                                  className={`text-[10px] px-3 py-1 rounded-lg border font-medium transition-all ${
                                    copiedDm === `genfu-${i}` ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : "border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                                  }`}
                                >
                                  {copiedDm === `genfu-${i}` ? "Copied" : "Copy"}
                                </button>
                              </div>
                              <p className="text-sm text-[#a8c8d8] leading-relaxed whitespace-pre-wrap">{followUpData[i].followup.followup}</p>
                              {followUpData[i].followup.timing_note && (
                                <p className="text-[10px] text-[#3a4550] mt-2">{followUpData[i].followup.timing_note}</p>
                              )}
                            </div>
                          )}

                          {/* Rework result */}
                          {followUpData[i]?.rework && (
                            <div className="mt-3 rounded-lg border border-amber-500/10 bg-amber-500/[0.03] p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[9px] font-semibold uppercase tracking-widest text-amber-400">Reworked DM</span>
                                <button
                                  onClick={() => { copyDm(followUpData[i].rework.reworked_dm, `rework-${i}`, i, t); }}
                                  className={`text-[10px] px-3 py-1 rounded-lg border font-medium transition-all ${
                                    copiedDm === `rework-${i}` ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : "border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                                  }`}
                                >
                                  {copiedDm === `rework-${i}` ? "Copied" : "Copy + Use This"}
                                </button>
                              </div>
                              <p className="text-sm text-[#a8c8d8] leading-relaxed whitespace-pre-wrap">{followUpData[i].rework.reworked_dm}</p>
                              <p className="text-[10px] text-amber-400/50 mt-2">{followUpData[i].rework.what_changed}</p>
                              {followUpData[i].rework.followup && (
                                <div className="mt-2 pt-2 border-t border-white/5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[9px] text-[#3a4550]">Follow-up for this version</span>
                                    <button
                                      onClick={() => copyDm(followUpData[i].rework.followup, `rwfu-${i}`)}
                                      className={`text-[9px] px-2 py-0.5 rounded border transition-all ${
                                        copiedDm === `rwfu-${i}` ? "border-emerald-500/40 text-emerald-400" : "border-white/10 text-[#6b7d8d]"
                                      }`}
                                    >
                                      {copiedDm === `rwfu-${i}` ? "Copied" : "Copy"}
                                    </button>
                                  </div>
                                  <p className="text-[10px] text-[#6b7d8d] mt-1">{followUpData[i].rework.followup}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── AUDIT TAB ─────────────────────────────── */}
        {activeTab === "audit" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold">App Audit</h2>
              <p className="text-sm text-[#6b7d8d] mt-1">Competitive edge check — where we win, where to improve, and when to stop</p>
            </div>

            {/* App Selector */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3 block">Select an App to Audit</label>
              <div className="flex flex-wrap gap-2">
                {apps.map((a) => (
                  <button
                    key={a.slug}
                    onClick={() => selectAuditApp(a.name)}
                    disabled={auditLoading}
                    className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all flex items-center gap-2 ${
                      auditApp === a.name
                        ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                        : "border-white/10 text-[#6b7d8d] hover:border-white/20"
                    }`}
                  >
                    <span>{a.emoji}</span> {a.name}
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${
                      a.status === "live" ? "border-emerald-500/40 text-emerald-400" :
                      a.status === "featured" ? "border-cyan-500/40 text-cyan-400" :
                      "border-white/10 text-[#3a4550]"
                    }`}>{a.status}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Audit Actions */}
            {auditApp && !auditLoading && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => runNewAudit()}
                  disabled={auditLoading}
                  className="px-4 py-2 rounded-lg text-xs font-medium border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-all disabled:opacity-50"
                >
                  Run Audit
                </button>
                {auditData && (
                  <span className="text-[10px] text-[#3a4550]">
                    Last audit: {localStorage.getItem(`audit_${auditApp}`) ? new Date(JSON.parse(localStorage.getItem(`audit_${auditApp}`) || '{}').timestamp).toLocaleString() : 'never'}
                  </span>
                )}
                {!auditData && <span className="text-[10px] text-[#6b7d8d]">No previous audit. Run one to get started.</span>}
              </div>
            )}

            {auditLoading && (
              <div className="text-center py-20">
                <div className="text-2xl mb-3 animate-pulse">🔬</div>
                <p className="text-[#6b7d8d] text-sm">Running competitive audit...</p>
                <p className="text-[#3a4550] text-xs mt-1">Analyzing features vs competitors. 20-30 seconds.</p>
              </div>
            )}

            {auditError && <p className="text-red-400 text-sm text-center py-10">{auditError}</p>}

            {/* Comparison Banner */}
            {auditCompare && !auditLoading && (
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.03] p-5">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-blue-400 mb-3">Changes Since Last Audit</div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="text-center">
                    <div className={`text-xl font-bold ${auditCompare.score_change > 0 ? 'text-emerald-400' : auditCompare.score_change < 0 ? 'text-red-400' : 'text-[#6b7d8d]'}`}>
                      {auditCompare.score_change > 0 ? '+' : ''}{auditCompare.score_change}
                    </div>
                    <div className="text-[9px] text-[#3a4550]">Readiness Score</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xl font-bold ${auditCompare.ux_change > 0 ? 'text-emerald-400' : auditCompare.ux_change < 0 ? 'text-red-400' : 'text-[#6b7d8d]'}`}>
                      {auditCompare.ux_change > 0 ? '+' : ''}{auditCompare.ux_change}
                    </div>
                    <div className="text-[9px] text-[#3a4550]">UX Score</div>
                  </div>
                </div>
                {auditCompare.improved.length > 0 && (
                  <div className="mb-2">
                    <div className="text-[9px] text-emerald-400 font-semibold uppercase mb-1">Improved</div>
                    {auditCompare.improved.map((item: string, i: number) => (
                      <p key={i} className="text-[11px] text-emerald-400/80">{item}</p>
                    ))}
                  </div>
                )}
                {auditCompare.regressed.length > 0 && (
                  <div>
                    <div className="text-[9px] text-red-400 font-semibold uppercase mb-1">Regressed</div>
                    {auditCompare.regressed.map((item: string, i: number) => (
                      <p key={i} className="text-[11px] text-red-400/80">{item}</p>
                    ))}
                  </div>
                )}
                {auditCompare.improved.length === 0 && auditCompare.regressed.length === 0 && (
                  <p className="text-[11px] text-[#6b7d8d]">No feature status changes detected.</p>
                )}
              </div>
            )}

            {auditData && !auditLoading && (
              <>
                {/* Overall Score */}
                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.03] p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-blue-400 mb-1">Competitive Readiness</div>
                      <p className="text-sm text-[#a8c8d8]">{auditData.summary}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-4xl font-bold ${
                        auditData.readiness_score >= 80 ? "text-emerald-400" :
                        auditData.readiness_score >= 60 ? "text-amber-400" :
                        "text-red-400"
                      }`}>{auditData.readiness_score}</div>
                      <div className="text-[9px] text-[#3a4550] uppercase">/100</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-[#3a4550] mt-2">vs {auditData.primary_competitor} | {auditData.competitor_price}</div>
                  {auditData.competitor_validation && <div className="text-[10px] text-[#6b7d8d] mt-1">{auditData.competitor_validation}</div>}
                </div>

                {/* Verdict */}
                <div className={`rounded-xl border p-4 ${
                  auditData.verdict === "SHIP" ? "border-emerald-500/30 bg-emerald-500/5" :
                  auditData.verdict === "IMPROVE" ? "border-amber-500/30 bg-amber-500/5" :
                  "border-red-500/30 bg-red-500/5"
                }`}>
                  <span className={`text-sm font-bold ${
                    auditData.verdict === "SHIP" ? "text-emerald-400" :
                    auditData.verdict === "IMPROVE" ? "text-amber-400" :
                    "text-red-400"
                  }`}>{auditData.verdict}</span>
                  <span className="text-xs text-[#6b7d8d] ml-2">{auditData.verdict_reason}</span>
                </div>

                {/* Feature-by-Feature Comparison */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-4">Feature-by-Feature</h3>
                  <div className="space-y-2">
                    {auditData.feature_audit?.map((f: any, i: number) => (
                      <div key={i} className="rounded-xl border border-white/10 bg-[#0c0e16] p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-[#f0f0f5]">{f.feature}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            f.status === "ahead" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" :
                            f.status === "match" ? "border-blue-500/40 bg-blue-500/10 text-blue-400" :
                            f.status === "behind" ? "border-red-500/40 bg-red-500/10 text-red-400" :
                            "border-white/10 text-[#6b7d8d]"
                          }`}>{f.status}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-[11px]">
                          <div>
                            <span className="text-[#3a4550] text-[9px] uppercase">Us</span>
                            <p className="text-[#a8c8d8] mt-0.5">{f.our_implementation}</p>
                          </div>
                          <div>
                            <span className="text-[#3a4550] text-[9px] uppercase">Them</span>
                            <p className="text-[#6b7d8d] mt-0.5">{f.their_implementation}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Improvements — only high-impact */}
                {auditData.improvements && auditData.improvements.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">High-Impact Improvements Only</h3>
                    <p className="text-[10px] text-[#3a4550] mb-4">These are the moves that change the competitive outcome. Everything else is polish.</p>
                    <div className="space-y-3">
                      {auditData.improvements.map((imp: any, i: number) => (
                        <div key={i} className="rounded-xl border border-amber-500/15 bg-amber-500/[0.03] p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-[#f0f0f5]">{imp.title}</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${
                                imp.impact === "critical" ? "border-red-500/40 text-red-400" :
                                imp.impact === "high" ? "border-amber-500/40 text-amber-400" :
                                "border-white/10 text-[#6b7d8d]"
                              }`}>{imp.impact}</span>
                              <span className="text-[9px] text-[#3a4550]">{imp.effort}</span>
                            </div>
                          </div>
                          <p className="text-[11px] text-[#6b7d8d] leading-relaxed">{imp.description}</p>
                          <p className="text-[10px] text-amber-400/60 mt-2">{imp.why_it_matters}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Functionality Check */}
                {auditData.functionality && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">Functionality</h3>
                    <span className={`text-[11px] px-3 py-1 rounded-full border font-medium ${
                      auditData.functionality.rating === 'solid' ? 'border-emerald-500/40 text-emerald-400' :
                      auditData.functionality.rating === 'mostly works' ? 'border-amber-500/40 text-amber-400' :
                      'border-red-500/40 text-red-400'
                    }`}>{auditData.functionality.rating}</span>
                    {auditData.functionality.issues?.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {auditData.functionality.issues.map((issue: string, i: number) => (
                          <p key={i} className="text-[11px] text-[#6b7d8d]">{issue}</p>
                        ))}
                      </div>
                    )}
                    {auditData.functionality.dead_ends?.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {auditData.functionality.dead_ends.map((de: string, i: number) => (
                          <p key={i} className="text-[11px] text-red-400/80">{de}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* UX/UI Score */}
                {auditData.ux_score && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-semibold uppercase tracking-widest text-blue-400">UX / UI Score</h3>
                      <div className={`text-2xl font-bold ${
                        auditData.ux_score.total >= 80 ? 'text-emerald-400' :
                        auditData.ux_score.total >= 60 ? 'text-amber-400' :
                        'text-red-400'
                      }`}>{auditData.ux_score.total}<span className="text-[9px] text-[#3a4550]">/100</span></div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      {[
                        { label: 'First Impression', val: auditData.ux_score.first_impression },
                        { label: 'Clicks to Task', val: auditData.ux_score.clicks_to_task },
                        { label: 'Visual Clarity', val: auditData.ux_score.visual_clarity },
                        { label: 'Feedback Loops', val: auditData.ux_score.feedback_loops },
                      ].map((item) => (
                        <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-center">
                          <div className={`text-lg font-bold ${item.val >= 80 ? 'text-emerald-400' : item.val >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{item.val}</div>
                          <div className="text-[9px] text-[#3a4550] mt-1">{item.label}</div>
                        </div>
                      ))}
                    </div>
                    {auditData.ux_score.improvements?.length > 0 && (
                      <div className="space-y-2">
                        {auditData.ux_score.improvements.map((imp: any, i: number) => (
                          <div key={i} className="rounded-lg border border-blue-500/15 bg-blue-500/[0.03] p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-[#f0f0f5]">{imp.area}</span>
                              <span className="text-[10px] text-red-400">{imp.score}/100</span>
                            </div>
                            <p className="text-[11px] text-[#6b7d8d]">{imp.fix}</p>
                            <p className="text-[10px] text-blue-400/60 mt-1">Slack elements: {imp.slack_elements}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 30-Day User Projection */}
                {auditData.user_projection && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">30-Day Projection (Minimal Marketing)</h3>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-center">
                        <div className="text-lg font-bold text-[#6b7d8d]">{auditData.user_projection.installs_30d_low}</div>
                        <div className="text-[9px] text-[#3a4550]">Low</div>
                      </div>
                      <div className="rounded-lg border border-blue-500/20 bg-blue-500/[0.03] p-3 text-center">
                        <div className="text-lg font-bold text-blue-400">{auditData.user_projection.installs_30d_mid}</div>
                        <div className="text-[9px] text-[#3a4550]">Mid</div>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-center">
                        <div className="text-lg font-bold text-[#6b7d8d]">{auditData.user_projection.installs_30d_high}</div>
                        <div className="text-[9px] text-[#3a4550]">High</div>
                      </div>
                    </div>
                    <div className="space-y-2 text-[11px]">
                      <p className="text-[#a8c8d8]">Activation rate: {auditData.user_projection.activation_rate}</p>
                      <p className="text-emerald-400/80">Driver: {auditData.user_projection.adoption_driver}</p>
                      <p className="text-red-400/80">Barrier: {auditData.user_projection.adoption_barrier}</p>
                    </div>
                  </div>
                )}

                {/* Stop List */}
                {auditData.stop_improving && auditData.stop_improving.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">Stop Improving These</h3>
                    <p className="text-[10px] text-[#3a4550] mb-3">Already good enough. More work here = diminishing returns.</p>
                    <div className="flex flex-wrap gap-2">
                      {auditData.stop_improving.map((item: string, i: number) => (
                        <span key={i} className="text-[11px] px-3 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-400">
                          ✓ {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}


            {/* Update Results */}
            {updateResult && (
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.03] p-5">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-blue-400 mb-3">Verification Results</div>
                  <div className="space-y-2">
                    {updateResult.verification?.map((v: any, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 mt-0.5 ${
                          v.status === 'verified' ? 'border-emerald-500/40 text-emerald-400' :
                          v.status === 'questionable' ? 'border-amber-500/40 text-amber-400' :
                          'border-red-500/40 text-red-400'
                        }`}>{v.status}</span>
                        <div>
                          <p className="text-xs text-[#f0f0f5]">{v.change}</p>
                          <p className="text-[10px] text-[#6b7d8d]">{v.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {updateResult.score_impact && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 text-center">
                      <div className={`text-2xl font-bold ${updateResult.score_impact.readiness_delta > 0 ? 'text-emerald-400' : 'text-[#6b7d8d]'}`}>
                        +{updateResult.score_impact.readiness_delta}
                      </div>
                      <div className="text-[9px] text-[#3a4550] mt-1">Readiness Score</div>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 text-center">
                      <div className={`text-2xl font-bold ${updateResult.score_impact.ux_delta > 0 ? 'text-emerald-400' : 'text-[#6b7d8d]'}`}>
                        +{updateResult.score_impact.ux_delta}
                      </div>
                      <div className="text-[9px] text-[#3a4550] mt-1">UX Score</div>
                    </div>
                  </div>
                )}

                {updateResult.resolved_improvements?.length > 0 && (
                  <div>
                    <div className="text-[9px] font-semibold uppercase tracking-widest text-emerald-400 mb-2">Resolved</div>
                    <div className="flex flex-wrap gap-1.5">
                      {updateResult.resolved_improvements.map((r: string, i: number) => (
                        <span key={i} className="text-[11px] px-2.5 py-1 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-400">✓ {r}</span>
                      ))}
                    </div>
                  </div>
                )}

                {updateResult.next_priorities?.length > 0 && (
                  <div>
                    <div className="text-[9px] font-semibold uppercase tracking-widest text-amber-400 mb-2">Next Priorities</div>
                    <div className="space-y-2">
                      {updateResult.next_priorities.map((p: any, i: number) => (
                        <div key={i} className="rounded-lg border border-amber-500/15 bg-amber-500/[0.03] p-3">
                          <p className="text-xs font-medium text-[#f0f0f5]">{p.title}</p>
                          <p className="text-[10px] text-[#6b7d8d] mt-1">{p.why}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── BUILD TAB ────────────────────────────── */}
        {activeTab === "build" && (
        <div>
          {/* Competitor Context Banner */}
          {competitorContext && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-5 mb-8">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-red-400">Building Against: {competitorContext.name} — {competitorContext.price}</div>
                <button onClick={() => setCompetitorContext(null)} className="text-[10px] text-[#3a4550] hover:text-red-400">Dismiss</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-[9px] font-semibold uppercase tracking-widest text-red-400/60 mb-1.5">Their Weakness (from reviews)</div>
                  <p className="text-xs text-[#a8c8d8] leading-relaxed">{competitorContext.weakness}</p>
                </div>
                <div>
                  <div className="text-[9px] font-semibold uppercase tracking-widest text-red-400/60 mb-1.5">Their Features to Beat</div>
                  <div className="space-y-1">
                    {competitorContext.features.map((f) => (
                      <div key={f} className="flex items-start gap-1.5 text-[11px] text-[#6b7d8d]">
                        <span className="text-red-400/40 mt-0.5 shrink-0">—</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

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
        )}
      </div>
    </div>
  );
}
