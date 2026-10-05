/**
 * Mock Chat Fixture
 * Matches backend Spring Boot Chat & Message contracts
 */
export const initialConversations = [
  {
    id: "c1",
    type: "DIRECT",
    name: "Trần Hoàng Nam",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    targetUserId: 2,
    unreadCount: 1,
    online: true,
    lastMessage: {
      content: "Cuối tuần này có photowalk ở cầu Rồng không anh?",
      senderId: 2,
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
  },
  {
    id: "c2",
    type: "DIRECT",
    name: "Lê Mai Chi",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
    targetUserId: 3,
    unreadCount: 0,
    online: false,
    lastMessage: {
      content: "Em vừa gửi bộ icon Phosphor đã tối ưu qua email nhé.",
      senderId: 3,
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    },
  },
  {
    id: "c3",
    type: "GROUP",
    name: "Core Tech & Design ConnectCG",
    avatarUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&auto=format&fit=crop&q=80",
    memberCount: 5,
    unreadCount: 0,
    online: true,
    lastMessage: {
      content: "Khánh: Đã deploy xong phiên bản Modern Flat 2026!",
      senderId: 1,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  },
];

export const initialMessages = {
  c1: [
    {
      id: "m1",
      conversationId: "c1",
      senderId: 1,
      senderName: "Nguyễn Kim Quốc Khánh",
      content: "Chào Nam, bộ ảnh Sơn Trà em chụp bằng lens gì thế?",
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
    {
      id: "m2",
      conversationId: "c1",
      senderId: 2,
      senderName: "Trần Hoàng Nam",
      content: "Dạ em dùng 35mm f/1.4 GM chụp góc rộng và xóa phông nhẹ anh ơi!",
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
    {
      id: "m3",
      conversationId: "c1",
      senderId: 2,
      senderName: "Trần Hoàng Nam",
      content: "Cuối tuần này có photowalk ở cầu Rồng không anh?",
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
  ],
  c2: [
    {
      id: "m4",
      conversationId: "c2",
      senderId: 1,
      senderName: "Nguyễn Kim Quốc Khánh",
      content: "Chi kiểm tra xem bộ Badge border-free mới đã ưng mắt chưa nhé.",
      createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    },
    {
      id: "m5",
      conversationId: "c2",
      senderId: 3,
      senderName: "Lê Mai Chi",
      content: "Em vừa xem rồi, bỏ border đi và giữ solid 100% nhìn sạch sẽ và sang hơn hẳn!",
      createdAt: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString(),
    },
    {
      id: "m6",
      conversationId: "c2",
      senderId: 3,
      senderName: "Lê Mai Chi",
      content: "Em vừa gửi bộ icon Phosphor đã tối ưu qua email nhé.",
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    },
  ],
};
