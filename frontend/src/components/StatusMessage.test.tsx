import { render, screen, waitFor } from '@testing-library/react';
import StatusMessage from './StatusMessage';

describe('StatusMessage Component', () => {
  it('renders the status message correctly', async () => {
    render(<StatusMessage status="Price hasn't changed yet..." />);

    await waitFor(() => {
      const statusElement = screen.getByText("Price hasn't changed yet...");
      expect(statusElement).toBeInTheDocument();
    });
  });

  it('applies pulse animation on status change', () => {
    const { rerender } = render(<StatusMessage status="Price hasn't changed yet..." />);

    // Get the status element that contains the text
    const statusElement = screen.getByText("Price hasn't changed yet...");
    expect(statusElement).toBeInTheDocument();

    // Change status and re-render
    rerender(<StatusMessage status="Price is increasing!" />);

    // Get the updated status element
    const updatedStatusElement = screen.getByText("Price is increasing!");
    expect(updatedStatusElement).toBeInTheDocument();

    // Check that the animation classes are applied to the child element
    const statusMessageElement = updatedStatusElement.closest('.status-message');
    expect(statusMessageElement).toHaveClass('animate__animated');
    expect(statusMessageElement).toHaveClass('animate__pulse');
  });

  it('initializes prevStatus correctly', () => {
    const { rerender } = render(<StatusMessage status="Waiting for your guess..." />);

    // Initially prevStatus should be null
    expect(screen.queryByText("Waiting for your guess...")).toBeInTheDocument();

    // Change status and check if prevStatus is updated
    rerender(<StatusMessage status="Price hasn't changed yet..." />);

    expect(screen.queryByText("Price hasn't changed yet...")).toBeInTheDocument();
  });

  it('handles empty status correctly', () => {
    const { rerender } = render(<StatusMessage status="" />);

    // Check if empty status results in the fallback message
    expect(screen.getByText("No status available")).toBeInTheDocument();

    // Re-render with a new status message
    rerender(<StatusMessage status="New status message!" />);

    // Ensure the new status message is rendered
    expect(screen.getByText("New status message!")).toBeInTheDocument();
  });

  it('handles special characters correctly', async () => {
    render(<StatusMessage status="🔥 High price alert! 🔥" />);

    const statusElement = screen.getByText("🔥 High price alert! 🔥");
    expect(statusElement).toBeInTheDocument();
  });

  it('handles multiple status changes correctly', async () => {
    const { rerender } = render(<StatusMessage status="Waiting for your guess..." />);

    expect(screen.queryByText("Waiting for your guess...")).toBeInTheDocument();

    rerender(<StatusMessage status="Price is increasing!" />);
    expect(screen.queryByText("Price is increasing!")).toBeInTheDocument();

    rerender(<StatusMessage status="Price is stable!" />);
    expect(screen.queryByText("Price is stable!")).toBeInTheDocument();

    rerender(<StatusMessage status="🚀 You're on the right track!" />);
    expect(screen.queryByText("🚀 You're on the right track!")).toBeInTheDocument();
  });

  it('handles rapid status changes correctly', async () => {
    const { rerender } = render(<StatusMessage status="Waiting for your guess..." />);

    rerender(<StatusMessage status="Price hasn't changed yet..." />);
    expect(screen.queryByText("Price hasn't changed yet...")).toBeInTheDocument();

    rerender(<StatusMessage status="Price is increasing!" />);
    expect(screen.queryByText("Price is increasing!")).toBeInTheDocument();

    rerender(<StatusMessage status="Price is dropping!" />);
    expect(screen.queryByText("Price is dropping!")).toBeInTheDocument();
  });
});
