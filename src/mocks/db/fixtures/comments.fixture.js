/**
 * Mock Comments Fixture
 * Matches backend Spring Boot CommentResponse contract
 */
export const initialComments = [
  {
    id: 1,
    postId: 101,
    authorId: 2,
    authorName: "hoangnam",
    authorFullName: "Trần Hoàng Nam",
    authorAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    content: "Giao diện mới phẳng đẹp quá anh ơi! Tốc độ load cũng mượt mà hẳn!",
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    replyCount: 1,
    replies: [
      {
        id: 1001,
        postId: 101,
        authorId: 1,
        authorName: "khanhnkq",
        authorFullName: "Nguyễn Kim Quốc Khánh",
        authorAvatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
        content: "Cảm ơn Nam nhé! Nhóm đã chuẩn hóa 100% không còn bóng đổ mờ đục nào nữa!",
        createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 2,
    postId: 101,
    authorId: 3,
    authorName: "maichi",
    authorFullName: "Lê Mai Chi",
    authorAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
    content: "Màu cam Tangerine Hermès phối với Dark mode nhìn rất sang và có gu!",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    replyCount: 0,
    replies: [],
  },
  {
    id: 3,
    postId: 102,
    authorId: 1,
    authorName: "khanhnkq",
    authorFullName: "Nguyễn Kim Quốc Khánh",
    authorAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    content: "Góc chụp đẹp quá Nam! Bán đảo Sơn Trà mùa này hoàng hôn là đỉnh nhất.",
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    replyCount: 0,
    replies: [],
  },
];
