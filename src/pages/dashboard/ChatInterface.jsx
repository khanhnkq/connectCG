import React, { useState, useEffect, useRef, useCallback, Fragment } from "react";
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
import { useDispatch } from 'react-redux';
import { setConversations, updateConversation, clearUnreadCount, setActiveRoomId } from '../../redux/slices/chatSlice';
import NewChatModal from '../../components/chat/NewChatModal.jsx';
import InviteMemberModal from '../../components/chat/InviteMemberModal.jsx';
import ChatSettings from '../../components/chat/ChatSettings.jsx';
import ChatSidebar from '../../components/chat/ChatSidebar.jsx';
import ChatWindow from '../../components/chat/ChatWindow.jsx';
import useChatRooms from '../chat/hooks/useChatRooms';
import useChatMessages from '../chat/hooks/useChatMessages';
import { fetchUserProfile } from "../../redux/slices/userSlice";

export default function ChatInterface() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const { profile: userProfile } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    conversations,
    isLoading,
    fetchRooms,
    setIsLoading,
    directUnreadCount,
    groupUnreadCount
  } = useChatRooms();
  const [activeRoom, setActiveRoom] = useState(null);
  const { messages, setMessages } = useChatMessages(activeRoom);
  const [inputText, setInputText] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [friends, setFriends] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteFriends, setInviteFriends] = useState([]);
  const [selectedInvitees, setSelectedInvitees] = useState([]);
  const [showReportUser, setShowReportUser] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const chatAvatarInputRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  const [activeTab, setActiveTab] = useState("DIRECT"); // "DIRECT" | "GROUP"
  const [kickMemberData, setKickMemberData] = useState(null);

  const emojis = ["😊", "😂", "🥰", "😍", "😒", "😭", "😘", "😩", "😔", "👍", "❤️", "🔥", "✨", "🎉", "🙏", "✅", "❌", "💯"];

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
        // Prefer profile fullName, then auth user fullName (if any), then username
        const name = groupName.trim() || `Nhóm của ${userProfile?.fullName || currentUser?.fullName || currentUser?.username}`;
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
      dispatch(updateConversation(response.data));

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
  const lastRoomIdRef = useRef(null);

  // useChatRooms hook handles fetchRooms

  // Handle auto-selection based on location state
  useEffect(() => {
    if (conversations.length === 0) return;

    const selectedKey = location.state?.selectedRoomKey;
    const clearSelection = location.state?.clearSelection;

    if (selectedKey) {
      const match = conversations.find((r) => r.firebaseRoomKey === selectedKey);
      if (match) {
        setActiveRoom(match);
        // Auto switch tab
        setActiveTab(match.type === "GROUP" ? "GROUP" : "DIRECT");
        // Clear the location state to prevent re-selection lock
        navigate(location.pathname, { replace: true, state: {} });
      }
    } else if (clearSelection) {
      setActiveRoom(null);
      // Clear the location state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, conversations, navigate, location.pathname]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Fetch profile if missing
  useEffect(() => {
    if (currentUser?.id && !userProfile) {
      dispatch(fetchUserProfile(currentUser.id));
    }
  }, [currentUser?.id, userProfile, dispatch]);

  // useChatMessages hook handles active room message listening and marking as read

  // useChatMessages hook handles global cleanup for active room

  // Scroll logic: Scroll to bottom whenever messages change or room changes
  useEffect(() => {
    if (!activeRoom || messages.length === 0) return;

    const scrollToBottom = (behavior = "auto") => {
      messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
    };

    // First attempt
    const timer1 = setTimeout(() => {
      const isRoomSwitch = lastRoomIdRef.current !== activeRoom.id;
      scrollToBottom(isRoomSwitch ? "auto" : "smooth");
      lastRoomIdRef.current = activeRoom.id;
    }, 150);

    // Second "safety" attempt for slow rendering (images, etc)
    const timer2 = setTimeout(() => {
      scrollToBottom("auto");
    }, 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [messages, activeRoom?.id]);

  // Click outside to close emoji picker
  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        senderName: userProfile?.fullName || currentUser.fullName || currentUser.username || "Anonymous",
        senderAvatarUrl: userProfile?.currentAvatarUrl || currentUser.avatarUrl || "",
        text: text,
        type: "text",
        timestamp: Date.now(),
      };
      await FirebaseChatService.sendMessage(
        activeRoom.firebaseRoomKey,
        msgData,
      );

      // Update lastMessageAt on Backend
      ChatService.updateLastMessageAt(activeRoom.firebaseRoomKey).catch(err =>
        console.error("Error updating last message time:", err)
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

  const handleRenameName = async (newName) => {
    if (!newName?.trim() || newName === activeRoom.name) {
      return;
    }

    const tid = toast.loading("Đang đổi tên...");
    try {
      const response = await ChatService.renameRoom(activeRoom.id, newName);
      const updatedRoom = response.data;

      // Update active room
      setActiveRoom(updatedRoom);

      // Update in conversations list
      dispatch(updateConversation(updatedRoom));

      toast.success("Đã đổi tên nhóm!", { id: tid });
    } catch (error) {
      console.error("Error renaming room:", error);
      toast.error("Lỗi khi đổi tên nhóm", { id: tid });
    }
  };

  const handleClearHistory = async () => {
    setShowClearConfirm(false);
    const tid = toast.loading("Đang xóa lịch sử...");
    try {
      await ChatService.clearHistory(activeRoom.id);
      toast.success("Đã xóa lịch sử trò chuyện", { id: tid });

      const now = new Date().toISOString();
      setActiveRoom(prev => ({ ...prev, clientClearedAt: now }));
      setMessages([]); // Clear current view

      // Update sidebar immediately
      setConversations(prev => prev.map(c =>
        c.id === activeRoom.id
          ? { ...c, lastMessageVisible: "Chưa có tin nhắn", unreadCount: 0, clientClearedAt: now }
          : c
      ));

      fetchRooms(); // Refresh list to get fresh data
    } catch (err) {
      console.error(err);
      toast.error("Không thể xóa lịch sử", { id: tid });
    }
  };

  const handleKickMember = (memberToKick) => {
    if (!activeRoom || !memberToKick) return;
    setKickMemberData(memberToKick);
  };

  const confirmKickMember = async () => {
    if (!activeRoom || !kickMemberData) return;
    try {
      if (kickMemberData.role === "Member" || kickMemberData.role === "MEMBER") {
        await ChatService.removeMember(activeRoom.id, kickMemberData.id);
        toast.success(`Đã xóa ${kickMemberData.fullName} khỏi nhóm`);
      } else {
        await ChatService.inviteMembers(activeRoom.id, [kickMemberData.id]);
        toast.success(`Đã mời lại ${kickMemberData.fullName}`);
      }
      setKickMemberData(null);
      fetchRooms();
      // Update active room members locally
      setActiveRoom(prev => ({
        ...prev,
        members: kickMemberData.role === "Member" || kickMemberData.role === "MEMBER"
          ? prev.members.filter(m => m.id !== kickMemberData.id)
          : [...prev.members, kickMemberData]
      }));
    } catch (error) {
      console.error(error);
      toast.error("Thao tác thất bại");
    }
  };

  const handleLeaveGroup = async () => {
    setShowLeaveConfirm(false);
    const tid = toast.loading("Đang rời nhóm...");
    try {
      await ChatService.leaveGroup(activeRoom.id);
      toast.success("Đã rời nhóm", { id: tid });
      setActiveRoom(null);
      navigate("/dashboard/chat", { state: { noAutoSelect: true } });
      fetchRooms();
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi rời nhóm", { id: tid });
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteGroup = async () => {
    setShowDeleteConfirm(false);
    const tid = toast.loading("Đang giải tán nhóm...");
    try {
      await ChatService.deleteChatRoom(activeRoom.id);
      toast.success("Đã giải tán nhóm thành công", { id: tid });
      setActiveRoom(null);
      navigate("/dashboard/chat", { state: { noAutoSelect: true } });
      fetchRooms();
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi giải tán nhóm", { id: tid });
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
        <ChatSidebar
          conversations={conversations}
          activeRoom={activeRoom}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          directUnreadCount={directUnreadCount}
          groupUnreadCount={groupUnreadCount}
          onSelectRoom={(conv) => {
            setActiveRoom(conv);
            dispatch(clearUnreadCount(conv.id));
          }}
          onOpenNewChat={() => setShowNewChatModal(true)}
        />

        <ChatWindow
          activeRoom={activeRoom}
          messages={messages}
          currentUser={{
            ...currentUser,
            fullName: userProfile?.fullName || currentUser.fullName || currentUser.username,
            avatarUrl: userProfile?.currentAvatarUrl || currentUser.avatarUrl
          }}
          messagesEndRef={messagesEndRef}
          inputText={inputText}
          setInputText={setInputText}
          onSendMessage={handleSendMessage}
          onToggleEmojiPicker={() => setShowEmojiPicker(!showEmojiPicker)}
          showEmojiPicker={showEmojiPicker}
          emojiPickerRef={emojiPickerRef}
          emojis={emojis}
        />

        <ChatSettings
          activeRoom={activeRoom}
          currentUser={{
            ...currentUser,
            fullName: userProfile?.fullName || currentUser.fullName || currentUser.username,
            avatarUrl: userProfile?.currentAvatarUrl || currentUser.avatarUrl
          }}
          onUpdateAvatar={handleUpdateAvatar}
          onRenameRoom={handleRenameName}
          onClearHistory={handleClearHistory}
          onReportUser={() => setShowReportUser(true)}
          onLeaveGroup={() => setShowLeaveConfirm(true)}
          onDeleteGroup={() => setShowDeleteConfirm(true)}
          onKickMember={handleKickMember}
          setShowClearConfirm={setShowClearConfirm}
          setShowReportUser={setShowReportUser}
          setShowLeaveConfirm={setShowLeaveConfirm}
          setShowDeleteConfirm={setShowDeleteConfirm}
        />
      </div>

      <ConfirmModal
        isOpen={showClearConfirm}
        title="Xóa lịch sử cuộc trò chuyện"
        message={
          <>
            Bạn có chắc muốn xóa lịch sử cuộc trò chuyện này?
            <br />
            <span className="text-xs opacity-70 mt-2 block">
              Lưu ý: Tin nhắn chỉ bị xóa ở phía bạn, người khác vẫn có thể xem được.
            </span>
          </>
        }
        type="warning"
        confirmText="Xác nhận Xóa"
        cancelText="Hủy"
        onConfirm={handleClearHistory}
        onClose={() => setShowClearConfirm(false)}
      />

      {/* Leave Group Modal */}
      <ConfirmModal
        isOpen={showLeaveConfirm}
        title="Rời nhóm"
        message={`Bạn có chắc muốn rời khỏi nhóm "${activeRoom?.name}"? Bạn sẽ không còn thấy tin nhắn mới của nhóm này nữa.`}
        type="danger"
        confirmText="Rời nhóm"
        cancelText="Hủy"
        onConfirm={handleLeaveGroup}
        onClose={() => setShowLeaveConfirm(false)}
      />

      {/* Delete Group Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Giải tán nhóm"
        message={`Hành động này không thể hoàn tác. Nhóm "${activeRoom?.name}" và toàn bộ tin nhắn sẽ bị xóa vĩnh viễn.`}
        type="danger"
        confirmText="Xác nhận Giải tán"
        cancelText="Hủy"
        onConfirm={handleDeleteGroup}
        onClose={() => setShowDeleteConfirm(false)}
      />

      {/* Kick Member Confirm Modal */}
      <ConfirmModal
        isOpen={!!kickMemberData}
        title="Xác nhận xóa thành viên"
        message={`Bạn có chắc muốn xóa/mời "${kickMemberData?.fullName}" ra khỏi nhóm không?`}
        type="warning"
        confirmText="Xác nhận"
        cancelText="Hủy"
        onConfirm={confirmKickMember}
        onClose={() => setKickMemberData(null)}
      />

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

      <NewChatModal
        show={showNewChatModal}
        onClose={() => {
          setShowNewChatModal(false);
          setSearchTerm("");
          setSelectedMembers([]);
        }}
        friends={friends.filter((f) =>
          (f.fullName || f.username)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
        )}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedMembers={selectedMembers}
        onToggleMember={(m) => {
          setSelectedMembers((prev) =>
            prev.some((x) => x.id === m.id)
              ? prev.filter((x) => x.id !== m.id)
              : [...prev, m],
          );
        }}
        onStartNewChat={handleStartNewChat}
        groupName={groupName}
        setGroupName={setGroupName}
        onCreateGroup={handleCreateGroup}
      />

      <InviteMemberModal
        show={showInviteModal}
        onClose={() => {
          setShowInviteModal(false);
          setSelectedInvitees([]);
        }}
        friends={inviteFriends}
        selectedInvitees={selectedInvitees}
        onToggleInvitee={toggleInvitee}
        onInvite={handleInviteMember}
        activeRoomName={activeRoom?.name}
      />
    </>
  );
}
