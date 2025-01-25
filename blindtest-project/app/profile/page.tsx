"use client";

import { useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ProfileCard } from "@/components/ProfileCard";
import { useProfile } from "@/app/hooks/useProfile";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const profile = useProfile(user);
  const [isEditing, setIsEditing] = useState(false);

  if (!user || loading) return null;

  return (
    <div className="min-h-screen bg-zinc-900">
      <header className="sticky top-0 z-50 bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-zinc-400 hover:text-white gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </div>
      </header>

      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <ProfileCard
          displayName={profile.displayName}
          email={user.email || ""}
          isEditing={isEditing}
          onEdit={() => setIsEditing(!isEditing)}
          onNameChange={profile.setDisplayName}
          onSave={() => {
            profile.handleUpdateProfile();
            setIsEditing(false);
          }}
          onDelete={profile.handleDeleteAccount}
          errorMessage={profile.errorMessage}
        />
      </main>
    </div>
  );
}