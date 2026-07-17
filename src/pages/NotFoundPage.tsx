import { Button } from "@/components/common/Button";

export function NotFoundPage() {
  return (
    <div className="pp-container mx-auto max-w-md safe-px py-20 text-center">
      <p className="pp-label">404</p>
      <h1 className="pp-display-md mt-2">Page not found</h1>
      <p className="mt-2 text-sm text-[var(--fg-muted)]">
        That destination is not available. Head back to the Port.
      </p>
      <Button to="/port" className="mt-8">
        Return to Port
      </Button>
    </div>
  );
}
