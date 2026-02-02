import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MessageSquare, SquarePen } from 'lucide-react';
import ChatService from '../../services/chat/ChatService';
import FirebaseChatService from '../../services/chat/FirebaseChatService';

export default function ChatDropdown({ onClose }) {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) return;
        const fetchRooms = async () => {
            try {
                const response = await ChatService.getMyChatRooms();
                const rooms = response.data || [];
                setConversations(rooms);

                // Fetch last messages for these rooms
                rooms.forEach(async (room) => {
                    try {
                        const lastMsg = await FirebaseChatService.getLastMessage(room.firebaseRoomKey);
                        if (lastMsg) {
                            setConversations(prev => prev.map(c =>
                                c.id === room.id
                                    ? {
                                        ...c,
                                        lastMessageVisible: lastMsg.text,
                                        lastMessageTimestamp: lastMsg.timestamp
                                    }
                                    : c
                            ));
                        }
                    } catch (e) {
                        console.error("Failed to fetch last msg for", room.id);
                    }
                });

            } catch (error) {
                console.error("Failed to load chat rooms", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, [user?.id]);

    // Realtime subscription (Simplified for dropdown - mostly for unread and ordering)
    useEffect(() => {
        if (conversations.length === 0) return;

        const listeners = [];
        const startTime = Date.now();

        conversations.forEach((room) => {
            const unsub = FirebaseChatService.subscribeToMessages(
                room.firebaseRoomKey,
                (newMsg) => {
                    // Re-order and update preview
                    setConversations((prev) => {
                        const index = prev.findIndex(c => c.firebaseRoomKey === room.firebaseRoomKey);
                        if (index === -1) return prev;

                        const updatedList = [...prev];
                        const oldRoom = updatedList[index];

                        // Update logic
                        const isNewMessage = newMsg.timestamp && newMsg.timestamp > startTime - 3000;
                        const isNotMe = newMsg.senderId !== user.id;

                        let newUnread = oldRoom.unreadCount || 0;
                        if (isNewMessage && isNotMe) {
                            newUnread += 1;
                        }

                        const updatedRoom = {
                            ...oldRoom,
                            lastMessageVisible: newMsg.text,
                            lastMessageTimestamp: newMsg.timestamp,
                            unreadCount: newUnread
                        };

                        // Move to top if new message
                        if (newMsg.timestamp > (oldRoom.lastMessageTimestamp || 0)) {
                            updatedList.splice(index, 1);
                            return [updatedRoom, ...updatedList];
                        } else {
                            updatedList[index] = updatedRoom;
                            return updatedList;
                        }
                    });
                }
            );
            listeners.push(unsub);
        });

        return () => listeners.forEach(u => u());
    }, [conversations.length]); // Re-subscribe if list changes (initially)

    const handleRoomClick = (room) => {
        navigate('/dashboard/chat', { state: { selectedRoomKey: room.firebaseRoomKey } });
        onClose();
    };

    if (loading) {
        return (
            <div className="p-4 flex justify-center">
                <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col max-h-[400px]">
            <div className="p-3 border-b border-border-main flex justify-between items-center sticky top-0 bg-background-main z-10">
                <h3 className="font-bold text-lg text-text-main">Tin nhắn</h3>
                <div className="flex gap-2">
                    <button
                        className="text-text-secondary hover:text-primary transition-colors text-xs font-semibold"
                        onClick={() => { navigate('/dashboard/chat'); onClose(); }}
                    >
                        Xem tất cả
                    </button>
                </div>
            </div>

            <div className="overflow-y-auto flex-1 p-2 space-y-1">
                {conversations.length === 0 ? (
                    <div className="p-8 text-center text-text-secondary flex flex-col items-center gap-2">
                        <MessageSquare size={32} className="opacity-20" />
                        <p className="text-xs">Chưa có tin nhắn nào</p>
                    </div>
                ) : (
                    conversations.map(room => (
                        <div
                            key={room.id}
                            onClick={() => handleRoomClick(room)}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-main cursor-pointer transition-colors relative"
                        >
                            <div className="relative shrink-0">
                                <img
                                    src={room.avatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                    alt={room.name}
                                    className="size-12 rounded-full object-cover border border-border-main"
                                />
                                {room.unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-background-main shadow-sm">
                                        {room.unreadCount}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <h4 className={`text-sm truncate pr-2 ${room.unreadCount > 0 ? 'font-bold text-text-main' : 'font-medium text-text-main'}`}>
                                        {room.name}
                                    </h4>
                                    {room.lastMessageTimestamp && (
                                        <span className={`text-[10px] shrink-0 ${room.unreadCount > 0 ? 'text-primary font-bold' : 'text-text-secondary'}`}>
                                            {new Date(room.lastMessageTimestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    )}
                                </div>
                                <p className={`text-xs truncate ${room.unreadCount > 0 ? 'text-text-main font-semibold' : 'text-text-secondary'}`}>
                                    {room.lastMessageVisible || "Bắt đầu cuộc trò chuyện"}
                                </p>
                            </div>
                            {room.unreadCount > 0 && (
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 size-2 bg-primary rounded-full"></div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <div className="p-2 border-t border-border-main text-center sticky bottom-0 bg-background-main">
                <button
                    onClick={() => { navigate('/dashboard/chat'); onClose(); }}
                    className="w-full py-1.5 text-xs font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                    Xem tất cả trong Messenger
                </button>
            </div>
        </div>
    );
}
