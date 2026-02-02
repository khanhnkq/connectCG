import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MessageSquare, SquarePen } from 'lucide-react';
import ChatService from '../../services/chat/ChatService';
import FirebaseChatService from '../../services/chat/FirebaseChatService';

export default function ChatDropdown({ onClose }) {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const conversations = useSelector((state) => state.chat.conversations);
    const [loading, setLoading] = useState(conversations.length === 0);

    // No need for local state or periodic fetching anymore
    // Redux state is automatically synced by ChatInterface

    useEffect(() => {
        if (conversations.length > 0) {
            setLoading(false);
        }
    }, [conversations]);

    // Real-time updates are now handled by ChatInterface and shared via Redux
    // No need for duplicate subscription logic here

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
                        onClick={() => { navigate('/dashboard/chat', { state: { clearSelection: true } }); onClose(); }}
                    >
                        Xem tất cả
                    </button>
                </div>
            </div>

            <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
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
                                    <span className="absolute top-0 right-0 size-3 bg-red-500 rounded-full border-2 border-background-main shadow-sm"></span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <h4 className={`text-sm truncate pr-2 ${room.unreadCount > 0 ? 'font-bold text-text-main' : 'font-medium text-text-main'}`}>
                                        {room.name}
                                    </h4>
                                    {room.lastMessageTimestamp > 0 && (
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
                    onClick={() => { navigate('/dashboard/chat', { state: { clearSelection: true } }); onClose(); }}
                    className="w-full py-1.5 text-xs font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                    Xem tất cả trong Messenger
                </button>
            </div>
        </div>
    );
}
