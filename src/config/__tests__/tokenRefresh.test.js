import { describe, it, expect, beforeEach, vi } from "vitest";
import { refreshWithLock } from "../tokenRefresh";

describe("tokenRefresh - refreshWithLock", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("should return true if a recent successful refresh occurred < 3 seconds ago", async () => {
    const recentResult = { success: true, ts: Date.now() - 1000 };
    localStorage.setItem("auth-refresh-result", JSON.stringify(recentResult));

    const mockAxios = { post: vi.fn() };
    const result = await refreshWithLock(mockAxios);

    expect(result).toBe(true);
    expect(mockAxios.post).not.toHaveBeenCalled();
  });

  it("should acquire lock and perform refresh request when no recent result exists", async () => {
    const mockAxios = {
      post: vi.fn().mockResolvedValue({ data: { status: "OK" } }),
    };

    const result = await refreshWithLock(mockAxios);

    expect(result).toBe(true);
    expect(mockAxios.post).toHaveBeenCalledWith("/auth/refresh", null, {
      skipAuthRefresh: true,
    });

    const storedResult = JSON.parse(localStorage.getItem("auth-refresh-result"));
    expect(storedResult.success).toBe(true);
  });

  it("should deduplicate in-flight refresh requests in the same tab", async () => {
    let resolveRefresh;
    const refreshPromise = new Promise((resolve) => {
      resolveRefresh = resolve;
    });

    const mockAxios = {
      post: vi.fn().mockImplementation(() => refreshPromise),
    };

    const p1 = refreshWithLock(mockAxios);
    const p2 = refreshWithLock(mockAxios);

    expect(mockAxios.post).toHaveBeenCalledTimes(1);

    resolveRefresh({ data: { status: "OK" } });

    const [res1, res2] = await Promise.all([p1, p2]);
    expect(res1).toBe(true);
    expect(res2).toBe(true);
  });

  it("should throw error and store failure result when refresh request fails", async () => {
    const error = new Error("Unauthorized");
    error.response = { status: 401 };

    const mockAxios = {
      post: vi.fn().mockRejectedValue(error),
    };

    await expect(refreshWithLock(mockAxios)).rejects.toThrow("Unauthorized");

    const storedResult = JSON.parse(localStorage.getItem("auth-refresh-result"));
    expect(storedResult.success).toBe(false);
    expect(storedResult.status).toBe(401);
  });
});
