import mockDb from "../db/mockDb";

export const groupHandlers = [
  // All groups (findAllGroup / Admin website)
  {
    method: "GET",
    pattern: "/groups",
    handler: ({ query }) => {
      const page = Number(query.page) || 0;
      const size = Number(query.size) || 10;
      const allGroups = mockDb.getCollection("groups");
      return { status: 200, data: mockDb.paginate(allGroups, page, size) };
    },
  },

  // My groups (all groups user is part of)
  {
    method: "GET",
    pattern: "/groups/my-groups",
    handler: ({ query }) => {
      const page = Number(query.page) || 0;
      const size = Number(query.size) || 10;
      const user = mockDb.getCurrentUser();
      const myGroups = mockDb.getCollection("groups").filter(
        (g) => Number(g.ownerId) === Number(user.id) || g.currentUserStatus === "ACCEPTED",
      );
      return { status: 200, data: mockDb.paginate(myGroups, page, size) };
    },
  },

  // My managed groups
  {
    method: "GET",
    pattern: "/groups/my-managed",
    handler: ({ query }) => {
      const page = Number(query.page) || 0;
      const size = Number(query.size) || 10;
      const user = mockDb.getCurrentUser();
      const managed = mockDb.getCollection("groups").filter(
        (g) => Number(g.ownerId) === Number(user.id),
      );
      return { status: 200, data: mockDb.paginate(managed, page, size) };
    },
  },

  // My joined groups
  {
    method: "GET",
    pattern: "/groups/my-joined",
    handler: ({ query }) => {
      const page = Number(query.page) || 0;
      const size = Number(query.size) || 10;
      const user = mockDb.getCurrentUser();
      const joined = mockDb.getCollection("groups").filter(
        (g) => g.currentUserStatus === "ACCEPTED" && Number(g.ownerId) !== Number(user.id),
      );
      return { status: 200, data: mockDb.paginate(joined, page, size) };
    },
  },

  // Discover groups
  {
    method: "GET",
    pattern: "/groups/discover",
    handler: ({ query }) => {
      const page = Number(query.page) || 0;
      const size = Number(query.size) || 10;
      const allGroups = mockDb.getCollection("groups");
      return { status: 200, data: mockDb.paginate(allGroups, page, size) };
    },
  },

  // Group invitations
  {
    method: "GET",
    pattern: "/groups/invitations",
    handler: () => {
      const invites = mockDb.getCollection("groups").filter(
        (g) => g.currentUserStatus === "PENDING",
      );
      return { status: 200, data: invites };
    },
  },

  // Search groups
  {
    method: "GET",
    pattern: "/groups/search",
    handler: ({ query }) => {
      const q = (query.query || query.name || query.q || "").toLowerCase();
      const page = Number(query.page) || 0;
      const size = Number(query.size) || 10;
      const matched = mockDb.getCollection("groups").filter(
        (g) =>
          g.name?.toLowerCase().includes(q) ||
          g.description?.toLowerCase().includes(q),
      );
      return { status: 200, data: mockDb.paginate(matched, page, size) };
    },
  },

  // Get single group
  {
    method: "GET",
    pattern: "/groups/:id",
    handler: ({ params }) => {
      const group = mockDb.findById("groups", params.id);
      if (!group) {
        return { status: 404, data: { message: "Không tìm thấy nhóm" } };
      }
      return { status: 200, data: group };
    },
  },

  // Create group
  {
    method: "POST",
    pattern: "/groups",
    handler: ({ data }) => {
      const parsed = typeof data === "string" ? JSON.parse(data) : data || {};
      const user = mockDb.getCurrentUser();
      const allGroups = mockDb.getCollection("groups");
      const nextId = allGroups.length > 0 ? Math.max(...allGroups.map((g) => Number(g.id) || 0)) + 1 : 1;

      const newGroup = mockDb.insert("groups", {
        id: nextId,
        name: parsed.name,
        privacy: parsed.privacy || "PUBLIC",
        description: parsed.description || "",
        image:
          parsed.image ||
          "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000",
        coverMediaId: 100 + nextId,
        ownerId: user.id,
        ownerName: user.username,
        ownerFullName: user.fullName,
        memberCount: 1,
        currentUserStatus: "ACCEPTED",
        currentUserRole: "OWNER",
        pendingRequestsCount: 0,
        pendingPostsCount: 0,
        isDeleted: false,
      });

      return { status: 201, data: newGroup };
    },
  },

  // Update group
  {
    method: "PUT",
    pattern: "/groups/:id",
    handler: ({ params, data }) => {
      const parsed = typeof data === "string" ? JSON.parse(data) : data || {};
      const updated = mockDb.update("groups", params.id, parsed);
      return { status: 200, data: updated };
    },
  },

  // Delete group
  {
    method: "DELETE",
    pattern: "/groups/:id",
    handler: ({ params }) => {
      mockDb.delete("groups", params.id);
      return { status: 200, data: { message: "Xóa nhóm thành công" } };
    },
  },

  // Join group
  {
    method: "POST",
    pattern: "/groups/:id/join",
    handler: ({ params }) => {
      const group = mockDb.findById("groups", params.id);
      if (group) {
        group.currentUserStatus =
          group.privacy === "PUBLIC" ? "ACCEPTED" : "REQUESTED";
        if (group.currentUserStatus === "ACCEPTED") {
          group.memberCount = (group.memberCount || 0) + 1;
        }
        mockDb.save();
      }
      return { status: 200, data: group };
    },
  },

  // Leave group
  {
    method: "POST",
    pattern: "/groups/:id/leave",
    handler: ({ params }) => {
      const group = mockDb.findById("groups", params.id);
      if (group) {
        group.currentUserStatus = null;
        group.currentUserRole = null;
        group.memberCount = Math.max(1, (group.memberCount || 1) - 1);
        mockDb.save();
      }
      return { status: 200, data: group };
    },
  },
  {
    method: "DELETE",
    pattern: "/groups/:id/leave",
    handler: ({ params }) => {
      const group = mockDb.findById("groups", params.id);
      if (group) {
        group.currentUserStatus = null;
        group.currentUserRole = null;
        group.memberCount = Math.max(1, (group.memberCount || 1) - 1);
        mockDb.save();
      }
      return { status: 200, data: group };
    },
  },

  // Accept invite
  {
    method: "POST",
    pattern: "/groups/:id/accept",
    handler: ({ params }) => {
      const group = mockDb.findById("groups", params.id);
      if (group) {
        group.currentUserStatus = "ACCEPTED";
        group.currentUserRole = "MEMBER";
        group.memberCount = (group.memberCount || 0) + 1;
        mockDb.save();
      }
      return { status: 200, data: group };
    },
  },

  // Decline invite
  {
    method: "POST",
    pattern: "/groups/:id/decline",
    handler: ({ params }) => {
      const group = mockDb.findById("groups", params.id);
      if (group) {
        group.currentUserStatus = null;
        mockDb.save();
      }
      return { status: 200, data: group };
    },
  },

  // Group members (returns TungGroupMemberDTO[])
  {
    method: "GET",
    pattern: "/groups/:id/members",
    handler: ({ params }) => {
      const group = mockDb.findById("groups", params.id);
      const allUsers = mockDb.getCollection("users");
      const owner = allUsers.find((u) => Number(u.id) === Number(group?.ownerId)) || allUsers[0];
      const members = [
        {
          userId: owner.id,
          username: owner.username,
          fullName: owner.fullName,
          avatarUrl: owner.currentAvatarUrl || owner.avatarUrl,
          role: "OWNER",
          joinedAt: group?.createdAt || "2025-01-01T00:00:00.000Z",
        },
        ...allUsers
          .filter((u) => Number(u.id) !== Number(owner.id))
          .slice(0, 3)
          .map((u) => ({
            userId: u.id,
            username: u.username,
            fullName: u.fullName,
            avatarUrl: u.currentAvatarUrl || u.avatarUrl,
            role: "MEMBER",
            joinedAt: "2025-02-01T00:00:00.000Z",
          })),
      ];
      return { status: 200, data: members };
    },
  },

  // Group posts
  {
    method: "GET",
    pattern: "/groups/:id/posts",
    handler: ({ params }) => {
      const posts = mockDb.getCollection("posts").filter(
        (p) => String(p.groupId) === String(params.id),
      );
      return { status: 200, data: posts };
    },
  },

  // Group moderation queues
  {
    method: "GET",
    pattern: "/groups/:id/posts/pending",
    handler: () => ({ status: 200, data: [] }),
  },
  {
    method: "GET",
    pattern: "/groups/:id/requests",
    handler: () => ({ status: 200, data: [] }),
  },
  {
    method: "GET",
    pattern: "/groups/:id/members/banned",
    handler: () => ({ status: 200, data: [] }),
  },

  // Moderation actions
  {
    method: "POST",
    pattern: "/groups/:groupId/approve/:userId",
    handler: () => ({ status: 200, data: { success: true } }),
  },
  {
    method: "POST",
    pattern: "/groups/:groupId/reject/:userId",
    handler: () => ({ status: 200, data: { success: true } }),
  },
  {
    method: "POST",
    pattern: "/groups/:groupId/ban/:userId",
    handler: () => ({ status: 200, data: { success: true } }),
  },
  {
    method: "POST",
    pattern: "/groups/:groupId/members/:userId/unban",
    handler: () => ({ status: 200, data: { success: true } }),
  },
  {
    method: "POST",
    pattern: "/groups/:groupId/members/:userId/role",
    handler: () => ({ status: 200, data: { success: true } }),
  },
  {
    method: "POST",
    pattern: "/groups/:groupId/transfer-ownership",
    handler: () => ({ status: 200, data: { success: true } }),
  },
  {
    method: "POST",
    pattern: "/groups/:groupId/posts/:postId/approve",
    handler: () => ({ status: 200, data: { success: true } }),
  },
  {
    method: "POST",
    pattern: "/groups/:groupId/posts/:postId/reject",
    handler: () => ({ status: 200, data: { success: true } }),
  },
  {
    method: "POST",
    pattern: "/groups/:groupId/posts/:postId/pin",
    handler: () => ({ status: 200, data: { success: true } }),
  },
  {
    method: "POST",
    pattern: "/groups/:id/invite",
    handler: () => ({ status: 200, data: { success: true } }),
  },
];
