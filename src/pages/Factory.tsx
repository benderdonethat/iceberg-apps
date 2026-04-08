import { useState } from "react";
import icebergLogo from "@/assets/hero-iceberg.png";

const categories = ["Team", "Ops", "Sales", "Productivity", "Streaming", "Other"] as const;
const pricingOptions = ["Free", "Freemium", "Paid"] as const;

const emojiSuggestions = [
  "🧾", "⏱️", "🎣", "💸", "📅", "🤝", "🧍", "🚀", "🏆", "🔄",
  "🏖️", "😊", "📊", "🎫", "📋", "🎯", "💰", "📄", "🤑", "💼",
  "📝", "📖", "🔗", "🔔", "📢", "🚢", "💬", "🔐", "🔌", "🎤",
  "🤖", "⚡", "🛡️", "🎮", "📡", "🧊", "🔥", "💎", "🎯", "🧲",
  "📦", "🏗️", "🛒", "🎁", "📈", "🧪", "🗂️", "✅", "🪝", "🌊",
];

const pricingColors: Record<string, string> = {
  Free: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  Freemium: "border-cyan-500/40 bg-cyan-500/10 text-cyan-400",
  Paid: "border-amber-500/40 bg-amber-500/10 text-amber-400",
};

export default function Factory() {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🤖");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState<string>("Team");
  const [pricing, setPricing] = useState<string>("Free");
  const [features, setFeatures] = useState(["", "", "", ""]);
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<string>("roadmap");
  const [copied, setCopied] = useState(false);

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const updateFeature = (i: number, val: string) => {
    const next = [...features];
    next[i] = val;
    setFeatures(next);
  };

  const addFeature = () => setFeatures([...features, ""]);
  const removeFeature = (i: number) => setFeatures(features.filter((_, idx) => idx !== i));

  const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);

  const output = `  {
    name: "${name}",
    slug: "${slug}",
    emoji: "${emoji}",
    desc: "${desc}",
    features: [${features.filter(Boolean).map((f) => `"${f}"`).join(", ")}],
    pricing: "${pricing}",
    category: "${category}",
    tags: [${tagList.map((t) => `"${t}"`).join(", ")}],
    status: "${status}",
  },`;

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#080a10] text-[#f0f0f5]">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#080a10]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <img src={icebergLogo} alt="logo" className="w-10 h-10 rounded-lg object-cover" />
          <div>
            <h1 className="text-lg font-bold tracking-tight">App Factory</h1>
            <p className="text-xs text-[#6b7d8d]">igotminimoney.com — build dashboard</p>
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
            {/* Name + Emoji */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-[#4dd4e6] mb-2 block">App Name</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Standup Bot"
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-[#f0f0f5] placeholder:text-[#3a4550] focus:outline-none focus:border-[#4dd4e6]/50 text-sm"
                />
              </div>
              {slug && <p className="text-[10px] text-[#3a4550] mt-1.5 font-mono">slug: {slug}</p>}
            </div>

            {/* Emoji Picker */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-[#4dd4e6] mb-2 block">Emoji</label>
              <div className="flex flex-wrap gap-1.5 p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                {emojiSuggestions.map((e) => (
                  <button
                    key={e}
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

            {/* Features */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-[#4dd4e6] mb-2 block">Features</label>
              <div className="space-y-2">
                {features.map((f, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-[#3a4550] text-xs mt-3 w-4 text-right shrink-0">{i + 1}.</span>
                    <input
                      type="text"
                      value={f}
                      onChange={(e) => updateFeature(i, e.target.value)}
                      placeholder={`Feature ${i + 1}`}
                      className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-[#f0f0f5] placeholder:text-[#3a4550] focus:outline-none focus:border-[#4dd4e6]/50"
                    />
                    {features.length > 1 && (
                      <button onClick={() => removeFeature(i)} className="text-[#3a4550] hover:text-red-400 text-xs px-1">✕</button>
                    )}
                  </div>
                ))}
              </div>
              {features.length < 8 && (
                <button onClick={addFeature} className="mt-2 text-xs text-[#4dd4e6] hover:text-[#4dd4e6]/80 font-medium">
                  + Add feature
                </button>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-[#4dd4e6] mb-2 block">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Freelancers, Billing, Free (comma separated)"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-[#f0f0f5] placeholder:text-[#3a4550] focus:outline-none focus:border-[#4dd4e6]/50 text-sm"
              />
              {tagList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tagList.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-[#6b7d8d]">{t}</span>
                  ))}
                </div>
              )}
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
                  {tagList.length > 0 ? tagList.map((t) => (
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
            {features.some(Boolean) && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-[#4dd4e6] mb-3 block">Feature Preview</label>
                <div className="rounded-2xl border border-white/10 bg-[#0c0e16] p-6">
                  <div className="space-y-2.5">
                    {features.filter(Boolean).map((f) => (
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
