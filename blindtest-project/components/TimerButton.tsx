import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";

interface TimerButtonProps {
  initialTime: number;
  onTimeUp: () => void;
  answer: string;
  onNextTrack: () => void;
  currentTrackIndex: number; 
}

const TimerButton: React.FC<TimerButtonProps> = ({ 
  initialTime = 90, 
  onTimeUp, 
  answer, 
  onNextTrack,
  currentTrackIndex 
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setTimeLeft(initialTime);
    setShowModal(false);
  }, [initialTime, currentTrackIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    if (timeLeft === 0) {
      onTimeUp();
    }

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const handleShowAnswer = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeLeft(initialTime); 
    onNextTrack();
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        className="bg-red-600 text-white"
        disabled={timeLeft > 0}
        onClick={handleShowAnswer}
      >
        Réponse
      </Button>
      <div className="text-lg">
        {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
      </div>

      {showModal && createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-black p-6 rounded-lg">
            <h2 className="text-xl mb-4">Perdu !</h2>
            <p>La musique était : {answer}</p>
            <Button className="mt-4 bg-violet-600 hover:bg-violet-700" onClick={handleCloseModal}>
              Suivant
            </Button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default TimerButton;