import { renderHook } from "@testing-library/react";
import { v4 as uuidv4 } from "uuid";
import useUserId from "./useUserId";

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

describe("useUserId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("should return a user ID from localStorage if it exists", () => {
    const mockUserId = "existing-user-id";
    localStorage.setItem("userId", mockUserId);

    const { result } = renderHook(() => useUserId());

    expect(result.current).toBe(mockUserId);
  });

  it("should generate a new user ID if one does not exist in localStorage", () => {
    const mockGeneratedUserId = "new-generated-user-id";
    (uuidv4 as jest.Mock).mockReturnValue(mockGeneratedUserId);

    const { result } = renderHook(() => useUserId());

    expect(result.current).toBe(mockGeneratedUserId);
    expect(localStorage.getItem("userId")).toBe(mockGeneratedUserId);
  });

  it("should store the newly generated user ID in localStorage", () => {
    const mockGeneratedUserId = "new-generated-user-id";
    (uuidv4 as jest.Mock).mockReturnValue(mockGeneratedUserId);

    renderHook(() => useUserId());

    expect(localStorage.getItem("userId")).toBe(mockGeneratedUserId);
  });

  it("should only set userId once on initial render", () => {
    const mockGeneratedUserId = "new-generated-user-id";
    (uuidv4 as jest.Mock).mockReturnValue(mockGeneratedUserId);

    const { result, rerender } = renderHook(() => useUserId());

    rerender();

    expect(result.current).toBe(mockGeneratedUserId);
    expect(localStorage.getItem("userId")).toBe(mockGeneratedUserId);
    expect(uuidv4).toHaveBeenCalledTimes(1);
  });
});
