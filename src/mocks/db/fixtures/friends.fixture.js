/**
 * Mock Friends Fixture
 * Matches backend Spring Boot Friend & FriendSuggestion contracts
 */
export const initialFriends = [
  {
    friendId: 2,
    username: "hoangnam",
    fullName: "Trần Hoàng Nam",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    occupation: "Nhiếp ảnh gia tự do",
    cityName: "TP. Hồ Chí Minh",
    onlineStatus: "ONLINE",
    friendSince: "2025-02-12T00:00:00.000Z",
  },
  {
    friendId: 3,
    username: "maichi",
    fullName: "Lê Mai Chi",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
    occupation: "UI/UX Designer",
    cityName: "Hà Nội",
    onlineStatus: "OFFLINE",
    friendSince: "2025-01-20T00:00:00.000Z",
  },
];

export const initialSuggestions = [
  {
    userId: 4,
    username: "quocanh",
    fullName: "Võ Quốc Anh",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    occupation: "Kỹ sư di động",
    cityName: "Đà Nẵng",
    mutualFriendsCount: 2,
    reason: "Cùng sống tại Đà Nẵng",
  },
  {
    userId: 5,
    username: "thanhhuong",
    fullName: "Đỗ Thanh Hương",
    avatarUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
    occupation: "Content Lead",
    cityName: "Hà Nội",
    mutualFriendsCount: 1,
    reason: "Cùng sở thích Cây cảnh mini",
  },
];

export const initialFriendRequests = [
  {
    id: "fr1",
    senderId: 4,
    senderName: "quocanh",
    senderFullName: "Võ Quốc Anh",
    senderAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    status: "PENDING",
  },
];
