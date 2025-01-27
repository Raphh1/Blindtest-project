import { ReactNode } from 'react';
import { User } from 'firebase/auth';
import { UseFormReturn } from "react-hook-form";

export interface BaseGameProps {
  currentTrackIndex: number;
  onTimeUp: () => void;
  onNextTrack: () => void;
}

export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface Track {
  id: number;
  title: string;
  artist: string;
  preview: string;
  cover: string;
}

export interface GameData {
  code: string;
  players: Player[];
  isOpen: boolean;
  host: string;
  genre?: string;
  isPlaying: boolean;
  canGuess: boolean;
  currentTrackIndex: number;
}



// Props des composants
export interface GamePlayProps extends BaseGameProps {
  track: Track;
  guess: string;
  setGuess: (value: string) => void;
  handleGuess: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  message: string | null;
  isHost: boolean;
}

export interface GameContentProps extends GamePlayProps {
  game: GameData;
  tracks: Track[];
  handleGenreSelect: (genre: string) => void;
  isGameOver: boolean;
}

export interface TimerButtonProps extends BaseGameProps {
  initialTime: number;
  answer: string;
  isHost?: boolean;
  onNextTrack: () => void;
  currentTrackIndex: number;
  totalTracks: number;
}

export interface GenreSelectorProps {
  selectedGenre: string;
  onGenreSelect: (genre: string) => void;
}

export interface PlayersSidebarProps {
  players: Player[];
  host: string;
  isHost: boolean;
  onClose: () => void;
}

export interface ActionsSidebarProps {
  isHost: boolean;
  onClose: () => void;
}

export interface PlayerFormData {
  player2?: string;
  player3?: string;
  player4?: string;
}

export interface PlayerFormProps {
  user: User | null;
  form: UseFormReturn<PlayerFormData>;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface GameCodeProps {
  code: string;
}