import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PlayerFormData } from '../schemas/form';
import { User } from 'firebase/auth';

export function useSoloGame(user: User | null) {
  const router = useRouter();
  const [selectedGenre, setSelectedGenre] = useState("");

  const handleGenreSelect = useCallback((genre: string) => {
    setSelectedGenre(genre);
  }, []);

  const handleSubmit = useCallback((data: PlayerFormData) => {
    if (!selectedGenre) {
      alert("Veuillez sélectionner un style musical");
      return;
    }

    const players = [
      user?.displayName || "Joueur 1",
      data.player2,
      data.player3,
      data.player4
    ];

    const searchParams = new URLSearchParams();
    searchParams.set("players", JSON.stringify(players));
    searchParams.set("genre", selectedGenre);

    router.push(`/game/solo/play?${searchParams.toString()}`);
  }, [selectedGenre, user, router]);

  return {
    selectedGenre,
    handleGenreSelect,
    handleSubmit
  };
}