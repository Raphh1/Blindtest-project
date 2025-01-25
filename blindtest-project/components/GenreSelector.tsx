import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GenreSelectorProps } from "@/app/types";


export function GenreSelector({ selectedGenre, onGenreSelect }: GenreSelectorProps) {
  return (
    <div className="col-span-6">
      <Card className="bg-zinc-800/50 border-violet-500/20">
        <CardHeader>
          <CardTitle className="text-violet-300 text-2xl">Choisissez un style musical</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6 p-4">
            {["rap", "rnb", "pop", "jazz"].map((genre) => (
              <Button
                key={genre}
                onClick={() => onGenreSelect(genre)}
                className={`h-32 text-xl ${
                  selectedGenre === genre 
                    ? "bg-violet-600 hover:bg-violet-700" 
                    : "bg-zinc-700/50 hover:bg-violet-600/20"
                } transition-all capitalize`}
              >
                {genre}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}