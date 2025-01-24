import React from "react";

interface Player {
  name: string;
  points: number;
}

interface PodiumProps {
  players: Player[];
}

const Podium: React.FC<PodiumProps> = ({ players }) => {
  const sortedPlayers = [...players].sort((a, b) => b.points - a.points);

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-3xl font-bold text-white">PODIUM DES GAGNANTS</h2>
      <div className="relative flex justify-center items-end h-64 w-full max-w-4xl gap-4">
        {/* 2ème place */}
        {sortedPlayers[1] && (
          <div className="flex flex-col items-center">
            <div className="bg-purple-500 w-24 h-32 rounded-t-lg flex items-center justify-center text-white text-xl font-bold">
              2
            </div>
            <p className="text-center mt-2 text-white font-medium">
              {sortedPlayers[1].name}
              <br />
              {sortedPlayers[1].points} pts
            </p>
          </div>
        )}

        {/* 1ère place */}
        {sortedPlayers[0] && (
          <div className="flex flex-col items-center">
            <div className="bg-pink-500 w-24 h-40 rounded-t-lg flex items-center justify-center text-white text-xl font-bold">
              1
            </div>
            <p className="text-center mt-2 text-white font-medium">
              {sortedPlayers[0].name}
              <br />
              {sortedPlayers[0].points} pts
            </p>
          </div>
        )}

        {/* 3ème place */}
        {sortedPlayers[2] && (
          <div className="flex flex-col items-center">
            <div className="bg-pink-300 w-24 h-24 rounded-t-lg flex items-center justify-center text-white text-xl font-bold">
              3
            </div>
            <p className="text-center mt-2 text-white font-medium">
              {sortedPlayers[2].name}
              <br />
              {sortedPlayers[2].points} pts
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Podium;
