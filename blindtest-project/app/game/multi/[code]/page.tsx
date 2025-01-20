"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { io, Socket } from "socket.io-client";

interface GameData {
  code: string;
  players: { id: string; name: string }[];
  isOpen: boolean;
  host: string;
}

let socket: Socket | null = null;

export default function MultiGamePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [game, setGame] = useState<GameData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const code = params.code as string;
    socket = io("http://87.106.162.205:5002");

    if (code === "new") {
      socket.emit("createGame", { playerName: user.displayName }, (response: { success: boolean; game?: GameData; error?: string }) => {
        if (response.success && response.game) {
          setGame(response.game);
          router.replace(`/game/multi/${response.game.code}`);
        } else {
          setError(response.error || "Erreur lors de la création de la partie");
        }
      });
    } else {
      socket.emit("joinGame", { code, playerName: user.displayName }, (response: { success: boolean; game?: GameData; error?: string }) => {
        if (response.success && response.game) {
          setGame(response.game);
        } else {
          setError(response.error || "Erreur lors de la connexion à la partie");
        }
      });
    }

    socket.on("playerJoined", ({ game: updatedGame }) => {
      console.log("Player joined:", updatedGame);
      setGame(updatedGame);
    });

    socket.on("gameClosed", () => {
      setMessage("La partie a été fermée");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [user, params.code, router]);

  const handleCloseGame = () => {
    if (!game) return;

    socket?.emit("closeGame", { code: game.code }, (response: { success: boolean; error?: string }) => {
      if (response.success) {
        router.push("/");
      } else {
        setError(response.error || "Erreur lors de la fermeture de la partie");
      }
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white p-6">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">{error}</h1>
          <Button onClick={() => router.push("/")} className="bg-violet-600 hover:bg-violet-700">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white p-6">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-2xl mb-4">Chargement...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <div className="max-w-xl mx-auto">
        {message && (
          <div className="bg-blue-500 text-white p-4 rounded mb-4 text-center">
            {message}
          </div>
        )}
        <div className="bg-zinc-800 rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">Code de la partie: {game.code}</h1>
          <p className="text-zinc-400">Partagez ce code avec vos amis pour qu'ils puissent rejoindre la partie</p>
        </div>

        <div className="bg-zinc-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Joueurs connectés</h2>
          <ul className="space-y-2">
            {game.players.map((player) => (
              <li 
                key={player.id}
                className="flex items-center gap-2 text-zinc-300"
              >
                {player.id === game.host && (
                  <span className="text-xs bg-violet-600 px-2 py-1 rounded">Hôte</span>
                )}
                {player.name}
              </li>
            ))}
          </ul>
        </div>

        {game.host === user?.uid && (
          <Button 
            onClick={handleCloseGame}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Fermer la partie
          </Button>
        )}
      </div>
    </div>
  );
}