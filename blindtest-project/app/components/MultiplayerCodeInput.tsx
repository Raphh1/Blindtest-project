"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import { Button } from "./ui/Button";

export const MultiplayerCodeInput: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [multiplayerCode, setMultiplayerCode] = useState("");

  const handleJoinGame = () => {
    if (!user) {
      router.push("/login");
    } else {
      // Logique pour rejoindre une partie avec le code (à implémenter plus tard)
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Code de partie multijoueur"
        value={multiplayerCode}
        onChange={(e) => setMultiplayerCode(e.target.value)}
        className="flex-grow px-4 py-2 rounded bg-zinc-700 text-white"
      />
      <Button onClick={handleJoinGame}>Rejoindre</Button>
    </div>
  );
};