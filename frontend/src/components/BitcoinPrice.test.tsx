import { render, screen } from '@testing-library/react';
import BitcoinPrice from './BitcoinPrice';

describe('BitcoinPrice Component', () => {

  test('should display prices correctly when all values are provided', () => {
    const currentPrice = 50000;
    const guessPrice = 48000;
    const finalPrice = 49000;
    const loading = false;
    const error = null;

    render(
      <BitcoinPrice
        currentPrice={currentPrice}
        guessPrice={guessPrice}
        finalPrice={finalPrice}
        loading={loading}
        error={error}
      />
    );

    expect(screen.getByText('$48000.00')).toBeInTheDocument(); // Guess Price
    expect(screen.getByText('$50000.00')).toBeInTheDocument(); // Current Price
    expect(screen.getByText('$49000.00')).toBeInTheDocument(); // Final Price
  });

  test('should display "Loading..." when currentPrice is null and loading is true', () => {
    const currentPrice = null;
    const guessPrice = 48000;
    const finalPrice = 49000;
    const loading = true;
    const error = null;

    render(
      <BitcoinPrice
        currentPrice={currentPrice}
        guessPrice={guessPrice}
        finalPrice={finalPrice}
        loading={loading}
        error={error}
      />
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('should display error message when there is an error', () => {
    const currentPrice = 50000;
    const guessPrice = 48000;
    const finalPrice = 49000;
    const loading = false;
    const error = 'Failed to fetch data';

    render(
      <BitcoinPrice
        currentPrice={currentPrice}
        guessPrice={guessPrice}
        finalPrice={finalPrice}
        loading={loading}
        error={error}
      />
    );

    expect(screen.getByText('Error: Failed to fetch data')).toBeInTheDocument();
  });

  test('should display "Loading..." when currentPrice is null and loading is false', () => {
    const currentPrice = null;
    const guessPrice = 48000;
    const finalPrice = 49000;
    const loading = false;
    const error = null;

    render(
      <BitcoinPrice
        currentPrice={currentPrice}
        guessPrice={guessPrice}
        finalPrice={finalPrice}
        loading={loading}
        error={error}
      />
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('should display "-" when guessPrice is null', () => {
    const currentPrice = 50000;
    const guessPrice = null;
    const finalPrice = 49000;
    const loading = false;
    const error = null;

    render(
      <BitcoinPrice
        currentPrice={currentPrice}
        guessPrice={guessPrice}
        finalPrice={finalPrice}
        loading={loading}
        error={error}
      />
    );

    expect(screen.getByText('-')).toBeInTheDocument();
  });

  test('should display "?" when finalPrice is null', () => {
    const currentPrice = 50000;
    const guessPrice = 48000;
    const finalPrice = null;
    const loading = false;
    const error = null;

    render(
      <BitcoinPrice
        currentPrice={currentPrice}
        guessPrice={guessPrice}
        finalPrice={finalPrice}
        loading={loading}
        error={error}
      />
    );

    expect(screen.getByText('?')).toBeInTheDocument();
  });

  test('should display "Loading..." when both currentPrice and finalPrice are null and loading is true', () => {
    const currentPrice = null;
    const guessPrice = 48000;
    const finalPrice = null;
    const loading = true;
    const error = null;

    render(
      <BitcoinPrice
        currentPrice={currentPrice}
        guessPrice={guessPrice}
        finalPrice={finalPrice}
        loading={loading}
        error={error}
      />
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('should display default values when all props are null and loading is false', () => {
    const currentPrice = null;
    const guessPrice = null;
    const finalPrice = null;
    const loading = false;
    const error = null;

    render(
      <BitcoinPrice
        currentPrice={currentPrice}
        guessPrice={guessPrice}
        finalPrice={finalPrice}
        loading={loading}
        error={error}
      />
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
