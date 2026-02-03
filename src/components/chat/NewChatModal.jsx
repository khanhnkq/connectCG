import React from "react";
import { X, Search, Send, UserX, MessageSquare, Users } from "lucide-react";

const NewChatModal = ({
  show,
  onClose,
  friends,
  searchTerm,
  onSearchChange,
  selectedMembers,
  onToggleMember,
  onStartNewChat,
  groupName,
  setGroupName,
  onCreateGroup,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-main w-full max-w-md rounded-3xl border border-border-main shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-border-main flex items-center justify-between">
          <h2 className="text-xl font-bold text-text-main">Tin nhắn mới</h2>
          <button
            onClick={onClose}
            className="size-8 rounded-full bg-surface-main text-text-main flex items-center justify-center hover:bg-background-main transition-all border border-border-main"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <div className="relative mb-6">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
              size={18}
            />
            <input
              autoFocus
              className="w-full pl-11 pr-4 py-3 bg-background-main border border-border-main rounded-2xl text-text-main placeholder-text-secondary/50 focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-inner"
              placeholder="Tìm kiếm bạn bè..."
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="space-y-2 max-h-[30vh] overflow-y-auto custom-scrollbar pr-2 -mr-2">
            {friends.length > 0 ? (
              friends.map((friend) => (
                <div
                  key={friend.id}
                  onClick={() => onToggleMember(friend)}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer group ${
                    selectedMembers.some((m) => m.id === friend.id)
                      ? "bg-primary/10 border-primary/50 shadow-sm"
                      : "bg-surface-main border-border-main hover:bg-background-main hover:border-primary/30"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div
                      className="size-10 rounded-full bg-cover bg-center border border-border-main"
                      style={{
                        backgroundImage: `url("${
                          friend.avatarUrl ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }")`,
                      }}
                    ></div>
                    {selectedMembers.some((m) => m.id === friend.id) && (
                      <div className="absolute -top-1 -right-1 size-5 bg-primary rounded-full flex items-center justify-center border-2 border-surface-main animate-in zoom-in text-[#231810]">
                        <X size={12} strokeWidth={4} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-text-main font-bold text-sm group-hover:text-primary transition-colors">
                      {friend.fullName || friend.username}
                    </p>
                    <p className="text-text-secondary text-[11px]">
                      @{friend.username}
                    </p>
                  </div>
                  {!selectedMembers.length && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartNewChat(friend.id);
                      }}
                      className="text-text-secondary group-hover:text-primary transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Send size={20} />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-text-secondary flex flex-col items-center gap-2">
                <UserX size={48} className="opacity-20" />
                <p className="text-xs italic">Không tìm thấy bạn bè nào</p>
              </div>
            )}
          </div>

          {selectedMembers.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border-main space-y-4 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-1">
                {selectedMembers.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-2 bg-background-main pl-1 pr-2 py-1 rounded-full border border-primary/20"
                  >
                    <div
                      className="size-6 rounded-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url("${
                          m.avatarUrl ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }")`,
                      }}
                    ></div>
                    <span className="text-[10px] text-text-main font-medium max-w-[80px] truncate">
                      {m.fullName || m.username}
                    </span>
                    <button
                      onClick={() => onToggleMember(m)}
                      className="text-text-secondary hover:text-red-400"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {selectedMembers.length > 1 && (
                  <input
                    className="block w-full px-4 py-2.5 bg-surface-main border border-border-main rounded-xl text-text-main placeholder-text-secondary/50 focus:outline-none focus:ring-1 focus:ring-primary text-sm transition-all shadow-inner"
                    placeholder="Tên nhóm (tùy chọn)..."
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                )}
                <button
                  onClick={onCreateGroup}
                  className="w-full py-3 bg-primary hover:bg-orange-600 text-[#231810] font-bold rounded-xl shadow-lg shadow-orange-500/10 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  {selectedMembers.length === 1 ? (
                    <MessageSquare size={20} />
                  ) : (
                    <Users size={20} />
                  )}
                  {selectedMembers.length === 1
                    ? "Bắt đầu trò chuyện"
                    : `Tạo nhóm (${selectedMembers.length})`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
