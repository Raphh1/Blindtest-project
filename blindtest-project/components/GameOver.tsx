import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function GameOver() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
      <Card className="bg-zinc-800/50 border-violet-500/20 w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
            Partie terminée !
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/")}
            className="w-full py-6 text-lg bg-zinc-700/50 border-violet-500/20 hover:bg-violet-600/20 hover:border-violet-500/40 transition-all duration-300 text-white"
          >
            Retour à l&apos;accueil
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}