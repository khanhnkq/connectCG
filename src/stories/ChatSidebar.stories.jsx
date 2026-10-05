import React, { useState } from "react";
import ChatSidebar from "../components/chat/ChatSidebar";
import { MockAppProviders } from "./mocks/MockAppProviders";
import { mockUsers } from "./mocks/apiMockData";

export default {
  title: "Features/Chat/ChatSidebar",
  component: ChatSidebar,
  decorators: [
    (Story) => (
      <MockAppProviders>
        <div className="w-80 sm:w-96 h-[600px] border border-border-main rounded-2xl overflow-hidden bg-background-main">
          <Story />
        </div>
      </MockAppProviders>
    ),
  ],
};

const mockConversations = [
  {
    id: 1,
    name: "Trần Hoàng Nam",
    type: "DIRECT",
    firebaseRoomKey: "room_1",
    avatarUrl: mockUsers.friend1.avatarUrl,
    lastMessageVisible: "Hôm nay họp lúc mấy giờ vậy bạn?",
    lastMessageTimestamp: Date.now() - 5 * 60 * 1000,
    unreadCount: 2,
    members: [{ id: 1 }, { id: 2 }],
  },
  {
    id: 2,
    name: "Lê Mai Chi",
    type: "DIRECT",
    firebaseRoomKey: "room_2",
    avatarUrl: "",
    lastMessageVisible: "Đã gửi một ảnh",
    lastMessageTimestamp: Date.now() - 45 * 60 * 1000,
    unreadCount: 0,
    members: [{ id: 1 }, { id: 3 }],
  },
  {
    id: 3,
    name: "Nhóm Frontend ConnectCG",
    type: "GROUP",
    firebaseRoomKey: "room_group_1",
    avatarUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&auto=format&fit=crop&q=80",
    lastMessageVisible: "Quốc Khánh: Đã hoàn tất PR #19 rồi nhé!",
    lastMessageTimestamp: Date.now() - 10 * 60 * 1000,
    unreadCount: 5,
    members: [{ id: 1 }, { id: 2 }, { id: 3 }],
  },
  {
    id: 4,
    name: "Hội UI/UX Designer",
    type: "GROUP",
    firebaseRoomKey: "room_group_2",
    avatarUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&auto=format&fit=crop&q=80",
    lastMessageVisible: "Chi: Giao diện Modern Flat nhìn rất ưng mắt.",
    lastMessageTimestamp: Date.now() - 120 * 60 * 1000,
    unreadCount: 0,
    members: [{ id: 1 }, { id: 3 }],
  },
];

export const DirectMessagesView = () => {
  const [activeTab, setActiveTab] = useState("DIRECT");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeRoom, setActiveRoom] = useState(mockConversations[0]);

  return (
    <ChatSidebar
      conversations={mockConversations}
      activeRoom={activeRoom}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      directUnreadCount={2}
      groupUnreadCount={5}
      onSelectRoom={setActiveRoom}
      onOpenNewChat={() => alert("Mở modal tạo chat mới")}
    />
  );
};

export const GroupChatsView = () => {
  const [activeTab, setActiveTab] = useState("GROUP");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeRoom, setActiveRoom] = useState(mockConversations[2]);

  return (
    <ChatSidebar
      conversations={mockConversations}
      activeRoom={activeRoom}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      directUnreadCount={2}
      groupUnreadCount={5}
      onSelectRoom={setActiveRoom}
      onOpenNewChat={() => alert("Mở modal tạo chat mới")}
    />
  );
};
