import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/app/AppLayout";
import { LandingPage } from "@/pages/LandingPage";
import { PortPage } from "@/pages/PortPage";
import { CategoryPage } from "@/pages/CategoryPage";
import { GamePage } from "@/pages/GamePage";
import { AboutPage } from "@/pages/AboutPage";
import { HowToPlayPage } from "@/pages/HowToPlayPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="port" element={<PortPage />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="game/:slug" element={<GamePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="how-to-play" element={<HowToPlayPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
