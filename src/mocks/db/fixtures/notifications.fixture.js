/**
 * Mock Notifications Fixture
 * Matches backend Spring Boot NotificationResponse contract
 */
export const initialNotifications = [
  {
    id: 1,
    notificationId: 1,
    type: "REACTION",
    targetType: "POST",
    targetId: 101,
    title: "Tương tác mới",
    content: "Trần Hoàng Nam đã thích bài viết của bạn.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    actorName: "Trần Hoàng Nam",
    actorAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    read: false,
    isRead: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    link: "/dashboard/feed",
  },
  {
    id: 2,
    notificationId: 2,
    type: "COMMENT",
    targetType: "POST",
    targetId: 102,
    title: "Bình luận mới",
    content: "Lê Mai Chi đã bình luận: 'Màu cam Tangerine Hermès phối với Dark mode nhìn rất sang...'",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
    actorName: "Lê Mai Chi",
    actorAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
    read: false,
    isRead: false,
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    link: "/dashboard/feed",
  },
  {
    id: 3,
    notificationId: 3,
    type: "GROUP_INVITE",
    targetType: "GROUP",
    targetId: 3,
    title: "Lời mời nhóm",
    content: "Bạn nhận được lời mời tham gia nhóm 'Venture Builders & Khởi nghiệp Công nghệ'.",
    avatar:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=300&auto=format&fit=crop&q=80",
    actorName: "Võ Quốc Anh",
    actorAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    read: true,
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    link: "/dashboard/groups?tab=invites",
  },
];
