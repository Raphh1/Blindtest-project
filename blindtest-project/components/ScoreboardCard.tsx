"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function Scoreboard() {
    const { user } = useAuth();
    const router = useRouter();

    const scores = [
        { rank: 1, name: "Alice", points: 120 },
        { rank: 2, name: "Bob", points: 100 },
        { rank: 3, name: "Charlie", points: 90 },
    ];

    if (!user) {
        return (
            <div className="grid place-items-center h-full p-6">
                <Card className="bg-zinc-900 border-violet-500/20 hover:border-violet-500/50 transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="text-violet-300">
                            Accès refusé
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Vous devez être connecté pour voir le tableau des scores.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            className="bg-violet-600 hover:bg-violet-700"
                            onClick={() => router.push("/login")}
                        >
                            Se connecter
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Card className="bg-zinc-900 border-violet-500/20 hover:border-violet-500/50 transition-all duration-300">
                <CardHeader>
                    <CardTitle className="text-violet-300">Tableau des Scores</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Voici les meilleurs joueurs !
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-zinc-300">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">Rang</th>
                                    <th className="px-4 py-2">Nom</th>
                                    <th className="px-4 py-2">Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scores.map((score) => (
                                    <tr
                                        key={score.rank}
                                        className="odd:bg-zinc-800 even:bg-zinc-700 hover:bg-zinc-600 transition-colors"
                                    >
                                        <td className="px-4 py-2">{score.rank}</td>
                                        <td className="px-4 py-2">{score.name}</td>
                                        <td className="px-4 py-2">{score.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
