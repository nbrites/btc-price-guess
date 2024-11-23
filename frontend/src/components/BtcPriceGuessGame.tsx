import React, { useState, useCallback } from "react";
import { useTimer } from 'react-timer-hook';

import Header from "./Header";
import BitcoinPrice from "./BitcoinPrice";
import Score from "./Score";
import useBTCPrice from "../hooks/useBTCPrice";
import useScore from "../hooks/useScore";
import useUserId from "../hooks/useUserId";
import GuessButtons from "./GuessButtons";

export enum GuessDirection {
  UP = 'up',
  DOWN = 'down',
}

export enum ErrorMessages {
  FAILED_TO_UPDATE_SCORE = "Failed to update the score on the backend.",
}

const BtcPriceGuessGame: React.FC = () => {
  const gameDurationSeconds = 20;
  const { price, priceAtTimeOfGuess, setPriceAtTimeOfGuess } = useBTCPrice();
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const userId = useUserId();
  const { score, loading, error, upsertScore } = useScore(userId);  // Get upsertScore from hook
  const [guess, setGuess] = useState<GuessDirection | null>(null);
  const [isGameActive, setGameActive] = useState(false);

  const { seconds, start, restart } = useTimer({
    expiryTimestamp: new Date(new Date().getTime() + gameDurationSeconds * 1000),
    autoStart: false,
    onExpire: () => {
      if (isGameActive) {
        handleGameResult();
        setGameActive(false);
      }
    },
  });

  const handleGuess = (userGuess: GuessDirection) => {
    setGuess(userGuess);
    setPriceAtTimeOfGuess(price);
    setGameActive(true);
    setFinalPrice(null);

    if (seconds === gameDurationSeconds) {
      start();
    } else {
      restart(new Date(new Date().getTime() + gameDurationSeconds * 1000));
    }
  };

  const isCorrectGuess = useCallback((): boolean => {
    if (price === null || priceAtTimeOfGuess === null) return false;
    return (
      (guess === GuessDirection.UP && price > priceAtTimeOfGuess) ||
      (guess === GuessDirection.DOWN && price < priceAtTimeOfGuess)
    );
  }, [price, priceAtTimeOfGuess, guess]);

  const handleGameResult = useCallback(async () => {
    let newScore;
    if (isCorrectGuess()) {
      newScore = score + 1;
    } else {
      newScore = Math.max(score - 1, 0);
    }

    setGameActive(false);
    setFinalPrice(price);

    try {
      if (newScore !== score) {
        await upsertScore(newScore);
      }
    } catch (error) {
      console.log(ErrorMessages.FAILED_TO_UPDATE_SCORE);
    }
  }, [isCorrectGuess, score, price, upsertScore]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
      <Header />
      <BitcoinPrice guessPrice={priceAtTimeOfGuess} currentPrice={price} finalPrice={finalPrice} />
      <Score score={score} loading={loading} error={error} />
      <GuessButtons onGuess={handleGuess} isDisabled={isGameActive} guess={guess} />
    </div>
  );
};

export default BtcPriceGuessGame;
