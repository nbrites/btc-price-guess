import { renderHook } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import useScore from "./useScore";

global.fetch = jest.fn();

const mockScore = 100;
const mockResponse = { score: mockScore };

describe("useScore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch and set the score for a valid user ID", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useScore("user123"));

    await waitFor(() => {
      expect(result.current.score).toBe(mockScore);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    expect(fetch).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_BASE_URL || ""}/scores/user123`
    );
  });

  it("should handle fetch errors gracefully", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useScore("user123"));

    await waitFor(() => {
      expect(result.current.error).toBe("Failed to fetch score");
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.score).toBe(0);
  });

  it("should set an error if userId is missing", async () => {
    const { result } = renderHook(() => useScore(null));

    await waitFor(() => {
      expect(result.current.error).toBe("User ID is missing");
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.score).toBe(0);
  });

  it("should set score to 0 if no score is returned from the API", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}), // No `score` key
    });

    const { result } = renderHook(() => useScore("user123"));

    await waitFor(() => {
      expect(result.current.score).toBe(0);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  it("should set loading state correctly", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useScore("user123"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});
