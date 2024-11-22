import React from 'react';

const Header: React.FC = () => (
  <header className="flex flex-col items-center justify-center">
    <h1 className="text-3xl font-bold mb-4">BTC Price Guessing Game</h1>
    <p className="text-lg">Guess whether the market price of Bitcoin (BTC/USD) will be higher or lower after one minute.</p>
  </header>
);

export default Header;
