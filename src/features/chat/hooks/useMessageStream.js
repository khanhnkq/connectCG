import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import ChatService from "../../../services/chat/ChatService";
import FirebaseChatService from "../../../services/chat/FirebaseChatService";
import { uploadChatImage } from "../../../utils/uploadImage";
import { useWebSocket } from "../../../context/WebSocketContext";
import {
  clearUnreadCount,
  setActiveRoomId,
  updateMemberReadStatus,
} from "../../../redux/slices/chatSlice";

export function useMessageStream({ activeRoom, currentUser, userProfile, setActiveRoom }) {
  const dispatch = useDispatch();
  const { stompClient, isConnected } = useWebSocket() || {};

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [typingUsers, setTypingUsers] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState(null);

  const messagesEndRef = useRef(null);
  const lastRoomIdRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const lastTypingSentAtRef = useRef(0);

  // 1. Subscribe to Firebase Messages for activeRoom
  useEffect(() => {
    if (!activeRoom?.firebaseRoomKey) {
      setMessages([]);
      dispatch(setActiveRoomId(null));
      return;
    }

    dispatch(setActiveRoomId(activeRoom.id));
    setMessages([]);

    ChatService.markAsRead(activeRoom.id)
      .then(() => {
        dispatch(clearUnreadCount(activeRoom.id));
      })
      .catch((err) => console.error("Mark as read error:", err));

    const unsub = FirebaseChatService.subscribeToMessages(
      activeRoom.firebaseRoomKey,
      (event) => {
        if (event.type === "add") {
          const newMsg = event.message;
          if (activeRoom.clientClearedAt) {
            const clearTime = new Date(activeRoom.clientClearedAt).getTime();
            if ((newMsg.timestamp || 0) <= clearTime) return;
          }

          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            const nextMessages = [...prev, newMsg];
            return nextMessages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
          });
        } else if (event.type === "remove") {
          setMessages((prev) => prev.filter((m) => m.id !== event.messageId));
        }
      }
    );

    return () => unsub();
  }, [activeRoom?.id, activeRoom?.firebaseRoomKey, activeRoom?.clientClearedAt, dispatch]);

  // Global cleanup for active room
  useEffect(() => {
    return () => {
      dispatch(setActiveRoomId(null));
    };
  }, [dispatch]);

  // 2. Scroll logic
  useEffect(() => {
    if (!activeRoom || messages.length === 0) return;

    const scrollToBottom = (behavior = "auto") => {
      messagesEndRef.current?.scrollIntoView({ behavior });
    };

    const isRoomSwitch = lastRoomIdRef.current !== activeRoom.id;
    if (isRoomSwitch) {
      scrollToBottom("auto");
      lastRoomIdRef.current = activeRoom.id;
    } else {
      const timer = setTimeout(() => scrollToBottom("smooth"), 50);
      return () => clearTimeout(timer);
    }
  }, [messages.length, activeRoom?.id]);

  // 3. Click outside emoji picker
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 4. STOMP Typing Events
  useEffect(() => {
    if (
      !stompClient ||
      !isConnected ||
      !stompClient.connected ||
      !activeRoom?.firebaseRoomKey
    ) {
      return;
    }

    const subscriptions = [];
    try {
      const sub = stompClient.subscribe(
        `/topic/chat/${activeRoom.firebaseRoomKey}/typing`,
        (message) => {
          const event = JSON.parse(message.body);
          if (event.userId === currentUser?.id) return;

          setTypingUsers((prev) => {
            const currentRoomTyping = prev[event.firebaseRoomKey] || [];
            if (event.typing) {
              if (!currentRoomTyping.includes(event.fullName)) {
                return {
                  ...prev,
                  [event.firebaseRoomKey]: [...currentRoomTyping, event.fullName],
                };
              }
            } else {
              return {
                ...prev,
                [event.firebaseRoomKey]: currentRoomTyping.filter(
                  (name) => name !== event.fullName
                ),
              };
            }
            return prev;
          });
        }
      );
      subscriptions.push(sub);
    } catch (error) {
      console.error("Failed to subscribe to typing:", error);
    }

    return () => {
      subscriptions.forEach((sub) => {
        try {
          sub.unsubscribe();
        } catch {
          // ignore
        }
      });
    };
  }, [stompClient, isConnected, activeRoom?.firebaseRoomKey, currentUser?.id]);

  // 5. STOMP Seen Events
  useEffect(() => {
    if (
      !stompClient ||
      !isConnected ||
      !stompClient.connected ||
      !activeRoom?.firebaseRoomKey
    ) {
      return;
    }

    let sub;
    try {
      sub = stompClient.subscribe(
        `/topic/chat/${activeRoom.firebaseRoomKey}/seen`,
        (message) => {
          const event = JSON.parse(message.body);

          setActiveRoom?.((prev) => {
            if (!prev || prev.id !== event.roomId) return prev;
            const updatedMembers = prev.members.map((m) => {
              if (m.id === event.userId) {
                return { ...m, lastReadAt: event.lastReadAt };
              }
              return m;
            });
            return { ...prev, members: updatedMembers };
          });

          dispatch(
            updateMemberReadStatus({
              roomId: event.roomId,
              userId: event.userId,
              lastReadAt: event.lastReadAt,
            })
          );
        }
      );
    } catch (error) {
      console.error("Failed to subscribe to seen events:", error);
    }

    return () => {
      if (sub) {
        try {
          sub.unsubscribe();
        } catch {
          // ignore
        }
      }
    };
  }, [stompClient, isConnected, activeRoom?.id, activeRoom?.firebaseRoomKey, dispatch, setActiveRoom]);

  // Mark room as read on new message arrivals
  useEffect(() => {
    if (activeRoom && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (!lastMsg || lastMsg.senderId === currentUser?.id) return;

      const currentMember = activeRoom.members?.find((m) => m.id === currentUser?.id);
      const lastMsgTime = lastMsg.timestamp ? new Date(lastMsg.timestamp).getTime() : 0;
      const myLastRead = currentMember?.lastReadAt
        ? new Date(currentMember.lastReadAt).getTime()
        : 0;

      if (lastMsgTime > myLastRead) {
        ChatService.markAsRead(activeRoom.id).catch((err) =>
          console.error("Error marking room as read:", err)
        );
      }
    }
  }, [activeRoom?.id, messages.length, currentUser?.id]);

  const emitTyping = useCallback(
    (isTyping) => {
      if (
        !stompClient ||
        !isConnected ||
        !stompClient.connected ||
        !activeRoom
      ) {
        return;
      }

      try {
        stompClient.publish({
          destination: "/app/chat/typing",
          body: JSON.stringify({
            firebaseRoomKey: activeRoom.firebaseRoomKey,
            userId: currentUser?.id,
            fullName:
              userProfile?.fullName ||
              currentUser?.fullName ||
              currentUser?.username,
            typing: isTyping,
          }),
        });
      } catch (error) {
        console.error("Failed to emit typing:", error);
      }
    },
    [stompClient, isConnected, activeRoom, currentUser, userProfile]
  );

  const handleInputChange = (text) => {
    setInputText(text);

    if (text.length > 0) {
      const now = Date.now();
      if (now - lastTypingSentAtRef.current >= 1000) {
        emitTyping(true);
        lastTypingSentAtRef.current = now;
      }

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        emitTyping(false);
        lastTypingSentAtRef.current = 0;
      }, 3000);
    } else {
      emitTyping(false);
      lastTypingSentAtRef.current = 0;
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleSendMessage = async () => {
    if (!activeRoom || (!inputText.trim() && !selectedImage)) return;

    if (!currentUser?.id) {
      toast.error("Phiên làm việc hết hạn, vui lòng đăng nhập lại");
      return;
    }

    const text = inputText.trim();
    setInputText("");

    try {
      let imageUrl = null;
      let msgType = "text";

      if (selectedImage) {
        setIsUploading(true);
        try {
          imageUrl = await uploadChatImage(selectedImage);
          if (selectedImage.type?.startsWith("video/")) {
            msgType = "video";
          } else {
            msgType = "image";
          }
        } catch (error) {
          console.error("Media upload error:", error);
          toast.error(error.message || "Upload thất bại");
          setInputText(text);
          setIsUploading(false);
          return;
        }
      }

      const msgData = {
        senderId: currentUser.id,
        senderName:
          userProfile?.fullName ||
          currentUser.fullName ||
          currentUser.username ||
          "Ẩn danh",
        senderAvatarUrl:
          userProfile?.currentAvatarUrl || currentUser.avatarUrl || "",
        text: text || "",
        type: imageUrl ? msgType : "text",
        imageUrl: imageUrl || null,
        timestamp: Date.now(),
      };

      await FirebaseChatService.sendMessage(
        activeRoom.firebaseRoomKey,
        msgData
      );

      setSelectedImage(null);
      setIsUploading(false);

      ChatService.updateLastMessageAt(activeRoom.firebaseRoomKey).catch((err) =>
        console.error("Error updating last message time:", err)
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setInputText(text);
      setIsUploading(false);
      toast.error("Gửi tin nhắn thất bại");
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!activeRoom) return;
    try {
      await FirebaseChatService.deleteMessage(activeRoom.firebaseRoomKey, messageId);
      toast.success("Đã xóa tin nhắn");
    } catch (error) {
      console.error("Delete message error:", error);
      toast.error("Không thể xóa tin nhắn");
    }
  };

  return {
    messages,
    setMessages,
    inputText,
    setInputText: handleInputChange,
    handleSendMessage,
    handleDeleteMessage,
    typingUsers: activeRoom ? typingUsers[activeRoom.firebaseRoomKey] || [] : [],
    selectedImage,
    setSelectedImage,
    isUploading,
    showEmojiPicker,
    setShowEmojiPicker,
    emojiPickerRef,
    messagesEndRef,
    showMediaGallery,
    setShowMediaGallery,
    lightboxMedia,
    setLightboxMedia,
  };
}

export default useMessageStream;
