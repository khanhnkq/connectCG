/**
 * Mock Posts Fixture
 * Matches backend Spring Boot PostResponse contract
 */
export const initialPosts = [
  {
    id: 101,
    authorId: 1,
    authorName: "khanhnkq",
    authorFullName: "Nguyễn Kim Quốc Khánh",
    authorAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    content:
      "Chào mừng các bạn đến với ConnectCG phiên bản mới! 🚀 Hệ thống giao diện đã được chuẩn hóa 100% theo phong cách Modern Flat (phẳng hoàn toàn, không bóng đổ, không làm mờ đục, bo góc 12-16px sắc nét). Mọi tính năng Newsfeed, Nhóm, Bạn bè và Chat đều sẵn sàng!",
    visibility: "PUBLIC",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    reactCount: 38,
    commentCount: 7,
    shareCount: 4,
    currentUserReaction: "LIKE",
    status: "APPROVED",
    media: [],
    groupId: null,
    groupName: null,
  },
  {
    id: 102,
    authorId: 2,
    authorName: "hoangnam",
    authorFullName: "Trần Hoàng Nam",
    authorAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    content:
      "Một buổi chiều hoàng hôn tuyệt đẹp trên bán đảo Sơn Trà, Đà Nẵng. Chụp vội vài tấm chia sẻ cùng anh em đam mê nhiếp ảnh 📸🌅",
    visibility: "PUBLIC",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    reactCount: 94,
    commentCount: 16,
    shareCount: 8,
    currentUserReaction: "LOVE",
    status: "APPROVED",
    media: [
      {
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
        type: "IMAGE",
        displayOrder: 0,
      },
      {
        url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop&q=80",
        type: "IMAGE",
        displayOrder: 1,
      },
      {
        url: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&auto=format&fit=crop&q=80",
        type: "IMAGE",
        displayOrder: 2,
      },
    ],
    groupId: null,
    groupName: null,
  },
  {
    id: 103,
    authorId: 3,
    authorName: "maichi",
    authorFullName: "Lê Mai Chi",
    authorAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
    content:
      "Design System cho ứng dụng mạng xã hội cần sự tối giản tối đa để người dùng tập trung vào nội dung. Hãy loại bỏ các bóng đổ thừa thãi và tập trung vào phân cấp thị giác (visual hierarchy) bằng typography!",
    visibility: "PUBLIC",
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    reactCount: 52,
    commentCount: 9,
    shareCount: 3,
    currentUserReaction: null,
    status: "APPROVED",
    media: [
      {
        url: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80",
        type: "IMAGE",
        displayOrder: 0,
      },
    ],
    groupId: 2,
    groupName: "Hội UI/UX & Thiết kế Sản phẩm",
  },
  {
    id: 104,
    authorId: 5,
    authorName: "thanhhuong",
    authorFullName: "Đỗ Thanh Hương",
    authorAvatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
    content:
      "Góc bàn làm việc sáng nay với chậu bàng Singapore mới thay đất 🌱 Không gian xanh giúp tăng 30% năng suất làm việc luôn đó mọi người!",
    visibility: "PUBLIC",
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    reactCount: 65,
    commentCount: 12,
    shareCount: 5,
    currentUserReaction: null,
    status: "APPROVED",
    media: [
      {
        url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80",
        type: "IMAGE",
        displayOrder: 0,
      },
      {
        url: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&auto=format&fit=crop&q=80",
        type: "IMAGE",
        displayOrder: 1,
      },
    ],
    groupId: 4,
    groupName: "Hội Yêu Cây Cảnh & Không Gian Xanh",
  },
  {
    id: 105,
    authorId: 4,
    authorName: "quocanh",
    authorFullName: "Võ Quốc Anh",
    authorAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    content:
      "Testing Microservices với gRPC streaming mang lại trải nghiệm độ trễ siêu thấp dưới 5ms. Anh em nào đang chuyển từ REST sang gRPC thảo luận nhé!",
    visibility: "PUBLIC",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    reactCount: 41,
    commentCount: 18,
    shareCount: 6,
    currentUserReaction: "LIKE",
    status: "APPROVED",
    media: [],
    groupId: null,
    groupName: null,
  },
];
