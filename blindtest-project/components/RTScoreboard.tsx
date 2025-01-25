import React from 'react';
import { ScoreBoardProps } from "@/app/types";

const ScoreBoard: React.FC<ScoreBoardProps> = ({ players }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-zinc-800 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Tableau des scores</h2>
      <div className="space-y-2">
        {sortedPlayers.map((player, index) => (
          <div 
            key={player.id} 
            className={`flex justify-between items-center p-3 rounded ${
              index === 0 ? 'bg-violet-600/20' : 'bg-zinc-700/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold">{index + 1}</span>
              <span>{player.name}</span>
            </div>
            <span className="text-lg font-bold">{player.score} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreBoard;