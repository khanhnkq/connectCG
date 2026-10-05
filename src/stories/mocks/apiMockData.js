/**
 * Mock Data Fixtures for Storybook
 * Exactly adhering to Spring Boot backend OpenAPI Schema (data-contracts.d.ts)
 */

export const mockUsers = {
  currentUser: {
    id: 1,
    username: "khanhnkq",
    fullName: "Nguyễn Kim Quốc Khánh",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    role: "ADMIN",
    bio: "Fullstack Developer & UI/UX enthusiast. Building ConnectCG.",
    cityCode: "48",
    cityName: "Đà Nẵng",
    occupation: "Kỹ sư phần mềm",
    gender: "MALE",
    maritalStatus: "SINGLE",
    friendCount: 142,
    postCount: 28,
  },
  friend1: {
    id: 2,
    username: "hoangnam",
    fullName: "Trần Hoàng Nam",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    role: "USER",
    bio: "Passionate about photography & travel.",
    cityCode: "79",
    cityName: "TP. Hồ Chí Minh",
    occupation: "Nhiếp ảnh gia",
    gender: "MALE",
    friendCount: 98,
  },
  friend2: {
    id: 3,
    username: "maichi",
    fullName: "Lê Mai Chi",
    avatarUrl: "", // Tests initials fallback "MC"
    role: "USER",
    bio: "Product Designer @ TechHub",
    cityCode: "01",
    cityName: "Hà Nội",
    occupation: "UI/UX Designer",
    gender: "FEMALE",
    friendCount: 215,
  },
};

export const mockPosts = {
  textOnly: {
    id: 101,
    authorId: 1,
    authorName: "khanhnkq",
    authorFullName: "Nguyễn Kim Quốc Khánh",
    authorAvatar: mockUsers.currentUser.avatarUrl,
    content: "Chào mừng mọi người đến với phiên bản ConnectCG mới! Giao diện đã được thiết kế lại hoàn toàn theo phong cách Modern Flat (phẳng hoàn toàn, không bóng đổ, không làm mờ, bo góc mềm mại). Mọi người cho mình xin ý kiến nhé! 🚀",
    visibility: "PUBLIC",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
    reactCount: 24,
    commentCount: 5,
    shareCount: 2,
    currentUserReaction: "LIKE",
    status: "APPROVED",
    media: [],
  },
  withImages: {
    id: 102,
    authorId: 2,
    authorName: "hoangnam",
    authorFullName: "Trần Hoàng Nam",
    authorAvatar: mockUsers.friend1.avatarUrl,
    content: "Chiều hoàng hôn tuyệt đẹp trên bán đảo Sơn Trà, Đà Nẵng. Chụp vội vài tấm chia sẻ cùng anh em nhóm nhiếp ảnh 📸🌅",
    visibility: "PUBLIC",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // 2 hours ago
    reactCount: 89,
    commentCount: 14,
    shareCount: 6,
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
  },
  inGroup: {
    id: 103,
    authorId: 3,
    authorName: "maichi",
    authorFullName: "Lê Mai Chi",
    authorAvatar: "",
    groupId: 501,
    groupName: "Cộng đồng Designer & Frontend VN",
    content: "Xin chào mọi người trong nhóm! Mình vừa tổng hợp bộ Design Tokens chuẩn 2026 cho Tailwind v4, bao gồm Color Palette, Corner Radii, và Typography. Anh em ai quan tâm thì comment mình gửi link tài liệu nha!",
    visibility: "PUBLIC",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // 1 day ago
    reactCount: 156,
    commentCount: 42,
    shareCount: 19,
    currentUserReaction: null,
    status: "APPROVED",
    isPinned: true,
    media: [],
  },
};

export const mockComments = [
  {
    id: 201,
    authorId: 1,
    authorName: "khanhnkq",
    authorFullName: "Nguyễn Kim Quốc Khánh",
    authorAvatar: mockUsers.currentUser.avatarUrl,
    content: "Bài viết rất hữu ích, cảm ơn bạn đã chia sẻ!",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    replies: [
      {
        id: 202,
        authorId: 3,
        authorName: "maichi",
        authorFullName: "Lê Mai Chi",
        authorAvatar: "",
        content: "Cảm ơn bạn! Để mình gửi bạn tài liệu chi tiết qua tin nhắn nha.",
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 203,
    authorId: 2,
    authorName: "hoangnam",
    authorFullName: "Trần Hoàng Nam",
    authorAvatar: mockUsers.friend1.avatarUrl,
    content: "Tông màu cam Tangerine phẳng nhìn rất hiện đại và dễ chịu mắt!",
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    replies: [],
  },
];

export const mockGroups = {
  activeGroup: {
    id: 501,
    name: "Cộng đồng Designer & Frontend VN",
    description: "Nơi giao lưu, chia sẻ kinh nghiệm về Thiết kế giao diện (UI/UX), Hệ thống thiết kế (Design System) và Lập trình Frontend hiện đại.",
    privacy: "PUBLIC",
    memberCount: 1420,
    pendingPostsCount: 3,
    pendingRequestsCount: 12,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    ownerId: 1,
    ownerFullName: "Nguyễn Kim Quốc Khánh",
    currentUserRole: "OWNER",
    currentUserStatus: "ACTIVE",
    createdAt: new Date(Date.now() - 60 * 86400 * 1000).toISOString(),
  },
};
