import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { useChatRooms } from "./hooks/useChatRooms";
import { useMessageStream } from "./hooks/useMessageStream";
import { useChatActions } from "./hooks/useChatActions";
import { clearUnreadCount } from "../../redux/slices/chatSlice";
import { fetchUserProfile } from "../../redux/slices/userSlice";

import ChatSidebar from "../../components/chat/ChatSidebar.jsx";
import ChatWindow from "../../components/chat/ChatWindow.jsx";
import ChatSettings from "../../components/chat/ChatSettings.jsx";
import MediaGallery from "../../components/chat/MediaGallery.jsx";
import ImageLightbox from "../../components/chat/ImageLightbox.jsx";
import { ChatModals } from "./components/ChatModals";

const EMOJIS = [
  "😊", "😂", "🥰", "😍", "😒", "😭", "😘", "😩", "😔",
  "👍", "❤️", "🔥", "✨", "🎉", "🙏", "✅", "❌", "💯",
];

/**
 * Modern Flat ChatInterface Orchestrator (< 150 lines)
 */
export function ChatInterface() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth?.user);
  const userProfile = useSelector((state) => state.user?.profile);

  const { conversations, isLoading, fetchRooms, directUnreadCount, groupUnreadCount } =
    useChatRooms();

  const [activeRoom, setActiveRoom] = useState(null);
  const [activeTab, setActiveTab] = useState("DIRECT");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showReportUser, setShowReportUser] = useState(false);
  const [newChatMembers, setNewChatMembers] = useState([]);
  const [newChatGroupName, setNewChatGroupName] = useState("");

  const stream = useMessageStream({ activeRoom, currentUser, userProfile, setActiveRoom });
  const actions = useChatActions({
    activeRoom,
    setActiveRoom,
    fetchRooms,
    currentUser,
    userProfile,
    setMessages: stream.setMessages,
  });

  // Fetch chat rooms on mount
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Ensure user profile is loaded
  useEffect(() => {
    if (currentUser?.id && !userProfile) {
      dispatch(fetchUserProfile(currentUser.id));
    }
  }, [currentUser?.id, userProfile, dispatch]);

  // Load friends when new chat modal opens
  useEffect(() => {
    if (showNewChatModal) {
      actions.fetchFriends();
    }
  }, [showNewChatModal]);

  // Handle auto-selection based on location state
  useEffect(() => {
    if (conversations.length === 0) return;
    const selectedKey = location.state?.selectedRoomKey;
    const clearSelection = location.state?.clearSelection;

    if (selectedKey) {
      const match = conversations.find((r) => r.firebaseRoomKey === selectedKey);
      if (match) {
        setActiveRoom(match);
        setActiveTab(match.type === "GROUP" ? "GROUP" : "DIRECT");
        navigate(location.pathname, { replace: true, state: {} });
      }
    } else if (clearSelection) {
      setActiveRoom(null);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, conversations, navigate, location.pathname]);

  // Keep active room in sync with conversation updates
  useEffect(() => {
    if (activeRoom && conversations.length > 0) {
      const updated = conversations.find((c) => c.id === activeRoom.id);
      if (updated && (updated.name !== activeRoom.name || updated.avatarUrl !== activeRoom.avatarUrl)) {
        setActiveRoom(updated);
      }
    }
  }, [conversations, activeRoom]);

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background-main">
        <div className="size-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const profileUser = {
    ...currentUser,
    fullName: userProfile?.fullName || currentUser?.fullName || currentUser?.username,
    avatarUrl: userProfile?.currentAvatarUrl || currentUser?.avatarUrl,
  };

  return (
    <>
      <div className="h-full w-full flex overflow-hidden bg-background-main relative">
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
            setShowSettings(false);
            dispatch(clearUnreadCount(conv.id));
          }}
          onOpenNewChat={() => setShowNewChatModal(true)}
        />

        <ChatWindow
          activeRoom={activeRoom}
          messages={stream.messages}
          currentUser={profileUser}
          messagesEndRef={stream.messagesEndRef}
          inputText={stream.inputText}
          setInputText={stream.setInputText}
          onSendMessage={stream.handleSendMessage}
          onToggleEmojiPicker={() => stream.setShowEmojiPicker(!stream.showEmojiPicker)}
          showEmojiPicker={stream.showEmojiPicker}
          emojiPickerRef={stream.emojiPickerRef}
          emojis={EMOJIS}
          onBack={() => setActiveRoom(null)}
          onShowSettings={() => setShowSettings(!showSettings)}
          onInviteMember={actions.handleOpenInviteModal}
          typingUsers={stream.typingUsers}
          selectedImage={stream.selectedImage}
          onImageSelect={stream.setSelectedImage}
          onClearImage={() => stream.setSelectedImage(null)}
          isUploading={stream.isUploading}
          onShowMediaGallery={() => stream.setShowMediaGallery(true)}
          onOpenLightbox={(url, type = "image") => stream.setLightboxMedia({ url, type })}
          onDeleteMessage={stream.handleDeleteMessage}
        />

        <MediaGallery
          roomKey={activeRoom?.firebaseRoomKey}
          minTimestamp={activeRoom?.clientClearedAt ? new Date(activeRoom.clientClearedAt).getTime() : 0}
          isOpen={stream.showMediaGallery}
          onClose={() => stream.setShowMediaGallery(false)}
          onMediaClick={(url, type) => stream.setLightboxMedia({ url, type })}
        />

        <ImageLightbox media={stream.lightboxMedia} onClose={() => stream.setLightboxMedia(null)} />

        <ChatSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          activeRoom={activeRoom}
          currentUser={profileUser}
          onUpdateAvatar={actions.handleUpdateAvatar}
          onRenameRoom={actions.handleRenameRoom}
          onKickMember={actions.handleKickMember}
          onInviteMember={actions.handleOpenInviteModal}
          setShowClearConfirm={actions.setShowClearConfirm}
          setShowReportUser={setShowReportUser}
          setShowLeaveConfirm={actions.setShowLeaveConfirm}
          setShowDeleteConfirm={actions.setShowDeleteConfirm}
          onShowMediaGallery={() => stream.setShowMediaGallery(true)}
          onOpenLightbox={(url, type = "image") => stream.setLightboxMedia({ url, type })}
        />
      </div>

      <ChatModals
        activeRoom={activeRoom}
        showNewChatModal={showNewChatModal}
        setShowNewChatModal={setShowNewChatModal}
        newChatMembers={newChatMembers}
        setNewChatMembers={setNewChatMembers}
        newChatGroupName={newChatGroupName}
        setNewChatGroupName={setNewChatGroupName}
        showReportUser={showReportUser}
        setShowReportUser={setShowReportUser}
        actions={actions}
      />
    </>
  );
}

export default ChatInterface;
