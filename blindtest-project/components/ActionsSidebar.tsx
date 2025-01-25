import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ActionsSidebarProps } from "@/app/types";


export function ActionsSidebar({ isHost, onClose }: ActionsSidebarProps) {
  if (!isHost) return null;

  return (
    <div className="col-span-3">
      <Card className="bg-zinc-800/50 border-violet-500/20">
        <CardHeader>
          <CardTitle className="text-violet-300">Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={onClose}
            variant="destructive"
            className="w-full"
          >
            Fermer la partie
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}