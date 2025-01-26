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

interface GameState {
  players: string[];
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
  const [isGameOver, setIsGameOver] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    const initGame = async () => {
      const players = JSON.parse(searchParams.get("players") || "[]");
      const genre = searchParams.get("genre") || "";

      try {
        const tracks = await fetchPlaylistByGenre(genre, 2); 
        console.log("Fetched tracks:", tracks); 
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

  useEffect(() => {
    if (isGameOver) {
      router.push("/game/solo/gameover");
    }
  }, [isGameOver, router]);

  const handleCheck = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const currentTrack = gameState.tracks[gameState.currentTrackIndex];
      if (guess.toLowerCase() === currentTrack.title.toLowerCase()) {
        setMessage("Réussi !");
        if (gameState.currentTrackIndex < gameState.tracks.length - 1) {
          setGameState((prev) => ({ ...prev, currentTrackIndex: prev.currentTrackIndex + 1 }));
        } else {
          setIsGameOver(true);
        }
      } else {
        setMessage("Réponse incorrecte");
      }
      setGuess("");
    }
  };

  const handleTimeUp = () => {
    setMessage("Temps écoulé !");
    if (gameState.currentTrackIndex < gameState.tracks.length - 1) {
      setGameState((prev) => ({ ...prev, currentTrackIndex: prev.currentTrackIndex + 1 }));
    } else {
      setIsGameOver(true);
    }
  };

  const handleNextTrack = () => {
    if (gameState.currentTrackIndex < gameState.tracks.length - 1) {
      setGameState((prev) => ({ ...prev, currentTrackIndex: prev.currentTrackIndex + 1 }));
      setMessage("");
    } else {
      setIsGameOver(true);
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (isGameOver) {
    return null;
  }

  const currentTrack = gameState.tracks[gameState.currentTrackIndex];

  return (
    <div className="min-h-screen bg-zinc-900 p-6 pt-12">
      <div className="absolute top-6 left-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-zinc-400 hover:text-white gap-2"
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
                  <span className="text-zinc-100">{player}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <TimerButton 
              initialTime={90} 
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