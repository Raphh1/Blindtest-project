"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { deleteUser, updateProfile } from "firebase/auth";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleDeleteAccount = async () => {
    if (user) {
      try {
        await deleteUser(user);
        router.push("/signup");
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleUpdateProfile = async () => {
    if (user) {
      try {
        await updateProfile(user, { displayName, photoURL });
        setIsEditing(false);
      } catch (error) {
        if (error instanceof Error && (error as any).code === "auth/invalid-profile-attribute") {
          setErrorMessage("Le fichier est trop lourd. Veuillez choisir un fichier plus léger.");
        } else {
          console.error("Error updating profile:", error);
        }
      }
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (file.size > maxSize) {
        setErrorMessage("Le fichier est trop lourd. Veuillez choisir un fichier de moins de 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result as string);
        setPhotoURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-white">Chargement...</div>;
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-screen text-white">
      <Link href="/" className="absolute top-4 left-4 text-white">
        ← Retour
      </Link>
      <h1 className="text-3xl mb-8">Profil</h1>
      {user && (
        <Card className="text-center">
          <div className="mb-4">
            <label className="block mb-2">Nom d'affichage:</label>
            {isEditing ? (
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="px-4 py-2 rounded bg-zinc-700 text-white"
              />
            ) : (
              <p>{user.displayName || "N/A"}</p>
            )}
          </div>
          <p className="mb-4">Email: {user.email}</p>
          {isEditing ? (
            <Button variant="primary" onClick={handleUpdateProfile}>
              Enregistrer
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => setIsEditing(true)}>
              Modifier le profil
            </Button>
          )}
          <Button variant="secondary" onClick={handleDeleteAccount} className="mt-4">
            Supprimer le compte
          </Button>
        </Card>
      )}
      {isEditing && (
        <Card className="text-center mt-8">
          <div className="mb-4">
            <label className="block mb-2">Modifier la photo de profil:</label>
            <input type="file" onChange={handlePhotoChange} className="px-4 py-2 rounded bg-zinc-700 text-white" />
          </div>
          {previewPhoto && (
            <div className="mb-4">
              <img src={previewPhoto} alt="Prévisualisation de la photo de profil" className="rounded-full w-24 h-24" />
            </div>
          )}
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        </Card>
      )}
    </div>
  );
}