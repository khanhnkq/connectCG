import axios from "axios";
import { appConfig } from "./runtimeConfig";
import { refreshWithLock } from "./tokenRefresh";

const apiBaseUrl = appConfig.apiBaseUrl;

const axiosClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  timeout: 15000,
});

let csrfRequest = null;
let csrfToken = null;

const readCookie = (name) => {
  const prefix = `${name}=`;
  const cookie = document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(prefix));

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
};

export const ensureCsrfCookie = async (force = false) => {
  if (!force) {
    let token = csrfToken || readCookie("XSRF-TOKEN");
    if (token) return token;
  }

  if (!csrfRequest) {
    csrfRequest = axios.get("/auth/csrf", {
      baseURL: apiBaseUrl,
      withCredentials: true,
      timeout: 10000,
    });
  }

  try {
    const response = await csrfRequest;
    csrfToken = response.data?.token || null;
  } finally {
    csrfRequest = null;
  }

  const token = csrfToken || readCookie("XSRF-TOKEN");
  if (!token) {
    throw new Error("Không thể khởi tạo CSRF token");
  }
  return token;
};

const requiresCsrf = (method) =>
  !["get", "head", "options", "trace"].includes((method || "get").toLowerCase());

const isNetworkOrServerError = (error) => {
  if (!error.response) return true; // Network error or timeout
  if (error.response.status === 429) return false; // Rate limit should not be blindly retried
  return error.response.status >= 500; // 500, 502, 503, 504
};

axiosClient.interceptors.request.use(async (config) => {
  // Nếu data là FormData, đảm bảo xóa Content-Type để trình duyệt tự động đính kèm multipart boundary
  if (config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
      if (typeof config.headers.delete === "function") {
        config.headers.delete("Content-Type");
        config.headers.delete("content-type");
      }
    }
  }

  if (!requiresCsrf(config.method)) return config;

  const token = await ensureCsrfCookie();
  if (typeof config.headers?.set === "function") {
    config.headers.set("X-XSRF-TOKEN", token);
  } else if (config.headers) {
    config.headers["X-XSRF-TOKEN"] = token;
  }
  return config;
});

const shouldRefresh = (error) => {
  const config = error.config;
  if (!config || config.skipAuthRefresh || config._authRetry) {
    return false;
  }
  return error.response?.status === 401;
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Retry for transient network/server errors (up to 2 retries with backoff)
    if (
      originalRequest &&
      !originalRequest.skipRetry &&
      isNetworkOrServerError(error)
    ) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      if (originalRequest._retryCount <= 2) {
        const delay = originalRequest._retryCount * 1000;
        await new Promise((r) => setTimeout(r, delay));
        return axiosClient(originalRequest);
      }
    }

    // Tự động lấy lại CSRF token mới và retry nếu bị lỗi 403 do token lệch/hết hạn
    if (error.response?.status === 403 && originalRequest && !originalRequest._csrfRetry) {
      originalRequest._csrfRetry = true;
      try {
        const freshToken = await ensureCsrfCookie(true);
        if (typeof originalRequest.headers?.set === "function") {
          originalRequest.headers.set("X-XSRF-TOKEN", freshToken);
        } else if (originalRequest.headers) {
          originalRequest.headers["X-XSRF-TOKEN"] = freshToken;
        }
        return axiosClient(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }

    if (!shouldRefresh(error)) {
      return Promise.reject(error);
    }

    originalRequest._authRetry = true;

    try {
      await refreshWithLock(axiosClient);
      return axiosClient(originalRequest);
    } catch (refreshError) {
      // Chỉ coi là hết phiên khi server xác nhận 401 hoặc 403
      if (
        refreshError.response?.status === 401 ||
        refreshError.response?.status === 403
      ) {
        window.dispatchEvent(new Event("auth:session-expired"));
      }
      return Promise.reject(refreshError);
    }
  },
);

export default axiosClient;
