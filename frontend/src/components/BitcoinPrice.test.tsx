import { act } from 'react';
import { render, screen } from '@testing-library/react';
import BitcoinPrice from './BitcoinPrice';

describe('BitcoinPrice Component', () => {
  test('should display prices correctly when all values are provided', async () => {
    const currentPrice = 50000;
    const lockedPrice = 48000;

    await act(async () => {
      render(
        <BitcoinPrice
          currentPrice={currentPrice}
          lockedPrice={lockedPrice}
        />
      );
    });

    expect(screen.getByText('$48000.00')).toBeInTheDocument();
    expect(screen.getByText('$50000.00')).toBeInTheDocument();
  });

  test('should display "Loading..." when currentPrice is null', async () => {
    const currentPrice = null;
    const lockedPrice = 48000;

    await act(async () => {
      render(
        <BitcoinPrice
          currentPrice={currentPrice}
          lockedPrice={lockedPrice}
        />
      );
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('should display "-" when lockedPrice is null', async () => {
    const currentPrice = 50000;
    const lockedPrice = null;

    await act(async () => {
      render(
        <BitcoinPrice
          currentPrice={currentPrice}
          lockedPrice={lockedPrice}
        />
      );
    });

    expect(screen.getByText('-')).toBeInTheDocument();
  });
});
