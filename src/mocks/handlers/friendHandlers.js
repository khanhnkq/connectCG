import mockDb from "../db/mockDb";

export const friendHandlers = [
  // My friends
  {
    method: "GET",
    pattern: "/friends/my-friends",
    handler: () => ({
      status: 200,
      data: mockDb.getCollection("friends"),
    }),
  },

  // Friend suggestions
  {
    method: "GET",
    pattern: "/friends/suggestions",
    handler: () => ({
      status: 200,
      data: mockDb.getCollection("suggestions"),
    }),
  },
  {
    method: "GET",
    pattern: "/friends/suggestions/refresh",
    handler: () => ({
      status: 200,
      data: mockDb.getCollection("suggestions"),
    }),
  },
  {
    method: "DELETE",
    pattern: "/friends/suggestions/:dismissedUserId",
    handler: ({ params }) => {
      mockDb.delete("suggestions", params.dismissedUserId);
      return { status: 200, data: { message: "Đã bỏ qua gợi ý" } };
    },
  },

  // Friend requests list
  {
    method: "GET",
    pattern: "/friend-requests",
    handler: () => ({
      status: 200,
      data: mockDb.getCollection("friendRequests"),
    }),
  },

  // Send friend request
  {
    method: "POST",
    pattern: "/friend-requests/send/:receiverId",
    handler: ({ params }) => {
      const targetUser = mockDb.findById("users", params.receiverId);
      const user = mockDb.getCurrentUser();
      const newReq = mockDb.insert("friendRequests", {
        id: `fr${Date.now()}`,
        senderId: user.id,
        senderName: user.username,
        senderFullName: user.fullName,
        senderAvatar: user.avatarUrl,
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
          friendId: req.senderId,
          username: req.senderName,
          fullName: req.senderFullName,
          avatarUrl: req.senderAvatar,
          onlineStatus: "ONLINE",
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

  // Cancel request
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
        (f) => Number(f.friendId) !== Number(params.friendId),
      );
      mockDb.save();
      return { status: 200, data: { message: "Đã hủy kết bạn" } };
    },
  },
];
