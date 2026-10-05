import { describe, it, expect, beforeEach } from "vitest";
import mockDb from "../db/mockDb";
import { initMockService } from "../index";
import axiosClient from "../../config/axiosConfig";
import mockStompClient from "../websocket/mockStompClient";

describe("ConnectCG Standalone Mock Layer", () => {
  beforeEach(() => {
    mockDb.reset();
    initMockService();
  });

  describe("Mock Database (mockDb)", () => {
    it("initializes default collections with realistic data", () => {
      const users = mockDb.getCollection("users");
      const groups = mockDb.getCollection("groups");
      const posts = mockDb.getCollection("posts");

      expect(users.length).toBeGreaterThanOrEqual(5);
      expect(groups.length).toBeGreaterThanOrEqual(6);
      expect(posts.length).toBeGreaterThanOrEqual(5);
    });

    it("gets current user and allows persona switching", () => {
      const defaultUser = mockDb.getCurrentUser();
      expect(defaultUser.email).toBe("admin@connectcg.com");

      // Switch to user 2 (Nam)
      mockDb.setCurrentUser(2);
      const updatedUser = mockDb.getCurrentUser();
      expect(updatedUser.id).toBe(2);
      expect(updatedUser.fullName).toBe("Trần Hoàng Nam");
    });

    it("supports paginate helper according to Spring Page format", () => {
      const posts = mockDb.getCollection("posts");
      const paged = mockDb.paginate(posts, 0, 2);

      expect(paged.content.length).toBe(2);
      expect(paged.totalElements).toBe(posts.length);
      expect(paged.totalPages).toBe(Math.ceil(posts.length / 2));
      expect(paged.number).toBe(0);
      expect(paged.size).toBe(2);
    });

    it("supports CRUD operations", () => {
      const newPost = mockDb.insert("posts", {
        content: "New test post created in mock mode",
        authorId: 1,
      });

      expect(newPost.id).toBeDefined();
      expect(mockDb.findById("posts", newPost.id)).toBeDefined();

      const updated = mockDb.update("posts", newPost.id, {
        content: "Updated post content",
      });
      expect(updated.content).toBe("Updated post content");

      const deleted = mockDb.delete("posts", newPost.id);
      expect(deleted).toBe(true);
      expect(mockDb.findById("posts", newPost.id)).toBeNull();
    });
  });

  describe("Axios Mock Adapter Endpoints", () => {
    it("handles GET /auth/csrf", async () => {
      const res = await axiosClient.get("/auth/csrf");
      expect(res.status).toBe(200);
      expect(res.data.token).toBeDefined();
    });

    it("handles GET /auth/me", async () => {
      const res = await axiosClient.get("/auth/me");
      expect(res.status).toBe(200);
      expect(res.data.email).toBe("admin@connectcg.com");
      expect(res.data.role).toBe("ADMIN");
    });

    it("handles POST /auth/login", async () => {
      const res = await axiosClient.post("/auth/login", {
        email: "admin@connectcg.com",
        password: "any-password",
      });
      expect(res.status).toBe(200);
      expect(res.data.user.email).toBe("admin@connectcg.com");
    });

    it("handles GET /posts with pagination", async () => {
      const res = await axiosClient.get("/posts?page=0&size=5");
      expect(res.status).toBe(200);
      expect(res.data.content).toBeInstanceOf(Array);
      expect(res.data.content.length).toBeGreaterThan(0);
    });

    it("handles POST /posts to create new post", async () => {
      const res = await axiosClient.post("/posts", {
        content: "Bài viết mới từ Mock Test",
        media: [],
      });
      expect([200, 201]).toContain(res.status);
      expect(res.data.content).toBe("Bài viết mới từ Mock Test");
      expect(res.data.currentUserReaction).toBeNull();
    });

    it("handles POST /posts/:id/react", async () => {
      const res = await axiosClient.post("/posts/101/react", {
        reaction: "LIKE",
      });
      expect(res.status).toBe(200);
      expect(res.data.currentUserReaction).toBe("LIKE");
    });

    it("handles GET /groups/discover and GET /groups/my-managed", async () => {
      const discoverRes = await axiosClient.get("/groups/discover?page=0&size=5");
      expect(discoverRes.status).toBe(200);
      expect(discoverRes.data.content.length).toBeGreaterThan(0);

      const managedRes = await axiosClient.get("/groups/my-managed");
      expect(managedRes.status).toBe(200);
      expect(managedRes.data.content).toBeInstanceOf(Array);
    });

    it("handles GET /users/profile", async () => {
      const res = await axiosClient.get("/users/profile");
      expect(res.status).toBe(200);
      expect(res.data.email).toBe("admin@connectcg.com");
      expect(res.data.roles).toContain("ADMIN");
    });

    it("handles GET /admin-user for admin user management", async () => {
      const res = await axiosClient.get("/admin-user?page=0&size=10");
      expect(res.status).toBe(200);
      expect(res.data.content.length).toBeGreaterThanOrEqual(5);
    });

    it("handles GET /chat/my and GET /chat/:roomId", async () => {
      const listRes = await axiosClient.get("/chat/my");
      expect(listRes.status).toBe(200);
      expect(listRes.data).toBeInstanceOf(Array);

      const roomRes = await axiosClient.get("/chat/c1");
      expect(roomRes.status).toBe(200);
      expect(roomRes.data.id).toBe("c1");
    });

    it("handles GET /notifications", async () => {
      const res = await axiosClient.get("/notifications");
      expect(res.status).toBe(200);
      expect(res.data.content).toBeInstanceOf(Array);
      expect(res.data.totalPages).toBeGreaterThanOrEqual(1);
    });

    it("handles GET /users/search with Spring Page envelope", async () => {
      const res = await axiosClient.get("/users/search?keyword=khanh");
      expect(res.status).toBe(200);
      expect(res.data.content).toBeInstanceOf(Array);
      expect(res.data.content[0].userId).toBeDefined();
      expect(res.data.totalPages).toBeGreaterThanOrEqual(1);
    });

    it("handles GET /reports with filter and Page envelope", async () => {
      const res = await axiosClient.get("/reports?targetType=USER&status=PENDING");
      expect(res.status).toBe(200);
      expect(res.data.content).toBeInstanceOf(Array);
      expect(res.data.totalPages).toBeGreaterThanOrEqual(1);
    });

    it("handles GET /friends/my-friends with Page envelope", async () => {
      const res = await axiosClient.get("/friends/my-friends");
      expect(res.status).toBe(200);
      expect(res.data.content).toBeInstanceOf(Array);
      expect(res.data.content[0].friendId || res.data.content[0].id).toBeDefined();
    });
  });

  describe("Mock WebSocket (MockStompClient)", () => {
    it("subscribes and receives emitted events", () => {
      let received = null;
      const sub = mockStompClient.subscribe("/test/topic", (msg) => {
        received = JSON.parse(msg.body);
      });

      mockStompClient.emit("/test/topic", { message: "Hello Mock WebSocket" });
      expect(received).toEqual({ message: "Hello Mock WebSocket" });

      sub.unsubscribe();
      received = null;
      mockStompClient.emit("/test/topic", { message: "After unsubscribe" });
      expect(received).toBeNull();
    });
  });
});
