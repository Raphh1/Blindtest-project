"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";

interface GameData {
  code: string;
  name: string;
  players: string[];
  isOpen: boolean;
}

export default function MultiGamePage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Stockage local de la partie et de son état
  const [game, setGame] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(false);

  // On récupère le code depuis l'URL (ex: /game/multi?code=12345)
  const code = searchParams.get("code");

  // On définit le pseudo à partir du compte (displayName),
  // avec un fallback si jamais l'utilisateur n'a pas de displayName.
  const playerName = user?.displayName || `User-${Math.floor(Math.random() * 1000)}`;

  // Au montage (et si code existe), on va rejoindre la partie et fetcher ses infos
  useEffect(() => {
    if (!code) return;

    const joinGame = async () => {
      setLoading(true);
      try {
        // 1) Appeler la route "join" de votre backend
        await fetch("http://87.106.162.205:5002/api/games/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, playerName }),
        });

        // 2) Récupérer les détails de la partie (liste des joueurs, etc.)
        const res = await fetch(`http://87.106.162.205:5002/api/games/${code}`);
        const data = await res.json();
        setGame(data); 
      } catch (error) {
        console.error("Erreur lors de la connexion à la partie:", error);
      } finally {
        setLoading(false);
      }
    };

    joinGame();
  }, [code, playerName]);

  // Cas : Pas de code dans l'URL
  if (!code) {
    return <div className="text-white p-4">Aucun code de partie spécifié.</div>;
  }

  // Cas : En cours de chargement
  if (loading && !game) {
    return <div className="text-white p-4">Chargement de la partie...</div>;
  }

  // Cas : On n'a pas réussi à récupérer la partie ou le fetch a échoué
  if (!game) {
    return <div className="text-white p-4">Impossible de récupérer les infos de la partie.</div>;
  }

  if (!game || !game.players) {
    return <div className="text-white p-4">Cette partie n'existe pas ou est inaccessible.</div>;
  }

  // Affichage simple
  return (
    <div className="text-white p-4">
      <h1 className="text-2xl mb-2">
        Code de la partie: <span className="font-bold">{game.code}</span>
      </h1>

      <h2 className="text-xl mb-4">
        Nom de la partie: <span className="font-semibold">{game.name}</span>
      </h2>

      <div className="mb-2">Joueurs connectés :</div>
      <ul className="list-disc ml-6">
        {game.players.map((player) => (
          <li key={player}>{player}</li>
        ))}
      </ul>
    </div>
  );
}
