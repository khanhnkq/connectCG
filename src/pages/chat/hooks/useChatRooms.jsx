import { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatService from '../../../services/chat/ChatService';
import FirebaseChatService from '../../../services/chat/FirebaseChatService';
import { setConversations, updateConversation } from '../../../redux/slices/chatSlice';
import toast from 'react-hot-toast';

const useChatRooms = () => {
    const [isLoading, setIsLoading] = useState(true);
    const conversations = useSelector((state) => state.chat.conversations);
    const activeRoomId = useSelector((state) => state.chat.activeRoomId);
    const { user: currentUser } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    // Map to track active Firebase listeners for last messages
    const subscriptionsRef = useRef(new Map());

    // Use a ref to store the latest conversations to avoid dependency loop in fetchRooms
    const conversationsRef = useRef(conversations);
    const activeRoomIdRef = useRef(activeRoomId);
    const currentUserRef = useRef(currentUser);

    useEffect(() => {
        conversationsRef.current = conversations;
        activeRoomIdRef.current = activeRoomId;
        currentUserRef.current = currentUser;
    }, [conversations, activeRoomId, currentUser]);

    // Function to subscribe to the last message of a room
    const subscribeToRoomLastMessage = useCallback((room) => {
        if (!room?.id || !room?.firebaseRoomKey) return;

        // Avoid redundant subscriptions
        if (subscriptionsRef.current.has(room.id)) return;

        const unsubscribe = FirebaseChatService.subscribeToMessages(room.firebaseRoomKey, (lastMsg) => {
            if (!lastMsg) return;

            // Determine display name priority (Full Name from members > senderName from Firebase)
            let senderName = lastMsg.senderName;
            if (room.members) {
                const member = room.members.find(m => String(m.id) === String(lastMsg.senderId));
                if (member && member.fullName) {
                    senderName = member.fullName;
                }
            }

            let visible = lastMsg.text || (lastMsg.type === 'image' ? "Đã gửi một ảnh" : "Đã gửi một tệp");
            let timestamp = lastMsg.timestamp;

            // Handle client-side history clearing
            if (room.clientClearedAt) {
                const clearTime = new Date(room.clientClearedAt).getTime();
                if (timestamp <= clearTime) {
                    visible = "Chưa có tin nhắn";
                    senderName = null;
                }
            }

            // Determine if this is a "new" message that should trigger an unread badge
            const existing = conversationsRef.current.find(c => c.id === room.id);
            const isBrandNew = !existing || (lastMsg.timestamp > (existing.lastMessageTimestamp || 0));

            // Push update to Redux - this triggers UI updates in Sidebar and Dropdown
            const updatePayload = {
                id: room.id,
                lastMessageVisible: visible,
                lastMessageTimestamp: timestamp,
                lastMessageSenderName: senderName,
                lastMessageSenderId: lastMsg.senderId,
            };

            // OPTIMISTIC UNREAD COUNT: If we get a new message from someone else while not in the room, 
            // mark it unread immediately instead of waiting for the backend WebSocket.
            const isFromOthers = String(lastMsg.senderId) !== String(currentUserRef.current?.id);
            const isNotInRoom = String(activeRoomIdRef.current) !== String(room.id);

            if (isBrandNew && isFromOthers && isNotInRoom) {
                updatePayload.unreadCount = 1;
            }

            dispatch(updateConversation(updatePayload));
        }, 1); // Only listen for the latest message

        subscriptionsRef.current.set(room.id, unsubscribe);
    }, [dispatch]);

    // Effect: Automatically subscribe to rooms when they appear in the conversations list
    useEffect(() => {
        conversations.forEach(room => {
            if (room.firebaseRoomKey && !subscriptionsRef.current.has(room.id)) {
                subscribeToRoomLastMessage(room);
            }
        });
    }, [conversations, subscribeToRoomLastMessage]);

    // Cleanup: Disconnect all listeners when the hook is unmounted
    useEffect(() => {
        return () => {
            subscriptionsRef.current.forEach(unsub => unsub());
            subscriptionsRef.current.clear();
        };
    }, []);

    const fetchRooms = useCallback(async () => {
        try {
            const response = await ChatService.getMyChatRooms();
            const rooms = response.data;

            // Prepare rooms for Redux (listeners will populate the message content shortly)
            const mergedRooms = rooms.map(newRoom => {
                const existing = conversationsRef.current.find(p => String(p.id) === String(newRoom.id));

                // IF we already have a real message (from Firebase listener), DON'T overwrite with "Đang tải..."
                if (existing && existing.lastMessageVisible &&
                    existing.lastMessageVisible !== "Đang tải..." &&
                    existing.lastMessageVisible !== "Chưa có tin nhắn") {

                    return {
                        ...newRoom,
                        lastMessageVisible: existing.lastMessageVisible,
                        lastMessageTimestamp: existing.lastMessageTimestamp || (newRoom.lastMessageAt ? new Date(newRoom.lastMessageAt).getTime() : 0),
                        lastMessageSenderName: existing.lastMessageSenderName,
                        lastMessageSenderId: existing.lastMessageSenderId,
                    };
                }

                // If not in Redux yet, or only had "Chưa có tin nhắn/Đang tải...", check Backend state
                let visible = "Chưa có tin nhắn";
                if (newRoom.lastMessageAt) {
                    visible = "Đang tải...";
                    if (newRoom.clientClearedAt) {
                        const clearTime = new Date(newRoom.clientClearedAt).getTime();
                        const msgTime = new Date(newRoom.lastMessageAt).getTime();
                        if (msgTime <= clearTime) {
                            visible = "Chưa có tin nhắn";
                        }
                    }
                }

                return {
                    ...newRoom,
                    lastMessageVisible: visible,
                    lastMessageTimestamp: (newRoom.lastMessageAt ? new Date(newRoom.lastMessageAt).getTime() : 0)
                };
            });

            dispatch(setConversations(mergedRooms));

        } catch (error) {
            console.error("Error fetching rooms:", error);
            toast.error("Không thể tải danh sách cuộc trò chuyện");
        } finally {
            setIsLoading(false);
        }
    }, [dispatch]);


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
