import { useState, useCallback } from 'react';
import { User, deleteUser, GoogleAuthProvider, reauthenticateWithPopup } from 'firebase/auth';
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
    } catch (error) {
      setErrorMessage("Erreur lors de la mise à jour du profil.");
      console.error("Error updating profile:", error);
    }
  }, [user, displayName]);

  const handleDeleteAccount = useCallback(async () => {
    if (!user) return;
    
    try {
      const provider = new GoogleAuthProvider();
      await reauthenticateWithPopup(user, provider);
      await deleteUser(user);
      window.location.href = "/login";
    } catch (error: FirebaseError) {
      if (error.code === 'auth/requires-recent-login') {
        setErrorMessage("Pour des raisons de sécurité, veuillez vous reconnecter avant de supprimer votre compte.");
      } else {
        setErrorMessage("Erreur lors de la suppression du compte.");
      }
      console.error("Error deleting account:", error);
    }
  }, [user]);

  return {
    displayName,
    setDisplayName,
    errorMessage,
    handleUpdateProfile,
    handleDeleteAccount
  };
};