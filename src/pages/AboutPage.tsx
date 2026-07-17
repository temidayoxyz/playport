import { Button } from "@/components/common/Button";

export function AboutPage() {
  return (
    <div className="pp-container mx-auto max-w-2xl safe-px pp-section">
      <p className="pp-label">About</p>
      <h1 className="pp-display-md mt-2">About PlayPort</h1>
      <div className="mt-6 space-y-4 text-[var(--fg-muted)] leading-relaxed">
        <p>
          PlayPort is a collection of lightweight games in one clean browser app. Enter the Port,
          choose a game, and start playing — no accounts, no downloads.
        </p>
        <p>
          Preferences and local best scores stay on this device only. Nothing is uploaded.
        </p>
        <p>More games will open at the Port over time.</p>
      </div>
      <Button to="/port" className="mt-10">
        Enter the Port
      </Button>
    </div>
  );
}
