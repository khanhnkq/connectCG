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
      const updated = mockDb.update("users", user.id, {
        ...parsed,
        userId: user.id,
        currentAvatarUrl: parsed.avatarUrl || user.currentAvatarUrl || user.avatarUrl,
        currentCoverUrl: parsed.coverUrl || user.currentCoverUrl || user.coverUrl,
      });
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
    handler: ({ data }) => {
      const parsed = typeof data === "string" ? JSON.parse(data) : data || {};
      const user = mockDb.getCurrentUser();
      const newAvatar =
        parsed.url ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80";
      user.avatarUrl = newAvatar;
      user.currentAvatarUrl = newAvatar;
      mockDb.save();
      return { status: 200, data: { url: newAvatar } };
    },
  },

  // Update cover
  {
    method: "POST",
    pattern: "/users/cover",
    handler: ({ data }) => {
      const parsed = typeof data === "string" ? JSON.parse(data) : data || {};
      const user = mockDb.getCurrentUser();
      const newCover =
        parsed.url ||
        "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1200&auto=format&fit=crop&q=80";
      user.coverUrl = newCover;
      user.currentCoverUrl = newCover;
      mockDb.save();
      return { status: 200, data: { url: newCover } };
    },
  },

  // Block / Unblock user
  {
    method: "POST",
    pattern: "/users/:id/block",
    handler: ({ params }) => {
      const user = mockDb.findById("users", params.id);
      if (user) {
        user.isLocked = true;
        mockDb.save();
      }
      return { status: 200, data: { success: true } };
    },
  },
  {
    method: "POST",
    pattern: "/users/:id/unblock",
    handler: ({ params }) => {
      const user = mockDb.findById("users", params.id);
      if (user) {
        user.isLocked = false;
        mockDb.save();
      }
      return { status: 200, data: { success: true } };
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

  // Advanced search users (returns Spring Page<MemberSearchResponse>)
  {
    method: "GET",
    pattern: "/users/search",
    handler: ({ query }) => {
      const q = (query.keyword || query.q || "").toLowerCase();
      const page = Number(query.page) || 0;
      const size = Number(query.size) || 10;
      const allUsers = mockDb.getCollection("users");
      const matched = allUsers
        .filter((u) => {
          if (q) {
            const matchesText =
              u.fullName?.toLowerCase().includes(q) ||
              u.username?.toLowerCase().includes(q) ||
              u.occupation?.toLowerCase().includes(q);
            if (!matchesText) return false;
          }
          const filterCity = query.cityCode || query.cityId;
          if (filterCity && String(u.cityCode) !== String(filterCity)) {
            return false;
          }
          if (query.gender && u.gender !== query.gender) {
            return false;
          }
          if (query.maritalStatus && u.maritalStatus !== query.maritalStatus) {
            return false;
          }
          if (query.lookingFor && u.lookingFor !== query.lookingFor) {
            return false;
          }
          return true;
        })
        .map((u) => ({
          userId: u.id,
          id: u.id,
          username: u.username,
          fullName: u.fullName,
          avatarUrl: u.currentAvatarUrl || u.avatarUrl,
          currentAvatarUrl: u.currentAvatarUrl || u.avatarUrl,
          cityName: u.cityName,
          cityCode: u.cityCode,
          gender: u.gender,
          maritalStatus: u.maritalStatus,
          lookingFor: u.lookingFor || "Kết bạn học hỏi",
          isFriend: false,
          requestSent: false,
          requestId: null,
          isRequestReceiver: false,
          mutualFriends: 2,
        }));

      return { status: 200, data: mockDb.paginate(matched, page, size) };
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

  // Get user by id (userService.getUserById)
  {
    method: "GET",
    pattern: "/users/:id",
    handler: ({ params }) => {
      const user = mockDb.findById("users", params.id);
      if (!user) {
        return { status: 404, data: { message: "User not found" } };
      }
      return { status: 200, data: user };
    },
  },
];
