import mockDb from "../db/mockDb";

export const adminHandlers = [
  // List all users for Admin (GET /admin-user)
  {
    method: "GET",
    pattern: "/admin-user",
    handler: ({ query }) => {
      const page = Number(query.page) || 0;
      const size = Number(query.size) || 10;
      const q = (query.keyword || query.query || query.search || "").toLowerCase();
      const role = query.role;

      let users = mockDb.getCollection("users");
      if (q) {
        users = users.filter(
          (u) =>
            u.fullName?.toLowerCase().includes(q) ||
            u.username?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q),
        );
      }
      if (role) {
        users = users.filter((u) => u.role === role);
      }

      const mapped = users.map((u) => ({
        ...u,
        userId: u.id,
        currentAvatarUrl: u.currentAvatarUrl || u.avatarUrl,
        currentCoverUrl: u.currentCoverUrl || u.coverUrl,
      }));

      return { status: 200, data: mockDb.paginate(mapped, page, size) };
    },
  },

  // Lock / Unlock user (supports PATCH and PUT)
  {
    method: "PATCH",
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

  // Change user role (supports PATCH and PUT)
  {
    method: "PATCH",
    pattern: "/admin-user/:userId/role",
    handler: ({ params, data }) => {
      const parsed = typeof data === "string" ? JSON.parse(data) : data || {};
      const user = mockDb.findById("users", params.userId);
      if (user) {
        user.role = parsed.role || "USER";
        user.roles = [user.role];
        mockDb.save();
      }
      return { status: 200, data: user };
    },
  },
  {
    method: "PUT",
    pattern: "/admin-user/:userId/role",
    handler: ({ params, data }) => {
      const parsed = typeof data === "string" ? JSON.parse(data) : data || {};
      const user = mockDb.findById("users", params.userId);
      if (user) {
        user.role = parsed.role || "USER";
        user.roles = [user.role];
        mockDb.save();
      }
      return { status: 200, data: user };
    },
  },

  // Delete user (supports PATCH and DELETE)
  {
    method: "PATCH",
    pattern: "/admin-user/:userId/delete",
    handler: ({ params }) => {
      const user = mockDb.findById("users", params.userId);
      if (user) {
        user.isDeleted = true;
        mockDb.save();
      }
      return { status: 200, data: { message: "Xóa người dùng thành công" } };
    },
  },
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
      const page = Number(query.page) || 0;
      const size = Number(query.size) || 10;
      const pendingPosts = mockDb
        .getCollection("posts")
        .filter((p) => p.status === "PENDING");
      return { status: 200, data: mockDb.paginate(pendingPosts, page, size) };
    },
  },
  {
    method: "GET",
    pattern: "/posts/admin/audit",
    handler: ({ query }) => {
      const page = Number(query.page) || 0;
      const size = Number(query.size) || 10;
      const auditPosts = mockDb.getCollection("posts");
      return { status: 200, data: mockDb.paginate(auditPosts, page, size) };
    },
  },

  // Reports (returns Spring Page<ReportDTO>)
  {
    method: "GET",
    pattern: "/reports",
    handler: ({ query }) => {
      const page = Number(query.page) || 0;
      const size = Number(query.size) || 10;
      const targetType = query.targetType;
      const status = query.status;

      let reports = mockDb.getCollection("reports");
      if (targetType) {
        reports = reports.filter((r) => r.targetType === targetType);
      }
      if (status) {
        reports = reports.filter((r) => r.status === status);
      }

      return {
        status: 200,
        data: mockDb.paginate(reports, page, size),
      };
    },
  },
  {
    method: "GET",
    pattern: "/reports/:id",
    handler: ({ params }) => {
      const report = mockDb.findById("reports", params.id);
      if (!report) {
        return { status: 404, data: { message: "Không tìm thấy báo cáo" } };
      }
      return { status: 200, data: report };
    },
  },
  {
    method: "POST",
    pattern: "/reports/:id/resolve",
    handler: ({ params }) => {
      const report = mockDb.findById("reports", params.id);
      if (report) {
        report.status = "RESOLVED";
        report.updatedAt = new Date().toISOString();
        mockDb.save();
      }
      return { status: 200, data: report };
    },
  },
  {
    method: "PUT",
    pattern: "/reports/:id",
    handler: ({ params, data }) => {
      const parsed = typeof data === "string" ? JSON.parse(data) : data || {};
      const report = mockDb.findById("reports", params.id);
      if (report) {
        report.status = parsed.status || "RESOLVED";
        if (parsed.adminNote) report.adminNote = parsed.adminNote;
        report.updatedAt = new Date().toISOString();
        mockDb.save();
      }
      return { status: 200, data: report };
    },
  },

  // Notifications (returns Spring Page<TungNotificationDTO>)
  {
    method: "GET",
    pattern: "/notifications",
    handler: ({ query }) => {
      const page = Number(query?.page) || 0;
      const size = Number(query?.size) || 10;
      const notifs = mockDb.getCollection("notifications");
      return {
        status: 200,
        data: mockDb.paginate(notifs, page, size),
      };
    },
  },
  {
    method: "PUT",
    pattern: "/notifications/:id/read",
    handler: ({ params }) => {
      const notif = mockDb.findById("notifications", params.id);
      if (notif) {
        notif.read = true;
        notif.isRead = true;
        mockDb.save();
      }
      return { status: 200, data: { success: true } };
    },
  },
  {
    method: "POST",
    pattern: "/notifications/:id/read",
    handler: ({ params }) => {
      const notif = mockDb.findById("notifications", params.id);
      if (notif) {
        notif.read = true;
        notif.isRead = true;
        mockDb.save();
      }
      return { status: 200, data: { success: true } };
    },
  },
  {
    method: "PUT",
    pattern: "/notifications/read-all",
    handler: () => {
      const notifs = mockDb.getCollection("notifications");
      notifs.forEach((n) => {
        n.read = true;
        n.isRead = true;
      });
      mockDb.save();
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
        n.isRead = true;
      });
      mockDb.save();
      return { status: 200, data: { success: true } };
    },
  },
  {
    method: "DELETE",
    pattern: "/notifications/:id",
    handler: ({ params }) => {
      mockDb.delete("notifications", params.id);
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
