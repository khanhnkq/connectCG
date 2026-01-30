import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Settings,
  Send,
  MoreVertical,
  Phone,
  Video,
  Image as ImageIcon,
  Paperclip,
  Smile,
  UserPlus,
  LogOut,
  Trash2,
  X,
  Check,
  Ban,
  AlertTriangle,
  Users,
  Lock,
  MessageSquare,
  ShieldAlert,
  Repeat,
  History,
  GalleryVerticalEnd,
  Archive,
  Star,
  Flag,
  ChevronDown,
  ArrowLeft,
  SquarePen,
  CirclePlus,
  Camera,
  User,
  ChevronRight,
  Pencil,
  BellOff,
  UserX,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";
import ChatService from "../../services/chat/ChatService";
import FirebaseChatService from "../../services/chat/FirebaseChatService";
import reportService from "../../services/ReportService";
import FriendService from "../../services/friend/FriendService";
import ReportModal from "../../components/report/ReportModal";
import ConfirmModal from "../../components/common/ConfirmModal";
import { uploadImage } from "../../utils/uploadImage";

export default function ChatInterface() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [friends, setFriends] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteFriends, setInviteFriends] = useState([]);
  const [selectedInvitees, setSelectedInvitees] = useState([]);
  const [showReportUser, setShowReportUser] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const chatAvatarInputRef = useRef(null);

  const handleCreateGroup = async () => {
    if (selectedMembers.length < 1) {
      toast.error("Vui lòng chọn ít nhất 1 người");
      return;
    }

    const isDirect = selectedMembers.length === 1;
    const tid = toast.loading(
      isDirect ? "Đang khởi tạo..." : "Đang tạo nhóm...",
    );

    try {
      let room;
      if (isDirect) {
        // Nếu chỉ chọn 1 người, dùng logic getOrCreateDirectChat
        const response = await ChatService.getOrCreateDirectChat(
          selectedMembers[0].id,
        );
        room = response.data;
      } else {
        // Nếu > 1 người, tạo nhóm
        const name = groupName.trim() || `Nhóm của ${currentUser.fullName || currentUser.username}`;
        const response = await ChatService.createGroupChat(
          name,
          selectedMembers.map((f) => f.id),
        );
        room = response.data;
      }

      await fetchRooms();
      setActiveRoom(room);
      setShowNewChatModal(false);
      setSelectedMembers([]);
      setGroupName("");
      toast.success(isDirect ? "Đã kết nối!" : "Đã tạo nhóm!", { id: tid });
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error(isDirect ? "Lỗi khi kết nối" : "Lỗi khi tạo nhóm", {
        id: tid,
      });
    }
  };

  const handleInviteMember = async () => {
    if (!selectedInvitees || selectedInvitees.length === 0 || !activeRoom)
      return;

    const tid = toast.loading(
      `Đang mời ${selectedInvitees.length} thành viên...`,
    );
    try {
      const userIds = selectedInvitees.map((f) => f.id);
      const response = await ChatService.inviteMembers(activeRoom.id, userIds);
      setActiveRoom(response.data);

      // Update conversations list
      setConversations((prev) =>
        prev.map((c) => (c.id === activeRoom.id ? response.data : c)),
      );

      setShowInviteModal(false);
      setSelectedInvitees([]);
      toast.success(`Đã mời ${selectedInvitees.length} người vào nhóm!`, {
        id: tid,
      });
    } catch (error) {
      console.error("Invite error:", error);
      toast.error(error.response?.data?.message || "Lỗi khi mời thành viên", {
        id: tid,
      });
    }
  };

  const handleOpenInviteModal = async () => {
    if (!activeRoom || activeRoom.type !== "GROUP") return;

    setShowInviteModal(true);
    setSelectedInvitees([]);
    try {
      const response = await FriendService.getMyFriends({ size: 100 });
      const allFriends = response.data.content || [];

      // Lọc bỏ những người đã có trong nhóm
      const currentMemberIds = activeRoom.members?.map((m) => m.id) || [];
      const availableFriends = allFriends.filter(
        (f) => !currentMemberIds.includes(f.id),
      );

      setInviteFriends(availableFriends);
    } catch (error) {
      console.error("Load friends error:", error);
      toast.error("Không thể tải danh sách bạn bè");
    }
  };

  const toggleInvitee = (friend) => {
    setSelectedInvitees((prev) => {
      const isSelected = prev.some((f) => f.id === friend.id);
      if (isSelected) {
        return prev.filter((f) => f.id !== friend.id);
      } else {
        return [...prev, friend];
      }
    });
  };

  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch rooms
  const fetchRooms = useCallback(async () => {
    try {
      const response = await ChatService.getMyChatRooms();
      const rooms = response.data;
      setConversations(rooms);

      // Decide which room to select
      const selectedKey = location.state?.selectedRoomKey;
      if (selectedKey) {
        const match = rooms.find((r) => r.firebaseRoomKey === selectedKey);
        if (match) setActiveRoom(match);
      } else if (rooms.length > 0 && !activeRoom && !location.state?.noAutoSelect) {
        setActiveRoom(rooms[0]);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Không thể tải danh sách cuộc trò chuyện");
    } finally {
      setIsLoading(false);
    }
  }, [activeRoom, location.state?.selectedRoomKey]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Subscribe to messages when activeRoom changes
  useEffect(() => {
    if (!activeRoom) return;

    setMessages([]); // Clear old messages
    const unsubscribe = FirebaseChatService.subscribeToMessages(
      activeRoom.firebaseRoomKey,
      (newMsg) => {
        setMessages((prev) => [...prev, newMsg]);
      },
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [activeRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch friends for new chat
  useEffect(() => {
    if (showNewChatModal) {
      const fetchFriendsList = async () => {
        try {
          const response = await FriendService.getMyFriends({ size: 100 });
          setFriends(response.data.content || []);
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      };
      fetchFriendsList();
    }
  }, [showNewChatModal]);

  const handleStartNewChat = async (userId) => {
    const tid = toast.loading("Đang khởi tạo...");
    try {
      const response = await ChatService.getOrCreateDirectChat(userId);
      const room = response.data;
      await fetchRooms();
      setActiveRoom(room);
      setShowNewChatModal(false);
      toast.success("Đã kết nối!", { id: tid });
    } catch (error) {
      console.error("Error starting chat:", error);
      toast.error("Lỗi khi tạo cuộc trò chuyện", { id: tid });
    }
  };

  const filteredFriends = friends.filter(
    (f) =>
      f.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.username?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSendMessage = async () => {
    const text = inputText.trim();
    if (!text || !activeRoom) return;

    if (!currentUser?.id) {
      toast.error("Phiên làm việc hết hạn, vui lòng đăng nhập lại");
      return;
    }

    setInputText(""); // Xóa ngay để tránh gửi lặp
    try {
      const msgData = {
        senderId: currentUser.id,
        senderName: currentUser.fullName || currentUser.username || "Anonymous",
        senderAvatarUrl: currentUser.avatarUrl || "",
        text: text,
        type: "text",
        timestamp: Date.now(),
      };
      await FirebaseChatService.sendMessage(
        activeRoom.firebaseRoomKey,
        msgData,
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setInputText(text); // Khôi phục nếu lỗi
      toast.error("Gửi tin nhắn thất bại");
    }
  };

  const handleUpdateAvatar = async (file) => {
    if (!activeRoom || !file) return;
    const tid = toast.loading("Đang tải ảnh lên...");
    try {
      const uploadedUrl = await uploadImage(file, "chat/avatar");
      const response = await ChatService.updateAvatar(
        activeRoom.id,
        uploadedUrl,
      );
      const updatedRoom = response.data;
      setActiveRoom(updatedRoom);
      setConversations((prev) =>
        prev.map((c) => (c.id === updatedRoom.id ? updatedRoom : c)),
      );
      toast.success("Đã cập nhật ảnh đại diện!", { id: tid });
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error(error.message || "Cập nhật ảnh thất bại", { id: tid });
    }
  };

  const handleRenameName = async () => {
    if (!tempName.trim() || tempName === activeRoom.name) {
      setIsEditingName(false);
      return;
    }

    const tid = toast.loading("Đang đổi tên...");
    try {
      const response = await ChatService.renameRoom(activeRoom.id, tempName);
      const updatedRoom = response.data;

      // Update active room
      setActiveRoom(updatedRoom);

      // Update in conversations list
      setConversations((prev) =>
        prev.map((c) => (c.id === updatedRoom.id ? updatedRoom : c)),
      );

      setIsEditingName(false);
      toast.success("Đã đổi tên nhóm!", { id: tid });
    } catch (error) {
      console.error("Error renaming room:", error);
      toast.error("Lỗi khi đổi tên nhóm", { id: tid });
    }
  };

  const handleDeleteRoom = async () => {
    if (!activeRoom) return;

    const isGroup = activeRoom.type === "GROUP";
    const confirmMsg = isGroup
      ? "Bạn có chắc muốn XÓA VĨNH VIỄN nhóm này và toàn bộ tin nhắn không? Thao tác này không thể hoàn tác."
      : "Bạn có chắc muốn XÓA VĨNH VIỄN cuộc trò chuyện này không? Toàn bộ tin nhắn sẽ bị mất ở cả 2 phía.";

    setShowDeleteConfirm(true);
  };

  const confirmDeleteRoom = async () => {
    setShowDeleteConfirm(false);
    const tid = toast.loading("Đang xóa...");
    try {
      // 1. Xóa trên MySQL
      await ChatService.deleteChatRoom(activeRoom.id);

      // 2. Xóa trên Firebase
      await FirebaseChatService.deleteMessages(activeRoom.firebaseRoomKey);

      toast.success("Đã xóa cuộc trò chuyện", { id: tid });

      // 3. Cập nhật UI: Quay về danh sách tin nhắn và không tự động chọn phòng mới
      setActiveRoom(null);
      navigate("/dashboard/chat", { state: { noAutoSelect: true }, replace: true });
      await fetchRooms();
    } catch (error) {
      console.error("Delete room error:", error);
      toast.error(error.response?.data?.message || "Lỗi khi xóa cuộc trò chuyện", {
        id: tid,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background-main">
        <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="h-full w-full flex overflow-hidden bg-chat-bg relative">
        {/* Conversations List */}
        {/* Conversations List */}
        <div
          className={`${activeRoom ? "hidden md:flex" : "flex"
            } w-full md:w-80 lg:w-96 flex-col border-r border-border-main bg-background-main z-10 shrink-0 transition-colors duration-300`}
        >
          <div className="p-5 border-b border-border-main flex justify-between items-center bg-background-main/95 backdrop-blur-md sticky top-0 z-10">
            <h2 className="text-xl font-extrabold text-text-main tracking-tight">
              Messages
            </h2>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="size-9 rounded-full bg-[#3A2A20] hover:bg-primary hover:text-[#231810] flex items-center justify-center text-primary transition-all shadow-md"
            >
              <SquarePen size={20} />
            </button>
          </div>
          <div className="px-5 py-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search
                  className="text-text-secondary transition-colors"
                  size={20}
                />
              </div>
              <input
                className="block w-full pl-10 pr-4 py-3 border border-border-main rounded-xl bg-surface-main text-text-main placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                placeholder="Search conversations..."
                type="text"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
            {conversations
              .filter((conv) =>
                conv.name?.toLowerCase().includes(searchTerm.toLowerCase()),
              )
              .map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setActiveRoom(conv)}
                  className={`p-3 rounded-xl cursor-pointer relative group flex gap-3 items-center shadow-lg transition-colors ${activeRoom?.id === conv.id
                    ? "bg-surface-main border border-primary/20 shadow-black/5"
                    : "hover:bg-surface-main/50 border border-transparent"
                    }`}
                >
                  <div className="relative shrink-0">
                    <div
                      className="size-12 rounded-full bg-cover bg-center group-hover:ring-2 ring-primary/30 transition-all"
                      style={{
                        backgroundImage: `url("${conv.avatarUrl ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          }")`,
                      }}
                    ></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3
                        className={`font-bold text-sm truncate ${activeRoom?.id === conv.id
                          ? "text-text-main"
                          : "text-text-secondary group-hover:text-text-main"
                          }`}
                      >
                        {conv.name || "Hội thoại"}
                      </h3>
                    </div>
                    <p className={`text-text-secondary text-xs truncate`}>
                      Bấm để xem tin nhắn
                    </p>
                  </div>
                  {activeRoom?.id === conv.id && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-primary rounded-r-xl"></div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Chat Area */}
        {/* Chat Area */}
        <div
          className={`${activeRoom ? "flex" : "hidden"
            } md:flex flex-1 flex-col bg-chat-bg relative transition-colors duration-300`}
        >
          {activeRoom ? (
            <>
              <div className="h-20 px-6 border-b border-border-main flex justify-between items-center bg-background-main/90 backdrop-blur-md z-10 shadow-sm">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setActiveRoom(null)}
                    className="md:hidden text-text-secondary hover:text-white"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <div className="relative">
                    <div
                      className="size-10 rounded-full bg-cover bg-center ring-2 ring-[#3A2A20]"
                      style={{
                        backgroundImage: `url("${activeRoom.avatarUrl ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          }")`,
                      }}
                    ></div>
                  </div>
                  <div>
                    <h3 className="text-text-main font-bold text-base flex items-center gap-2">
                      {activeRoom.name || "Đang tải..."}
                    </h3>
                    <p className="text-text-secondary text-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>{" "}
                      Đang kết nối
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 text-text-secondary">
                  <button className="size-10 rounded-full hover:bg-surface-main hover:text-primary flex items-center justify-center transition-all">
                    <Phone size={24} />
                  </button>
                  <button className="size-10 rounded-full hover:bg-surface-main hover:text-primary flex items-center justify-center transition-all">
                    <Video size={24} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scroll-smooth">
                {messages.map((msg, index) => {
                  const isSentByMe = msg.senderId === currentUser.id;

                  // Logic xác định avatar của người gửi
                  let msgAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

                  if (msg.senderAvatarUrl) {
                    msgAvatar = msg.senderAvatarUrl;
                  } else if (activeRoom.members) {
                    // Fallback: tìm trong members của activeRoom
                    const sender = activeRoom.members.find(
                      (m) => m.id === msg.senderId,
                    );
                    if (sender?.avatarUrl) {
                      msgAvatar = sender.avatarUrl;
                    }
                  } else if (
                    !isSentByMe &&
                    activeRoom.type !== "GROUP" &&
                    activeRoom.avatarUrl
                  ) {
                    // Fallback 1-1
                    msgAvatar = activeRoom.avatarUrl;
                  }

                  return (
                    <div
                      key={index}
                      className={`flex gap-3 max-w-[80%] ${isSentByMe ? "self-end justify-end" : ""
                        }`}
                    >
                      {!isSentByMe && (
                        <div
                          className="size-8 rounded-full bg-cover bg-center shrink-0 self-end mb-1 border border-border-main"
                          style={{
                            backgroundImage: `url("${msgAvatar}")`,
                          }}
                        ></div>
                      )}
                      <div
                        className={`flex flex-col gap-1 ${isSentByMe ? "items-end" : ""
                          }`}
                      >
                        <div
                          className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${isSentByMe
                            ? "bg-bubble-sent rounded-br-none text-white font-semibold"
                            : "bg-bubble-received rounded-bl-none text-text-main"
                            }`}
                        >
                          <p>{msg.text}</p>
                        </div>
                        <div
                          className={`flex items-center gap-1 text-text-secondary text-[10px] ${!isSentByMe ? "ml-1" : "mr-1"
                            }`}
                        >
                          <span>
                            {msg.timestamp
                              ? new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                              : "Vừa xong"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 px-6 bg-background-main border-t border-border-main">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex gap-3 items-end"
                >
                  <button
                    type="button"
                    className="p-3 text-text-secondary hover:text-text-main hover:bg-surface-main rounded-full transition-colors flex-shrink-0"
                  >
                    <CirclePlus size={24} />
                  </button>
                  <div className="flex-1 bg-surface-main border border-border-main rounded-3xl flex items-center px-4 py-1.5 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                    <input
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="bg-transparent border-none text-text-main placeholder-text-secondary/50 focus:ring-0 w-full py-2.5 text-sm"
                      placeholder="Type a message..."
                      type="text"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-3.5 bg-primary hover:bg-orange-600 text-[#231810] rounded-full shadow-lg shadow-orange-500/20 transition-all hover:scale-105 flex-shrink-0 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <Send size={24} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-text-secondary gap-4">
              <MessageSquare size={64} className="opacity-20" />
              <p>Chọn một cuộc trò chuyện để bắt đầu</p>
            </div>
          )}
        </div>

        {/* Right Sidebar - Conversation Details */}
        <aside className="hidden xl:flex w-80 flex-col border-l border-border-main bg-background-main overflow-y-auto shrink-0 z-20 transition-colors duration-300">
          {activeRoom ? (
            <>
              <div className="p-8 flex flex-col items-center border-b border-border-main">
                <div className="relative group/avatar">
                  <div
                    className="size-24 rounded-full bg-cover bg-center ring-4 ring-surface-main mb-4 shadow-xl"
                    style={{
                      backgroundImage: `url("${activeRoom?.avatarUrl ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }")`,
                    }}
                  ></div>
                  {activeRoom?.type === "GROUP" && (
                    <>
                      <button
                        onClick={() => chatAvatarInputRef.current?.click()}
                        className="absolute bottom-4 right-0 size-8 bg-primary rounded-full border-4 border-background-main text-[#231810] flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all shadow-lg hover:scale-110"
                      >
                        <Camera size={18} />
                      </button>
                      <input
                        type="file"
                        ref={chatAvatarInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleUpdateAvatar(e.target.files[0])}
                      />
                    </>
                  )}
                </div>
                {isEditingName ? (
                  <div className="flex gap-2 mb-1 w-full px-4">
                    <input
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="bg-surface-main border border-border-main text-text-main text-sm rounded-lg px-2 py-1 flex-1 focus:outline-none focus:ring-1 focus:ring-primary"
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handleRenameName()}
                    />
                    <button
                      onClick={handleRenameName}
                      className="text-primary flex items-center justify-center p-1 rounded hover:bg-surface-main"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() => setIsEditingName(false)}
                      className="text-text-secondary flex items-center justify-center p-1 rounded hover:bg-surface-main"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <h2 className="text-text-main text-xl font-extrabold mb-1 text-center flex items-center gap-2 group/title">
                    {activeRoom?.name || "Đang tải..."}
                    {activeRoom?.type === "GROUP" && (
                      <button
                        onClick={() => {
                          setIsEditingName(true);
                          setTempName(activeRoom.name || "");
                        }}
                        className="opacity-0 group-hover/title:opacity-100 text-text-secondary hover:text-primary transition-all"
                      >
                        <Pencil size={16} />
                      </button>
                    )}
                  </h2>
                )}
                <p className="text-text-secondary text-sm mb-4">
                  {activeRoom?.type === "GROUP"
                    ? "Group Chat"
                    : "Direct Message"}
                </p>
                <div className="flex gap-3 w-full justify-center">
                  <button
                    onClick={() =>
                      activeRoom?.type !== "GROUP" &&
                      navigate(
                        `/dashboard/member/${activeRoom?.otherParticipantId}`,
                      )
                    }
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div className="size-10 rounded-full bg-[#2A1D15] group-hover:bg-primary group-hover:text-[#231810] flex items-center justify-center text-white transition-all border border-[#3A2A20]">
                      <User size={24} />
                    </div>
                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wide group-hover:text-primary transition-colors">
                      Profile
                    </span>
                  </button>
                  {activeRoom?.type === "GROUP" && (
                    <button
                      onClick={handleOpenInviteModal}
                      className="flex flex-col items-center gap-1 group"
                    >
                      <div className="size-10 rounded-full bg-surface-main group-hover:bg-green-500 group-hover:text-white flex items-center justify-center text-green-500 transition-all border border-border-main">
                        <UserPlus size={24} />
                      </div>
                      <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wide group-hover:text-green-500 transition-colors">
                        Invite
                      </span>
                    </button>
                  )}
                  <button className="flex flex-col items-center gap-1 group">
                    <div className="size-10 rounded-full bg-[#2A1D15] group-hover:bg-primary group-hover:text-[#231810] flex items-center justify-center text-white transition-all border border-[#3A2A20]">
                      <BellOff size={24} />
                    </div>
                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wide group-hover:text-primary transition-colors">
                      Mute
                    </span>
                  </button>
                  <button className="flex flex-col items-center gap-1 group">
                    <div className="size-10 rounded-full bg-surface-main group-hover:bg-red-500 group-hover:text-white flex items-center justify-center text-red-500 transition-all border border-border-main">
                      <Ban size={24} />
                    </div>
                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wide group-hover:text-red-500 transition-colors">
                      Block
                    </span>
                  </button>
                  {/* Delete Button */}
                  {(activeRoom.type === "DIRECT" ||
                    activeRoom.members?.find((m) => m.id === currentUser.id)
                      ?.role === "ADMIN") && (
                      <button
                        onClick={handleDeleteRoom}
                        className="flex flex-col items-center gap-1 group"
                      >
                        <div className="size-10 rounded-full bg-red-500/10 group-hover:bg-red-600 group-hover:text-white flex items-center justify-center text-red-500 transition-all border border-red-500/20">
                          <Trash2 size={24} />
                        </div>
                        <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wide group-hover:text-red-500 transition-colors">
                          Delete
                        </span>
                      </button>
                    )}
                </div>
              </div>
              <div className="p-5">
                {activeRoom?.type === "GROUP" ? (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-text-main text-sm font-bold uppercase tracking-wide">
                        Nhóm ({activeRoom.members?.length || 0} thành viên)
                      </h3>
                    </div>
                    <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                      {activeRoom.members?.map((member) => (
                        <div
                          key={member.id}
                          onClick={() =>
                            navigate(`/dashboard/member/${member.id}`)
                          }
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-main cursor-pointer group transition-all"
                        >
                          <div
                            className="size-8 rounded-full bg-cover bg-center border border-border-main"
                            style={{
                              backgroundImage: `url("${member.avatarUrl ||
                                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                }")`,
                            }}
                          ></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-text-main text-sm font-bold truncate group-hover:text-primary transition-colors">
                              {member.fullName}
                            </p>
                            <span
                              className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${member.role === "ADMIN"
                                ? "bg-orange-500/20 text-orange-400"
                                : "bg-surface-main text-text-secondary"
                                }`}
                            >
                              {member.role}
                            </span>
                          </div>
                          <ChevronRight
                            size={16}
                            className="text-text-secondary opacity-0 group-hover:opacity-100 transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-white text-sm font-bold uppercase tracking-wide">
                        Shared Media
                      </h3>
                      <button className="text-primary text-xs font-bold hover:underline">
                        See All
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=150&q=80",
                        "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=150&q=80",
                        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=150&q=80",
                        "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=150&q=80",
                      ].map((img, i) => (
                        <div
                          key={i}
                          className="aspect-square bg-cover bg-center rounded-xl cursor-pointer hover:opacity-80 transition-opacity border border-border-main"
                          style={{ backgroundImage: `url("${img}")` }}
                        ></div>
                      ))}
                      <div className="aspect-square bg-surface-main rounded-xl flex items-center justify-center text-text-secondary hover:text-primary cursor-pointer transition-all border border-border-main">
                        <span className="text-xs font-bold">+12</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="p-5 border-t border-border-main">
                <h3 className="text-text-main text-sm font-bold uppercase tracking-wide mb-3">
                  Privacy & Support
                </h3>
                <div className="flex flex-col gap-2">
                  <button className="w-full flex items-center justify-between p-3 rounded-xl bg-background-main hover:bg-surface-main border border-border-main group transition-colors text-left">
                    <div className="flex items-center gap-3 text-text-secondary group-hover:text-white">
                      <Lock size={20} />
                      <span className="text-sm font-medium">Encryption</span>
                    </div>
                    <ChevronRight size={16} className="text-text-secondary" />
                  </button>

                  <button
                    onClick={() => setShowReportUser(true)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-main hover:bg-background-main border border-border-main group transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 text-text-secondary group-hover:text-white">
                      <Flag size={20} />
                      <span className="text-sm font-medium">Báo cáo</span>
                    </div>
                    <ChevronRight size={16} className="text-text-secondary" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-text-secondary h-full p-8 text-center gap-3">
              <Info size={32} className="opacity-20" />
              <p className="text-xs italic">
                Chọn một cuộc trò chuyện để xem chi tiết
              </p>
            </div>
          )}
        </aside>

        <ConfirmModal
          isOpen={showDeleteConfirm}
          title="Xác nhận xóa"
          message={
            activeRoom?.type === "GROUP"
              ? "Bạn có chắc muốn XÓA VĨNH VIỄN nhóm này và toàn bộ tin nhắn không? Thao tác này không thể hoàn tác."
              : "Bạn có chắc muốn XÓA VĨNH VIỄN cuộc trò chuyện này không? Toàn bộ tin nhắn sẽ bị mất ở cả 2 phía."
          }
          type="danger"
          confirmText="Xác nhận Xóa"
          cancelText="Hủy"
          onConfirm={confirmDeleteRoom}
          onClose={() => setShowDeleteConfirm(false)}
        />
      </div>
      <ReportModal
        isOpen={showReportUser}
        onClose={() => setShowReportUser(false)}
        title={`Báo cáo ${activeRoom?.name || "người dùng"}`}
        subtitle="Giúp chúng tôi hiểu rõ hơn về sự việc"
        question="Vì sao bạn muốn báo cáo người dùng này?"
        reasons={[
          "Spam hoặc lừa đảo",
          "Quấy rối hoặc bắt nạt",
          "Nội dung không phù hợp",
          "Tài khoản giả mạo",
          "Khác",
        ]}
        user={activeRoom}
        targetPayload={{
          targetType: activeRoom?.type === "GROUP" ? "GROUP" : "USER",
          targetId: activeRoom?.id,
        }}
        onSubmit={async (data) => {
          const toastId = toast.loading("Đang gửi báo cáo...", {
            style: {
              background: "#1A120B",
              color: "#FFD8B0",
            },
          });

          try {
            await reportService.createReport(data);

            toast.success("Báo cáo thành công!", {
              id: toastId,
              style: {
                background: "#1A120B",
                color: "#FF8A2A",
                border: "1px solid #FF8A2A",
                fontWeight: "700",
              },
            });

            setShowReportUser(false);
          } catch (err) {
            toast.error(
              err?.response?.data?.message ||
              "Gửi báo cáo thất bại. Vui lòng thử lại!",
              {
                id: toastId,
                style: {
                  background: "#1A120B",
                  color: "#FF6A00",
                },
              },
            );
          }
        }}
      />

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowNewChatModal(false)}
          ></div>
          <div className="relative bg-surface-main border border-border-main w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border-main flex justify-between items-center bg-background-main">
              <h3 className="text-xl font-bold text-text-main">Tin nhắn mới</h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="text-text-secondary hover:text-text-main transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-text-secondary" size={16} />
                </div>
                <input
                  className="block w-full pl-9 pr-4 py-2 bg-surface-main border border-border-main rounded-xl text-text-main placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary text-sm transition-all"
                  placeholder="Tìm tên bạn bè..."
                  type="text"
                  autoFocus
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="max-h-64 overflow-y-auto space-y-1 custom-scrollbar pr-2">
                {filteredFriends.length > 0 ? (
                  filteredFriends.map((friend) => (
                    <div
                      key={friend.id}
                      onClick={() => {
                        const isSelected = selectedMembers.some(
                          (m) => m.id === friend.id,
                        );
                        if (isSelected) {
                          setSelectedMembers((prev) =>
                            prev.filter((m) => m.id !== friend.id),
                          );
                        } else {
                          setSelectedMembers((prev) => [...prev, friend]);
                        }
                      }}
                      className={`flex items-center gap-3 p-3 rounded-2xl hover:bg-background-main cursor-pointer group transition-all ${
                        selectedMembers.some((m) => m.id === friend.id)
                          ? "bg-background-main ring-1 ring-primary/30"
                          : ""
                      }`}
                    >
                      <div className="relative">
                        <div
                          className="size-10 rounded-full bg-cover bg-center ring-2 ring-transparent group-hover:ring-primary/50 transition-all shadow-lg"
                          style={{
                            backgroundImage: `url("${friend.avatarUrl ||
                              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                              }")`,
                          }}
                        ></div>
                        {selectedMembers.some((m) => m.id === friend.id) && (
                          <div className="absolute -top-1 -right-1 size-5 bg-primary rounded-full flex items-center justify-center border-2 border-surface-main">
                            <Check
                              size={12}
                              className="text-text-main font-bold"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-text-main font-bold text-sm group-hover:text-primary transition-colors">
                          {friend.fullName || friend.username}
                        </p>
                        <p className="text-text-secondary text-[11px]">
                          @{friend.username}
                        </p>
                      </div>
                      {!selectedMembers.length && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartNewChat(friend.id);
                          }}
                          className="text-text-secondary group-hover:text-primary transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Send size={20} />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-text-secondary flex flex-col items-center gap-2">
                    <UserX size={48} className="opacity-20" />
                    <p className="text-xs italic">Không tìm thấy bạn bè nào</p>
                  </div>
                )}
              </div>

              {selectedMembers.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border-main space-y-4 animate-in slide-in-from-bottom-4 duration-300">
                  <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-1">
                    {selectedMembers.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center gap-2 bg-background-main pl-1 pr-2 py-1 rounded-full border border-primary/20"
                      >
                        <div
                          className="size-6 rounded-full bg-cover bg-center"
                          style={{
                            backgroundImage: `url("${m.avatarUrl ||
                              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                              }")`,
                          }}
                        ></div>
                        <span className="text-[10px] text-text-main font-medium max-w-[80px] truncate">
                          {m.fullName || m.username}
                        </span>
                        <button
                          onClick={() =>
                            setSelectedMembers((prev) =>
                              prev.filter((x) => x.id !== m.id),
                            )
                          }
                          className="text-text-secondary hover:text-red-400"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <input
                      className="block w-full px-4 py-2.5 bg-surface-main border border-border-main rounded-xl text-text-main placeholder-text-secondary/50 focus:outline-none focus:ring-1 focus:ring-primary text-sm transition-all shadow-inner"
                      placeholder="Tên nhóm (tùy chọn)..."
                      type="text"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                    />
                    <button
                      onClick={handleCreateGroup}
                      className="w-full py-3 bg-primary hover:bg-orange-600 text-text-main font-bold rounded-xl shadow-lg shadow-orange-500/10 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                    >
                      {selectedMembers.length === 1 ? (
                        <MessageSquare size={20} />
                      ) : (
                        <Users size={20} />
                      )}
                      {selectedMembers.length === 1
                        ? "Bắt đầu trò chuyện"
                        : `Tạo nhóm (${selectedMembers.length})`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-main w-full max-w-md rounded-3xl border border-border-main shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border-main flex items-center justify-between">
              <h2 className="text-xl font-bold text-text-main">
                Mời bạn bè vào nhóm
              </h2>
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setSelectedInvitees([]);
                }}
                className="size-8 rounded-full bg-surface-main text-text-main flex items-center justify-center hover:bg-background-main transition-all border border-border-main"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {inviteFriends.length === 0 ? (
                <div className="text-center py-10 text-text-muted">
                  <UserX size={48} className="mx-auto mb-3 opacity-30" />
                  <p>Không có bạn bè nào để mời</p>
                  <p className="text-sm mt-1">Tất cả bạn bè đã có trong nhóm</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {inviteFriends.map((friend) => {
                    const isSelected = selectedInvitees.some(
                      (f) => f.id === friend.id,
                    );
                    return (
                      <div
                        key={friend.id}
                        onClick={() => toggleInvitee(friend)}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${isSelected
                          ? "bg-primary/10 border-primary/50"
                          : "bg-surface-main border-border-main hover:bg-background-main"
                          }`}
                      >
                        <div
                          className="size-10 rounded-full bg-cover bg-center border border-border-main"
                          style={{
                            backgroundImage: `url("${friend.avatarUrl ||
                              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                              }")`,
                          }}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-text-main font-bold truncate">
                            {friend.fullName}
                          </p>
                        </div>
                        <div
                          className={`size-5 rounded border-2 flex items-center justify-center transition-all ${isSelected
                            ? "bg-primary border-primary"
                            : "border-border-main"
                            }`}
                        >
                          {isSelected && (
                            <Check size={16} className="text-text-main" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {inviteFriends.length > 0 && (
              <div className="p-6 border-t border-border-main">
                <button
                  onClick={handleInviteMember}
                  disabled={selectedInvitees.length === 0}
                  className="w-full py-3 bg-primary hover:bg-orange-600 text-text-main font-bold rounded-xl shadow-lg shadow-orange-500/10 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  <UserPlus size={20} />
                  {selectedInvitees.length > 0
                    ? `Mời ${selectedInvitees.length} người`
                    : "Chọn bạn bè để mời"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
