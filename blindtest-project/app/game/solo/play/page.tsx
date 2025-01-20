"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { fetchPlaylistByGenre } from "@/app/lib/api";
import { Input } from "@/components/ui/input";
import TimerButton from "@/components/TimerButton";

interface Track {
  id: number;
  title: string;
  artist: string;
  preview: string;
  cover: string;
}

interface GameState {
  players: string[];
  genre: string;
  tracks: Track[];
  currentTrackIndex: number;
}

export default function PlaySoloGame() {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    genre: "",
    tracks: [],
    currentTrackIndex: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const initGame = async () => {
      const players = JSON.parse(searchParams.get("players") || "[]");
      const genre = searchParams.get("genre") || "";

      try {
        const tracks = await fetchPlaylistByGenre(genre);
        setGameState({
          players,
          genre,
          tracks,
          currentTrackIndex: 0,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch tracks:", error);
      }
    };

    initGame();
  }, [searchParams]);
  useEffect(() => {
    if (gameState.tracks[gameState.currentTrackIndex]) {
      console.log("Dev track name:", gameState.tracks[gameState.currentTrackIndex].title);
    }
    setMessage("");
  }, [gameState.currentTrackIndex, gameState.tracks]);

  const handleCheck = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const currentTrack = gameState.tracks[gameState.currentTrackIndex];
      if (guess.toLowerCase() === currentTrack.title.toLowerCase()) {
        setMessage("Réussi !");
        if (gameState.currentTrackIndex < gameState.tracks.length - 1) {
          setGameState((prev) => ({ ...prev, currentTrackIndex: prev.currentTrackIndex + 1 }));
        }
      } else {
        setMessage("Réponse incorrecte");
      }
      setGuess("");
    }
  };

  const handleTimeUp = () => {
    setMessage("Temps écoulé !");
  };

  const handleNextTrack = () => {
    if (gameState.currentTrackIndex < gameState.tracks.length - 1) {
      setGameState((prev) => ({ ...prev, currentTrackIndex: prev.currentTrackIndex + 1 }));
      setMessage(""); 
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  const currentTrack = gameState.tracks[gameState.currentTrackIndex];

  return (
    <div className="flex flex-col items-center min-h-screen bg-zinc-900 text-white p-6 gap-4">
      <div className="flex flex-col items-center w-full max-w-2xl">
        <img src={currentTrack.cover} alt="Cover" className="w-48 h-48 mb-4" />
        <audio src={currentTrack.preview} controls className="mb-4" />
        <TimerButton 
          initialTime={90} 
          onTimeUp={handleTimeUp} 
          answer={currentTrack.title} 
          onNextTrack={handleNextTrack}
          currentTrackIndex={gameState.currentTrackIndex} 
        />
        <Input
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={handleCheck}
          placeholder="Saisissez le nom du titre"
          className="bg-zinc-700 border-violet-500/20 text-white w-full mb-4"
        />
        <div className="mb-4">{message}</div>
      </div>
    </div>
  );
}