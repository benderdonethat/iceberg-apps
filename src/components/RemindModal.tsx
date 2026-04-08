import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface RemindModalProps {
  open: boolean;
  onClose: () => void;
  appName: string;
  appSlug: string;
  onSuccess: () => void;
  savedEmail?: string;
}

export default function RemindModal({ open, onClose, appName, appSlug, onSuccess, savedEmail }: RemindModalProps) {
  const [email, setEmail] = useState(savedEmail || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      await fetch("/api/remind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, appName, appSlug }),
      });
      onSuccess();
      onClose();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-card border-border sm:max-w-md w-[calc(100%-2rem)] p-6">
        <DialogHeader>
          <DialogTitle className="text-foreground text-lg">
            Get notified when <span className="text-primary">{appName}</span> drops
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
          <input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          {error && <p className="text-sm text-muted-foreground">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 min-h-[44px]"
          >
            {loading ? "Submitting…" : "Remind Me"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
