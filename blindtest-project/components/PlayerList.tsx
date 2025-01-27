import React from 'react';
import { PlayerListProps } from "@/app/types";

const PlayerList: React.FC<PlayerListProps> = ({ players, hostId }) => {
  return (
    <div className="bg-zinc-800 rounded-lg p-4 mb-4">
      <ul className="space-y-2">
        {players.map((player) => (
          <li key={player.id} className="flex items-center gap-2 text-zinc-300">
            {player.id === hostId && (
              <span className="text-xs bg-violet-600 px-2 py-1 rounded">Hôte</span>
            )}
            {player.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;