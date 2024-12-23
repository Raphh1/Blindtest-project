"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchPlaylistByGenre } from "@/app/lib/api";


interface Track {
  id: number;
  title: string;
  artist: string;
  preview: string;
  cover: string;
}

interface GameState {
  players: string[];
  genre: string;
  tracks: Track[];
  currentTrackIndex: number;
}

export default function PlaySoloGame() {
    const [gameState, setGameState] = useState<GameState>({
      players: [],
      genre: "",
      tracks: [],
      currentTrackIndex: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    
    const searchParams = useSearchParams();
  
    useEffect(() => {
      const initGame = async () => {
        const players = JSON.parse(searchParams.get("players") || "[]");
        const genre = searchParams.get("genre") || "";
        
        try {
          const tracks = await fetchPlaylistByGenre(genre); // Utiliser la fonction helper
          setGameState({
            players,
            genre,
            tracks,
            currentTrackIndex: 0
          });
          setIsLoading(false);
        } catch (error) {
          console.error("Failed to fetch tracks:", error);
        }
      };
  
      initGame();
    }, [searchParams]);

  const handleNextTrack = () => {
    if (gameState.currentTrackIndex < gameState.tracks.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentTrackIndex: prev.currentTrackIndex + 1
      }));
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  const currentTrack = gameState.tracks[gameState.currentTrackIndex];

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-zinc-800 border-violet-500/20">
          <CardContent className="p-6 space-y-4">
            <audio 
              src={currentTrack.preview} 
              controls 
              className="w-full"
            />
            <img 
              src={currentTrack.cover} 
              alt="Album cover" 
              className="w-48 h-48 mx-auto rounded-lg"
            />
            <div className="flex justify-between mt-4">
              <Button
                onClick={handleNextTrack}
                disabled={gameState.currentTrackIndex === gameState.tracks.length - 1}
                className="bg-violet-600 hover:bg-violet-700"
              >
                Suivant
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}