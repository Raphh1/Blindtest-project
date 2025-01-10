// app/page.tsx
"use client";

import { useAuth } from "./providers/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { GameModes } from "@/components/GameModes";

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
    <div className="min-h-screen bg-zinc-900">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
        <h1 className="text-6xl text-center text-white mb-8">
          BlindGame.io
        </h1>
        <GameModes />
      </div>
    </div>
  );
}