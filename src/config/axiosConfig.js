import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const axiosClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

let refreshRequest = null;
let csrfRequest = null;

const readCookie = (name) => {
  const prefix = `${name}=`;
  const cookie = document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(prefix));

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
};

export const ensureCsrfCookie = async () => {
  let token = readCookie("XSRF-TOKEN");
  if (token) return token;

  if (!csrfRequest) {
    csrfRequest = axios.get("/v1/auth/csrf", {
      baseURL: apiBaseUrl,
      withCredentials: true,
    });
  }

  try {
    await csrfRequest;
  } finally {
    csrfRequest = null;
  }

  token = readCookie("XSRF-TOKEN");
  if (!token) {
    throw new Error("Không thể khởi tạo CSRF token");
  }
  return token;
};

const requiresCsrf = (method) =>
  !["get", "head", "options", "trace"].includes((method || "get").toLowerCase());

axiosClient.interceptors.request.use(async (config) => {
  if (!requiresCsrf(config.method)) return config;

  const token = await ensureCsrfCookie();
  config.headers.set("X-XSRF-TOKEN", token);
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
    if (!shouldRefresh(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    originalRequest._authRetry = true;

    try {
      if (!refreshRequest) {
        refreshRequest = axiosClient.post("/v1/auth/refresh", null, {
          skipAuthRefresh: true,
        });
      }
      await refreshRequest;
      return axiosClient(originalRequest);
    } catch (refreshError) {
      window.dispatchEvent(new Event("auth:session-expired"));
      return Promise.reject(refreshError);
    } finally {
      refreshRequest = null;
    }
  },
);

export default axiosClient;
