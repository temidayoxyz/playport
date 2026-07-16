import { Outlet, useLocation } from "react-router-dom";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";

export function AppLayout() {
  const location = useLocation();
  const isGame = location.pathname.startsWith("/game/");

  return (
    <div className="flex min-h-dvh flex-col">
      {!isGame && <Header />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isGame && <Footer />}
    </div>
  );
}
