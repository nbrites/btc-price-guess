import { render, screen } from '@testing-library/react';
import BitcoinPrice from './BitcoinPrice';

describe('BitcoinPrice Component', () => {
  test('should display prices correctly when all values are provided', () => {
    const currentPrice = 50000;
    const guessPrice = 48000;
    const finalPrice = 49000;
    const remainingTime = 30;

    render(
      <BitcoinPrice
        currentPrice={currentPrice}
        guessPrice={guessPrice}
        finalPrice={finalPrice}
        remainingTime={remainingTime}
      />
    );

    expect(screen.getByText('$48000.00')).toBeInTheDocument();
    expect(screen.getByText('$50000.00')).toBeInTheDocument();
    expect(screen.getByText('$49000.00')).toBeInTheDocument();
  });

  test('should display "Loading..." when currentPrice is null', () => {
    const currentPrice = null;
    const guessPrice = 48000;
    const finalPrice = 49000;
    const remainingTime = 30;

    render(
      <BitcoinPrice
        currentPrice={currentPrice}
        guessPrice={guessPrice}
        finalPrice={finalPrice}
        remainingTime={remainingTime}
      />
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('should display "-" when guessPrice is null', () => {
    const currentPrice = 50000;
    const guessPrice = null;
    const finalPrice = 49000;
    const remainingTime = 30;

    render(
      <BitcoinPrice
        currentPrice={currentPrice}
        guessPrice={guessPrice}
        finalPrice={finalPrice}
        remainingTime={remainingTime}
      />
    );

    expect(screen.getByText('-')).toBeInTheDocument();
  });

  test('should display remaining time when finalPrice is null', () => {
    const currentPrice = 50000;
    const guessPrice = 48000;
    const finalPrice = null;
    const remainingTime = 30;

    render(
      <BitcoinPrice
        currentPrice={currentPrice}
        guessPrice={guessPrice}
        finalPrice={finalPrice}
        remainingTime={remainingTime}
      />
    );

    expect(screen.getByText('⏳ 30s')).toBeInTheDocument();
  });
});
