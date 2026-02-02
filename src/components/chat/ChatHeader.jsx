import React from 'react';
import { Phone, Video } from 'lucide-react';

const ChatHeader = ({ activeRoom }) => {
    if (!activeRoom) return null;

    return (
        <div className="h-20 border-b border-border-main flex items-center justify-between px-6 bg-background-main/95 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <div className="relative group/header-avatar cursor-pointer">
                    <div
                        className="size-11 rounded-full bg-cover bg-center border-2 border-surface-main group-hover/header-avatar:border-primary transition-all duration-300"
                        style={{
                            backgroundImage: `url("${activeRoom.avatarUrl ||
                                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                }")`,
                        }}
                    ></div>
                    <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-background-main" />
                </div>
                <div>
                    <h3 className="text-text-main font-bold text-base flex items-center gap-2">
                        {activeRoom.name || "Đang tải..."}
                    </h3>
                    <p className="text-text-secondary text-xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>{" "}
                        Đang kết nối
                    </p>
                </div>
            </div>
            <div className="flex gap-2 text-text-secondary">
                <button
                    className="size-10 rounded-full hover:bg-surface-main hover:text-primary flex items-center justify-center transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Gọi thoại (Sắp ra mắt)"
                    disabled
                >
                    <Phone size={24} />
                </button>
                <button
                    className="size-10 rounded-full hover:bg-surface-main hover:text-primary flex items-center justify-center transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Gọi video (Sắp ra mắt)"
                    disabled
                >
                    <Video size={24} />
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;
