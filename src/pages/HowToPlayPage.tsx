import { Link } from "react-router-dom";
import { Button } from "@/components/common/Button";

export function HowToPlayPage() {
  return (
    <div className="pp-container mx-auto max-w-2xl safe-px pp-section">
      <p className="pp-label">Guide</p>
      <h1 className="pp-display-md mt-2">How it works</h1>
      <ol className="mt-8 space-y-6">
        {[
          {
            n: "1",
            t: "Enter the Port",
            d: "Find all available games in one focused place.",
          },
          {
            n: "2",
            t: "Choose your play",
            d: "Select a mode, difficulty, and the options that suit you.",
          },
          {
            n: "3",
            t: "Start instantly",
            d: "Launch the game without registration or unnecessary setup.",
          },
        ].map((step) => (
          <li key={step.n} className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-[var(--on-accent)]">
              {step.n}
            </span>
            <div>
              <h2 className="pp-title-md">{step.t}</h2>
              <p className="mt-1 text-sm text-[var(--fg-muted)]">{step.d}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-8 text-sm text-[var(--fg-muted)]">
        Prefer the short version?{" "}
        <Link to="/" className="font-semibold text-[var(--fg)] underline underline-offset-3">
          Back to home
        </Link>
      </p>
      <Button to="/port" className="mt-8">
        Enter the Port
      </Button>
    </div>
  );
}
