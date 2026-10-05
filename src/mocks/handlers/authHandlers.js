import mockDb from "../db/mockDb";

export const authHandlers = [
  // CSRF token
  {
    method: "GET",
    pattern: "/auth/csrf",
    handler: () => ({
      status: 200,
      data: { token: "mock-csrf-token-connectcg-2026" },
    }),
  },

  // Current session user (/auth/me)
  {
    method: "GET",
    pattern: "/auth/me",
    handler: () => {
      const user = mockDb.getCurrentUser();
      return {
        status: 200,
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          roles: user.roles || [user.role],
          avatarUrl: user.avatarUrl,
          hasProfile: true,
        },
      };
    },
  },

  // Login
  {
    method: "POST",
    pattern: "/auth/login",
    handler: ({ data }) => {
      let parsed = data;
      if (typeof data === "string") {
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = {};
        }
      }
      const emailOrUsername = parsed?.email || parsed?.username;
      const allUsers = mockDb.getCollection("users");
      const matchedUser = allUsers.find(
        (u) => u.email === emailOrUsername || u.username === emailOrUsername,
      ) || allUsers[0];

      mockDb.setCurrentUser(matchedUser.id);
      return {
        status: 200,
        data: {
          message: "Đăng nhập thành công!",
          user: matchedUser,
        },
      };
    },
  },

  // Logout
  {
    method: "POST",
    pattern: "/auth/logout",
    handler: () => ({
      status: 200,
      data: { message: "Đăng xuất thành công" },
    }),
  },

  // Token refresh
  {
    method: "POST",
    pattern: "/auth/refresh",
    handler: () => ({
      status: 200,
      data: { message: "Token refreshed" },
    }),
  },

  // Register
  {
    method: "POST",
    pattern: "/auth/register",
    handler: ({ data }) => {
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      const newUser = mockDb.insert("users", {
        ...parsed,
        role: "USER",
        hasProfile: false,
        friendCount: 0,
        postCount: 0,
      });
      mockDb.setCurrentUser(newUser.id);
      return {
        status: 201,
        data: { message: "Đăng ký thành công", user: newUser },
      };
    },
  },

  // Password / Email flows
  {
    method: "POST",
    pattern: "/auth/forgot-password",
    handler: () => ({
      status: 200,
      data: { message: "Đã gửi hướng dẫn khôi phục mật khẩu qua email." },
    }),
  },
  {
    method: "POST",
    pattern: "/auth/reset-password",
    handler: () => ({
      status: 200,
      data: { message: "Đặt lại mật khẩu thành công!" },
    }),
  },
  {
    method: "POST",
    pattern: "/auth/verify-email",
    handler: () => ({
      status: 200,
      data: { message: "Xác thực email thành công!" },
    }),
  },
];
