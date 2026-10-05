import mockDb from "../db/mockDb";

export const userHandlers = [
  // Current user full profile
  {
    method: "GET",
    pattern: "/users/profile",
    handler: () => {
      const user = mockDb.getCurrentUser();
      return { status: 200, data: user };
    },
  },

  // Update current user profile
  {
    method: "PUT",
    pattern: "/users/profile",
    handler: ({ data }) => {
      const user = mockDb.getCurrentUser();
      const parsed = typeof data === "string" ? JSON.parse(data) : data || {};
      const updated = mockDb.update("users", user.id, parsed);
      return { status: 200, data: updated };
    },
  },

  // Get external user profile
  {
    method: "GET",
    pattern: "/users/:userId/profile",
    handler: ({ params }) => {
      const user = mockDb.findById("users", params.userId);
      if (!user) {
        return { status: 404, data: { message: "User not found" } };
      }
      return { status: 200, data: user };
    },
  },

  // Update avatar
  {
    method: "POST",
    pattern: "/users/avatar",
    handler: () => {
      const user = mockDb.getCurrentUser();
      const newAvatar =
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80";
      user.avatarUrl = newAvatar;
      mockDb.save();
      return { status: 200, data: { url: newAvatar } };
    },
  },

  // Update cover
  {
    method: "POST",
    pattern: "/users/cover",
    handler: () => {
      const user = mockDb.getCurrentUser();
      const newCover =
        "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1200&auto=format&fit=crop&q=80";
      user.coverUrl = newCover;
      mockDb.save();
      return { status: 200, data: { url: newCover } };
    },
  },

  // Hobbies
  {
    method: "GET",
    pattern: "/users/hobbies",
    handler: () => ({ status: 200, data: [1, 2, 3] }),
  },
  {
    method: "PUT",
    pattern: "/users/hobbies",
    handler: ({ data }) => {
      const parsed = typeof data === "string" ? JSON.parse(data) : data || [];
      return { status: 200, data: parsed };
    },
  },

  // Search users
  {
    method: "GET",
    pattern: "/users/search",
    handler: ({ query }) => {
      const q = (query.keyword || query.q || "").toLowerCase();
      const matched = mockDb.getCollection("users").filter(
        (u) =>
          u.fullName?.toLowerCase().includes(q) ||
          u.username?.toLowerCase().includes(q) ||
          u.occupation?.toLowerCase().includes(q),
      );
      return { status: 200, data: matched };
    },
  },

  // Online users
  {
    method: "GET",
    pattern: "/users/online",
    handler: () => ({
      status: 200,
      data: [1, 2, 4],
    }),
  },
];
