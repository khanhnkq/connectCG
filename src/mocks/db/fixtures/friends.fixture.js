/**
 * Mock Friends Fixture
 * Matches backend Spring Boot FriendDTO, FriendRequestDTO, and FriendSuggestion contracts
 */
export const initialFriends = [
  {
    id: 2,
    userId: 2,
    friendId: 2,
    username: "hoangnam",
    fullName: "Trần Hoàng Nam",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    currentAvatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    occupation: "Nhiếp ảnh gia tự do",
    cityName: "Thành phố Hồ Chí Minh",
    gender: "MALE",
    onlineStatus: "ONLINE",
    relationshipStatus: "ACCEPTED",
    friendSince: "2025-02-12T00:00:00.000Z",
  },
  {
    id: 3,
    userId: 3,
    friendId: 3,
    username: "maichi",
    fullName: "Lê Mai Chi",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
    currentAvatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
    occupation: "UI/UX Designer",
    cityName: "Thành phố Hà Nội",
    gender: "FEMALE",
    onlineStatus: "OFFLINE",
    relationshipStatus: "ACCEPTED",
    friendSince: "2025-01-20T00:00:00.000Z",
  },
];

export const initialSuggestions = [
  {
    id: 4,
    userId: 4,
    username: "quocanh",
    fullName: "Võ Quốc Anh",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    currentAvatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    occupation: "Kỹ sư di động",
    cityName: "Thành phố Đà Nẵng",
    gender: "MALE",
    mutualFriendsCount: 2,
    mutualFriends: 2,
    description: "Cùng sống tại Đà Nẵng",
    reason: "Cùng sống tại Đà Nẵng",
  },
  {
    id: 5,
    userId: 5,
    username: "thanhhuong",
    fullName: "Đỗ Thanh Hương",
    avatarUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
    currentAvatarUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
    occupation: "Content Lead",
    cityName: "Thành phố Hà Nội",
    gender: "FEMALE",
    mutualFriendsCount: 1,
    mutualFriends: 1,
    description: "Cùng sở thích Cây cảnh mini",
    reason: "Cùng sở thích Cây cảnh mini",
  },
];

export const initialFriendRequests = [
  {
    id: 1,
    requestId: 1,
    senderId: 4,
    senderUsername: "quocanh",
    senderName: "quocanh",
    senderFullName: "Võ Quốc Anh",
    senderAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    senderAvatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    receiverId: 1,
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    status: "PENDING",
  },
];
