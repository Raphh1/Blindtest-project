// app/page.tsx
"use client";

import { useAuth } from "./providers/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { GameModes } from "@/components/GameModes";
import { Scoreboard } from "@/components/ScoreboardCard";

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
        <GameModes />
        <Scoreboard />
      </div>
    </div>
  );
}