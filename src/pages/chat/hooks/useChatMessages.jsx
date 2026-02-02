import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import FirebaseChatService from '../../../services/chat/FirebaseChatService';
import ChatService from '../../../services/chat/ChatService';
import { clearUnreadCount, setActiveRoomId } from '../../../redux/slices/chatSlice';

const useChatMessages = (activeRoom) => {
    const [messages, setMessages] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!activeRoom?.firebaseRoomKey) {
            setMessages([]);
            return;
        }

        // Sync with Redux activeRoomId
        dispatch(setActiveRoomId(activeRoom.id));

        // Clear previous chat messages
        setMessages([]);

        // Mark as read in backend AND Redux
        ChatService.markAsRead(activeRoom.id)
            .then(() => {
                dispatch(clearUnreadCount(activeRoom.id));
            })
            .catch(err => console.error("Mark as read error:", err));

        // Subscribe specifically to THIS room's messages
        const unsub = FirebaseChatService.subscribeToMessages(
            activeRoom.firebaseRoomKey,
            (newMsg) => {
                // Filter out if message is older than clientClearedAt
                if (activeRoom.clientClearedAt) {
                    const clearTime = new Date(activeRoom.clientClearedAt).getTime();
                    if (newMsg.timestamp <= clearTime) return;
                }

                setMessages((prev) => {
                    if (prev.some((m) => m.id === newMsg.id)) return prev;
                    return [...prev, newMsg];
                });
            }
        );

        return () => unsub();
    }, [activeRoom?.id, activeRoom?.firebaseRoomKey, dispatch]);

    // Global cleanup for active room
    useEffect(() => {
        return () => {
            dispatch(setActiveRoomId(null));
        };
    }, [dispatch]);

    return { messages, setMessages };
};

export default useChatMessages;
