
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GenreSelector } from "@/components/GenreSelector";
import TimerButton from "@/components/TimerButton";
import { GameContentProps, GamePlayProps } from "@/app/types";
import RTScoreboard from "@/components/RTScoreboard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function GamePlay({
  track,
  guess,
  setGuess,
  handleGuess,
  message,
  isHost,
  currentTrackIndex,
  onTimeUp,
  onNextTrack,
  totalTracks
}: GamePlayProps) {
  return (
    <div className="col-span-9">
      <Card className="bg-zinc-800/50 border-violet-500/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
            En cours de lecture
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-12">
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-violet-400 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative aspect-square w-80 rounded-lg overflow-hidden">
                <img 
                  src={track.cover} 
                  alt="Cover" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300" 
                />
              </div>
            </div>
          </div>

          <audio 
            src={track.preview} 
            controls 
            className="w-full max-w-xl mx-auto" 
          />

          <div className="flex flex-col items-center gap-4">
            <Input
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={handleGuess}
              placeholder="Saisissez le nom du titre"
              className="w-full max-w-md py-6 text-lg bg-zinc-700/50 border-violet-500/20 hover:border-violet-500/40 transition-colors text-center text-white"
            />
            {message && (
              <div className="text-red-400 text-lg font-medium">
                {message}
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <TimerButton 
              initialTime={90} 
              onTimeUp={onTimeUp} 
              answer={track.title}
              onNextTrack={onNextTrack}
              currentTrackIndex={currentTrackIndex}
              isHost={isHost}
              totalTracks={totalTracks}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function GameContent({
  game,
  isHost,
  tracks,
  currentTrackIndex,
  guess,
  setGuess,
  handleGuess,
  handleGenreSelect,
  message,
  onTimeUp,
  onNextTrack,
  isGameOver
}: GameContentProps) {
  const genres = ["Rap", "Rnb", "Pop", "Jazz"];
  const router = useRouter();

  console.log("isGameOver:", isGameOver, "currentTrackIndex:", currentTrackIndex, "totalTracks:", tracks.length);

  if (isGameOver) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-zinc-900 z-50">
        <div className="w-full max-w-3xl p-8">
          <h1 className="text-4xl font-bold text-center text-white mb-8">
            Fin de la partie !
          </h1>
          <RTScoreboard 
            players={game.players} 
            className="scale-125 transform-gpu mb-8"
          />
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => router.push("/")}
              className="mt-8 bg-violet-600 hover:bg-violet-700 text-white"
            >
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isHost && !game.genre) {
    return (
      <div className="col-span-9">
        <Card className="bg-zinc-800/50 border-violet-500/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
              Sélectionnez un genre
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <GenreSelector
              genres={genres}
              selectedGenre={game.genre || ""}
              onGenreSelect={handleGenreSelect}
              disabled={!isHost}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (game.genre && tracks[currentTrackIndex]) {
    return (
      <GamePlay
        track={tracks[currentTrackIndex]}
        guess={guess}
        setGuess={setGuess}
        handleGuess={handleGuess}
        message={message}
        isHost={isHost}
        currentTrackIndex={currentTrackIndex}
        onTimeUp={onTimeUp}
        onNextTrack={onNextTrack}
        totalTracks={tracks.length}
        isGameOver={isGameOver} 
      />
    );
  }

  return null;
}