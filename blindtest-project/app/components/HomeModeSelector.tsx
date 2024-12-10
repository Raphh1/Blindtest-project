"use client";
import React  from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import { Button } from "./ui/Button";
import { MultiplayerCodeInput } from "./MultiplayerCodeInput";

export const HomeModeSelector: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleSoloClick = () => {
    if (!user) {
      router.push("/login");
    } else {
      // Logique pour le mode solo (à implémenter plus tard)
    }
  };

  const handleMultiplayerClick = () => {
    if (!user) {
      router.push("/login");
    } else {
      // Logique pour le mode multijoueur (à implémenter plus tard)
    }
  };

  return (
    <div className="card bg-zinc-800 text-white p-6 rounded-lg">
      <h2 className="text-2xl mb-4">Choisissez votre mode de jeu</h2>
      <div className="flex flex-col gap-4">
        <Button variant="primary" onClick={handleSoloClick}>
          Mode Solo
        </Button>
        <Button variant="secondary" onClick={handleMultiplayerClick}>
          Mode Multijoueur
        </Button>
        <MultiplayerCodeInput />
      </div>
    </div>
  );
};