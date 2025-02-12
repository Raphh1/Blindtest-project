import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { TimerButtonProps } from "@/app/types";

const TimerButton: React.FC<TimerButtonProps> = ({
  initialTime,
  answer,
  onNextTrack,
  currentTrackIndex,
  isHost
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [showModal, setShowModal] = useState(false);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    setTimeLeft(initialTime);
    setShowModal(false);
    setTimerActive(true);
  }, [initialTime, currentTrackIndex]);

  useEffect(() => {
    if (!timerActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [timerActive]);

  const handleShowAnswer = () => {
    setShowModal(true);
  };

  const handleNextTrack = () => {
    onNextTrack();
    setShowModal(false);
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline" 
        size="lg"
        className="min-w-[100px] bg-zinc-800/50 border-violet-500/20 text-white"
        disabled={true}
      >
        {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
      </Button>

      {timeLeft === 0 && (
        <Button
          className="bg-red-600 text-white"
          onClick={handleShowAnswer}
        >
          Réponse
        </Button>
      )}

      {showModal && createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-zinc-800 text-white p-6 rounded-lg">
            <h2 className="text-xl mb-4">Temps écoulé !</h2>
            <p>La musique était : {answer}</p>
            {isHost && (
              <Button 
                className="mt-4 bg-violet-600 hover:bg-violet-700" 
                onClick={handleNextTrack}
              >
                Musique suivante
              </Button>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default TimerButton;