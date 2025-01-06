"use client";

import { useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function CreatePlaylist() {
    const [playlistName, setPlaylistName] = useState("");
    const [songs, setSongs] = useState<string[]>([]);
    const [newSong, setNewSong] = useState("");
    const { user } = useAuth();

    const handleAddSong = () => {
        if (newSong.trim()) {
            setSongs((prevSongs) => [...prevSongs, newSong.trim()]);
            setNewSong("");
        }
    };

    const handleCreatePlaylist = () => {
        if (!user) {
            alert("Vous devez être connecté pour créer une playlist.");
            return;
        }

        if (playlistName.trim() && songs.length > 0) {
            console.log("Playlist créée", { name: playlistName, songs });
            setPlaylistName("");
            setSongs([]);
        } else {
            alert("Veuillez ajouter un nom de playlist et au moins une chanson.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Card className="bg-zinc-900 border-violet-500/20 hover:border-violet-500/50 transition-all duration-300">
                <CardHeader>
                    <CardTitle className="text-violet-300">Créer une Playlist</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Ajoutez un nom de playlist et des chansons pour créer une nouvelle playlist.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        placeholder="Nom de la playlist"
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                        className="bg-zinc-800 border-violet-500/20 focus:border-violet-500 text-white"
                    />
                    <div className="flex gap-2">
                        <Input
                            placeholder="Ajouter une chanson"
                            value={newSong}
                            onChange={(e) => setNewSong(e.target.value)}
                            className="bg-zinc-800 border-violet-500/20 focus:border-violet-500 text-white"
                        />
                        <Button
                            className="bg-violet-600 hover:bg-violet-700 whitespace-nowrap"
                            onClick={handleAddSong}
                        >
                            Ajouter
                        </Button>
                    </div>
                    <div>
                        <ul className="space-y-2">
                            {songs.map((song, index) => (
                                <li key={index} className="text-zinc-300">
                                    - {song}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Button
                        className="w-full bg-violet-600 hover:bg-violet-700"
                        onClick={handleCreatePlaylist}
                    >
                        Créer la Playlist
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}