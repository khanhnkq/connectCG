import React, { useState, useRef } from "react";
import ChatWindow from "../components/chat/ChatWindow";
import { MockAppProviders } from "./mocks/MockAppProviders";
import { mockUsers } from "./mocks/apiMockData";

export default {
  title: "Features/Chat/ChatWindow",
  component: ChatWindow,
  decorators: [
    (Story) => (
      <MockAppProviders>
        <div className="w-full max-w-4xl h-[650px] border-0 shadow-xl rounded-2xl overflow-hidden bg-background-main flex">
          <Story />
        </div>
      </MockAppProviders>
    ),
  ],
};

const currentUser = {
  id: 1,
  username: "khanhnkq",
  fullName: "Nguyễn Kim Quốc Khánh",
  avatarUrl: mockUsers.currentUser.avatarUrl,
};

const directRoom = {
  id: 1,
  name: "Trần Hoàng Nam",
  type: "DIRECT",
  firebaseRoomKey: "room_1",
  avatarUrl: mockUsers.friend1.avatarUrl,
  members: [
    { id: 1, fullName: "Nguyễn Kim Quốc Khánh", avatarUrl: mockUsers.currentUser.avatarUrl },
    { id: 2, fullName: "Trần Hoàng Nam", avatarUrl: mockUsers.friend1.avatarUrl, lastReadAt: new Date().toISOString() },
  ],
};

const groupRoom = {
  id: 3,
  name: "Nhóm Frontend ConnectCG",
  type: "GROUP",
  firebaseRoomKey: "room_group_1",
  avatarUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&auto=format&fit=crop&q=80",
  members: [
    { id: 1, fullName: "Nguyễn Kim Quốc Khánh", avatarUrl: mockUsers.currentUser.avatarUrl },
    { id: 2, fullName: "Trần Hoàng Nam", avatarUrl: mockUsers.friend1.avatarUrl, lastReadAt: new Date().toISOString() },
    { id: 3, fullName: "Lê Mai Chi", avatarUrl: mockUsers.friend2.avatarUrl },
  ],
};

const initialDirectMessages = [
  {
    id: "m1",
    senderId: 2,
    senderName: "Trần Hoàng Nam",
    senderAvatarUrl: mockUsers.friend1.avatarUrl,
    content: "Chào Khánh! Đã hoàn thành refactor PR #19 chưa bạn?",
    timestamp: Date.now() - 30 * 60 * 1000,
  },
  {
    id: "m2",
    senderId: 1,
    senderName: "Nguyễn Kim Quốc Khánh",
    senderAvatarUrl: mockUsers.currentUser.avatarUrl,
    content: "Đã hoàn thành xong cả GroupDetailPage và ChatInterface rồi nhé! Kiến trúc SRP siêu sạch.",
    timestamp: Date.now() - 25 * 60 * 1000,
  },
  {
    id: "m3",
    senderId: 2,
    senderName: "Trần Hoàng Nam",
    senderAvatarUrl: mockUsers.friend1.avatarUrl,
    content: "Tuyệt vời quá! Đang xem preview trên Storybook đây.",
    timestamp: Date.now() - 5 * 60 * 1000,
  },
];

const groupMessages = [
  {
    id: "gm1",
    senderId: 3,
    senderName: "Lê Mai Chi",
    senderAvatarUrl: mockUsers.friend2.avatarUrl,
    content: "Mọi người đã kiểm tra bảng màu Modern Flat 2026 trên Dark Mode chưa?",
    timestamp: Date.now() - 40 * 60 * 1000,
  },
  {
    id: "gm2",
    senderId: 2,
    senderName: "Trần Hoàng Nam",
    senderAvatarUrl: mockUsers.friend1.avatarUrl,
    content: "Chuẩn crisp 1px border, không blur hay drop shadow nhìn rất hiện đại.",
    timestamp: Date.now() - 35 * 60 * 1000,
  },
  {
    id: "gm3",
    senderId: 1,
    senderName: "Nguyễn Kim Quốc Khánh",
    senderAvatarUrl: mockUsers.currentUser.avatarUrl,
    content: "Đây là ảnh demo giao diện mới này các bạn:",
    mediaUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    mediaType: "image",
    timestamp: Date.now() - 10 * 60 * 1000,
  },
];

export const ActiveDirectChat = () => {
  const [messages, setMessages] = useState(initialDirectMessages);
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: "m_" + Date.now(),
      senderId: 1,
      senderName: currentUser.fullName,
      senderAvatarUrl: currentUser.avatarUrl,
      content: inputText,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
  };

  return (
    <ChatWindow
      activeRoom={directRoom}
      messages={messages}
      currentUser={currentUser}
      messagesEndRef={messagesEndRef}
      inputText={inputText}
      setInputText={setInputText}
      onSendMessage={handleSendMessage}
      showEmojiPicker={showEmojiPicker}
      onToggleEmojiPicker={() => setShowEmojiPicker(!showEmojiPicker)}
      emojis={["👍", "❤️", "🔥", "🎉", "👏", "🚀", "😂"]}
      typingUsers={[]}
      onBack={() => {}}
      onShowSettings={() => alert("Mở cài đặt cuộc trò chuyện")}
      onInviteMember={() => alert("Mời thành viên")}
      onShowMediaGallery={() => alert("Mở kho file & media")}
      onDeleteMessage={(id) => setMessages((prev) => prev.filter((m) => m.id !== id))}
    />
  );
};

export const ActiveGroupChat = () => {
  const [messages, setMessages] = useState(groupMessages);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: "gm_" + Date.now(),
      senderId: 1,
      senderName: currentUser.fullName,
      senderAvatarUrl: currentUser.avatarUrl,
      content: inputText,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
  };

  return (
    <ChatWindow
      activeRoom={groupRoom}
      messages={messages}
      currentUser={currentUser}
      messagesEndRef={messagesEndRef}
      inputText={inputText}
      setInputText={setInputText}
      onSendMessage={handleSendMessage}
      emojis={["👍", "❤️", "🔥", "🎉", "👏", "🚀"]}
      typingUsers={[]}
      onBack={() => {}}
      onShowSettings={() => alert("Cài đặt nhóm")}
      onInviteMember={() => alert("Thêm thành viên vào nhóm")}
      onShowMediaGallery={() => alert("Mở media")}
      onDeleteMessage={(id) => setMessages((prev) => prev.filter((m) => m.id !== id))}
    />
  );
};

export const TypingIndicatorState = () => {
  const messagesEndRef = useRef(null);

  return (
    <ChatWindow
      activeRoom={directRoom}
      messages={initialDirectMessages}
      currentUser={currentUser}
      messagesEndRef={messagesEndRef}
      inputText=""
      setInputText={() => {}}
      onSendMessage={() => {}}
      typingUsers={["Trần Hoàng Nam"]}
      emojis={[]}
    />
  );
};

export const EmptyState = () => {
  return (
    <ChatWindow
      activeRoom={null}
      messages={[]}
      currentUser={currentUser}
      inputText=""
      setInputText={() => {}}
      onSendMessage={() => {}}
    />
  );
};
