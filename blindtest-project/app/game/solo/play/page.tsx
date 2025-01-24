"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import TimerButton from "@/components/TimerButton";
import Image from "next/image";
import { fetchPlaylistByGenre } from "@/app/lib/api";
import Podium from "@/components/Podium";
import Scoreboard from "@/components/Scoreboard";

interface Player {
  name: string;
  points: number;
}

interface Track {
  id: number;
  title: string;
  artist: string;
  preview: string;
  cover: string;
}

interface GameState {
  players: Player[];
  genre: string;
  tracks: Track[];
  currentTrackIndex: number;
  isGameOver: boolean;
}

export default function PlaySoloGame() {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    genre: "",
    tracks: [],
    currentTrackIndex: 0,
    isGameOver: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [showPlayerSelection, setShowPlayerSelection] = useState(false);
  const [revealAnswer, setRevealAnswer] = useState(false);
  const [globalScores, setGlobalScores] = useState<Record<string, number>>({});

  const searchParams = useSearchParams();

  useEffect(() => {
    const initGame = async () => {
      const storedScores = JSON.parse(localStorage.getItem("globalScores") || "{}");

      const players = JSON.parse(searchParams.get("players") || "[]").map(
        (name: string) => ({ name, points: 0 })
      );
      const genre = searchParams.get("genre") || "";

      try {
        const tracks = await fetchPlaylistByGenre(genre);
        setGameState({
          players,
          genre,
          tracks,
          currentTrackIndex: 0,
          isGameOver: false,
        });
        setGlobalScores(storedScores);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch tracks:", error);
      }
    };

    initGame();
  }, [searchParams]);

  useEffect(() => {
    if (gameState.tracks[gameState.currentTrackIndex]) {
      console.log(
        "Dev track name:",
        gameState.tracks[gameState.currentTrackIndex].title
      );
    }
    setMessage("");
    setRevealAnswer(false);
  }, [gameState.currentTrackIndex, gameState.tracks]);

  const handleCheck = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
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
    setMessage("");
    if (gameState.currentTrackIndex < gameState.tracks.length - 1) {
      setGameState((prev) => ({
        ...prev,
        currentTrackIndex: prev.currentTrackIndex + 1,
      }));
    } else {
      setGameState((prev) => ({
        ...prev,
        isGameOver: true,
      }));
      updateGlobalScores();
    }
  };

  const handleTimeUp = () => {
    setMessage("Temps écoulé !");
    setRevealAnswer(true);
  };

  const updateGlobalScores = () => {
    const updatedScores = { ...globalScores };

    gameState.players.forEach((player) => {
      updatedScores[player.name] = (updatedScores[player.name] || 0) + player.points;
    });

    setGlobalScores(updatedScores);
    localStorage.setItem("globalScores", JSON.stringify(updatedScores));
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen text-white">Chargement...</div>;
  }

  const currentTrack = gameState.tracks[gameState.currentTrackIndex];

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 flex flex-col items-center justify-center gap-6">
      {!gameState.isGameOver ? (
        <>
          <div className="flex flex-col items-center gap-4">
            <img
              src={currentTrack.cover}
              alt="Cover"
              width={300}
              height={300}
              className="rounded-lg shadow-lg"
            />
            <audio src={currentTrack.preview} controls className="mt-4 w-full max-w-md" />
          </div>

          <div className="flex flex-col items-center gap-4 w-full max-w-md">
            <TimerButton
              initialTime={30}
              onTimeUp={handleTimeUp}
              onNextTrack={handleNextTrack}
              currentTrackIndex={gameState.currentTrackIndex}
              answer={currentTrack.title}
            />
            <Input
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={handleCheck}
              placeholder="Saisissez le nom du titre"
              className="bg-zinc-700 border-violet-500/20 text-white w-full"
            />
            {message && <p className="text-lg font-medium text-violet-400">{message}</p>}
            {revealAnswer && (
              <p className="text-md text-gray-300">
                La bonne réponse était :{" "}
                <span className="font-bold text-white">{currentTrack.title}</span>
              </p>
            )}
          </div>

          {showPlayerSelection && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white">Qui gagne le point ?</h3>
              <div className="flex flex-wrap gap-4 justify-center mt-4">
                {gameState.players.map((player, index) => (
                  <button
                    key={index}
                    onClick={() => handleAddPoint(index)}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg shadow-md"
                  >
                    {player.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <Podium players={gameState.players} />
          <Scoreboard globalScores={globalScores} />
        </>
      )}
    </div>
  );
}
