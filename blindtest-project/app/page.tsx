"use client";

import { useAuth } from "./providers/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { GameModes } from "@/components/GameModes";
import Scoreboard from "@/components/Scoreboard"; 
import { useEffect, useState } from "react";

export default function HomePage() {
  const { loading } = useAuth();
  const [globalScores, setGlobalScores] = useState<Record<string, number>>({});

  useEffect(() => {
    const storedScores = JSON.parse(localStorage.getItem("globalScores") || "{}");
    setGlobalScores(storedScores);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Chargement...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-zinc-900">
      <Navbar />
      <div className="absolute top-20 right-20 bg-zinc-800  p-4 rounded-lg shadow-lg max-w-xs w-full">
        <h3 className="text-lg font-bold text-white mb-2">Scoreboard en local</h3>
        <Scoreboard globalScores={globalScores} />
      </div>
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
        <h1 className="text-6xl text-center text-white mb-8">BlindGame.io</h1>
        <GameModes />
      </div>
    </div>
  );
}
