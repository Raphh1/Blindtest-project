"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import TimerButton from "@/components/TimerButton";
import Image from "next/image";
import { fetchPlaylistByGenre } from "@/app/lib/api";

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
      // Charger les scores globaux depuis localStorage
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
        setGlobalScores(storedScores); // Charger les scores globaux
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
      updateGlobalScores(); // Mettre à jour les scores globaux
    }
  };

  const handleTimeUp = () => {
    setMessage("Temps écoulé !");
    setRevealAnswer(true);
  };

  const updateGlobalScores = () => {
    const updatedScores = { ...globalScores };

    // Ajouter les scores de la partie au score global
    gameState.players.forEach((player) => {
      updatedScores[player.name] = (updatedScores[player.name] || 0) + player.points;
    });

    setGlobalScores(updatedScores);
    localStorage.setItem("globalScores", JSON.stringify(updatedScores)); // Sauvegarder dans localStorage
  };

  const renderPodium = () => {
    const sortedPlayers = [...gameState.players].sort(
      (a, b) => b.points - a.points
    );

    return (
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-3xl font-bold text-white">PODIUM DES GAGNANTS</h2>
        <div className="relative flex justify-center items-end h-64 w-full max-w-4xl gap-4">
          {/* 2ème place */}
          {sortedPlayers[1] && (
            <div className="flex flex-col items-center">
              <div className="bg-purple-500 w-24 h-32 rounded-t-lg flex items-center justify-center text-white text-xl font-bold">
                2
              </div>
              <p className="text-center mt-2 text-white font-medium">
                {sortedPlayers[1].name}
                <br />
                {sortedPlayers[1].points} pts
              </p>
            </div>
          )}

          {/* 1ère place */}
          {sortedPlayers[0] && (
            <div className="flex flex-col items-center">
              <div className="bg-pink-500 w-24 h-40 rounded-t-lg flex items-center justify-center text-white text-xl font-bold">
                1
              </div>
              <p className="text-center mt-2 text-white font-medium">
                {sortedPlayers[0].name}
                <br />
                {sortedPlayers[0].points} pts
              </p>
            </div>
          )}

          {/* 3ème place */}
          {sortedPlayers[2] && (
            <div className="flex flex-col items-center">
              <div className="bg-pink-300 w-24 h-24 rounded-t-lg flex items-center justify-center text-white text-xl font-bold">
                3
              </div>
              <p className="text-center mt-2 text-white font-medium">
                {sortedPlayers[2].name}
                <br />
                {sortedPlayers[2].points} pts
              </p>
            </div>
          )}
        </div>

        <h3 className="text-xl font-semibold text-zinc-300 mt-6">
          Scores cumulés
        </h3>
        <div className="bg-zinc-800 p-4 rounded-lg shadow-md w-full max-w-md">
          <ul className="space-y-2">
            {Object.entries(globalScores)
              .sort(([, a], [, b]) => b - a)
              .map(([name, points], index) => (
                <li
                  key={index}
                  className="flex justify-between bg-zinc-700 p-2 rounded"
                >
                  <span className="text-white font-medium">{name}</span>
                  <span className="text-violet-400 font-bold">
                    {points} points
                  </span>
                </li>
              ))}
          </ul>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg mt-4"
        >
          Rejouer
        </button>
      </div>
    );
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  const currentTrack = gameState.tracks[gameState.currentTrackIndex];

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      {!gameState.isGameOver ? (
        <>
          <img
            src={currentTrack.cover}
            alt="Cover"
            width={250}
            height={250}
            className="rounded-md mb-4"
          />
          <audio src={currentTrack.preview} controls className="mb-4" />
          <TimerButton
            initialTime={3}
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
            className="bg-zinc-700 border-violet-500/20 text-white w-full mb-4"
          />
          {message && <p>{message}</p>}
          {revealAnswer && (
            <p className="text-zinc-300">
              La bonne réponse était :{" "}
              <span className="font-bold">{currentTrack.title}</span>
            </p>
          )}
          {showPlayerSelection && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Qui gagne le point ?</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {gameState.players.map((player, index) => (
                  <button
                    key={index}
                    onClick={() => handleAddPoint(index)}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded"
                  >
                    {player.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        renderPodium()
      )}
    </div>
  );
}
