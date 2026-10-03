import { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatService from '../../../services/chat/ChatService';
import FirebaseChatService from '../../../services/chat/FirebaseChatService';
import { setConversations, updateConversation } from '../../../redux/slices/chatSlice';
import { store } from '../../../redux/store/store';
import toast from 'react-hot-toast';

// Module-level listener registry for Firebase subscriptions
// Map<roomId, { unsubscribe: Function, refCount: number, firebaseRoomKey: string }>
const globalRoomSubscriptions = new Map();

// In-flight fetchRooms promise deduplicator across concurrent mounting components
let inFlightFetchRoomsPromise = null;
const fetchRoomsFromApi = async () => {
    if (!inFlightFetchRoomsPromise) {
        inFlightFetchRoomsPromise = ChatService.getMyChatRooms().finally(() => {
            inFlightFetchRoomsPromise = null;
        });
    }
    return inFlightFetchRoomsPromise;
};

const registerRoomSubscription = (room) => {
    if (!room?.id || !room?.firebaseRoomKey) return;
    const roomId = room.id;

    if (globalRoomSubscriptions.has(roomId)) {
        const entry = globalRoomSubscriptions.get(roomId);
        if (entry.firebaseRoomKey === room.firebaseRoomKey) {
            entry.refCount += 1;
            return;
        }
        // If room key changed, tear down old listener
        try {
            entry.unsubscribe?.();
        } catch (e) {
            console.error("Error unsubscribing obsolete room key:", e);
        }
        globalRoomSubscriptions.delete(roomId);
    }

    const unsubscribe = FirebaseChatService.subscribeToMessages(room.firebaseRoomKey, (event) => {
        if (!event) return;

        // Ignore remove events for last-message preview
        if (event.type === 'remove') {
            return;
        }

        if (event.type !== 'add' || !event.message) return;

        const state = store.getState();
        const currentConversations = state.chat.conversations || [];
        const activeRoomId = state.chat.activeRoomId;
        const currentUser = state.auth.user;

        // Guard: nếu room đã bị xóa khỏi conversations, không update (tránh re-inserting)
        const targetRoom = currentConversations.find(c => String(c.id) === String(roomId));
        if (!targetRoom) {
            return;
        }

        const msg = event.message;

        // Determine display name priority (Full Name from members > senderName from Firebase)
        let senderName = msg.senderName;
        if (targetRoom.members) {
            const member = targetRoom.members.find(m => String(m.id) === String(msg.senderId));
            if (member && member.fullName) {
                senderName = member.fullName;
            }
        }

        let visible = msg.text || (msg.type === 'image' ? "Đã gửi một ảnh" : "Đã gửi một tệp");
        let timestamp = msg.timestamp || Date.now();

        // Handle client-side history clearing
        if (targetRoom.clientClearedAt) {
            const clearTime = new Date(targetRoom.clientClearedAt).getTime();
            if (timestamp <= clearTime) {
                visible = "Chưa có tin nhắn";
                senderName = null;
            }
        }

        // Determine if this is a "new" message that should trigger an unread badge
        const isBrandNew = timestamp > (targetRoom.lastMessageTimestamp || 0);

        // Push update to Redux - this triggers UI updates in Sidebar and Dropdown
        const updatePayload = {
            id: targetRoom.id,
            lastMessageVisible: visible,
            lastMessageTimestamp: timestamp,
            lastMessageSenderName: senderName,
            lastMessageSenderId: msg.senderId,
        };

        // OPTIMISTIC UNREAD COUNT: If we get a new message from someone else while not in the room, 
        // mark it unread immediately instead of waiting for the backend WebSocket.
        const isFromOthers = String(msg.senderId) !== String(currentUser?.id);
        const isNotInRoom = String(activeRoomId) !== String(targetRoom.id);

        if (isBrandNew && isFromOthers && isNotInRoom) {
            updatePayload.unreadCount = (targetRoom.unreadCount || 0) + 1;
        }

        store.dispatch(updateConversation(updatePayload));
    }, 1); // Only listen for the latest message

    globalRoomSubscriptions.set(roomId, {
        unsubscribe,
        refCount: 1,
        firebaseRoomKey: room.firebaseRoomKey,
    });
};

const releaseRoomSubscription = (roomId) => {
    const entry = globalRoomSubscriptions.get(roomId);
    if (!entry) return;

    entry.refCount -= 1;
    if (entry.refCount <= 0) {
        try {
            entry.unsubscribe?.();
        } catch (e) {
            console.error("Error unsubscribing room:", e);
        }
        globalRoomSubscriptions.delete(roomId);
    }
};

const useChatRooms = () => {
    const [isLoading, setIsLoading] = useState(true);
    const conversations = useSelector((state) => state.chat.conversations);
    const dispatch = useDispatch();

    // Track which room IDs this hook instance has registered with the singleton listener registry
    const instanceSubscribedRoomIdsRef = useRef(new Set());

    // Use a ref to store the latest conversations to avoid dependency loop in fetchRooms
    const conversationsRef = useRef(conversations);
    useEffect(() => {
        conversationsRef.current = conversations;
    }, [conversations]);

    // Unsubscribe a specific room listener for this instance
    const unsubscribeRoom = useCallback((roomId) => {
        if (instanceSubscribedRoomIdsRef.current.has(roomId)) {
            releaseRoomSubscription(roomId);
            instanceSubscribedRoomIdsRef.current.delete(roomId);
        }
    }, []);

    // Effect: Automatically register subscriptions and release removed ones
    useEffect(() => {
        const currentRoomIds = new Set(conversations.map(c => c.id));
        const registered = instanceSubscribedRoomIdsRef.current;

        // Clean up rooms no longer in conversations for this hook instance
        for (const roomId of Array.from(registered)) {
            if (!currentRoomIds.has(roomId)) {
                releaseRoomSubscription(roomId);
                registered.delete(roomId);
            }
        }

        // Register new rooms
        conversations.forEach(room => {
            if (room.firebaseRoomKey && !registered.has(room.id)) {
                registerRoomSubscription(room);
                registered.add(room.id);
            }
        });
    }, [conversations]);

    // Cleanup: Release all subscriptions registered by this hook instance on unmount
    useEffect(() => {
        const registered = instanceSubscribedRoomIdsRef.current;
        return () => {
            for (const roomId of registered) {
                releaseRoomSubscription(roomId);
            }
            registered.clear();
        };
    }, []);

    const fetchRooms = useCallback(async () => {
        try {
            const response = await fetchRoomsFromApi();
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
        unsubscribeRoom,
        directUnreadCount,
        groupUnreadCount
    };
};

export default useChatRooms;

