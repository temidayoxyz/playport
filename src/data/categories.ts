import type { CategoryDefinition } from "@/types/game";

export const categories: CategoryDefinition[] = [
  {
    id: "board-strategy",
    slug: "board-strategy",
    name: "Board & Strategy",
    shortName: "Board",
    description:
      "Think ahead at Dock Alpha — classic mind games with sharp computer opponents and local two-player tables.",
    accent: "#a78bfa",
    icon: "board",
    dockNumber: "A-01",
    comingSoonLabel: "More strategy tables arriving",
  },
  {
    id: "word-games",
    slug: "word-games",
    name: "Word Games",
    shortName: "Words",
    description:
      "Language terminals at Dock Bravo — scramble letters, hunt words, and race the clock with a local dictionary.",
    accent: "#a3e635",
    icon: "words",
    dockNumber: "B-02",
    comingSoonLabel: "Additional word packs docking soon",
  },
  {
    id: "sports-skill",
    slug: "sports-skill",
    name: "Sports & Skill",
    shortName: "Sports",
    description:
      "Skill range at Dock Charlie — 3D cup tosses and archery challenges tuned for touch and precision.",
    accent: "#fb923c",
    icon: "sports",
    dockNumber: "C-03",
    comingSoonLabel: "Future sports terminal under construction",
  },
  {
    id: "arcade-action",
    slug: "arcade-action",
    name: "Arcade & Action",
    shortName: "Arcade",
    description:
      "Fast gates at Dock Delta — pure reflex classics with AI rivals and local co-op on one screen.",
    accent: "#67e8f9",
    icon: "arcade",
    dockNumber: "D-04",
    comingSoonLabel: "More action bays opening soon",
  },
  {
    id: "puzzle-logic",
    slug: "puzzle-logic",
    name: "Puzzle & Logic",
    shortName: "Puzzle",
    description:
      "Quiet focus at Dock Echo — number grids and tile merges for calm challenge sessions.",
    accent: "#f472b6",
    icon: "puzzle",
    dockNumber: "E-05",
    comingSoonLabel: "New puzzle berths approaching",
  },
];

export function getCategoryById(id: string): CategoryDefinition | undefined {
  return categories.find((c) => c.id === id || c.slug === id);
}

export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  return categories.find((c) => c.slug === slug);
}
