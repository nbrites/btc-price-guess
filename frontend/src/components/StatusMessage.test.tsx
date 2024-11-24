import { render, screen, waitFor } from '@testing-library/react';
import StatusMessage from './StatusMessage';

describe('StatusMessage Component', () => {
  it('renders the status message and remaining time correctly', async () => {
    render(<StatusMessage status="Price hasn't changed yet..." remainingTime={30} />);

    await waitFor(() => {
      const statusElement = screen.getByText("Price hasn't changed yet...");
      expect(statusElement).toBeInTheDocument();
      const timeElement = screen.getByText("⏳ 30s");
      expect(timeElement).toBeInTheDocument();
    });
  });

  it('applies pulse animation on status change', () => {
    const { rerender } = render(
      <StatusMessage status="Price hasn't changed yet..." remainingTime={60} />
    );

    const statusElement = screen.getByText("Price hasn't changed yet...");
    expect(statusElement).toBeInTheDocument();

    const timeElement = screen.getByText("⏳ 60s");
    expect(timeElement).toBeInTheDocument();

    rerender(<StatusMessage status="Price is increasing!" remainingTime={45} />);

    const updatedStatusElement = screen.getByText("Price is increasing!");
    expect(updatedStatusElement).toBeInTheDocument();

    const updatedTimeElement = screen.getByText("⏳ 45s");
    expect(updatedTimeElement).toBeInTheDocument();

    const statusMessageElement = updatedStatusElement.closest('.status-message');
    expect(statusMessageElement).toHaveClass('animate__animated');
    expect(statusMessageElement).toHaveClass('animate__pulse');
  });

  it('initializes prevStatus correctly', () => {
    const { rerender } = render(
      <StatusMessage status="Waiting for your guess..." remainingTime={20} />
    );

    expect(screen.queryByText("Waiting for your guess...")).toBeInTheDocument();
    expect(screen.queryByText("⏳ 20s")).toBeInTheDocument();

    rerender(<StatusMessage status="Price hasn't changed yet..." remainingTime={10} />);

    expect(screen.queryByText("Price hasn't changed yet...")).toBeInTheDocument();
    expect(screen.queryByText("⏳ 10s")).toBeInTheDocument();
  });

  it('handles empty status correctly', () => {
    const { rerender } = render(<StatusMessage status="" remainingTime={5} />);

    expect(screen.getByText("No status available")).toBeInTheDocument();
    expect(screen.getByText("⏳ 5s")).toBeInTheDocument();

    rerender(<StatusMessage status="New status message!" remainingTime={3} />);

    expect(screen.getByText("New status message!")).toBeInTheDocument();
    expect(screen.getByText("⏳ 3s")).toBeInTheDocument();
  });

  it('handles special characters correctly', async () => {
    render(<StatusMessage status="🔥 High price alert! 🔥" remainingTime={15} />);

    const statusElement = screen.getByText("🔥 High price alert! 🔥");
    expect(statusElement).toBeInTheDocument();
    const timeElement = screen.getByText("⏳ 15s");
    expect(timeElement).toBeInTheDocument();
  });

  it('handles multiple status changes correctly', async () => {
    const { rerender } = render(
      <StatusMessage status="Waiting for your guess..." remainingTime={60} />
    );

    expect(screen.queryByText("Waiting for your guess...")).toBeInTheDocument();
    expect(screen.queryByText("⏳ 60s")).toBeInTheDocument();

    rerender(<StatusMessage status="Price is increasing!" remainingTime={30} />);
    expect(screen.queryByText("Price is increasing!")).toBeInTheDocument();
    expect(screen.queryByText("⏳ 30s")).toBeInTheDocument();

    rerender(<StatusMessage status="Price is stable!" remainingTime={15} />);
    expect(screen.queryByText("Price is stable!")).toBeInTheDocument();
    expect(screen.queryByText("⏳ 15s")).toBeInTheDocument();

    rerender(<StatusMessage status="🚀 You're on the right track!" remainingTime={5} />);
    expect(screen.queryByText("🚀 You're on the right track!")).toBeInTheDocument();
    expect(screen.queryByText("⏳ 5s")).toBeInTheDocument();
  });

  it('handles rapid status changes correctly', async () => {
    const { rerender } = render(
      <StatusMessage status="Waiting for your guess..." remainingTime={45} />
    );

    rerender(<StatusMessage status="Price hasn't changed yet..." remainingTime={30} />);
    expect(screen.queryByText("Price hasn't changed yet...")).toBeInTheDocument();
    expect(screen.queryByText("⏳ 30s")).toBeInTheDocument();

    rerender(<StatusMessage status="Price is increasing!" remainingTime={15} />);
    expect(screen.queryByText("Price is increasing!")).toBeInTheDocument();
    expect(screen.queryByText("⏳ 15s")).toBeInTheDocument();

    rerender(<StatusMessage status="Price is dropping!" remainingTime={5} />);
    expect(screen.queryByText("Price is dropping!")).toBeInTheDocument();
    expect(screen.queryByText("⏳ 5s")).toBeInTheDocument();
  });
});
