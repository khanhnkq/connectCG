import mockDb from "../db/mockDb";

export const chatHandlers = [
  // List my conversations
  {
    method: "GET",
    pattern: "/chat/my",
    handler: () => ({
      status: 200,
      data: mockDb.getCollection("conversations"),
    }),
  },

  // Get conversation detail + messages
  {
    method: "GET",
    pattern: "/chat/:roomId",
    handler: ({ params }) => {
      const conv = mockDb.findById("conversations", params.roomId);
      const messages = mockDb.data.messages[params.roomId] || [];
      return {
        status: 200,
        data: {
          ...(conv || {}),
          id: params.roomId,
          messages,
        },
      };
    },
  },

  // Create or get direct chat
  {
    method: "POST",
    pattern: "/chat/direct/:targetUserId",
    handler: ({ params }) => {
      const targetUser = mockDb.findById("users", params.targetUserId);
      const conversations = mockDb.getCollection("conversations");
      let found = conversations.find(
        (c) => c.type === "DIRECT" && Number(c.targetUserId) === Number(params.targetUserId),
      );

      if (!found) {
        found = mockDb.insert("conversations", {
          id: `c${Date.now()}`,
          type: "DIRECT",
          name: targetUser?.fullName || "Người dùng",
          avatarUrl: targetUser?.avatarUrl || "",
          targetUserId: Number(params.targetUserId),
          unreadCount: 0,
          online: true,
          lastMessage: null,
        });
        mockDb.data.messages[found.id] = [];
        mockDb.save();
      }

      return { status: 200, data: found };
    },
  },

  // Create group chat
  {
    method: "POST",
    pattern: "/chat/group",
    handler: ({ data }) => {
      const parsed = typeof data === "string" ? JSON.parse(data) : data || {};
      const newGroupChat = mockDb.insert("conversations", {
        id: `c${Date.now()}`,
        type: "GROUP",
        name: parsed.name || "Nhóm chat mới",
        avatarUrl:
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&auto=format&fit=crop&q=80",
        memberCount: (parsed.memberIds?.length || 1) + 1,
        unreadCount: 0,
        online: true,
        lastMessage: null,
      });
      mockDb.data.messages[newGroupChat.id] = [];
      mockDb.save();

      return { status: 201, data: newGroupChat };
    },
  },

  // Mark room as read
  {
    method: "POST",
    pattern: "/chat/:roomId/read",
    handler: ({ params }) => {
      const conv = mockDb.findById("conversations", params.roomId);
      if (conv) {
        conv.unreadCount = 0;
        mockDb.save();
      }
      return { status: 200, data: { success: true } };
    },
  },

  // Clear messages
  {
    method: "POST",
    pattern: "/chat/:roomId/clear",
    handler: ({ params }) => {
      mockDb.data.messages[params.roomId] = [];
      mockDb.save();
      return { status: 200, data: { success: true } };
    },
  },

  // Leave chat
  {
    method: "POST",
    pattern: "/chat/:roomId/leave",
    handler: ({ params }) => {
      mockDb.delete("conversations", params.roomId);
      return { status: 200, data: { success: true } };
    },
  },
];
