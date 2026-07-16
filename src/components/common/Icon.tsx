import type { LucideIcon, LucideProps } from "lucide-react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Brain,
  Crosshair,
  Fullscreen,
  Gamepad2,
  Heart,
  LayoutGrid,
  Menu,
  Moon,
  Pause,
  Play,
  Puzzle,
  Settings,
  Sun,
  Type,
  Volume2,
  VolumeX,
  Wind,
} from "lucide-react";

const sizeMap = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
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
  Fullscreen,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Play,
  Pause,
  Heart,
  Wind,
  Board: Brain,
  Words: Type,
  Sports: Crosshair,
  Arcade: Gamepad2,
  Puzzle,
  Grid: LayoutGrid,
} as const;

export type CategoryIconId = "board" | "words" | "sports" | "arcade" | "puzzle";

const categoryIcons: Record<CategoryIconId, LucideIcon> = {
  board: Brain,
  words: Type,
  sports: Crosshair,
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
  const Lucide = categoryIcons[id as CategoryIconId] ?? LayoutGrid;
  return <Icon icon={Lucide} size={size} className={className} />;
}
