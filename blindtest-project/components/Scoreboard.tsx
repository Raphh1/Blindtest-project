import React from "react";

interface ScoreboardProps {
  globalScores: Record<string, number>;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ globalScores }) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <h3 className="text-xl font-semibold text-zinc-300 mt-6">Scores cumulés</h3>
      <div className="bg-zinc-800 p-4 rounded-lg shadow-md w-full max-w-md">
        <ul className="space-y-2">
          {Object.entries(globalScores)
            .sort(([, a], [, b]) => b - a)
            .map(([name, points], index) => (
              <li
                key={index}
                className="flex justify-between bg-zinc-700 p-2 rounded"
              >
                <span className="text-white font-medium">{name}</span>
                <span className="text-violet-400 font-bold">
                  {points} points
                </span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Scoreboard;
