import React, { useState, useCallback, useEffect } from "react";
import { useTimer } from 'react-timer-hook';


import Header from "./Header";
import BitcoinPrice from "./BitcoinPrice";
import Score from "./Score";
import StatusMessage from "./StatusMessage"
import useBTCPrice from "../hooks/useBTCPrice";
import useScore from "../hooks/useScore";
import useUserId from "../hooks/useUserId";
import GuessButtons from "./GuessButtons";
import { GuessDirection } from "../enums/GuessDirection.enum"
import { BtcGuessGameMessages } from "../enums/GuessGameMessages.enum"

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
  const [statusMessage, setStatusMessage] = useState<string | null>(BtcGuessGameMessages.WAITING_FOR_GUESS);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

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
    setResultMessage(null);

    if (seconds === gameDurationSeconds) {
      start();
    } else {
      restart(new Date(new Date().getTime() + gameDurationSeconds * 1000));
    }
  };

  const isCorrectGuess = useCallback((): boolean => {
    if (price === null || priceAtTimeOfGuess === null) {
      return false;
    }

    switch (guess) {
      case GuessDirection.UP:
        return price > priceAtTimeOfGuess;
      case GuessDirection.DOWN:
        return price < priceAtTimeOfGuess;
      default:
        return false;
    }
  }, [price, priceAtTimeOfGuess, guess]);

  const handleGameResult = useCallback(async () => {
    let newScore;
    if (isCorrectGuess()) {
      newScore = score + 1;
      setResultMessage(BtcGuessGameMessages.WIN);
    } else {
      newScore = Math.max(score - 1, 0);
      setResultMessage(BtcGuessGameMessages.LOSS);
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

  const updateStatusBasedOnPrice = useCallback(() => {
    if (price === null || priceAtTimeOfGuess === null || guess === null) {
      return;
    }

    const getStatusMessage = () => {
      if (price === priceAtTimeOfGuess) {
        return BtcGuessGameMessages.WAITING_PRICE_UPDATE;
      }

      return isCorrectGuess() ? BtcGuessGameMessages.GUESS_ON_TRACK : BtcGuessGameMessages.GUESS_OFF_TRACK;
    };

    setStatusMessage(getStatusMessage());
  }, [price, priceAtTimeOfGuess, guess, isCorrectGuess]);

  useEffect(() => {
    if (price && priceAtTimeOfGuess && guess) {
      updateStatusBasedOnPrice();
    }
  }, [price, priceAtTimeOfGuess, guess, updateStatusBasedOnPrice]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
      <Header />
      <div className="flex flex-row space-x-10 mt-6">
        <BitcoinPrice guessPrice={priceAtTimeOfGuess} currentPrice={price} finalPrice={finalPrice} remainingTime={seconds} />
        <Score score={score} loading={loading} error={error} />
      </div>
      <div className="mt-4 w-full">
        <StatusMessage status={resultMessage || statusMessage} />
      </div>

      <GuessButtons onGuess={handleGuess} isDisabled={isGameActive} guess={guess} />
    </div>
  );
};

export default BtcPriceGuessGame;
