import type { CategoryDefinition } from "@/types/game";

export const categories: CategoryDefinition[] = [
  {
    id: "board-strategy",
    slug: "board-strategy",
    name: "Board & Strategy",
    shortName: "Board",
    description: "Think ahead with classic mind games and local two-player matches.",
    accent: "#8DA85A",
    icon: "board",
    dockNumber: "01",
  },
  {
    id: "word-games",
    slug: "word-games",
    name: "Word Games",
    shortName: "Words",
    description: "Scramble letters, hunt words, and race the clock.",
    accent: "#C8F04D",
    icon: "words",
    dockNumber: "02",
  },
  {
    id: "sports-skill",
    slug: "sports-skill",
    name: "Sports & Skill",
    shortName: "Sports",
    description: "Aim, charge, and score with touch-friendly skill games.",
    accent: "#F59A51",
    icon: "sports",
    dockNumber: "03",
  },
  {
    id: "arcade-action",
    slug: "arcade-action",
    name: "Arcade & Action",
    shortName: "Arcade",
    description: "Fast reflex classics with computer rivals or local play.",
    accent: "#EF6C58",
    icon: "arcade",
    dockNumber: "04",
  },
  {
    id: "puzzle-logic",
    slug: "puzzle-logic",
    name: "Puzzle & Logic",
    shortName: "Puzzle",
    description: "Calm number grids and tile merges for focused play.",
    accent: "#D8B54A",
    icon: "puzzle",
    dockNumber: "05",
  },
];

export function getCategoryById(id: string): CategoryDefinition | undefined {
  return categories.find((c) => c.id === id || c.slug === id);
}

export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  return categories.find((c) => c.slug === slug);
}
