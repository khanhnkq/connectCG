import mockDb from "../db/mockDb";

export const adminHandlers = [
  // List all users for Admin
  {
    method: "GET",
    pattern: "/admin-user",
    handler: ({ query }) => {
      const page = query.page || 0;
      const size = query.size || 10;
      const q = (query.query || query.search || "").toLowerCase();
      let users = mockDb.getCollection("users");
      if (q) {
        users = users.filter(
          (u) =>
            u.fullName?.toLowerCase().includes(q) ||
            u.username?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q),
        );
      }
      return { status: 200, data: mockDb.paginate(users, page, size) };
    },
  },

  // Lock / Unlock user
  {
    method: "PUT",
    pattern: "/admin-user/:userId/lock",
    handler: ({ params }) => {
      const user = mockDb.findById("users", params.userId);
      if (user) {
        user.isLocked = !user.isLocked;
        mockDb.save();
      }
      return { status: 200, data: user };
    },
  },

  // Change user role
  {
    method: "PUT",
    pattern: "/admin-user/:userId/role",
    handler: ({ params, data }) => {
      const parsed = typeof data === "string" ? JSON.parse(data) : data || {};
      const user = mockDb.findById("users", params.userId);
      if (user) {
        user.role = parsed.role || "USER";
        mockDb.save();
      }
      return { status: 200, data: user };
    },
  },

  // Delete user
  {
    method: "DELETE",
    pattern: "/admin-user/:userId/delete",
    handler: ({ params }) => {
      mockDb.delete("users", params.userId);
      return { status: 200, data: { message: "Xóa người dùng thành công" } };
    },
  },

  // Admin pending posts & audit
  {
    method: "GET",
    pattern: "/posts/admin/pending",
    handler: ({ query }) => {
      const page = query.page || 0;
      const size = query.size || 10;
      return { status: 200, data: mockDb.paginate([], page, size) };
    },
  },
  {
    method: "GET",
    pattern: "/posts/admin/audit",
    handler: ({ query }) => {
      const page = query.page || 0;
      const size = query.size || 10;
      return { status: 200, data: mockDb.paginate([], page, size) };
    },
  },

  // Reports
  {
    method: "GET",
    pattern: "/reports",
    handler: () => ({
      status: 200,
      data: mockDb.getCollection("reports"),
    }),
  },
  {
    method: "GET",
    pattern: "/reports/:id",
    handler: ({ params }) => {
      const report = mockDb.findById("reports", params.id);
      return { status: 200, data: report };
    },
  },

  // Notifications
  {
    method: "GET",
    pattern: "/notifications",
    handler: () => ({
      status: 200,
      data: mockDb.getCollection("notifications"),
    }),
  },
  {
    method: "POST",
    pattern: "/notifications/:id/read",
    handler: ({ params }) => {
      const notif = mockDb.findById("notifications", params.id);
      if (notif) {
        notif.read = true;
        mockDb.save();
      }
      return { status: 200, data: { success: true } };
    },
  },
  {
    method: "POST",
    pattern: "/notifications/read-all",
    handler: () => {
      const notifs = mockDb.getCollection("notifications");
      notifs.forEach((n) => {
        n.read = true;
      });
      mockDb.save();
      return { status: 200, data: { success: true } };
    },
  },

  // Media upload & hobbies & health
  {
    method: "POST",
    pattern: "/media/upload",
    handler: () => ({
      status: 200,
      data: {
        url: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000",
      },
    }),
  },
  {
    method: "GET",
    pattern: "/hobbies",
    handler: () => ({
      status: 200,
      data: mockDb.getCollection("hobbies"),
    }),
  },
  {
    method: "GET",
    pattern: "/health/readiness",
    handler: () => ({
      status: 200,
      data: { status: "UP", mockMode: true },
    }),
  },
];
