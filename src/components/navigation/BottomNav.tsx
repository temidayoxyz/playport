import { NavLink, useNavigate } from "react-router-dom";
import { Icon, Icons } from "@/components/common/Icon";
import { getRandomGame } from "@/data/games";

const items = [
  { to: "/port", label: "Port", icon: Icons.House, end: true },
  { to: "/port?view=categories", label: "Categories", icon: Icons.Grid, end: false },
  { to: "/settings", label: "Settings", icon: Icons.Settings, end: false },
] as const;

export function BottomNav() {
  const navigate = useNavigate();

  return (
    <nav className="pp-bottom-nav pp-glass border-t md:hidden" aria-label="Port navigation">
      <div className="mx-auto flex h-[var(--bottom-nav-height)] max-w-lg items-center justify-around px-2">
        {items.slice(0, 2).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              [
                "flex min-w-[64px] flex-col items-center justify-center gap-0.5 rounded-[var(--radius-md)] px-3 py-1.5 text-[11px] font-medium transition-colors",
                isActive ? "text-[var(--fg)]" : "text-[var(--fg-muted)]",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                <Icon icon={item.icon} size={22} className={isActive ? "text-[var(--fg)]" : ""} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        <button
          type="button"
          className="flex min-w-[64px] flex-col items-center justify-center gap-0.5 rounded-[var(--radius-md)] px-3 py-1.5 text-[11px] font-semibold text-[var(--on-accent)]"
          aria-label="Surprise me with a random game"
          onClick={() => navigate(getRandomGame().route)}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] shadow-[var(--shadow-sm)] active:scale-95 transition-transform">
            <Icon icon={Icons.Dices} size={20} className="text-[var(--on-accent)]" />
          </span>
          <span className="text-[var(--fg-muted)] font-medium">Random</span>
        </button>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            [
              "flex min-w-[64px] flex-col items-center justify-center gap-0.5 rounded-[var(--radius-md)] px-3 py-1.5 text-[11px] font-medium transition-colors",
              isActive ? "text-[var(--fg)]" : "text-[var(--fg-muted)]",
            ].join(" ")
          }
        >
          {({ isActive }) => (
            <>
              <Icon icon={Icons.Settings} size={22} />
              <span>Settings</span>
              {isActive && <span className="sr-only">current</span>}
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
}
