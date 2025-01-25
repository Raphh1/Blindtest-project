import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PlayerList from "@/components/PlayerList";
import ScoreBoard from "@/components/RTScoreboard";
import { PlayersSidebarProps } from "@/app/game/multi/[code]/types/game";

export function PlayersSidebar({ players, host }: PlayersSidebarProps) {
  return (
    <div className="col-span-3">
      <Card className="bg-zinc-800/50 border-violet-500/20">
        <CardHeader>
          <CardTitle className="text-violet-300">Joueurs connectés</CardTitle>
        </CardHeader>
        <CardContent>
          <PlayerList players={players} hostId={host} />
          <Separator className="my-4 bg-violet-500/20" />
          <ScoreBoard players={players} />
        </CardContent>
      </Card>
    </div>
  );
}