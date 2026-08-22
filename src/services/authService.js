import axiosClient, { ensureCsrfCookie } from "../config/axiosConfig";

const ensureCsrf = ensureCsrfCookie;

const postWithCsrf = async (url, data, config) => {
  await ensureCsrf();
  return axiosClient.post(url, data, config);
};

const authService = {
  ensureCsrf,

  login: (username, password) =>
    postWithCsrf("/v1/auth/login", { username, password }, { skipAuthRefresh: true }),

  register: (data) =>
    postWithCsrf("/v1/auth/register", data, { skipAuthRefresh: true }),

  createProfile: (data) => postWithCsrf("/v1/auth/profile", data),

  forgotPassword: (email) =>
    postWithCsrf("/v1/auth/forgot-password", null, {
      params: { email },
      skipAuthRefresh: true,
    }),

  resetPassword: (token, newPassword) =>
    postWithCsrf("/v1/auth/reset-password", null, {
      params: { token, newPassword },
      skipAuthRefresh: true,
    }),

  verifyEmail: (token) =>
    axiosClient.get("/v1/auth/verify-email", {
      params: { token },
      skipAuthRefresh: true,
    }),

  getCurrentSession: async () => {
    await ensureCsrf();
    return axiosClient.get("/v1/auth/me");
  },

  logout: () =>
    postWithCsrf("/v1/auth/logout", null, { skipAuthRefresh: true }),

  logoutAll: () => postWithCsrf("/v1/auth/logout-all", null),
};

export default authService;
