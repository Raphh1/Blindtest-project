"use client";

import { useEffect, useState } from "react";

interface Player {
  name: string;
  points: number;
}

export default function ScoreTable() {
  const [cumulativeScores, setCumulativeScores] = useState<Player[]>([]);

  useEffect(() => {
    const scores = JSON.parse(localStorage.getItem("cumulativeScores") || "[]");
    setCumulativeScores(scores);
  }, []);

  return (
    <div className="mt-6 bg-zinc-800/50 border border-violet-500/20 rounded-lg p-4">
      <h2 className="text-xl font-bold text-violet-400 mb-4 text-center">
        Tableau des scores cumulés en local
      </h2>
      <div className="max-h-64 overflow-y-scroll">
        {/* Conteneur scrollable */}
        <table className="w-full text-left text-white">
          <thead>
            <tr>
              <th className="py-2 px-4">Joueur</th>
              <th className="py-2 px-4 text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {cumulativeScores
              .sort((a, b) => b.points - a.points) 
              .map((player, index) => (
                <tr key={index} className="border-b border-zinc-700">
                  <td className="py-2 px-4">{player.name}</td>
                  <td className="py-2 px-4 text-right">{player.points} pts</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
