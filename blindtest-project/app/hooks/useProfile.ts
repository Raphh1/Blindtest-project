import { useState, useCallback } from 'react';
import { User } from 'firebase/auth';
import { updateProfile } from 'firebase/auth';

export const useProfile = (user: User | null) => {
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [errorMessage, setErrorMessage] = useState("");
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const handlePhotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleUpdateProfile = useCallback(async () => {
    if (!user) return;
    
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
  }, [user, displayName, previewPhoto]);

  return {
    displayName,
    setDisplayName,
    errorMessage,
    previewPhoto,
    handlePhotoChange,
    handleUpdateProfile
  };
};