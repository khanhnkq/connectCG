import axiosClient, { ensureCsrfCookie } from "../config/axiosConfig";

const ensureCsrf = ensureCsrfCookie;

const postWithCsrf = async (url, data, config) => {
  await ensureCsrf();
  return axiosClient.post(url, data, config);
};

const authService = {
  ensureCsrf,

  login: (username, password) =>
    postWithCsrf("/auth/login", { username, password }, { skipAuthRefresh: true }),

  register: (data) =>
    postWithCsrf("/auth/register", data, { skipAuthRefresh: true }),

  createProfile: (data) => postWithCsrf("/auth/profile", data),

  forgotPassword: (email) =>
    postWithCsrf("/auth/forgot-password", null, {
      params: { email },
      skipAuthRefresh: true,
    }),

  resetPassword: (token, newPassword) =>
    postWithCsrf("/auth/reset-password", null, {
      params: { token, newPassword },
      skipAuthRefresh: true,
    }),

  verifyEmail: (token) =>
    axiosClient.get("/auth/verify-email", {
      params: { token },
      skipAuthRefresh: true,
    }),

  getCurrentSession: async () => {
    await ensureCsrf();
    return axiosClient.get("/auth/me");
  },

  logout: () =>
    postWithCsrf("/auth/logout", null, { skipAuthRefresh: true }),

  logoutAll: () => postWithCsrf("/auth/logout-all", null),
};

export default authService;
