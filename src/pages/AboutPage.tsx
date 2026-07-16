import { Button } from "@/components/common/Button";

export function AboutPage() {
  return (
    <div className="pp-container mx-auto max-w-2xl safe-px pp-section">
      <p className="pp-label">About</p>
      <h1 className="pp-display-md mt-2">About PlayPort</h1>
      <div className="mt-6 space-y-4 text-[var(--fg-muted)] leading-relaxed">
        <p>
          PlayPort is a mobile-first browser game arcade. Visit the Port, pick a dock, and launch a
          game instantly — no accounts, no downloads, no servers.
        </p>
        <p>
          The platform is built as a static site for GitHub Pages using Vite, React, TypeScript, and
          Tailwind. Action games use Canvas; Cup Pong and Archery use optimised Three.js; Chess uses
          chess.js with a Stockfish-compatible Web Worker.
        </p>
        <p>
          Preferences and high scores stay on your device via localStorage. Nothing is uploaded.
        </p>
      </div>
      <Button to="/port" className="mt-10">
        Enter the Port
      </Button>
    </div>
  );
}
