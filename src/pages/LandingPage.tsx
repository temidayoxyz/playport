import { Link } from "react-router-dom";
import { Button } from "@/components/common/Button";
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
      <section className="mx-auto grid max-w-6xl items-center gap-10 safe-px py-12 lg:grid-cols-2 lg:py-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
            PlayPort · Digital Game Terminal
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Your next game is waiting at the Port.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted">
            Choose a category, pick a game, and start playing instantly. No account, no download, no waiting.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/port">Enter the Port</Button>
            <Button variant="secondary" to="/port#games">
              Explore Games
            </Button>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-3 text-sm text-muted sm:grid-cols-3">
            {["Play instantly", "No registration", "Mobile-first", "Computer opponents", "Multiple difficulties", "More games coming"].map(
              (item) => (
                <li key={item} className="rounded-xl surface px-3 py-2">
                  {item}
                </li>
              ),
            )}
          </ul>
        </div>
        <HeroRadar />
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-6xl safe-px py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Now Docking</p>
          <div className="mt-4 grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold">{featured.name}</h2>
              <p className="mt-2 text-muted">{featured.shortDescription}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <span className="rounded-full surface px-3 py-1">
                  {featured.difficulties.find((d) => d.recommended)?.name ?? featured.difficulties[0]?.name}
                </span>
                <span className="rounded-full surface px-3 py-1">
                  {featured.players.includes("local-multiplayer") ? "Solo / Local MP" : "Solo"}
                </span>
                <span className="rounded-full surface px-3 py-1">~{featured.estimatedMinutes} min</span>
              </div>
              <Button to={featured.route} className="mt-6">
                Play {featured.name}
              </Button>
            </div>
            <GameCard game={featured} onRules={() => setRulesGame(featured)} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl safe-px py-14" id="categories">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl font-bold">Category docks</h2>
            <p className="mt-1 text-muted">Five destinations. Ten games ready to board.</p>
          </div>
          <Link to="/port" className="text-sm font-semibold text-[var(--accent)]">
            Open full Port map →
          </Link>
        </div>
        <div className="mt-8 grid gap-6">
          {categories.map((c) => (
            <CategoryDock key={c.id} category={c} />
          ))}
        </div>
      </section>

      <section className="bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-6xl safe-px py-14">
          <h2 className="font-display text-3xl font-bold">New arrivals</h2>
          <p className="mt-1 text-muted">Recently berthed at PlayPort</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {arrivals.map((g) => (
              <GameCard key={g.id} game={g} onRules={() => setRulesGame(g)} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl safe-px py-14">
        <h2 className="font-display text-3xl font-bold">Why PlayPort</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { t: "Play instantly", d: "Hash-routed static site. Tap a card and launch." },
            { t: "No registration", d: "Zero accounts, zero backend, zero waiting rooms." },
            { t: "Mobile-friendly", d: "Touch-first boards with desktop polish." },
            { t: "Computer opponents", d: "From casual AI to Stockfish-backed chess." },
            { t: "Multiple difficulties", d: "Every terminal ships with mode & skill options." },
            { t: "More games coming", d: "The registry is built to grow — new docks open soon." },
          ].map((item) => (
            <div key={item.t} className="rounded-2xl surface p-5">
              <h3 className="font-display font-semibold">{item.t}</h3>
              <p className="mt-2 text-sm text-muted">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {rulesGame && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-3xl surface p-6">
            <h2 className="font-display text-xl font-bold">{rulesGame.name} rules</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
              {rulesGame.rules.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <Button className="mt-5" onClick={() => setRulesGame(null)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
