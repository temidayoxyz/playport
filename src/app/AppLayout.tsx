import { Outlet, useLocation } from "react-router-dom";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { BottomNav } from "@/components/navigation/BottomNav";

export function AppLayout() {
  const location = useLocation();
  const isGame = location.pathname.startsWith("/game/");
  const isLanding = location.pathname === "/";
  const showPortChrome =
    !isGame &&
    (location.pathname.startsWith("/port") ||
      location.pathname.startsWith("/category") ||
      location.pathname.startsWith("/settings"));
  const showFooter = isLanding || location.pathname.startsWith("/about");

  return (
    <div className="flex min-h-dvh flex-col">
      {!isGame && <Header />}
      <main className={`flex-1 ${showPortChrome ? "safe-pb-nav md:pb-0" : ""}`}>
        <Outlet />
      </main>
      {showFooter && <Footer />}
      {showPortChrome && <BottomNav />}
    </div>
  );
}
