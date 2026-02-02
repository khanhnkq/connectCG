import { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatService from '../../../services/chat/ChatService';
import { setConversations } from '../../../redux/slices/chatSlice';
import toast from 'react-hot-toast';

const useChatRooms = () => {
    const [isLoading, setIsLoading] = useState(true);
    const conversations = useSelector((state) => state.chat.conversations);
    const dispatch = useDispatch();

    // Use a ref to store the latest conversations to avoid dependency loop in fetchRooms
    const conversationsRef = useRef(conversations);
    useEffect(() => {
        conversationsRef.current = conversations;
    }, [conversations]);

    const fetchRooms = useCallback(async () => {
        try {
            const response = await ChatService.getMyChatRooms();
            const rooms = response.data;

            // Merge new rooms with existing client-side data (like lastMessageVisible)
            const mergedRooms = rooms.map(newRoom => {
                const existing = conversationsRef.current.find(p => p.id === newRoom.id);
                if (existing) {
                    return {
                        ...newRoom,
                        lastMessageVisible: existing.lastMessageVisible,
                        lastMessageTimestamp: existing.lastMessageTimestamp && existing.lastMessageTimestamp > (newRoom.lastMessageAt ? new Date(newRoom.lastMessageAt).getTime() : 0)
                            ? existing.lastMessageTimestamp
                            : newRoom.lastMessageAt,
                        // Update status from backend
                        clientClearedAt: newRoom.clientClearedAt
                    };
                }

                // For newly loaded status, check if cleared
                let visible = newRoom.lastMessageAt ? "Đang tải..." : "Chưa có tin nhắn";
                if (newRoom.clientClearedAt && newRoom.lastMessageAt) {
                    const clearTime = new Date(newRoom.clientClearedAt).getTime();
                    const msgTime = new Date(newRoom.lastMessageAt).getTime();
                    if (msgTime <= clearTime) {
                        visible = "Chưa có tin nhắn";
                    }
                }
                return { ...newRoom, lastMessageVisible: visible };
            });

            dispatch(setConversations(mergedRooms));

        } catch (error) {
            console.error("Error fetching rooms:", error);
            toast.error("Không thể tải danh sách cuộc trò chuyện");
        } finally {
            setIsLoading(false);
        }
    }, [dispatch]); // Removed conversations from dependencies

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
