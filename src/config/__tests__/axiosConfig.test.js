import { describe, it, expect, beforeEach, vi } from "vitest";
import { ensureCsrfCookie } from "../axiosConfig";
import axios from "axios";

vi.mock("axios", async () => {
  const actual = await vi.importActual("axios");
  return {
    default: {
      ...actual.default,
      get: vi.fn(),
      create: vi.fn(() => ({
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      })),
    },
  };
});

describe("axiosConfig - ensureCsrfCookie", () => {
  beforeEach(() => {
    document.cookie = "XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    vi.restoreAllMocks();
  });

  it("should return token from cookie if present and not forced", async () => {
    document.cookie = "XSRF-TOKEN=existing-csrf-token; path=/;";
    const token = await ensureCsrfCookie(false);
    expect(token).toBe("existing-csrf-token");
    expect(axios.get).not.toHaveBeenCalled();
  });

  it("should fetch /auth/csrf when no cookie is present", async () => {
    axios.get.mockResolvedValueOnce({
      data: { token: "new-fetched-csrf-token" },
    });

    const token = await ensureCsrfCookie(false);
    expect(token).toBe("new-fetched-csrf-token");
    expect(axios.get).toHaveBeenCalledWith(
      "/auth/csrf",
      expect.objectContaining({ baseURL: expect.any(String), withCredentials: true })
    );
  });

  it("should re-fetch /auth/csrf when force is true", async () => {
    document.cookie = "XSRF-TOKEN=old-csrf-token; path=/;";
    axios.get.mockResolvedValueOnce({
      data: { token: "forced-csrf-token" },
    });

    const token = await ensureCsrfCookie(true);
    expect(token).toBe("forced-csrf-token");
    expect(axios.get).toHaveBeenCalled();
  });

  it("should throw an error if CSRF token cannot be obtained", async () => {
    axios.get.mockResolvedValueOnce({ data: {} });

    await expect(ensureCsrfCookie(true)).rejects.toThrow(
      "Không thể khởi tạo CSRF token"
    );
  });
});
