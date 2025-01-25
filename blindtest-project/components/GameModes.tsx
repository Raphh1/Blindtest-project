import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

interface Game {
  code: string;
  players: { id: string; name: string }[];
  isOpen: boolean;
  host: string;
}

export function GameModes() {
  const [gameCode, setGameCode] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  const handleSelectMode = (mode: "solo" | "multi", code?: string) => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (mode === "solo") {
      router.push("/game/solo");
    } else {
      if (code) {
        router.push(`/game/multi/${code}`);
      } else {
        socket = io("http://87.106.162.205:5002");
        socket.emit("createGame", { playerName: user.displayName , uid: user.uid}, (response: { success: boolean; game?: Game; error?: string }) => {
          if (response.success && response.game) {
            router.push(`/game/multi/${response.game.code}`);
          } else {
            toast.error(response.error || "Erreur lors de la création de la partie");
          }
        });
      }
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto p-6 mb-24">
      <Card className="bg-zinc-900 border-violet-500/20 hover:border-violet-500/50 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-violet-300 flex items-center gap-2">
            <UserIcon className="h-6 w-6" />
            Mode Solo
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Testez vos connaissances musicales en solo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            className="w-full bg-violet-600 hover:bg-violet-700"
            onClick={() => handleSelectMode("solo")}
          >
            Jouer en Solo
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-violet-500/20 hover:border-violet-500/50 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-violet-300 flex items-center gap-2">
            <Users className="h-6 w-6" />
            Mode Multijoueur
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Affrontez d&apos;autres joueurs en temps réel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Code de la partie"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value)}
              className="bg-zinc-800 border-violet-500/20 focus:border-violet-500 text-white"
            />
            <Button 
              className="bg-violet-600 hover:bg-violet-700 whitespace-nowrap"
              onClick={() => handleSelectMode("multi", gameCode)}
              disabled={!gameCode}
            >
              Rejoindre
            </Button>
          </div>
          <Button 
            className="w-full bg-violet-600 hover:bg-violet-700"
            onClick={() => handleSelectMode("multi")}
          >
            Créer une partie
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}