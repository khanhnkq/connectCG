import React from 'react';
import { Search, SquarePen, User, Users } from 'lucide-react';
import { useSelector } from 'react-redux';

const ChatSidebar = ({
    conversations,
    activeRoom,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    directUnreadCount,
    groupUnreadCount,
    onSelectRoom,
    onOpenNewChat
}) => {
    const { user: currentUser } = useSelector((state) => state.auth);
    return (
        <div
            className={`${activeRoom ? "hidden md:flex" : "flex"
                } w-full md:w-80 lg:w-96 flex-col border-r border-border-main bg-background-main z-10 shrink-0 transition-colors duration-300`}
        >
            <div className="p-5 border-b border-border-main flex justify-between items-center bg-background-main/95 backdrop-blur-md sticky top-0 z-10">
                <h2 className="text-xl font-extrabold text-text-main tracking-tight">
                    Tin nhắn
                </h2>
                <button
                    onClick={onOpenNewChat}
                    className="size-9 rounded-full bg-[#3A2A20] hover:bg-primary hover:text-[#231810] flex items-center justify-center text-primary transition-all shadow-md"
                >
                    <SquarePen size={20} />
                </button>
            </div>

            <div className="px-5 pt-4 pb-2 flex gap-2">
                <button
                    onClick={() => setActiveTab("DIRECT")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all relative ${activeTab === "DIRECT"
                        ? "bg-surface-main text-primary shadow-sm"
                        : "text-text-secondary hover:bg-surface-main/50"
                        }`}
                >
                    <User size={16} />
                    <span>Cá nhân</span>
                    {directUnreadCount > 0 && (
                        <span className="bg-red-600 text-white text-[10px] size-5 flex items-center justify-center rounded-full ml-1 font-bold">
                            {directUnreadCount > 99 ? '99+' : directUnreadCount}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("GROUP")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all relative ${activeTab === "GROUP"
                        ? "bg-surface-main text-primary shadow-sm"
                        : "text-text-secondary hover:bg-surface-main/50"
                        }`}
                >
                    <Users size={16} />
                    <span>Nhóm</span>
                    {groupUnreadCount > 0 && (
                        <span className="bg-red-600 text-white text-[10px] size-5 flex items-center justify-center rounded-full ml-1 font-bold">
                            {groupUnreadCount > 99 ? '99+' : groupUnreadCount}
                        </span>
                    )}
                </button>
            </div>

            <div className="px-5 py-4">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search
                            className="text-text-secondary transition-colors"
                            size={20}
                        />
                    </div>
                    <input
                        className="block w-full pl-10 pr-4 py-3 border border-border-main rounded-xl bg-surface-main text-text-main placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-medium shadow-inner"
                        placeholder="Tìm kiếm cuộc trò chuyện..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1 custom-scrollbar">
                {conversations
                    .filter((conv) => {
                        // Filter by Tab
                        if (activeTab === "DIRECT" && conv.type === "GROUP") return false;
                        if (activeTab === "GROUP" && conv.type !== "GROUP") return false;

                        // Filter by Search
                        return conv.name?.toLowerCase().includes(searchTerm.toLowerCase());
                    })
                    .map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => onSelectRoom(conv)}
                            className={`p-3 rounded-xl cursor-pointer relative group flex gap-3 items-center transition-all ${activeRoom?.id === conv.id
                                ? "bg-surface-main border border-primary/20 shadow-sm"
                                : "hover:bg-surface-main/30 border border-transparent"
                                }`}
                        >
                            <div className="relative shrink-0">
                                <div
                                    className="size-12 rounded-full bg-cover bg-center ring-2 ring-transparent group-hover:ring-primary/20 transition-all border border-border-main"
                                    style={{
                                        backgroundImage: `url("${conv.avatarUrl ||
                                            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                            }")`,
                                    }}
                                ></div>
                                {conv.unreadCount > 0 && activeRoom?.id !== conv.id && (
                                    <div className="absolute -top-1 -right-1 size-5 bg-red-600 rounded-full flex items-center justify-center border-2 border-background-main animate-in zoom-in shadow-lg">
                                        <span className="text-[10px] font-black text-white">{conv.unreadCount}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3
                                        className={`font-bold text-sm truncate ${activeRoom?.id === conv.id
                                            ? "text-text-main"
                                            : "text-text-secondary group-hover:text-text-main"
                                            }`}
                                    >
                                        {conv.name || "Hội thoại"}
                                    </h3>
                                    {conv.lastMessageTimestamp && (
                                        <span className="text-[10px] text-text-muted shrink-0 ml-2">
                                            {new Date(conv.lastMessageTimestamp).toLocaleTimeString("vi-VN", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    )}
                                </div>
                                <p className={`text-text-secondary text-xs truncate max-w-full italic ${conv.unreadCount > 0 ? "font-bold text-primary not-italic" : ""}`}>
                                    {conv.lastMessageSenderName && (conv.type === "GROUP" || String(conv.lastMessageSenderId) === String(currentUser?.id)) && (
                                        <span className="font-bold mr-1 not-italic">
                                            {String(conv.lastMessageSenderId) === String(currentUser?.id) ? "Bạn" : conv.lastMessageSenderName}:
                                        </span>
                                    )}
                                    {conv.lastMessageVisible || (conv.lastMessageTimestamp ? "Đang tải..." : "Chưa có tin nhắn")}
                                </p>
                            </div>
                            {activeRoom?.id === conv.id && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-primary rounded-r-xl"></div>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ChatSidebar;
