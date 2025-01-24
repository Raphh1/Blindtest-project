"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { io, Socket } from "socket.io-client";
import { fetchPlaylistByGenre } from "@/app/lib/api";
import TimerButton from "@/components/TimerButton";
import PlayerList from "@/components/PlayerList";
import ScoreBoard from "@/components/RTScoreboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface GameData {
  code: string;
  players: {
    id: string;
    name: string;
    score: number;
  }[];
  isOpen: boolean;
  host: string;
  genre?: string;
  isPlaying: boolean;
  canGuess: boolean;
  currentTrackIndex: number;
}

interface Track {
  id: number;
  title: string;
  artist: string;
  preview: string;
  cover: string;
}

let socket: Socket | null = null;

export default function MultiGamePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [game, setGame] = useState<GameData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [guess, setGuess] = useState("");

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const code = params.code as string;
    socket = io("http://87.106.162.205:5002");

    socket.emit('authenticate', { uid: user.uid });

    socket.on("playerJoined", ({ game: updatedGame }) => {
      console.log("Player joined:", updatedGame);
      setGame(updatedGame);
    });

    socket.on("gameUpdated", ({ game: updatedGame }) => {
      console.log("Game updated:", updatedGame);
      setGame(updatedGame);
      if (updatedGame.genre) {
        fetchPlaylistByGenre(updatedGame.genre)
          .then(data => {
            console.log("Tracks loaded:", data);
            setTracks(data);
          })
          .catch(error => console.error("Failed to fetch tracks:", error));
      }
    });

    socket.on("correctAnswerFound", ({ game: updatedGame, winnerName }) => {
      setGame(updatedGame);
      setMessage(`${winnerName} a trouvé la réponse !`);
      setGuess("");
    });

    socket.on("nextTrack", ({ game: updatedGame, currentTrackIndex }) => {
      console.log("Received nextTrack event", { currentTrackIndex });
      setGame(updatedGame);
      setCurrentTrackIndex(currentTrackIndex);
      setMessage("");
      setGuess("");
    });

    socket.on("timerEnded", ({ game: updatedGame, currentTrackIndex }) => {
      setGame(updatedGame);
      setCurrentTrackIndex(currentTrackIndex);
      setGuess("");
    });

    socket.on("gameClosed", () => {
      setMessage("La partie a été fermée");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    });

    setTimeout(() => {
      if (code === "new") {
        socket?.emit("createGame", { 
          playerName: user.displayName, 
          uid: user.uid 
        }, (response: { success: boolean; game?: GameData; error?: string }) => {
          if (response.success && response.game) {
            setGame(response.game);
            router.replace(`/game/multi/${response.game.code}`);
          } else {
            setError(response.error || "Erreur lors de la création de la partie");
          }
        });
      } else {
        socket?.emit("joinGame", { 
          code, 
          playerName: user.displayName,
          uid: user.uid 
        }, (response: { success: boolean; game?: GameData; error?: string }) => {
          if (response.success && response.game) {
            setGame(response.game);
            if (response.game.genre) {
              fetchPlaylistByGenre(response.game.genre)
                .then(data => setTracks(data))
                .catch(error => console.error("Failed to fetch tracks:", error));
            }
          } else {
            setError(response.error || "Erreur lors de la connexion à la partie");
          }
        });
      }
    }, 100);

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [user, params.code, router]);

  const handleGenreSelect = (genre: string) => {
    if (game && user?.uid === game.host) {
      console.log("Selecting genre:", genre);
      socket?.emit("selectGenre", { 
        code: game.code, 
        genre 
      }, (response: { success: boolean; error?: string }) => {
        if (response.success) {
          console.log("Genre selected successfully");
          fetchPlaylistByGenre(genre)
            .then(data => {
              console.log("Tracks loaded:", data);
              setTracks(data);
            })
            .catch(error => console.error("Failed to fetch tracks:", error));
        } else {
          setError(response.error || "Erreur lors de la sélection du genre");
        }
      });
    }
  };

  const handleGuess = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tracks[currentTrackIndex] && game?.canGuess) {
      if (guess.toLowerCase() === tracks[currentTrackIndex].title.toLowerCase()) {
        socket?.emit("correctGuess", { 
          code: game?.code,
          playerId: user?.uid 
        });
      } else {
        setMessage("Réponse incorrecte");
      }
      setGuess("");
    }
  };

  const handleCloseGame = () => {
    if (!game) return;

    socket?.emit("closeGame", { code: game.code }, (response: { success: boolean; error?: string }) => {
      if (response.success) {
        router.push("/");
      } else {
        setError(response.error || "Erreur lors de la fermeture de la partie");
      }
    });
  };
  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white p-6">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">{error}</h1>
          <Button onClick={() => router.push("/")} className="bg-violet-600 hover:bg-violet-700">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white p-6">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-2xl mb-4">Chargement de la partie...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-6">
      {/* Code de partie flottant */}
      <div className="absolute top-4 left-4">
        <Card className="bg-zinc-800/50 border-violet-500/20">
          <CardContent className="p-4">
            <span className="text-xs text-zinc-400">Code de la partie</span>
            <h2 className="text-2xl font-bold text-violet-300">{game.code}</h2>
          </CardContent>
        </Card>
      </div>

      {/* Layout principal en grille */}
      <div className="container mx-auto grid grid-cols-12 gap-6 mt-16">
        {/* Sidebar gauche - Joueurs et Scores */}
        <div className="col-span-3">
          <div className="space-y-4 sticky top-6">
            <Card className="bg-zinc-800/50 border-violet-500/20">
              <CardHeader>
                <CardTitle className="text-violet-300">Joueurs connectés</CardTitle>
              </CardHeader>
              <CardContent>
                <PlayerList players={game.players} hostId={game.host} />
                <Separator className="my-4 bg-violet-500/20" />
                <ScoreBoard players={game.players} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Zone centrale - Jeu */}
        <div className="col-span-6">
          {game.host === user?.uid && !game.genre ? (
            <Card className="bg-zinc-800/50 border-violet-500/20">
              <CardHeader>
                <CardTitle className="text-violet-300">Choisissez un style musical</CardTitle>
                <CardDescription className="text-zinc-400">
                  Sélectionnez un genre pour commencer la partie
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {["rap", "rnb", "pop", "jazz"].map((genre) => (
                    <Button
                      key={genre}
                      onClick={() => handleGenreSelect(genre)}
                      className="h-24 text-lg bg-zinc-700/50 hover:bg-violet-600/20 
                               hover:text-violet-300 transition-all capitalize"
                    >
                      {genre}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : game.genre && tracks[currentTrackIndex] ? (
            <div className="space-y-4">
              <Card className="bg-zinc-800/50 border-violet-500/20">
                <CardContent className="p-6">
                  <div className="aspect-square max-w-sm mx-auto rounded-lg overflow-hidden mb-6">
                    <img 
                      src={tracks[currentTrackIndex].cover} 
                      alt="Cover" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <audio 
                    src={tracks[currentTrackIndex].preview} 
                    controls 
                    className="w-full mb-6"
                  />
                  <TimerButton 
                    initialTime={90} 
                    onTimeUp={() => {
                      setMessage("Temps écoulé !");
                    }} 
                    answer={tracks[currentTrackIndex].title}
                    onNextTrack={() => {
                      if (user?.uid === game.host) {
                        socket?.emit("timerEnded", { 
                          code: game.code,
                          currentTrackIndex: currentTrackIndex + 1
                        });
                      }
                    }}
                    currentTrackIndex={currentTrackIndex}
                    isHost={user?.uid === game.host}
                  />
                </CardContent>
              </Card>

              <Card className="bg-zinc-800/50 border-violet-500/20">
                <CardContent className="p-6">
                  <Input
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyDown={handleGuess}
                    placeholder="Saisissez le nom du titre"
                    className="bg-zinc-700/50 border-violet-500/20 
                             focus:border-violet-500 text-white text-lg"
                  />
                </CardContent>
              </Card>

              {message && (
                <Card className="bg-violet-600/20 border-violet-500/20">
                  <CardContent className="p-4 text-center text-lg font-medium">
                    {message}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : null}
        </div>

        {/* Sidebar droite - Actions */}
        <div className="col-span-3">
          <div className="space-y-4 sticky top-6">
            {game.host === user?.uid && (
              <Card className="bg-zinc-800/50 border-violet-500/20">
                <CardHeader>
                  <CardTitle className="text-violet-300">Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handleCloseGame}
                    variant="destructive"
                    className="w-full"
                  >
                    Fermer la partie
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}