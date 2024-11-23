import React from 'react';
import { render, screen } from '@testing-library/react';
import Score from './Score';

describe('Score Component', () => {
  it('renders without crashing', () => {
    render(<Score score={0} loading={false} error={null} />);
    const scoreElement = screen.getByText(/Score/i);
    expect(scoreElement).toBeInTheDocument();
  });

  it('displays the correct score when loading is false and no error', () => {
    render(<Score score={10} loading={false} error={null} />);
    const scoreValue = screen.getByText('10');
    expect(scoreValue).toBeInTheDocument();
  });

  it('displays "Loading score..." when loading is true', () => {
    render(<Score score={null} loading={true} error={null} />);
    const loadingText = screen.getByText(/Loading score.../i);
    expect(loadingText).toBeInTheDocument();
  });

  it('displays an error message when there is an error', () => {
    render(<Score score={null} loading={false} error="Failed to fetch score" />);
    const errorText = screen.getByText(/Error: Failed to fetch score/i);
    expect(errorText).toBeInTheDocument();
  });

  it('does not display score when there is an error', () => {
    render(<Score score={10} loading={false} error="Failed to fetch score" />);
    const scoreValue = screen.queryByText('10');
    expect(scoreValue).not.toBeInTheDocument();
  });

  it('does not display loading text or error when loading is false and no error', () => {
    render(<Score score={25} loading={false} error={null} />);
    const loadingText = screen.queryByText(/Loading score.../i);
    const errorText = screen.queryByText(/Error:/i);
    expect(loadingText).not.toBeInTheDocument();
    expect(errorText).not.toBeInTheDocument();
  });

  it('updates the displayed score when score prop changes', () => {
    const { rerender } = render(<Score score={10} loading={false} error={null} />);
    expect(screen.getByText('10')).toBeInTheDocument();
    rerender(<Score score={20} loading={false} error={null} />);
    expect(screen.getByText('20')).toBeInTheDocument();
  });
});
