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
    const mockPrice = { price: 51000, priceAtTimeOfGuess: 50000, setPriceAtTimeOfGuess: jest.fn() };
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

    const mockPrice = { price: 51000, priceAtTimeOfGuess: 50000, setPriceAtTimeOfGuess: jest.fn() };
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

    const mockPrice = { price: 49000, priceAtTimeOfGuess: 50000, setPriceAtTimeOfGuess: jest.fn() };
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
    jest.useFakeTimers();

    //@ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ok: true, data: { amount: '50000' } }),
      })
    );

    const mockPrice = { price: 51000, priceAtTimeOfGuess: 50000, setPriceAtTimeOfGuess: jest.fn() };
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
    jest.useFakeTimers();

    //@ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ok: true, data: { amount: '50000' } }),
      })
    );

    const mockPrice = { price: 51000, priceAtTimeOfGuess: 50000, setPriceAtTimeOfGuess: jest.fn() };
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
    });

    await waitFor(() => {
      expect(screen.getByText('Score 🎯')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    jest.useRealTimers();
  });
});