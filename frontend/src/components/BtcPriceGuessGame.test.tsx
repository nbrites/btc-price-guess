import { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import BtcPriceGuessGame from './BtcPriceGuessGame';
import { BtcGuessGameMessages } from '../enums/GuessGameMessages.enum';

jest.mock('../hooks/useBTCPrice', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('BtcPriceGuessGame', () => {
  it('fetches and displays initial score correctly', async () => {
    const mockPrice = { price: 51000, priceAtTimeOfGuess: 50000, finalPrice: null, setFinalPrice: jest.fn(), setPriceAtTimeOfGuess: jest.fn() };
    require('../hooks/useBTCPrice').default.mockReturnValue(mockPrice);

    await act(async () => {
      render(<BtcPriceGuessGame />);
    });

    await waitFor(() => {
      expect(screen.getByText('$50000.00')).toBeInTheDocument();
    });
  });

  it('handles a correct guess and updates status correctly', async () => {
    jest.useFakeTimers();

    //@ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ok: true, data: { amount: '50000' } }),
      })
    );

    const mockPrice = { price: 51000, priceAtTimeOfGuess: 50000, finalPrice: 49000, setFinalPrice: jest.fn(), setPriceAtTimeOfGuess: jest.fn() };
    require('../hooks/useBTCPrice').default.mockReturnValue(mockPrice);

    await act(async () => {
      render(<BtcPriceGuessGame />);
    });

    await waitFor(() => {
      expect(screen.getByText('$50000.00')).toBeInTheDocument();
    });

    const upButton = screen.getByRole('button', { name: /guess up/i });
    act(() => {
      fireEvent.click(upButton);
    });

    await waitFor(() => {
      expect(screen.getByText(BtcGuessGameMessages.GUESS_ON_TRACK)).toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it('handles an incorrect guess and updates status correctly', async () => {
    jest.useFakeTimers();

    //@ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ok: true, data: { amount: '50000' } }),
      })
    );

    const mockPrice = { price: 49000, priceAtTimeOfGuess: 50000, finalPrice: 5000, setPriceAtTimeOfGuess: jest.fn(), setFinalPrice: jest.fn() };
    require('../hooks/useBTCPrice').default.mockReturnValue(mockPrice);

    await act(async () => {
      render(<BtcPriceGuessGame />);
    });

    await waitFor(() => {
      expect(screen.getByText('$50000.00')).toBeInTheDocument();
    });

    const upButton = screen.getByRole('button', { name: /guess up/i });
    act(() => {
      fireEvent.click(upButton);
    });

    await waitFor(() => {
      expect(screen.getByText(BtcGuessGameMessages.GUESS_OFF_TRACK)).toBeInTheDocument();
    });

    jest.useRealTimers();
  });


  it('handles the timer expiration, shows the game win message and updated score', async () => {
    process.env.REACT_APP_BTC_GUESS_GAME_DURATION_MILLISECONDS = '20000';

    jest.useFakeTimers();

    //@ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ok: true, data: { amount: '50000' } }),
      })
    );

    const mockPrice = { price: 51000, priceAtTimeOfGuess: 50000, finalPrice: 51000, setFinalPrice: jest.fn(), setPriceAtTimeOfGuess: jest.fn() };
    require('../hooks/useBTCPrice').default.mockReturnValue(mockPrice);

    await act(async () => {
      render(<BtcPriceGuessGame />);
    });

    await waitFor(() => {
      expect(screen.getByText('$50000.00')).toBeInTheDocument();
    });

    const upButton = screen.getByRole('button', { name: /guess up/i });
    act(() => {
      fireEvent.click(upButton);
    });

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    await waitFor(() => {
      expect(screen.getByText(BtcGuessGameMessages.GUESS_ON_TRACK)).toBeInTheDocument();
    });

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    await waitFor(() => {
      expect(screen.getByText(BtcGuessGameMessages.WIN)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Score 🎯')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it('handles the timer expiration, shows the game loss message and no score update', async () => {
    process.env.REACT_APP_BTC_GUESS_GAME_DURATION_MILLISECONDS = '20000';

    jest.useFakeTimers();

    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ok: true, data: { amount: '50000' } }),
      })
    );

    const mockPrice = {
      price: 51000,
      priceAtTimeOfGuess: 50000,
      finalPrice: 49000,
      setFinalPrice: jest.fn(),
      setPriceAtTimeOfGuess: jest.fn(),
    };
    require('../hooks/useBTCPrice').default.mockReturnValue(mockPrice);

    await act(async () => {
      render(<BtcPriceGuessGame />);
    });

    await waitFor(() => {
      expect(screen.getByText('$50000.00')).toBeInTheDocument();
    });

    const downButton = screen.getByRole('button', { name: /guess down/i });
    act(() => {
      fireEvent.click(downButton);
    });

    mockPrice.price = 51000;

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    await waitFor(() => {
      expect(screen.getByText(BtcGuessGameMessages.GUESS_OFF_TRACK)).toBeInTheDocument();
    });

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    await waitFor(() => {
      expect(screen.getByText(BtcGuessGameMessages.LOSS)).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it('handles a draw scenario where the guessed price is equal to the final price', async () => {
    jest.useFakeTimers();

    //@ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ok: true, data: { amount: '50000' } }),
      })
    );

    const mockPrice = {
      price: 51000,
      priceAtTimeOfGuess: 50000,
      finalPrice: 50000,
      setFinalPrice: jest.fn(),
      setPriceAtTimeOfGuess: jest.fn(),
    };
    require('../hooks/useBTCPrice').default.mockReturnValue(mockPrice);

    await act(async () => {
      render(<BtcPriceGuessGame />);
    });

    await waitFor(() => {
      const priceElements = screen.getAllByText('$50000.00');
      expect(priceElements[0]).toBeInTheDocument(); // for "Guess Price"
      expect(priceElements[1]).toBeInTheDocument(); // for "Final Price"
    });

    const upButton = screen.getByRole('button', { name: /guess up/i });
    act(() => {
      fireEvent.click(upButton);
    });

    act(() => {
      jest.advanceTimersByTime(60000);
    });

    await waitFor(() => {
      expect(screen.getByText(/The price ended where it started, no win or loss/)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Score 🎯')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByText(/Congratulations! You've guessed correctly/)).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });

});
