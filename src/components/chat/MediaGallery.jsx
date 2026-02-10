import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Loader2, Play } from 'lucide-react';
import FirebaseChatService from '../../services/chat/FirebaseChatService';

const MediaGallery = ({ roomKey, isOpen, onClose, onMediaClick, minTimestamp = 0 }) => {
    const [mediaMessages, setMediaMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [limit, setLimit] = useState(20);

    useEffect(() => {
        if (isOpen && roomKey) {
            loadMedia();
        }
    }, [isOpen, roomKey]);

    const loadMedia = async () => {
        setLoading(true);
        try {
            const messages = await FirebaseChatService.getMediaMessages(roomKey, limit, minTimestamp);
            setMediaMessages(messages);
            setHasMore(messages.length >= limit);
        } catch (error) {
            console.error('Error loading media:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        setLimit(prev => prev + 20);
        loadMedia();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-background-main h-full flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="p-4 border-b border-border-main flex items-center justify-between">
                    <h2 className="text-lg font-bold text-text-main">Thư viện Ảnh & Video</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-surface-main rounded-full transition-colors"
                    >
                        <X size={24} className="text-text-secondary" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {loading && mediaMessages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="animate-spin text-primary" size={40} />
                        </div>
                    ) : mediaMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-text-secondary">
                            <p className="text-center">Chưa có hình ảnh nào được chia sẻ</p>
                        </div>
                    ) : (
                        <>
                            {/* Grid of images */}
                            <div className="grid grid-cols-3 gap-2">
                                {mediaMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className="aspect-square relative rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border border-border-main group"
                                        onClick={() => onMediaClick && onMediaClick(msg.imageUrl, msg.type)}
                                    >
                                        {msg.type === 'video' ? (
                                            <>
                                                <video
                                                    src={msg.imageUrl}
                                                    className="w-full h-full object-cover"
                                                    muted
                                                    preload="metadata"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                                                    <Play size={32} className="text-white opacity-90 drop-shadow-md" fill="white" />
                                                </div>
                                                <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1 py-0.5 rounded font-bold">
                                                    VIDEO
                                                </div>
                                            </>
                                        ) : (
                                            <img
                                                src={msg.imageUrl}
                                                alt="Shared"
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Load More Button */}
                            {hasMore && (
                                <button
                                    onClick={loadMore}
                                    disabled={loading}
                                    className="w-full mt-4 py-3 bg-surface-main hover:bg-surface-main/80 text-text-main rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            <span>Đang tải...</span>
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown size={20} />
                                            <span>Xem thêm</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MediaGallery;
