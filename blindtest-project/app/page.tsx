"use client";

import { useAuth } from "./providers/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { GameModes } from "@/components/GameModes";
import ScoreTable from "@/components/ScoreTable";

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
    <div className="relative min-h-screen bg-zinc-900 overflow-hidden">
      <div className="dots absolute inset-0 z-0"></div>

      <Navbar />
      <div className="relative flex flex-col items-center justify-center h-[calc(100vh-64px)] z-10">
        <h1 className="text-6xl text-center text-white mb-8">BlindGame.io</h1>
        <div className="flex flex-col items-center space-y-2">
          <GameModes />
          <div className="w-full max-w-4xl">
            <ScoreTable />
          </div>
        </div>
      </div>
    </div>
  );
}
