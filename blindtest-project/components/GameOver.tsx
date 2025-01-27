"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams, useRouter } from "next/navigation";
import { Crown } from "lucide-react";

interface Player {
  name: string;
  points: number;
}

export default function GameOver() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const players: Player[] = JSON.parse(searchParams.get("players") || "[]");

  // Trier les joueurs par points décroissants
  const sortedPlayers = [...players].sort((a, b) => b.points - a.points);

  if (sortedPlayers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Aucun joueur trouvé. Veuillez vérifier les données transmises.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center p-8">
      {/* Titre principal */}
      <h1 className="text-7xl font-extrabold text-center text-white bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent mb-12">
        Partie terminée !
      </h1>

      {/* Card du podium */}
      <Card className="bg-zinc-800/50 border-violet-500/20 w-full max-w-[90%] p-20 shadow-2xl">
        <CardContent className="flex flex-col items-center space-y-20">
          {/* Podium */}
          <div className="flex items-end justify-center gap-24">
            {sortedPlayers[1] && (
              <div className="flex flex-col items-center">
                <div className="text-5xl text-zinc-200 mb-8">
                  {sortedPlayers[1].name}
                </div>
                <div className="bg-zinc-700 text-white py-12 px-16 rounded-lg h-48 flex flex-col items-center justify-center">
                  <span className="text-3xl font-semibold">2e</span>
                  <span className="text-4xl">{sortedPlayers[1].points} pts</span>
                </div>
              </div>
            )}

            {sortedPlayers[0] && (
              <div className="flex flex-col items-center">
                <Crown className="w-20 h-20 text-yellow-400 mb-8" />
                <div className="text-6xl font-bold text-white mb-8">
                  {sortedPlayers[0].name}
                </div>
                <div className="bg-violet-600 text-white py-16 px-20 rounded-lg h-64 flex flex-col items-center justify-center shadow-lg shadow-violet-500/50">
                  <span className="text-4xl font-bold">1er</span>
                  <span className="text-5xl">{sortedPlayers[0].points} pts</span>
                </div>
              </div>
            )}

            {sortedPlayers[2] && (
              <div className="flex flex-col items-center">
                <div className="text-5xl text-zinc-200 mb-8">
                  {sortedPlayers[2].name}
                </div>
                <div className="bg-zinc-700 text-white py-12 px-16 rounded-lg h-40 flex flex-col items-center justify-center">
                  <span className="text-3xl font-semibold">3e</span>
                  <span className="text-4xl">{sortedPlayers[2].points} pts</span>
                </div>
              </div>
            )}
          </div>

          {/* Bouton de retour à l'accueil */}
          <div className="w-full flex justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/")}
              className="py-8 px-16 text-3xl bg-zinc-700/50 border-violet-500/20 hover:bg-violet-600/20 hover:border-violet-500/40 transition-all duration-300 text-white"
            >
              Retour à l&apos;accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
