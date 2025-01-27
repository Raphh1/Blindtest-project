import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { User } from 'firebase/auth';
import { fetchPlaylistByGenre } from "@/app/lib/api";
import { GameData, Track } from "@/app/types";

let socket: Socket | null = null;

export function useMultiGame(user: User | null) {
  const params = useParams();
  const router = useRouter();
  const [game, setGame] = useState<GameData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const code = params.code as string;
    console.log("Connecting to socket with code:", code);
    
    socket = io("http://87.106.162.205:5002", {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      timeout: 10000
    });

    socket.on("connect", () => {
      console.log("Socket connected");
      socket?.emit('authenticate', { uid: user.uid });
      
      if (code === "new") {
        socket?.emit("createGame", { 
          playerName: user.displayName, 
          uid: user.uid 
        });
      } else {
        socket?.emit("joinGame", {
          code,
          playerName: user.displayName,
          uid: user.uid
        });
      }
    });

    socket.on("playerJoined", ({ game: updatedGame }) => {
      console.log("Player joined:", updatedGame);
      setGame(updatedGame);
    });

    socket.on("gameUpdated", ({ game: updatedGame }) => {
      console.log("Game updated:", updatedGame);
      setGame(updatedGame);
      if (updatedGame.genre) {
        fetchPlaylistByGenre(updatedGame.genre, 3)
          .then(fetchedTracks => {
            setTracks(fetchedTracks);
          })
          .catch(error => {
            console.error("Failed to fetch tracks:", error);
            setError("Erreur lors du chargement de la playlist");
          });
      }
    });

    socket.on("correctAnswerFound", ({ game: updatedGame, winnerName, trackTitle }) => {
      setGame(updatedGame);
      setMessage(`${winnerName} a trouvé la réponse ${trackTitle} !`);
      setGuess("");
      
      // Effacer le message après 3 secondes
      setTimeout(() => {
        setMessage("");
      }, 3000);
    });

    socket.on("nextTrack", ({ game: updatedGame, currentTrackIndex }) => {
      setGame(updatedGame);
      setCurrentTrackIndex(currentTrackIndex);
      setMessage("");
      setGuess("");
      
      if (currentTrackIndex === tracks.length - 1) {
        setMessage("C'est votre dernière musique !");
      }
    });

    socket.on('gameEnded', ({ game }) => {
      console.log("Game ended received");
      setGame(game);
      setIsGameOver(true);
    });

    socket.on('gameClosed', () => {
      router.push("/");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setError("Erreur de connexion au serveur");
    });

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [user, params.code, router, tracks.length]);

  const handleGenreSelect = useCallback((genre: string) => {
    if (game && user?.uid === game.host) {
      socket?.emit("selectGenre", { code: game.code, genre });
    }
  }, [game, user?.uid]);


   const handleGuess = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tracks[currentTrackIndex] && game?.canGuess) {
      if (guess.toLowerCase() === tracks[currentTrackIndex].title.toLowerCase()) {
        if (currentTrackIndex >= tracks.length - 1) {
          socket?.emit("gameEnded", { code: game.code }); 
        } else {
          setCurrentTrackIndex(prev => prev + 1);
        }
        socket?.emit("correctGuess", {
          code: game.code,
          playerId: user?.uid,
          isLastTrack: currentTrackIndex >= tracks.length - 1 
        });
      } else {
        setMessage("Réponse incorrecte");
      }
      setGuess("");
    }
  }, [currentTrackIndex, game, guess, tracks, user?.uid]);

  

  const handleTimeUp = useCallback(() => {
    socket?.emit("timerEnded", { 
      code: game?.code,
      timeUp: true 
    });
  }, [game?.code]);

  const handleNextTrack = useCallback(() => {
    const nextIndex = currentTrackIndex + 1;
    
    if (nextIndex >= tracks.length) {
      setIsGameOver(true);
    } else {
      socket?.emit("timerEnded", { 
        code: game?.code,
        currentTrackIndex: nextIndex,
        isLastTrack: nextIndex >= tracks.length - 1
      });
    }
  }, [game?.code, currentTrackIndex, tracks.length]);

  const handleCloseGame = useCallback(() => {
    if (!game) return;
    socket?.emit("closeGame", { code: game.code });
  }, [game]);

  return {
    game,
    error,
    message,
    tracks,
    currentTrackIndex,
    guess,
    setGuess,
    handleGuess,
    handleGenreSelect,
    handleCloseGame,
    handleTimeUp,
    handleNextTrack,
    isHost: user?.uid === game?.host,
    totalTracks: tracks.length,
    isGameOver
  };
}