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
        const createGamePayload = { 
          playerName: user.displayName, 
          uid: user.uid 
        };

        socket?.emit("createGame", createGamePayload);
      } else {
        const joinGamePayload = {
          code,
          playerName: user.displayName,
          uid: user.uid
        };

        socket?.emit("joinGame", joinGamePayload);
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
        fetchPlaylistByGenre(updatedGame.genre)
          .then(setTracks)
          .catch(error => {
            console.error("Failed to fetch tracks:", error);
            setError("Erreur lors du chargement de la playlist");
          });
      }
    });

    socket.on("correctAnswerFound", ({ game: updatedGame, winnerName }) => {
      setGame(updatedGame);
      setMessage(`${winnerName} a trouvé la réponse !`);
      setGuess("");
    });

    socket.on("nextTrack", ({ game: updatedGame, currentTrackIndex }) => {
      setGame(updatedGame);
      setCurrentTrackIndex(currentTrackIndex);
      setMessage("");
      setGuess("");
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
  }, [user, params.code, router]);

  const handleGuess = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tracks[currentTrackIndex] && game?.canGuess) {
      if (guess.toLowerCase() === tracks[currentTrackIndex].title.toLowerCase()) {
        socket?.emit("correctGuess", { 
          code: game.code,
          playerId: user?.uid 
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
    socket?.emit("timerEnded", { 
      code: game?.code,
      currentTrackIndex: currentTrackIndex + 1 
    });
  }, [game?.code, currentTrackIndex]);

  const handleGenreSelect = useCallback((genre: string) => {
    if (game && user?.uid === game.host) {
      socket?.emit("selectGenre", { code: game.code, genre });
    }
  }, [game, user?.uid]);

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
    isHost: user?.uid === game?.host
  };
}