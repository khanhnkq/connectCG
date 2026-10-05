import mockDb from "../db/mockDb";

export const postHandlers = [
  // Get homepage feed (paginated)
  {
    method: "GET",
    pattern: "/posts",
    handler: ({ query }) => {
      const page = query.page || 0;
      const size = query.size || 10;
      const allPosts = mockDb.getCollection("posts");
      return {
        status: 200,
        data: mockDb.paginate(allPosts, page, size),
      };
    },
  },
  {
    method: "GET",
    pattern: "/posts/public/homepage",
    handler: ({ query }) => {
      const page = query.page || 0;
      const size = query.size || 10;
      const publicPosts = mockDb.getCollection("posts").filter(
        (p) => p.visibility === "PUBLIC",
      );
      return {
        status: 200,
        data: mockDb.paginate(publicPosts, page, size),
      };
    },
  },

  // Get single post
  {
    method: "GET",
    pattern: "/posts/:id",
    handler: ({ params }) => {
      const post = mockDb.findById("posts", params.id);
      if (!post) {
        return { status: 404, data: { message: "Không tìm thấy bài viết" } };
      }
      return { status: 200, data: post };
    },
  },

  // Create post
  {
    method: "POST",
    pattern: "/posts",
    handler: ({ data }) => {
      const parsed = typeof data === "string" ? JSON.parse(data) : data || {};
      const user = mockDb.getCurrentUser();
      const newPost = mockDb.insert("posts", {
        authorId: user.id,
        authorName: user.username,
        authorFullName: user.fullName,
        authorAvatar: user.avatarUrl,
        content: parsed.content || "",
        visibility: parsed.visibility || "PUBLIC",
        groupId: parsed.groupId || null,
        groupName: parsed.groupName || null,
        media: parsed.media || [],
        reactCount: 0,
        commentCount: 0,
        shareCount: 0,
        currentUserReaction: null,
        status: "APPROVED",
      });

      // Increment user postCount
      user.postCount = (user.postCount || 0) + 1;
      mockDb.save();

      return { status: 201, data: newPost };
    },
  },

  // Update post
  {
    method: "PUT",
    pattern: "/posts/:id",
    handler: ({ params, data }) => {
      const parsed = typeof data === "string" ? JSON.parse(data) : data || {};
      const updated = mockDb.update("posts", params.id, parsed);
      return { status: 200, data: updated };
    },
  },

  // Delete post
  {
    method: "DELETE",
    pattern: "/posts/:id",
    handler: ({ params }) => {
      mockDb.delete("posts", params.id);
      return { status: 200, data: { message: "Đã xóa bài viết thành công" } };
    },
  },

  // React to post
  {
    method: "POST",
    pattern: "/posts/:id/react",
    handler: ({ params, data }) => {
      const parsed = typeof data === "string" ? JSON.parse(data) : data || {};
      const reaction = parsed.reaction || "LIKE";
      const post = mockDb.findById("posts", params.id);
      if (!post) return { status: 404, data: { message: "Post not found" } };

      const hadReaction = Boolean(post.currentUserReaction);
      post.currentUserReaction = reaction;
      if (!hadReaction) {
        post.reactCount = (post.reactCount || 0) + 1;
      }
      mockDb.save();

      return { status: 200, data: post };
    },
  },

  // Unreact to post
  {
    method: "POST",
    pattern: "/posts/:id/unreact",
    handler: ({ params }) => {
      const post = mockDb.findById("posts", params.id);
      if (post && post.currentUserReaction) {
        post.currentUserReaction = null;
        post.reactCount = Math.max(0, (post.reactCount || 1) - 1);
        mockDb.save();
      }
      return { status: 200, data: post };
    },
  },

  // Share post
  {
    method: "POST",
    pattern: "/posts/:id/share",
    handler: ({ params, data }) => {
      const original = mockDb.findById("posts", params.id);
      if (!original) return { status: 404, data: { message: "Post not found" } };

      original.shareCount = (original.shareCount || 0) + 1;
      const user = mockDb.getCurrentUser();
      const parsed = typeof data === "string" ? JSON.parse(data) : data || {};

      const sharedPost = mockDb.insert("posts", {
        authorId: user.id,
        authorName: user.username,
        authorFullName: user.fullName,
        authorAvatar: user.avatarUrl,
        content: parsed.content || "",
        visibility: parsed.visibility || "PUBLIC",
        sharedPost: original,
        reactCount: 0,
        commentCount: 0,
        shareCount: 0,
        status: "APPROVED",
      });

      return { status: 201, data: sharedPost };
    },
  },

  // User posts
  {
    method: "GET",
    pattern: "/posts/user/:userId",
    handler: ({ params, query }) => {
      const page = query.page || 0;
      const size = query.size || 10;
      const userPosts = mockDb.getCollection("posts").filter(
        (p) => String(p.authorId) === String(params.userId),
      );
      return { status: 200, data: mockDb.paginate(userPosts, page, size) };
    },
  },

  // Comments for post
  {
    method: "GET",
    pattern: "/posts/:postId/comments",
    handler: ({ params }) => {
      const comments = mockDb.getCollection("comments").filter(
        (c) => String(c.postId) === String(params.postId),
      );
      return { status: 200, data: comments };
    },
  },

  // Add comment
  {
    method: "POST",
    pattern: "/posts/:postId/comments",
    handler: ({ params, data }) => {
      const parsed = typeof data === "string" ? JSON.parse(data) : data || {};
      const user = mockDb.getCurrentUser();
      const newComment = mockDb.insert("comments", {
        postId: Number(params.postId),
        authorId: user.id,
        authorName: user.username,
        authorFullName: user.fullName,
        authorAvatar: user.avatarUrl,
        content: parsed.content || "",
        replyCount: 0,
        replies: [],
      });

      // Increment comment count on post
      const post = mockDb.findById("posts", params.postId);
      if (post) {
        post.commentCount = (post.commentCount || 0) + 1;
        mockDb.save();
      }

      return { status: 201, data: newComment };
    },
  },

  // Delete comment
  {
    method: "DELETE",
    pattern: "/posts/:postId/comments/:commentId",
    handler: ({ params }) => {
      mockDb.delete("comments", params.commentId);
      const post = mockDb.findById("posts", params.postId);
      if (post) {
        post.commentCount = Math.max(0, (post.commentCount || 1) - 1);
        mockDb.save();
      }
      return { status: 200, data: { message: "Đã xóa bình luận" } };
    },
  },
];
