import mockDb from "../db/mockDb";

export const friendHandlers = [
  // My friends (returns Spring Page<FriendDTO>)
  {
    method: "GET",
    pattern: "/friends/my-friends",
    handler: ({ query }) => {
      const page = Number(query.page) || 0;
      const size = Number(query.size) || 10;
      const name = (query.name || "").toLowerCase();
      let friends = mockDb.getCollection("friends");
      if (name) {
        friends = friends.filter(
          (f) =>
            f.fullName?.toLowerCase().includes(name) ||
            f.username?.toLowerCase().includes(name),
        );
      }
      return {
        status: 200,
        data: mockDb.paginate(friends, page, size),
      };
    },
  },

  // Friends by user ID
  {
    method: "GET",
    pattern: "/friends/:userId",
    handler: ({ query }) => {
      const page = Number(query.page) || 0;
      const size = Number(query.size) || 10;
      const friends = mockDb.getCollection("friends");
      return {
        status: 200,
        data: mockDb.paginate(friends, page, size),
      };
    },
  },

  // Friend suggestions (returns Spring Page<FriendSuggestionDTO>)
  {
    method: "GET",
    pattern: "/friends/suggestions",
    handler: ({ query }) => {
      const page = Number(query.page) || 0;
      const size = Number(query.size) || 10;
      const suggestions = mockDb.getCollection("suggestions");
      return {
        status: 200,
        data: mockDb.paginate(suggestions, page, size),
      };
    },
  },
  {
    method: "POST",
    pattern: "/friends/suggestions/refresh",
    handler: ({ query }) => {
      const page = Number(query?.page) || 0;
      const size = Number(query?.size) || 10;
      const suggestions = mockDb.getCollection("suggestions");
      return {
        status: 200,
        data: mockDb.paginate(suggestions, page, size),
      };
    },
  },
  {
    method: "GET",
    pattern: "/friends/suggestions/refresh",
    handler: ({ query }) => {
      const page = Number(query?.page) || 0;
      const size = Number(query?.size) || 10;
      const suggestions = mockDb.getCollection("suggestions");
      return {
        status: 200,
        data: mockDb.paginate(suggestions, page, size),
      };
    },
  },
  {
    method: "DELETE",
    pattern: "/friends/suggestions/:dismissedUserId",
    handler: ({ params }) => {
      const id = params.dismissedUserId;
      const list = mockDb.getCollection("suggestions");
      mockDb.data.suggestions = list.filter(
        (s) => String(s.userId) !== String(id) && String(s.id) !== String(id),
      );
      mockDb.save();
      return { status: 200, data: { message: "Đã bỏ qua gợi ý" } };
    },
  },

  // Friend requests list (returns Spring Page<FriendRequestDTO>)
  {
    method: "GET",
    pattern: "/friend-requests",
    handler: ({ query }) => {
      const page = Number(query.page) || 0;
      const size = Number(query.size) || 10;
      const requests = mockDb.getCollection("friendRequests");
      return {
        status: 200,
        data: mockDb.paginate(requests, page, size),
      };
    },
  },

  // Send friend request
  {
    method: "POST",
    pattern: "/friend-requests/send/:receiverId",
    handler: ({ params }) => {
      const targetUser = mockDb.findById("users", params.receiverId);
      const user = mockDb.getCurrentUser();
      const newReq = mockDb.insert("friendRequests", {
        id: Date.now(),
        requestId: Date.now(),
        senderId: user.id,
        senderUsername: user.username,
        senderName: user.username,
        senderFullName: user.fullName,
        senderAvatar: user.currentAvatarUrl || user.avatarUrl,
        senderAvatarUrl: user.currentAvatarUrl || user.avatarUrl,
        receiverId: Number(params.receiverId),
        receiverName: targetUser?.username,
        status: "PENDING",
      });
      return { status: 201, data: newReq };
    },
  },

  // Accept request
  {
    method: "POST",
    pattern: "/friend-requests/:requestId/accept",
    handler: ({ params }) => {
      const req = mockDb.findById("friendRequests", params.requestId);
      if (req) {
        mockDb.insert("friends", {
          id: req.senderId,
          userId: req.senderId,
          friendId: req.senderId,
          username: req.senderUsername || req.senderName,
          fullName: req.senderFullName,
          avatarUrl: req.senderAvatarUrl || req.senderAvatar,
          currentAvatarUrl: req.senderAvatarUrl || req.senderAvatar,
          gender: "MALE",
          onlineStatus: "ONLINE",
          relationshipStatus: "ACCEPTED",
          friendSince: new Date().toISOString(),
        });
        mockDb.delete("friendRequests", params.requestId);
      }
      return { status: 200, data: { message: "Đã chấp nhận kết bạn" } };
    },
  },

  // Reject request
  {
    method: "POST",
    pattern: "/friend-requests/:requestId/reject",
    handler: ({ params }) => {
      mockDb.delete("friendRequests", params.requestId);
      return { status: 200, data: { message: "Đã từ chối lời mời" } };
    },
  },

  // Cancel request (supports both DELETE and POST)
  {
    method: "DELETE",
    pattern: "/friend-requests/cancel/:receiverId",
    handler: ({ params }) => {
      const col = mockDb.getCollection("friendRequests");
      mockDb.data.friendRequests = col.filter(
        (r) => Number(r.receiverId) !== Number(params.receiverId),
      );
      mockDb.save();
      return { status: 200, data: { message: "Đã hủy yêu cầu" } };
    },
  },
  {
    method: "POST",
    pattern: "/friend-requests/cancel/:receiverId",
    handler: ({ params }) => {
      const col = mockDb.getCollection("friendRequests");
      mockDb.data.friendRequests = col.filter(
        (r) => Number(r.receiverId) !== Number(params.receiverId),
      );
      mockDb.save();
      return { status: 200, data: { message: "Đã hủy yêu cầu" } };
    },
  },

  // Unfriend
  {
    method: "DELETE",
    pattern: "/friends/:friendId",
    handler: ({ params }) => {
      const col = mockDb.getCollection("friends");
      mockDb.data.friends = col.filter(
        (f) =>
          Number(f.id) !== Number(params.friendId) &&
          Number(f.friendId) !== Number(params.friendId) &&
          Number(f.userId) !== Number(params.friendId),
      );
      mockDb.save();
      return { status: 200, data: { message: "Đã hủy kết bạn" } };
    },
  },
];
