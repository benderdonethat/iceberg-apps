import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface RemindModalProps {
  open: boolean;
  onClose: () => void;
  appName: string;
  appSlug: string;
  onSuccess: (email: string) => void;
  savedEmail?: string;
}

export default function RemindModal({ open, onClose, appName, appSlug, onSuccess, savedEmail }: RemindModalProps) {
  const [email, setEmail] = useState(savedEmail || "");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Simulate success — wire real endpoint later
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
          <DialogTitle className="text-foreground text-lg">
            Get notified when <span className="text-primary">{appName}</span> drops
          </DialogTitle>
        </DialogHeader>
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
