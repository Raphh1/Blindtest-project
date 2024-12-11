// components/EditProfileCard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditProfileCardProps {
  displayName: string;
  setDisplayName: (value: string) => void;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpdateProfile: () => void;
  errorMessage: string;
}

export function EditProfileCard({
  displayName,
  setDisplayName,
  handlePhotoChange,
  handleUpdateProfile,
  errorMessage,
}: EditProfileCardProps) {
  return (
    <Card className="w-full bg-zinc-800 border-violet-500/20 hover:border-violet-500/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-violet-300">Modifier le profil</CardTitle>
        <CardDescription className="text-zinc-400">Mettre à jour votre pseudo et photo de profil</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Pseudo"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="bg-zinc-800 border-violet-500/20 focus:border-violet-500 text-white"
        />
        <Input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="bg-zinc-800 border-violet-500/20 focus:border-violet-500 text-white"
        />
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <Button
          className="w-full bg-violet-600 hover:bg-violet-700"
          onClick={handleUpdateProfile}
        >
          Mettre à jour
        </Button>
      </CardContent>
    </Card>
  );
}