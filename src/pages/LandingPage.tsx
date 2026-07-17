import { Button } from "@/components/common/Button";
import { PortSignal } from "@/components/port/PortSignal";
import { HowItWorksDemo } from "@/components/port/HowItWorksDemo";

export function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="pp-container grid items-center gap-10 safe-px pt-8 pb-12 md:min-h-[calc(100dvh-3.5rem)] md:grid-cols-2 md:gap-12 md:py-12">
        <div className="order-1">
          <h1 className="pp-display-xl">Games ready when you are.</h1>
          <p className="mt-4 max-w-md text-[16px] leading-relaxed text-[var(--fg-body)] md:text-[17px]">
            Enter the Port, choose what you want to play, and start instantly.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button to="/port" size="lg">
              Enter the Port
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              See how it works
            </Button>
          </div>
        </div>
        <div className="order-2">
          <PortSignal />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-[var(--border)] bg-[var(--bg-elevated)]">
        <div className="pp-container safe-px pp-section">
          <div className="mx-auto max-w-2xl text-center">
            <p className="pp-label">How it works</p>
            <h2 className="pp-display-md mt-2">Three steps. Zero setup.</h2>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-center">
            <ol className="space-y-6">
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
                    <h3 className="pp-title-md">{step.t}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--fg-muted)]">{step.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <HowItWorksDemo />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pp-container safe-px pp-section">
        <div className="pp-cta-panel text-center">
          <h2 className="pp-display-md">Your next game is inside.</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--fg-body)]">
            Choose a game and start playing. No account required.
          </p>
          <Button to="/port" size="lg" className="mt-6">
            Enter the Port
          </Button>
        </div>
      </section>
    </div>
  );
}
