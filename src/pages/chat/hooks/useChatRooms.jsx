import { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatService from '../../../services/chat/ChatService';
import FirebaseChatService from '../../../services/chat/FirebaseChatService';
import { setConversations, updateConversation } from '../../../redux/slices/chatSlice';
import toast from 'react-hot-toast';

const useChatRooms = () => {
    const [isLoading, setIsLoading] = useState(true);
    const conversations = useSelector((state) => state.chat.conversations);
    const dispatch = useDispatch();

    // Map to track rooms currently being fetched from Firebase to prevent redundant calls
    const fetchingMap = useRef(new Set());

    // Use a ref to store the latest conversations to avoid dependency loop in fetchRooms
    const conversationsRef = useRef(conversations);
    useEffect(() => {
        conversationsRef.current = conversations;
    }, [conversations]);

    // Function to fetch last message content for a specific room
    const fetchLastMessageContent = useCallback(async (room) => {
        if (!room?.id || !room?.firebaseRoomKey) return;

        // Don't fetch if already fetching this room
        if (fetchingMap.current.has(room.id)) return;
        fetchingMap.current.add(room.id);

        try {
            const lastMsg = await FirebaseChatService.getLastMessage(room.firebaseRoomKey);
            let visible = "Chưa có tin nhắn";
            let timestamp = room.lastMessageAt ? new Date(room.lastMessageAt).getTime() : 0;
            let senderName = null;

            if (lastMsg) {
                // Determine the best display name from members list if possible
                let bestName = lastMsg.senderName;
                if (room.members) {
                    const member = room.members.find(m => String(m.id) === String(lastMsg.senderId));
                    if (member && member.fullName) {
                        bestName = member.fullName;
                    }
                }

                // Check if message is newer than clientClearedAt
                if (room.clientClearedAt) {
                    const clearTime = new Date(room.clientClearedAt).getTime();
                    if (lastMsg.timestamp <= clearTime) {
                        visible = "Chưa có tin nhắn";
                        senderName = null;
                    } else {
                        visible = lastMsg.text || (lastMsg.type === 'image' ? "Đã gửi một ảnh" : "Đã gửi một tệp");
                        timestamp = lastMsg.timestamp;
                        senderName = bestName;
                    }
                } else {
                    visible = lastMsg.text || (lastMsg.type === 'image' ? "Đã gửi một ảnh" : "Đã gửi một tệp");
                    timestamp = lastMsg.timestamp;
                    senderName = bestName;
                }
            }

            dispatch(updateConversation({
                id: room.id,
                lastMessageVisible: visible,
                lastMessageTimestamp: timestamp,
                lastMessageSenderName: senderName,
                lastMessageSenderId: lastMsg?.senderId
            }));
        } catch (error) {
            console.error(`Error fetching last message for room ${room.id}:`, error);
            // Fallback so it doesn't stay "Đang tải..."
            dispatch(updateConversation({
                id: room.id,
                lastMessageVisible: "Không thể tải tin nhắn",
                lastMessageTimestamp: room.lastMessageAt ? new Date(room.lastMessageAt).getTime() : 0
            }));
        } finally {
            fetchingMap.current.delete(room.id);
        }
    }, [dispatch]);

    const fetchRooms = useCallback(async () => {
        try {
            const response = await ChatService.getMyChatRooms();
            const rooms = response.data;

            // Merge new rooms with existing client-side data (like lastMessageVisible)
            const mergedRooms = rooms.map(newRoom => {
                // Match by ID (handling potential string/number mismatch)
                const existing = conversationsRef.current.find(p => String(p.id) === String(newRoom.id));

                if (existing && existing.lastMessageVisible && existing.lastMessageVisible !== "Đang tải...") {
                    return {
                        ...newRoom,
                        lastMessageVisible: existing.lastMessageVisible,
                        lastMessageTimestamp: existing.lastMessageTimestamp || (newRoom.lastMessageAt ? new Date(newRoom.lastMessageAt).getTime() : 0),
                        lastMessageSenderName: existing.lastMessageSenderName,
                        lastMessageSenderId: existing.lastMessageSenderId,
                        clientClearedAt: newRoom.clientClearedAt
                    };
                }

                // For newly loaded status or if it was "Đang tải..."
                let visible = newRoom.lastMessageAt ? "Đang tải..." : "Chưa có tin nhắn";
                if (newRoom.clientClearedAt && newRoom.lastMessageAt) {
                    const clearTime = new Date(newRoom.clientClearedAt).getTime();
                    const msgTime = new Date(newRoom.lastMessageAt).getTime();
                    if (msgTime <= clearTime) {
                        visible = "Chưa có tin nhắn";
                    }
                }
                return {
                    ...newRoom,
                    lastMessageVisible: visible,
                    lastMessageTimestamp: (newRoom.lastMessageAt ? new Date(newRoom.lastMessageAt).getTime() : 0)
                };
            });

            dispatch(setConversations(mergedRooms));

            // Eagerly fetch message contents for all rooms that need it
            mergedRooms.forEach(room => {
                if (room.lastMessageVisible === "Đang tải...") {
                    fetchLastMessageContent(room);
                }
            });

        } catch (error) {
            console.error("Error fetching rooms:", error);
            toast.error("Không thể tải danh sách cuộc trò chuyện");
        } finally {
            setIsLoading(false);
        }
    }, [dispatch, fetchLastMessageContent]); // Removed conversations from dependencies

    // Defensive effect to catch any rooms stuck in "Đang tải..."
    useEffect(() => {
        const needsUpdate = conversations.filter(c => c.lastMessageVisible === "Đang tải...");
        if (needsUpdate.length > 0) {
            needsUpdate.forEach(room => fetchLastMessageContent(room));
        }
    }, [conversations, fetchLastMessageContent]);


    // Calculate unread counts
    const directUnreadCount = conversations
        .filter(c => c.type === "DIRECT" && (c.unreadCount || 0) > 0)
        .length;

    const groupUnreadCount = conversations
        .filter(c => c.type === "GROUP" && (c.unreadCount || 0) > 0)
        .length;

    return {
        conversations,
        isLoading,
        fetchRooms,
        setIsLoading,
        directUnreadCount,
        groupUnreadCount
    };
};

export default useChatRooms;
