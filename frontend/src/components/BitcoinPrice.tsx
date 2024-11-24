import React from 'react';

interface BitcoinPriceProps {
  currentPrice: number | null;
  guessPrice: number | null;
  finalPrice: number | null;
}

const BitcoinPrice: React.FC<BitcoinPriceProps> = ({ guessPrice, currentPrice, finalPrice }) => {
  return (
    <div className="text-center mt-8">
      <div className="flex items-center justify-center space-x-10">
        <div className="bg-white p-6 rounded-xl shadow-lg w-56 opacity-90">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Guess Price 🤔</h3>
          <div className="text-3xl font-bold text-gray-900">
            {guessPrice !== null ? `$${guessPrice.toFixed(2)}` : '-'}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg w-56 opacity-90">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Current Price 📈</h3>
          <div className="text-3xl font-bold text-gray-900">
            {currentPrice !== null ? `$${currentPrice.toFixed(2)}` : 'Loading...'}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg w-56 opacity-90">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Final Price 🏁</h3>
          <div className="text-3xl font-bold text-gray-900">
            {finalPrice !== null ? `$${finalPrice.toFixed(2)}` : '?'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BitcoinPrice;
