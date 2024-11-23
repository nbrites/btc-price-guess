import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GuessButtons from './GuessButtons';
import { GuessDirection } from "../enums/GuessDirection.enum"

describe('GuessButtons Component', () => {
  const onGuessMock = jest.fn();

  test('renders both buttons with correct text', () => {
    render(
      <GuessButtons onGuess={onGuessMock} isDisabled={false} guess={null} />
    );

    expect(screen.getByText(/Guess Up/i)).toBeInTheDocument();
    expect(screen.getByText(/Guess Down/i)).toBeInTheDocument();
  });

  test('calls onGuess with the correct value when Guess Up is clicked', () => {
    render(
      <GuessButtons onGuess={onGuessMock} isDisabled={false} guess={null} />
    );

    fireEvent.click(screen.getByText(/Guess Up/i));
    expect(onGuessMock).toHaveBeenCalledWith(GuessDirection.UP);
  });

  test('calls onGuess with the correct value when Guess Down is clicked', () => {
    render(
      <GuessButtons onGuess={onGuessMock} isDisabled={false} guess={null} />
    );

    fireEvent.click(screen.getByText(/Guess Down/i));
    expect(onGuessMock).toHaveBeenCalledWith(GuessDirection.DOWN);
  });

  test('disables buttons when isDisabled is true', () => {
    render(
      <GuessButtons onGuess={onGuessMock} isDisabled={true} guess={null} />
    );

    const guessUpButton = screen.getByText(/Guess Up/i);
    const guessDownButton = screen.getByText(/Guess Down/i);

    expect(guessUpButton).toBeDisabled();
    expect(guessDownButton).toBeDisabled();
  });

  test('applies the correct styles when Guess Up is selected', () => {
    render(
      <GuessButtons onGuess={onGuessMock} isDisabled={false} guess={GuessDirection.UP} />
    );

    const guessUpButton = screen.getByText(/Guess Up/i);
    expect(guessUpButton).toHaveClass('bg-green-500 opacity-80');
  });

  test('applies the correct styles when Guess Down is selected', () => {
    render(
      <GuessButtons onGuess={onGuessMock} isDisabled={false} guess={GuessDirection.DOWN} />
    );

    const guessDownButton = screen.getByText(/Guess Down/i);
    expect(guessDownButton).toHaveClass('bg-red-500 opacity-80');
  });

  test('buttons are accessible with correct aria attributes', () => {
    render(
      <GuessButtons onGuess={onGuessMock} isDisabled={false} guess={GuessDirection.UP} />
    );

    const guessUpButton = screen.getByText(/Guess Up/i);
    const guessDownButton = screen.getByText(/Guess Down/i);

    expect(guessUpButton).toHaveAttribute('aria-pressed', 'true');
    expect(guessDownButton).toHaveAttribute('aria-pressed', 'false');
  });
});
