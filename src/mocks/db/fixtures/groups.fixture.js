/**
 * Mock Groups Fixture
 * Matches backend Spring Boot GroupResponse contract
 */
export const initialGroups = [
  {
    id: "g1",
    name: "Cộng đồng AI & Robotics Đà Nẵng",
    description:
      "Nơi giao lưu, chia sẻ kinh nghiệm nghiên cứu mô hình LLM, thị giác máy tính và lập trình robot tự hành.",
    privacy: "PUBLIC",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop",
    ownerId: 1,
    ownerName: "khanhnkq",
    ownerFullName: "Nguyễn Kim Quốc Khánh",
    memberCount: 348,
    currentUserStatus: "ACCEPTED",
    currentUserRole: "OWNER",
    pendingRequestsCount: 4,
    pendingPostsCount: 2,
    createdAt: "2025-01-10T08:00:00.000Z",
  },
  {
    id: "g2",
    name: "Hội UI/UX & Thiết kế Sản phẩm",
    description:
      "Cộng đồng các nhà thiết kế chia sẻ case study, design system hiện đại và thảo luận xu hướng giao diện phẳng 2026.",
    privacy: "PUBLIC",
    image:
      "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1000&auto=format&fit=crop",
    ownerId: 1,
    ownerName: "khanhnkq",
    ownerFullName: "Nguyễn Kim Quốc Khánh",
    memberCount: 512,
    currentUserStatus: "ACCEPTED",
    currentUserRole: "OWNER",
    pendingRequestsCount: 7,
    pendingPostsCount: 5,
    createdAt: "2025-01-20T10:30:00.000Z",
  },
  {
    id: "g3",
    name: "CLB Nhiếp ảnh Đường phố Sài Gòn",
    description:
      "Giao lưu ảnh street life, ống kính cơ bản, góc chụp ánh sáng tự nhiên và các buổi photowalk cuối tuần.",
    privacy: "PUBLIC",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop",
    ownerId: 2,
    ownerName: "hoangnam",
    ownerFullName: "Trần Hoàng Nam",
    memberCount: 189,
    currentUserStatus: "ACCEPTED",
    currentUserRole: "MEMBER",
    pendingRequestsCount: 0,
    pendingPostsCount: 0,
    createdAt: "2025-02-01T14:15:00.000Z",
  },
  {
    id: "g4",
    name: "Hội Yêu Cây Cảnh & Không Gian Xanh",
    description:
      "Chia sẻ kinh nghiệm chăm sóc cây cảnh văn phòng, sen đá, terrarium và trang trí góc làm việc xanh mát.",
    privacy: "PUBLIC",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1000&auto=format&fit=crop",
    ownerId: 5,
    ownerName: "thanhhuong",
    ownerFullName: "Đỗ Thanh Hương",
    memberCount: 260,
    currentUserStatus: "ACCEPTED",
    currentUserRole: "MEMBER",
    pendingRequestsCount: 0,
    pendingPostsCount: 0,
    createdAt: "2025-02-15T09:00:00.000Z",
  },
  {
    id: "g5",
    name: "Lập trình viên Golang & Cloud Native",
    description:
      "Thảo luận chuyên sâu về kiến trúc Microservices, Kubernetes, gRPC và tối ưu hiệu năng hệ thống chịu tải cao.",
    privacy: "PUBLIC",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop",
    ownerId: 4,
    ownerName: "quocanh",
    ownerFullName: "Võ Quốc Anh",
    memberCount: 415,
    currentUserStatus: null, // Chưa tham gia -> hiển thị nút "Tham gia" trong Discover
    currentUserRole: null,
    pendingRequestsCount: 0,
    pendingPostsCount: 0,
    createdAt: "2025-03-01T11:00:00.000Z",
  },
  {
    id: "g6",
    name: "Venture Builders & Khởi nghiệp Công nghệ",
    description:
      "Không gian kết nối giữa các Founder, Tech Leads và nhà đầu tư thiên thần tại khu vực miền Trung.",
    privacy: "PRIVATE",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop",
    ownerId: 3,
    ownerName: "maichi",
    ownerFullName: "Lê Mai Chi",
    memberCount: 92,
    currentUserStatus: "PENDING", // Lời mời tham gia -> hiển thị trong tab Lời mời
    currentUserRole: null,
    pendingRequestsCount: 0,
    pendingPostsCount: 0,
    createdAt: "2025-03-10T16:45:00.000Z",
  },
];
