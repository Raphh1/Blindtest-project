// app/page.tsx
"use client";

import { useAuth } from "./providers/AuthProvider";
import { Navbar } from "./components/ui/Navbar";
import { HomeModeSelector } from "./components/HomeModeSelector";

export default function HomePage() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Chargement...
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center h-screen">
        <HomeModeSelector />
      </div>
    </div>
  );
}