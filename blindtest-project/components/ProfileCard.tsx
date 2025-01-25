import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { ProfileCardProps } from "@/app/types";

export function ProfileCard({
  displayName,
  email,
  isEditing,
  onEdit,
  onNameChange,
  onSave,
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
          className="text-zinc-400 hover:text-violet-300"
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
              className="max-w-[250px] bg-zinc-700/50 border-violet-500/20 text-center"
              placeholder="Votre nom"
            />
          ) : (
            <h2 className="text-2xl font-semibold text-white">{displayName}</h2>
          )}
          <p className="text-zinc-400">{email}</p>
        </div>

        {errorMessage && (
          <p className="text-center text-red-500 text-sm">{errorMessage}</p>
        )}

        {isEditing && (
          <Button 
            onClick={onSave}
            className="w-full bg-violet-600 hover:bg-violet-700"
          >
            Enregistrer les modifications
          </Button>
        )}
      </CardContent>
    </Card>
  );
}