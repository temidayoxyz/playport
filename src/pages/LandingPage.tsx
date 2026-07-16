import { Link } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { Icon, Icons } from "@/components/common/Icon";
import { HeroRadar } from "@/components/port/HeroRadar";
import { CategoryDock } from "@/components/port/CategoryDock";
import { GameCard } from "@/components/port/GameCard";
import { categories } from "@/data/categories";
import { getFeaturedGames, getNewGames, games } from "@/data/games";
import { useState } from "react";
import type { GameDefinition } from "@/types/game";

export function LandingPage() {
  const featured = getFeaturedGames()[0] ?? games[0]!;
  const arrivals = getNewGames();
  const [rulesGame, setRulesGame] = useState<GameDefinition | null>(null);

  return (
    <div>
      {/* Hero */}
      <section className="pp-container grid items-center gap-12 safe-px pp-section lg:grid-cols-2">
        <div>
          <p className="pp-label text-[var(--accent)]">PlayPort · Digital Game Terminal</p>
          <h1 className="pp-display-xl mt-4">Your next game is waiting at the Port.</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--fg-muted)]">
            Choose a category, pick a game, and start playing instantly. No account, no download, no
            waiting.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/port">Enter the Port</Button>
            <Button variant="secondary" to="/port#games">
              Explore Games
            </Button>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-4 border-t border-[var(--border)] pt-8">
            {[
              { n: "10", l: "Games" },
              { n: "5", l: "Docks" },
              { n: "0", l: "Accounts" },
            ].map((s) => (
              <div key={s.l}>
                <p className="pp-stat">{s.n}</p>
                <p className="mt-1 text-sm text-[var(--fg-muted)]">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <HeroRadar />
      </section>

      {/* Featured — yellow band */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-soft)]">
        <div className="pp-container safe-px pp-section">
          <p className="pp-label">Now Docking</p>
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2">
            <div>
              <h2 className="pp-display-md">{featured.name}</h2>
              <p className="mt-3 text-[var(--fg-muted)] leading-relaxed">{featured.shortDescription}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="pp-badge">
                  {featured.difficulties.find((d) => d.recommended)?.name ??
                    featured.difficulties[0]?.name}
                </span>
                <span className="pp-badge">
                  {featured.players.includes("local-multiplayer") ? "Solo / Local MP" : "Solo"}
                </span>
                <span className="pp-badge">~{featured.estimatedMinutes} min</span>
              </div>
              <Button to={featured.route} className="mt-8">
                Play {featured.name}
              </Button>
            </div>
            <GameCard game={featured} onRules={() => setRulesGame(featured)} />
          </div>
        </div>
      </section>

      {/* Category docks */}
      <section className="pp-container safe-px pp-section" id="categories">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="pp-label">Destinations</p>
            <h2 className="pp-display-lg mt-2">Category docks</h2>
            <p className="mt-2 text-[var(--fg-muted)]">Five destinations. Ten games ready to board.</p>
          </div>
          <Link
            to="/port"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] underline-offset-4"
          >
            Open full Port map
            <Icon icon={Icons.ArrowRight} size="sm" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6">
          {categories.map((c) => (
            <CategoryDock key={c.id} category={c} />
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="bg-[var(--bg-soft)]">
        <div className="pp-container safe-px pp-section">
          <p className="pp-label">Fleet update</p>
          <h2 className="pp-display-lg mt-2">New arrivals</h2>
          <p className="mt-2 text-[var(--fg-muted)]">Recently berthed at PlayPort</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {arrivals.map((g) => (
              <GameCard key={g.id} game={g} onRules={() => setRulesGame(g)} />
            ))}
          </div>
        </div>
      </section>

      {/* Why — feature cards */}
      <section className="pp-container safe-px pp-section">
        <p className="pp-label">Why PlayPort</p>
        <h2 className="pp-display-lg mt-2">Built for instant play</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { t: "Play instantly", d: "Hash-routed static site. Tap a card and launch." },
            { t: "No registration", d: "Zero accounts, zero backend, zero waiting rooms." },
            { t: "Mobile-first", d: "Touch-first boards with desktop polish." },
            { t: "Computer opponents", d: "From casual AI to Stockfish-backed chess." },
            { t: "Multiple difficulties", d: "Every terminal ships with mode & skill options." },
            { t: "More games coming", d: "The registry grows — new docks open soon." },
          ].map((item) => (
            <div key={item.t} className="pp-card pp-card-pad">
              <h3 className="pp-title-md">{item.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Yellow CTA band */}
      <section className="pp-container safe-px pb-[var(--space-section)]">
        <div className="pp-card-yellow p-10 sm:p-16">
          <p className="text-xs font-semibold uppercase tracking-[1.5px] text-[var(--on-accent)]/70">
            Ready to board
          </p>
          <h2 className="pp-display-md mt-3 !text-[var(--on-accent)]">
            Pick a game. Enter the Port. Start playing.
          </h2>
          <p className="mt-3 max-w-xl text-[var(--on-accent)]/80">
            A growing collection of games you can play instantly — no account, no download, no waiting.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="on-yellow" to="/port">
              Enter the Port
            </Button>
            <Button
              to="/how-to-play"
              className="!bg-transparent !text-[var(--on-accent)] !border-[var(--on-accent)]/25"
            >
              How to Play
            </Button>
          </div>
        </div>
      </section>

      {rulesGame && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-elevated)] p-6">
            <h2 className="pp-title-lg">{rulesGame.name} rules</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--fg-muted)]">
              {rulesGame.rules.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <Button className="mt-6" onClick={() => setRulesGame(null)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
