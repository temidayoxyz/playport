# PlayPort

**Games ready when you are.**

PlayPort is a mobile-first browser gaming platform. Enter the Port, choose a game, configure mode and difficulty, and start playing instantly — no account, no download.

Deployable as a static site on **GitHub Pages**.

---

## Features

- **Landing** — concise product introduction with Port Signal animation (no game catalogue)
- **The Port** — app-like discovery with search, category chips, filters, recently played, and Surprise Me
- **Five categories** with restrained accent colours
- **Ten complete games** with modes, difficulties, setup sheets, pause, and results
- **Shared design system** — glass surfaces, Lucide icons, light/dark themes
- **Local preferences** — theme, sound, reduced motion, high contrast, device scores
- **Lazy-loaded games** — each game loads only when selected
- **HashRouter** for reliable GitHub Pages refreshes
- **Vitest** coverage for core game logic

---

## Games

| Game | Category | Rendering |
|------|----------|-----------|
| Tic-Tac-Toe | Board & Strategy | React |
| Chess | Board & Strategy | React |
| Anagram Rush | Word Games | React |
| Word Hunt | Word Games | React |
| Cup Pong | Sports & Skill | Canvas 2D |
| Archery | Sports & Skill | Canvas 2D |
| Pong | Arcade & Action | Canvas |
| Snake Duel | Arcade & Action | Canvas |
| Sudoku | Puzzle & Logic | React |
| 2048 | Puzzle & Logic | React |

### Categories

| Name | Accent |
|------|--------|
| Board & Strategy | Moss |
| Word Games | Lime |
| Sports & Skill | Tangerine |
| Arcade & Action | Coral |
| Puzzle & Logic | Gold |

---

## Technology stack

- Vite · React · TypeScript · Tailwind CSS v4
- React Router (`HashRouter`)
- Zustand
- Canvas 2D (Cup Pong, Archery, Pong, Snake)
- chess.js + optional computer opponent worker
- Lucide icons
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

## Deploy

Push to `main` triggers GitHub Pages via `.github/workflows/deploy.yml`.

Site base path: `/playport/`
