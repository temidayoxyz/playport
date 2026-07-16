import { Button } from "@/components/common/Button";

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-lg safe-px py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Signal lost</p>
      <h1 className="mt-2 font-display text-3xl font-bold">This route is not at the Port</h1>
      <p className="mt-3 text-muted">The terminal you requested does not exist or has not docked yet.</p>
      <Button to="/port" className="mt-6">
        Return to Port
      </Button>
    </div>
  );
}
