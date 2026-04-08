import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface RemindModalProps {
  open: boolean;
  onClose: () => void;
  appName: string;
  appSlug: string;
  onSuccess: (email: string) => void;
  savedEmail?: string;
  features?: string[];
  pricing?: string;
  emoji?: string;
}

const pricingStyles: Record<string, string> = {
  Free: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Freemium: "bg-primary/10 text-primary border-primary/20",
  Paid: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function RemindModal({ open, onClose, appName, appSlug, onSuccess, savedEmail, features, pricing, emoji }: RemindModalProps) {
  const [email, setEmail] = useState(savedEmail || "");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setDone(true);
    setLoading(false);
    onSuccess(email);
    setTimeout(() => onClose(), 1200);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-card border-border sm:max-w-md w-[calc(100%-2rem)] p-6">
        <DialogHeader>
          <DialogTitle className="text-foreground text-lg flex items-center gap-2">
            {emoji && <span className="text-2xl">{emoji}</span>}
            <span>
              Get notified when <span className="text-primary">{appName}</span> drops
            </span>
          </DialogTitle>
        </DialogHeader>

        {features && features.length > 0 && (
          <div className="mt-1 mb-2">
            {pricing && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border inline-block mb-3 ${pricingStyles[pricing] || ""}`}>
                {pricing}
              </span>
            )}
            <ul className="space-y-1.5">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5 shrink-0 text-xs">✦</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {done ? (
          <div className="py-6 text-center">
            <div className="text-3xl mb-2">✓</div>
            <p className="text-emerald-400 font-medium">You'll be notified!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
            <input
              type="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 min-h-[44px]"
            >
              {loading ? "Submitting…" : "Remind Me"}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
