import React from "react";
import Header from "./Header";
import BitcoinPrice from "./BitcoinPrice";
import Score from "./Score";
import useBTCPrice from "../hooks/useBTCPrice";
import useScore from "../hooks/useScore";
import useUserId from "../hooks/useUserId";

const BtcPriceGuessGame: React.FC = () => {
  const { price, priceAtTimeOfGuess } = useBTCPrice();
  const userId = useUserId();
  const { score, loading, error } = useScore(userId);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
      <Header />
      <BitcoinPrice lockedPrice={priceAtTimeOfGuess} currentPrice={price} />
      <Score score={score} loading={loading} error={error} />
    </div>
  );
};

export default BtcPriceGuessGame;
