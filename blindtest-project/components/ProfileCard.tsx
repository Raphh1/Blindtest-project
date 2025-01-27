import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";

interface ProfileCardProps {
  displayName: string;
  email: string;
  isEditing: boolean;
  onEdit: () => void;
  onNameChange: (value: string) => void;
  onSave: () => void;
  onDelete: () => void;
  errorMessage?: string;
}

export function ProfileCard({
  displayName,
  email,
  isEditing,
  onEdit,
  onNameChange,
  onSave,
  onDelete,
  errorMessage
}: ProfileCardProps) {
  return (
    <Card className="w-full max-w-2xl bg-zinc-800/50 border-violet-500/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-violet-300">Profil</CardTitle>
          <CardDescription className="text-zinc-400">Gérez vos informations personnelles</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="text-zinc-400 hover:text-white hover:bg-transparent transition-colors gap-2"
          >
          <Pencil className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          {isEditing ? (
            <Input
              value={displayName}
              onChange={(e) => onNameChange(e.target.value)}
              className="max-w-[250px] bg-zinc-700/50 border-violet-500/20 text-center text-white"
              placeholder="Votre nom"
            />
          ) : (
            <h2 className="text-2xl font-semibold text-white">{displayName || "Utilisateur"}</h2>
          )}
          <p className="text-zinc-400">{email}</p>
        </div>

        {errorMessage && (
          <p className="text-center text-red-500 text-sm">{errorMessage}</p>
        )}

              <div className="flex flex-col gap-4">
                {isEditing && (
                  <Button 
                    onClick={onSave}
                    variant="outline"
                    size="lg"
                    className="w-full py-6 text-lg bg-zinc-700/50 border-violet-500/20 hover:bg-violet-600/20 hover:border-violet-500/40 transition-all duration-300 text-white hover:text-white"
                  >
                    Enregistrer les modifications
                  </Button>
                )}
                
                <Button 
                  onClick={onDelete}
                  variant="outline"
                  size="sm"
                  className="w-[200px] mx-auto bg-zinc-700/50 border-red-500/20 hover:bg-red-600/20 hover:border-red-500/40 text-red-400 hover:text-red-300 transition-all duration-300"
                >
                  Supprimer le compte
                </Button>
              </div>
      </CardContent>
    </Card>
  );
}