import type { LucideIcon, LucideProps } from "lucide-react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Brain,
  ChevronLeft,
  CircleHelp,
  Dices,
  Gamepad2,
  Grid3X3,
  Heart,
  House,
  Info,
  Maximize,
  Menu,
  Moon,
  Pause,
  Play,
  Puzzle,
  RotateCcw,
  Search,
  Settings,
  Shuffle,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Swords,
  Target,
  Timer,
  Trophy,
  Type,
  UserRound,
  Users,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

const sizeMap = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 22,
  xl: 24,
} as const;

export type IconSize = keyof typeof sizeMap;

type Props = LucideProps & {
  size?: IconSize | number;
};

function px(size: IconSize | number | undefined): number {
  if (typeof size === "number") return size;
  return sizeMap[size ?? "md"];
}

export function Icon({
  icon: Lucide,
  size = "md",
  strokeWidth = 1.75,
  className = "",
  ...rest
}: Props & { icon: LucideIcon }) {
  return (
    <Lucide
      size={px(size)}
      strokeWidth={strokeWidth}
      className={`shrink-0 ${className}`}
      aria-hidden
      {...rest}
    />
  );
}

export const Icons = {
  VolumeOn: Volume2,
  VolumeOff: VolumeX,
  Moon,
  Sun,
  Menu,
  Settings,
  Fullscreen: Maximize,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  Play,
  Pause,
  Heart,
  House,
  Search,
  Dices,
  Sparkles,
  Shuffle,
  RotateCcw,
  SlidersHorizontal,
  Trophy,
  Timer,
  Users,
  UserRound,
  Grid3X3,
  Swords,
  Target,
  Brain,
  Type,
  CircleHelp,
  Info,
  X,
  Board: Swords,
  Words: Type,
  Sports: Target,
  Arcade: Gamepad2,
  Puzzle,
  Grid: Grid3X3,
} as const;

export type CategoryIconId = "board" | "words" | "sports" | "arcade" | "puzzle";

const categoryIcons: Record<CategoryIconId, LucideIcon> = {
  board: Swords,
  words: Type,
  sports: Target,
  arcade: Gamepad2,
  puzzle: Puzzle,
};

export function CategoryIcon({
  id,
  size = "md",
  className = "",
}: {
  id: CategoryIconId | string;
  size?: IconSize | number;
  className?: string;
}) {
  const Lucide = categoryIcons[id as CategoryIconId] ?? Grid3X3;
  return <Icon icon={Lucide} size={size} className={className} />;
}
