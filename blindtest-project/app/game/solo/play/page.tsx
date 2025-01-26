"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchPlaylistByGenre } from "@/app/lib/api";
import { Input } from "@/components/ui/input";
import TimerButton from "@/components/TimerButton";
import { Track } from "@/app/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Player {
  name: string;
  points: number;
}

interface GameState {
  players: Player[];
  genre: string;
  tracks: Track[];
  currentTrackIndex: number;
}

export default function PlaySoloGame() {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    genre: "",
    tracks: [],
    currentTrackIndex: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [showPlayerSelection, setShowPlayerSelection] = useState(false);
  const [isInsertBlocked, setIsInsertBlocked] = useState(false); // Nouvel état pour bloquer l'insert

  const searchParams = useSearchParams();

  useEffect(() => {
    const initGame = async () => {
      const players = JSON.parse(searchParams.get("players") || "[]").map(
        (name: string) => ({ name, points: 0 })
      );
      const genre = searchParams.get("genre") || "";

      try {
        const tracks = await fetchPlaylistByGenre(genre, 10);
        setGameState({
          players,
          genre,
          tracks,
          currentTrackIndex: 0,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch tracks:", error);
        setIsLoading(false);
      }
    };

    initGame();
  }, [searchParams]);

  const saveCumulativeScores = (players: Player[]) => {
    const existingScores = JSON.parse(localStorage.getItem("cumulativeScores") || "[]");

    const updatedScores = players.map((player) => {
      const existingPlayer = existingScores.find((p: Player) => p.name === player.name);
      if (existingPlayer) {
        return { ...player, points: player.points + existingPlayer.points };
      }
      return player; 
    });

    const allScores = [
      ...updatedScores,
      ...existingScores.filter((p: Player) => !updatedScores.find((u: Player) => u.name === p.name)),
    ];


    localStorage.setItem("cumulativeScores", JSON.stringify(allScores));
  };

  const handleCheck = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isInsertBlocked) { 
      const currentTrack = gameState.tracks[gameState.currentTrackIndex];
      if (guess.toLowerCase() === currentTrack.title.toLowerCase()) {
        setMessage("Réussi !");
        setShowPlayerSelection(true);
      } else {
        setMessage("Réponse incorrecte");
      }
      setGuess("");
    }
  };

  const handleAddPoint = (playerIndex: number) => {
    if (isInsertBlocked) return; 
    setGameState((prev) => {
      const updatedPlayers = prev.players.map((player, index) =>
        index === playerIndex
          ? { ...player, points: player.points + 1 }
          : player
      );
      return { ...prev, players: updatedPlayers };
    });
    setShowPlayerSelection(false);
    handleNextTrack();
  };

  const handleNextTrack = () => {
    if (gameState.currentTrackIndex < gameState.tracks.length - 1) {
      setGameState((prev) => ({
        ...prev,
        currentTrackIndex: prev.currentTrackIndex + 1,
      }));
      setMessage("");
      setIsInsertBlocked(false); 
    } else {
      saveCumulativeScores(gameState.players);

      const searchParams = new URLSearchParams();
      searchParams.set("players", JSON.stringify(gameState.players));
      router.push(`/game/solo/gameover?${searchParams.toString()}`);
    }
  };

  const handleTimeUp = () => {
    setMessage("Temps écoulé !");
    setShowPlayerSelection(false); 
    setIsInsertBlocked(true); 
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  const currentTrack = gameState.tracks[gameState.currentTrackIndex];

  return (
  <div className="min-h-screen bg-zinc-900 p-6 pt-12">
    <div className="absolute top-6 left-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="text-zinc-400 hover:text-violet-500 hover:bg-violet-200/10 gap-2 transition-colors duration-300"
      >
      <ArrowLeft className="h-4 w-4" />
      Retour
    </Button>
  </div>

      <div className="container mx-auto grid grid-cols-12 gap-6">
        <div className="col-span-9">
          <Card className="bg-zinc-800/50 border-violet-500/20">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
                En cours de lecture
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-12">
              {currentTrack ? (
                <>
                  <div className="flex justify-center">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-violet-400 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                      <div className="relative aspect-square w-80 rounded-lg overflow-hidden">
                        <img
                          src={currentTrack.cover}
                          alt="Cover"
                          className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
                        />
                      </div>
                    </div>
                  </div>

                  <audio
                    src={currentTrack.preview}
                    controls
                    className="w-full max-w-xl mx-auto"
                  />

                  <div className="flex flex-col items-center gap-4">
                    <Input
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                      onKeyDown={handleCheck}
                      placeholder="Saisissez le nom du titre"
                      className="w-full max-w-md py-6 text-lg bg-zinc-700/50 border-violet-500/20 hover:border-violet-500/40 transition-colors text-center text-white"
                    />
                    {message && (
                      <div className="text-red-400 text-lg font-medium">
                        {message}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div>Chargement de la piste...</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="col-span-3 space-y-6">
          <Card className="bg-zinc-800/50 border-violet-500/20">
            <CardHeader>
              <CardTitle className="text-xl text-violet-300">
                Joueurs en partie
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {gameState.players.map((player, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-zinc-700/30 border border-violet-500/10"
                >
                  {index === 0 ? (
                    <Crown className="w-5 h-5 text-violet-400" />
                  ) : (
                    <User className="w-5 h-5 text-zinc-400" />
                  )}
                  <span className="text-zinc-100">
                    {player.name} - {player.points} pts
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {showPlayerSelection && !isInsertBlocked && (
            <Card className="bg-zinc-800/50 border-violet-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-violet-300">
                  Qui a deviné ?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {gameState.players.map((player, index) => (
                  <button
                    key={index}
                    onClick={() => handleAddPoint(index)}
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded"
                  >
                    {player.name}
                  </button>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="flex justify-center">
            <TimerButton
              initialTime={5}
              onTimeUp={handleTimeUp}
              answer={currentTrack?.title || ""}
              onNextTrack={handleNextTrack}
              currentTrackIndex={gameState.currentTrackIndex}
              isHost={true}
              totalTracks={gameState.tracks.length}
              className="text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
