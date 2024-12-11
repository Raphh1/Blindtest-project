// components/ProfileCard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileCardProps {
  displayName: string;
  email: string;
  photoURL: string | null;
}

export function ProfileCard({ displayName, email, photoURL }: ProfileCardProps) {
  return (
    <Card className="w-full max-w-md bg-zinc-800 border-violet-500/20 hover:border-violet-500/50 transition-all duration-300 mb-6">
      <CardHeader>
        <CardTitle className="text-violet-300">Profil</CardTitle>
        <CardDescription className="text-zinc-400">Informations du profil</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <img
          src={photoURL || "/default-profile.png"}
          alt="Photo de profil"
          className="w-24 h-24 rounded-full mb-4"
        />
        <p className="text-xl">{displayName || "Utilisateur"}</p>
        <p className="text-zinc-400">{email}</p>
      </CardContent>
    </Card>
  );
}