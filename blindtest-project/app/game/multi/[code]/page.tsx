"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { useMultiGame } from "./hooks/useMultiGame";
import { GameCode } from "@/components/GameCode";
import { PlayersSidebar } from "@/components/PlayersSidebar";
import { GameContent } from "@/components/GameContent";
import { ActionsSidebar } from "@/components/ActionsSidebar";

function ErrorView({ error }: { error: string }) {
  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">{error}</h1>
      </div>
    </div>
  );
}

function LoadingView() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-2xl mb-4">Chargement de la partie...</h1>
      </div>
    </div>
  );
}

export default function MultiGamePage() {
  const { user } = useAuth();
  const {
    game,
    error,
    message,
    tracks,
    currentTrackIndex,
    guess,
    setGuess,
    handleGuess,
    handleGenreSelect,
    handleCloseGame,
    handleTimeUp,
    handleNextTrack,
    isHost
  } = useMultiGame(user);

  if (error) {
    return <ErrorView error={error} />;
  }

  if (!game) {
    return <LoadingView />;
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-6">
      <GameCode code={game.code} />
      <div className="container mx-auto grid grid-cols-12 gap-6 mt-16">
        <PlayersSidebar players={game.players} host={game.host} />
        <GameContent 
          game={game}
          tracks={tracks}
          currentTrackIndex={currentTrackIndex}
          guess={guess}
          setGuess={setGuess}
          handleGuess={handleGuess}
          handleGenreSelect={handleGenreSelect}
          isHost={isHost}
          message={message}
          onTimeUp={handleTimeUp}
          onNextTrack={handleNextTrack}
        />
        <ActionsSidebar 
          isHost={isHost}
          onClose={handleCloseGame}
        />
      </div>
    </div>
  );
}