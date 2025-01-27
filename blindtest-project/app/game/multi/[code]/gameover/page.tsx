"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ScoreBoard from "@/components/RTScoreboard";
import { useMultiGame } from "../hooks/useMultiGame";

export default function GameOverMultiPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { game, handleCloseGame, isHost } = useMultiGame(user);

  if (!game) return null;

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
      <Card className="bg-zinc-800/50 border-violet-500/20 w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
            Partie terminée !
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
          <ScoreBoard players={game.players} />
          
          <div className="flex flex-col gap-4">
            {isHost ? (
              <Button
                variant="outline"
                size="lg"
                onClick={handleCloseGame}
                className="w-full py-6 text-lg bg-zinc-700/50 border-violet-500/20 hover:bg-violet-600/20 hover:border-violet-500/40 transition-all duration-300"
              >
                Fermer la partie
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push("/")}
                className="w-full py-6 text-lg bg-zinc-700/50 border-violet-500/20 hover:bg-violet-600/20 hover:border-violet-500/40 transition-all duration-300"
              >
                Retour à l&apos;accueil
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}