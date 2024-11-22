import Header from './Header';
import BitcoinPrice from './BitcoinPrice';
import useBTCPrice from '../hooks/useBTCPrice';

const BtcPriceGuessGame: React.FC = () => {
  const { price, priceAtTimeOfGuess } = useBTCPrice();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
      <Header />
      <BitcoinPrice lockedPrice={priceAtTimeOfGuess} currentPrice={price} />
    </div>
  );
};

export default BtcPriceGuessGame;
