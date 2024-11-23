import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { GuessDirection } from "../enums/GuessDirection.enum"

interface GuessButtonsProps {
  onGuess: (guess: GuessDirection) => void;
  isDisabled: boolean;
  guess: GuessDirection | null;
}

const GuessButtons: React.FC<GuessButtonsProps> = ({ onGuess, isDisabled, guess }) => {
  return (
    <div className="flex space-x-6 mt-6 justify-center">
      <button
        onClick={() => onGuess(GuessDirection.UP)}
        className={`px-6 py-3 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300
          ${isDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300'}
          ${guess === 'up' ? 'bg-green-500 opacity-80' : ''} 
          w-56 text-white`}
        disabled={isDisabled}
        aria-label="Guess Up"
        aria-pressed={guess === 'up'}
      >
        <FaArrowUp className="mr-2 inline-block" />
        Guess Up
      </button>
      <button
        onClick={() => onGuess(GuessDirection.DOWN)}
        className={`px-6 py-3 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300
          ${isDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300'}
          ${guess === 'down' ? 'bg-red-500 opacity-80' : ''} 
          w-56 text-white`}
        disabled={isDisabled}
        aria-label="Guess Down"
        aria-pressed={guess === 'down'}
      >
        <FaArrowDown className="mr-2 inline-block" />
        Guess Down
      </button>
    </div>
  );
};

export default GuessButtons;
