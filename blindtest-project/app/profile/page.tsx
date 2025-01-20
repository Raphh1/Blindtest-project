"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { updateProfile } from "firebase/auth";
import { ArrowLeft } from "lucide-react";
import { ProfileCard } from "@/components/ProfileCard";
import { EditProfileCard } from "@/components/EditProfileCard";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [errorMessage, setErrorMessage] = useState("");
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleUpdateProfile = async () => {
    if (user) {
      try {
        await updateProfile(user, {
          displayName,
          photoURL: previewPhoto || user.photoURL,
        });
 
        window.location.reload();
      } catch (error) {
        setErrorMessage("Erreur lors de la mise à jour du profil.");
        console.error("Error updating profile:", error);
      }
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 text-white p-4">
      <div className="absolute top-4 left-4 flex items-center">
        <Button
          className="bg-transparent hover:bg-zinc-700 p-2 rounded-full flex items-center"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-6 h-6 text-white" />
          <span className="ml-2 text-white">Retour</span>
        </Button>
      </div>
      <ProfileCard
        displayName={user?.displayName || "Utilisateur"}
        email={user?.email || ""}
        photoURL={previewPhoto || user?.photoURL || null}
      />
      <Accordion type="single" collapsible className="w-full max-w-md">
        <AccordionItem value="item-1">
          <AccordionTrigger className="bg-zinc-700 hover:bg-zinc-800 text-white p-2 rounded">
            Modifier le profil
          </AccordionTrigger>
          <AccordionContent className="bg-zinc-800 p-4 rounded-lg mt-2">
            <EditProfileCard
              displayName={displayName}
              setDisplayName={setDisplayName}
              handlePhotoChange={handlePhotoChange}
              handleUpdateProfile={handleUpdateProfile}
              errorMessage={errorMessage}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}