import { Button } from "@/components/common/Button";

export function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl safe-px py-12">
      <h1 className="font-display text-4xl font-bold">About PlayPort</h1>
      <p className="mt-4 text-muted">
        PlayPort is a mobile-first browser game arcade. Visit the Port, pick a dock, and launch a game
        instantly — no accounts, no downloads, no servers.
      </p>
      <p className="mt-4 text-muted">
        The platform is built as a static site for GitHub Pages using Vite, React, TypeScript, and
        Tailwind. Action games use Canvas; Cup Pong and Archery use optimised Three.js; Chess uses
        chess.js with a Stockfish-compatible Web Worker.
      </p>
      <p className="mt-4 text-muted">
        Preferences and high scores stay on your device via localStorage. Nothing is uploaded.
      </p>
      <Button to="/port" className="mt-8">
        Enter the Port
      </Button>
    </div>
  );
}
