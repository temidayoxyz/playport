import { Button } from "@/components/common/Button";

export function NotFoundPage() {
  return (
    <div className="pp-container mx-auto max-w-lg safe-px py-20 text-center">
      <p className="pp-label">Signal lost</p>
      <h1 className="pp-display-sm mt-2">This route is not at the Port</h1>
      <p className="mt-3 text-[var(--fg-muted)]">
        The terminal you requested does not exist or has not docked yet.
      </p>
      <Button to="/port" className="mt-8">
        Return to Port
      </Button>
    </div>
  );
}
