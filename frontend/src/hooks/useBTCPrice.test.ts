import { renderHook, act } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import useBTCPrice from "./useBTCPrice";

global.fetch = jest.fn();

const mockBTCPrice = "50000.00";
const mockResponse = {
  data: {
    amount: mockBTCPrice,
  },
};

describe("useBTCPrice", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch and set the Bitcoin price on mount", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useBTCPrice());

    await waitFor(() => {
      expect(result.current.price).toBe(parseFloat(mockBTCPrice));
    });

    expect(fetch).toHaveBeenCalledWith(
      "https://api.coinbase.com/v2/prices/spot?currency=USD",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
  });

  it("should handle fetch errors gracefully", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    const { result } = renderHook(() => useBTCPrice());

    await waitFor(() => {
      expect(result.current.error).toBe("Error while fetching Bitcoin price");
    });

    expect(result.current.price).toBe(null);
    expect(result.current.loading).toBe(false);
  });

  it("should update `priceAtTimeOfGuess` when setPriceAtTimeOfGuess is called", () => {
    const { result } = renderHook(() => useBTCPrice());

    act(() => {
      result.current.setPriceAtTimeOfGuess(49000);
    });

    expect(result.current.priceAtTimeOfGuess).toBe(49000);
  });

  it("should keep updating the price at the refresh interval", async () => {
    jest.useFakeTimers();

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    renderHook(() => useBTCPrice());

    jest.advanceTimersByTime(10000);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    jest.useRealTimers();
  });

  it("should clean up the interval on unmount", () => {
    jest.useFakeTimers();

    const { unmount } = renderHook(() => useBTCPrice());

    unmount();
    jest.advanceTimersByTime(10000);

    expect(fetch).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });

  it("should handle invalid JSON response gracefully", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error("Invalid JSON");
      },
    });

    const { result } = renderHook(() => useBTCPrice());

    await waitFor(() => {
      expect(result.current.error).toBe("Invalid JSON");
    });

    expect(result.current.price).toBe(null);
    expect(result.current.loading).toBe(false);
  });
});
