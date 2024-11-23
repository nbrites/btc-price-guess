import { act } from "react";
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
      json: async () => ({}),
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

  it("should upsert the score when upsertScore is called", async () => {
    const newScore = 150;

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ score: mockScore }),
    });

    const { result } = renderHook(() => useScore("user123"));

    await waitFor(() => {
      expect(result.current.score).toBe(mockScore);
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ score: newScore }),
    });

    await act(async () => {
      await result.current.upsertScore(newScore);
    });

    expect(result.current.score).toBe(newScore);
    expect(result.current.error).toBe(null);

    expect(fetch).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_BASE_URL || ""}/scores`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ userId: "user123", score: newScore }),
      })
    );
  });

  it("should handle errors when upserting score", async () => {
    const newScore = 150;

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ score: mockScore }),
    });

    const { result } = renderHook(() => useScore("user123"));

    await waitFor(() => {
      expect(result.current.score).toBe(mockScore);
    });

    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    await act(async () => {
      await result.current.upsertScore(newScore);
    });

    expect(result.current.score).toBe(mockScore);
    expect(result.current.error).toBe("Failed to upsert the score");

    expect(fetch).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_BASE_URL || ""}/scores`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ userId: "user123", score: newScore }),
      })
    );
  });

  it("should set an error when userId is missing during upsert", async () => {
    const { result } = renderHook(() => useScore(null));

    await act(async () => {
      await result.current.upsertScore(150);
    });

    expect(result.current.error).toBe("User ID is missing");
  });
});
