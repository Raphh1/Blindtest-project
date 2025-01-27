import { Button } from "@/components/ui/button";
import { GenreSelectorProps } from "@/app/types/game";

export function GenreSelector({
  genres = ["Rap", "Rnb", "Pop", "Jazz"],
  selectedGenre,
  onGenreSelect,
  disabled
}: GenreSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {genres.map((genre) => (
        <Button
          key={genre}
          onClick={() => onGenreSelect(genre)}
          className={`h-32 text-xl ${
            selectedGenre === genre 
              ? "bg-violet-600 hover:bg-violet-700"
              : "bg-zinc-800/50 hover:bg-zinc-800/70"
          }`}
          disabled={disabled}
        >
          {genre}
        </Button>
      ))}
    </div>
  );
}