import { ReactNode } from 'react';
import { User } from 'firebase/auth';
import { UseFormReturn } from "react-hook-form";

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

export interface GameContentProps {
  game: GameData;
  tracks: Track[];
  currentTrackIndex: number;
  guess: string;
  setGuess: (value: string) => void;
  handleGuess: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleGenreSelect: (genre: string) => void;
  isHost: boolean;
  message: string | null;
  onTimeUp: () => void;
  onNextTrack: () => void;
}

export interface GamePlayProps {
  track: Track;
  guess: string;
  setGuess: (value: string) => void;
  handleGuess: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  message: string | null;
  isHost: boolean;
  currentTrackIndex: number;
  onTimeUp: () => void;
  onNextTrack: () => void;
}

export interface GenreSelectorProps {
  selectedGenre: string;
  onGenreSelect: (genre: string) => void;
}

export interface TimerButtonProps {
  initialTime: number;
  onTimeUp: () => void;
  answer: string;
  onNextTrack: () => void;
  currentTrackIndex: number;
  isHost: boolean;
}

export interface PlayersSidebarProps {
  players: Player[];
  host: string;
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

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface ErrorViewProps {
  error: string;
}

export interface ProfileCardProps {
  displayName: string;
  email: string;
  photoURL: string | null;
  isEditing: boolean;
  onEdit: () => void;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNameChange: (value: string) => void;
  onSave: () => void;
  errorMessage?: string;
}

export interface PlayerFormProps {
  user: User | null;
  form: UseFormReturn<PlayerFormData>;
}

export interface ScoreBoardProps {
  players: Player[];
}

export interface PlayerListProps {
  players: Player[];
  hostId: string;
}

export interface GameCodeProps {
  code: string;
}