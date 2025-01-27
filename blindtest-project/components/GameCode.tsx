import { Card, CardContent } from "@/components/ui/card";
import { GameCodeProps } from "@/app/types";

export function GameCode({ code }: GameCodeProps) {
  return (
    <div className="absolute top-4 left-4">
      <Card className="bg-zinc-800/50 border-violet-500/20">
        <CardContent className="p-4">
          <span className="text-xs text-zinc-400">Code de la partie</span>
          <h2 className="text-2xl font-bold text-violet-300">{code}</h2>
        </CardContent>
      </Card>
    </div>
  );
}