import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GenreSelector } from "@/components/GenreSelector";
import TimerButton from "@/components/TimerButton";
import { GameContentProps, GamePlayProps } from "@/app/types";




function GamePlay({ 
  track, 
  guess, 
  setGuess, 
  handleGuess, 
  message,
  isHost,
  currentTrackIndex,
  onTimeUp,
  onNextTrack
}: GamePlayProps) {
  return (
    <div className="col-span-6 space-y-6">
      <Card className="bg-zinc-800/50 border-violet-500/20">
        <CardHeader>
          <CardTitle className="text-violet-300">Piste en cours</CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex flex-col items-center">
          <div className="aspect-square w-full max-w-md rounded-lg overflow-hidden mb-6">
            <img src={track.cover} alt="Cover" className="w-full h-full object-cover" />
          </div>
          <audio src={track.preview} controls className="w-full mb-6" />
          <TimerButton 
            initialTime={90}
            onTimeUp={onTimeUp}
            answer={track.title}
            onNextTrack={onNextTrack}
            currentTrackIndex={currentTrackIndex}
            isHost={isHost}
          />
        </CardContent>
      </Card>

      <Card className="bg-zinc-800/50 border-violet-500/20">
        <CardContent className="p-6">
          <Input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={handleGuess}
            placeholder="Saisissez le nom du titre"
            className="bg-zinc-700/50 border-violet-500/20 text-white"
          />
        </CardContent>
      </Card>

      {message && (
        <Card className="bg-violet-600/20 border-violet-500/20">
          <CardContent className="p-4 text-center text-lg font-medium">
            {message}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function GameContent({
  game,
  tracks,
  currentTrackIndex,
  guess,
  setGuess,
  handleGuess,
  handleGenreSelect,
  isHost,
  message,
  onTimeUp,
  onNextTrack
}: GameContentProps) {
  if (isHost && !game.genre) {
    return <GenreSelector selectedGenre="" onGenreSelect={handleGenreSelect} />;
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
      />
    );
  }

  return null;
}