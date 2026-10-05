import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import ChatService from "../../../services/chat/ChatService";
import FriendService from "../../../services/friend/FriendService";
import { uploadImage } from "../../../utils/uploadImage";
import { updateConversation, setConversations } from "../../../redux/slices/chatSlice";

export function useChatActions({
  activeRoom,
  setActiveRoom,
  fetchRooms,
  currentUser,
  userProfile,
  setMessages,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isInviting, setIsInviting] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteFriends, setInviteFriends] = useState([]);
  const [selectedInvitees, setSelectedInvitees] = useState([]);

  const [friends, setFriends] = useState([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [kickMemberData, setKickMemberData] = useState(null);

  const fetchFriends = async () => {
    try {
      const response = await FriendService.getMyFriends({ size: 100 });
      setFriends(response.data?.content || response.data || []);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const handleStartNewChat = async (userId) => {
    const tid = toast.loading("Đang khởi tạo...");
    try {
      const response = await ChatService.getOrCreateDirectChat(userId);
      const room = response.data;
      await fetchRooms();
      setActiveRoom(room);
      toast.success("Đã kết nối!", { id: tid });
      return room;
    } catch (error) {
      console.error("Error starting chat:", error);
      toast.error("Lỗi khi tạo cuộc trò chuyện", { id: tid });
      throw error;
    }
  };

  const handleCreateGroup = async (selectedMembers, groupName) => {
    if (selectedMembers.length < 1) {
      toast.error("Vui lòng chọn ít nhất 1 người");
      return null;
    }

    const isDirect = selectedMembers.length === 1;
    const tid = toast.loading(isDirect ? "Đang khởi tạo..." : "Đang tạo nhóm...");

    try {
      let room;
      if (isDirect) {
        const response = await ChatService.getOrCreateDirectChat(selectedMembers[0].id);
        room = response.data;
      } else {
        const name =
          groupName.trim() ||
          `Nhóm của ${
            userProfile?.fullName ||
            currentUser?.fullName ||
            currentUser?.username
          }`;
        const response = await ChatService.createGroupChat(
          name,
          selectedMembers.map((f) => f.id)
        );
        room = response.data;
      }

      await fetchRooms();
      setActiveRoom(room);
      toast.success(isDirect ? "Đã kết nối!" : "Đã tạo nhóm!", { id: tid });
      return room;
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error(isDirect ? "Lỗi khi kết nối" : "Lỗi khi tạo nhóm", { id: tid });
      throw error;
    }
  };

  const handleOpenInviteModal = async () => {
    if (!activeRoom || activeRoom.type !== "GROUP") return;

    setShowInviteModal(true);
    setSelectedInvitees([]);
    try {
      const response = await FriendService.getMyFriends({ size: 100 });
      const allFriends = response.data.content || [];
      const currentMemberIds = activeRoom.members?.map((m) => m.id) || [];
      const availableFriends = allFriends.filter(
        (f) => !currentMemberIds.includes(f.id)
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
      return isSelected
        ? prev.filter((f) => f.id !== friend.id)
        : [...prev, friend];
    });
  };

  const handleInviteMember = async () => {
    if (!selectedInvitees || selectedInvitees.length === 0 || !activeRoom) return;

    setIsInviting(true);
    const tid = toast.loading(`Đang mời ${selectedInvitees.length} thành viên...`);
    try {
      const userIds = selectedInvitees.map((f) => f.id);
      const response = await ChatService.inviteMembers(activeRoom.id, userIds);
      setActiveRoom(response.data);
      dispatch(updateConversation(response.data));

      setShowInviteModal(false);
      setSelectedInvitees([]);
      toast.success(`Đã mời ${selectedInvitees.length} người vào nhóm!`, { id: tid });
    } catch (error) {
      console.error("Invite error:", error);
      toast.error(error.response?.data?.message || "Lỗi khi mời thành viên", { id: tid });
    } finally {
      setIsInviting(false);
    }
  };

  const handleUpdateAvatar = async (file) => {
    if (!activeRoom || !file) return;
    const tid = toast.loading("Đang tải ảnh lên...");
    try {
      const uploadedUrl = await uploadImage(file, "chat/avatar");
      const response = await ChatService.updateAvatar(activeRoom.id, uploadedUrl);
      const updatedRoom = response.data;
      setActiveRoom(updatedRoom);
      dispatch(
        setConversations((prev) =>
          prev.map((c) => (c.id === updatedRoom.id ? updatedRoom : c))
        )
      );
      toast.success("Đã cập nhật ảnh đại diện!", { id: tid });
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error(error.message || "Cập nhật ảnh thất bại", { id: tid });
    }
  };

  const handleRenameRoom = async (newName) => {
    if (!newName?.trim() || newName === activeRoom.name) return;

    const tid = toast.loading("Đang đổi tên...");
    try {
      const response = await ChatService.renameRoom(activeRoom.id, newName);
      const updatedRoom = response.data;
      setActiveRoom(updatedRoom);
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
      setActiveRoom((prev) => ({ ...prev, clientClearedAt: now }));
      setMessages?.([]);

      dispatch(
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeRoom.id
              ? {
                  ...c,
                  lastMessageVisible: "Chưa có tin nhắn",
                  unreadCount: 0,
                  clientClearedAt: now,
                }
              : c
          )
        )
      );

      fetchRooms();
    } catch (err) {
      console.error(err);
      toast.error("Không thể xóa lịch sử", { id: tid });
    }
  };

  const handleKickMember = (member) => {
    if (!activeRoom || !member) return;
    setKickMemberData(member);
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
      setActiveRoom((prev) => ({
        ...prev,
        members:
          kickMemberData.role === "Member" || kickMemberData.role === "MEMBER"
            ? prev.members.filter((m) => m.id !== kickMemberData.id)
            : [...prev.members, kickMemberData],
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

  return {
    isInviting,
    friends,
    setFriends,
    fetchFriends,
    showInviteModal,
    setShowInviteModal,
    inviteFriends,
    selectedInvitees,
    setSelectedInvitees,
    toggleInvitee,
    handleOpenInviteModal,
    handleInviteMember,
    showClearConfirm,
    setShowClearConfirm,
    showLeaveConfirm,
    setShowLeaveConfirm,
    showDeleteConfirm,
    setShowDeleteConfirm,
    kickMemberData,
    setKickMemberData,
    handleStartNewChat,
    handleCreateGroup,
    handleUpdateAvatar,
    handleRenameRoom,
    handleClearHistory,
    handleKickMember,
    confirmKickMember,
    handleLeaveGroup,
    handleDeleteGroup,
  };
}

export default useChatActions;
