# PlayPort

**Pick a game. Enter the Port. Start playing.**

PlayPort is a mobile-first browser game arcade. Visit [The Port](#the-port), choose a category dock, launch a game, and play instantly — no account, no download, no backend.

A growing collection of games you can play in the browser. Deployable as a static site on **GitHub Pages**.

---

## Features

- **The Port** — immersive game discovery with search, filters, featured docks, recently played, and Surprise Me
- **Five category docks** with distinct accents and personalities
- **Ten complete games** with modes, difficulties, rules, and tutorials
- **Shared game shell** — pause, restart, sound, fullscreen, end screens
- **Local settings** — theme, audio, reduced motion, high contrast, performance quality
- **Lazy-loaded games** — Three.js and chess engine never ship in the landing-page bundle
- **Touch-first** controls with keyboard/mouse support
- **HashRouter** routing for reliable GitHub Pages refreshes
- **Vitest** coverage for core game logic

---

## Games

| # | Game | Category | Tech |
|---|------|----------|------|
| 1 | Tic-Tac-Toe | Board & Strategy | React |
| 2 | Chess | Board & Strategy | React + chess.js + Stockfish worker |
| 3 | Anagram Rush | Word Games | React |
| 4 | Word Hunt | Word Games | React + Trie |
| 5 | Cup Pong | Sports & Skill | React Three Fiber |
| 6 | Archery | Sports & Skill | React Three Fiber |
| 7 | Pong | Arcade & Action | Canvas |
| 8 | Snake Duel | Arcade & Action | Canvas |
| 9 | Sudoku | Puzzle & Logic | React |
| 10 | 2048 | Puzzle & Logic | React |

### Categories

| Dock | Name | Accent |
|------|------|--------|
| A-01 | Board & Strategy | Violet |
| B-02 | Word Games | Lime |
| C-03 | Sports & Skill | Orange |
| D-04 | Arcade & Action | Cyan |
| E-05 | Puzzle & Logic | Pink |

---

## Technology stack

- Vite · React · TypeScript · Tailwind CSS v4
- React Router (`HashRouter`)
- Zustand
- Three.js / `@react-three/fiber` / `@react-three/drei` (Cup Pong, Archery only)
- chess.js + Stockfish-compatible Web Worker
- Web Audio API (procedural UI tones)
- Vitest · React Testing Library
- GitHub Actions → GitHub Pages

---

## Local development

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173/playport/`).

```bash
npm run build    # production build to dist/
npm run preview  # preview the production build
npm test         # run unit tests
npm run format   # Prettier
```

---

## GitHub Pages deployment

1. Push this repository to GitHub (repo name `playport` recommended so the base path matches).
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main` (or `master`). The workflow in `.github/workflows/deploy.yml` builds and deploys `dist/`.
4. Site URL: `https://<username>.github.io/playport/`

### Base path

`vite.config.ts` sets:

```ts
base: "/playport/"
```

If your repository has a different name, change `base` to `/<repo-name>/` and update the favicon path in `index.html` if needed.

### Routing

PlayPort uses **HashRouter** (`/#/port`, `/#/game/chess`, …) so every deep link works after refresh on static hosting without a custom `404.html` rewrite.

---

## Folder structure

```text
src/
├── app/                 # App shell, router, providers
├── assets/              # Static media (optional)
├── components/          # Shared UI (nav, port, game-shell, settings)
├── data/                # Categories, game registry, word lists
├── games/               # One folder per game
│   └── <game>/
│       ├── components/
│       ├── engine/
│       ├── tests/
│       ├── Game.tsx
│       ├── config.ts
│       └── …
├── hooks/
├── lib/                 # audio, storage, performance, accessibility
├── pages/
├── stores/              # Zustand settings + progress
├── styles/
├── types/
├── workers/             # (optional) additional workers
└── tests/
public/
└── engines/             # Stockfish worker script
```

---

## Game registry

All discovery UI is driven by `src/data/games.ts`.

Each `GameDefinition` includes id, slug, copy, category, modes, difficulties, rules, tutorial, technology tags, and a **lazy** `component` import.

Homepage, Port, and category pages read from this registry. Adding a game should not require rewriting those screens.

---

## How to add a new game

1. **Copy a template** — e.g. clone `src/games/tic-tac-toe/` into `src/games/my-game/`.
2. **Implement** `engine/` logic and `Game.tsx` accepting `GameShellProps`.
3. **Define** modes, difficulties, rules, and tutorial in `config.ts`.
4. **Register** the game in `src/data/games.ts` with `lazy(() => import("@/games/my-game/Game"))`.
5. **Add** illustration handling in `GameIllustration` (or reuse a generic style).
6. **Write** Vitest coverage for pure engine logic.
7. **Confirm** mobile touch targets and gesture `touch-action`.
8. **Confirm** lazy loading (no eager import from landing page).
9. **Confirm** cleanup of timers, workers, rAF, and WebGL on unmount.
10. **Build and deploy** with `npm run build` and the Pages workflow.

---

## Local settings & persistence

Settings and progress use **safe localStorage wrappers** (`src/lib/storage/safeStorage.ts`):

- Theme, sound, accessibility, performance quality
- Recently played games
- Local high scores
- Tutorial completion flags
- Per-game mode/difficulty preferences

If storage is unavailable or quota fails, the app falls back to in-memory maps and continues to work.

There are **no** global leaderboards and **no** accounts.

---

## Three.js performance

Cup Pong and Archery:

- Cap device pixel ratio via the performance quality setting (`auto` / `high` / `balanced` / `low`)
- Simple geometry and procedural materials
- No post-processing, no large textures
- Pause-friendly UI; lightweight flight loops
- WebGL feature detection with a friendly fallback message
- Three.js is code-split into a separate vendor chunk and only loaded when those routes mount

---

## Stockfish loading

Chess uses `chess.js` on the main thread for rules and UI.

Engine search runs in `public/engines/stockfish-worker.js` via `StockfishEngine` (`src/games/chess/engine/stockfishEngine.ts`):

- Worker speaks a UCI-compatible protocol
- Skill / depth / movetime map from difficulty
- If the worker cannot produce a move, the client falls back to a legal-move selection path so chess stays playable offline
- To plug in a full Stockfish WASM build, place `stockfish.js` / `stockfish.wasm` beside the worker and enable loading in that script

The worker is **terminated** when leaving the chess game.

---

## Browser support

- Modern Chromium, Firefox, Safari (last two major versions)
- WebGL required for Cup Pong and Archery
- WebAssembly recommended for a full Stockfish binary (optional fallback exists)
- Touch and mouse/keyboard as appropriate per game

### Known limitations

- Chess full engine strength depends on the Stockfish binary you ship; the portable worker stub is UCI-compatible for messaging and tests
- Procedural Web Audio tones are intentionally minimal (no large music packs)
- No online multiplayer in v1
- localStorage is device-local and not durable across browsers/profiles

---

## Attribution

Open-source packages used under their respective licences, including:

- React, React DOM, React Router
- Vite, TypeScript, Tailwind CSS
- Zustand
- Three.js, React Three Fiber, Drei
- chess.js
- Vitest, Testing Library
- Phaser is listed as an optional stack dependency for future 2D titles; v1 arcade games use Canvas for a smaller mobile bundle

Fonts: [Outfit](https://fonts.google.com/specimen/Outfit) and [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) via Google Fonts.

---

## Licence

MIT — see [LICENSE](./LICENSE).

PlayPort names, UI copy, and illustrations are original. Do not copy commercial game branding.
