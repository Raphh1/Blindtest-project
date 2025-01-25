import { useState, useCallback } from 'react';
import { User } from 'firebase/auth';
import { updateProfile } from 'firebase/auth';

export const useProfile = (user: User | null) => {
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpdateProfile = useCallback(async () => {
    if (!user) return;
    
    try {
      await updateProfile(user, {
        displayName
      });
      window.location.reload();
    } catch (error) {
      setErrorMessage("Erreur lors de la mise à jour du profil.");
      console.error("Error updating profile:", error);
    }
  }, [user, displayName]);

  return {
    displayName,
    setDisplayName,
    errorMessage,
    handleUpdateProfile
  };
};