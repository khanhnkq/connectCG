import React from "react";
import { X, MagnifyingGlass as Search, PaperPlaneTilt as Send, UserMinus as UserX } from "@phosphor-icons/react";
import { Avatar } from "../ui/avatar/Avatar";
import { Button, IconButton } from "../ui/button/Button";
import { Input } from "../ui/input/Input";

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
      <div className="bg-surface-main w-full max-w-md rounded-2xl border border-border-main shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-border-main flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-main">Tin nhắn mới</h2>
          <IconButton
            icon={X}
            variant="ghost"
            size="sm"
            aria-label="Đóng"
            onClick={onClose}
          />
        </div>

        <div className="p-5">
          <div className="mb-4">
            <Input
              leftIcon={Search}
              placeholder="Tìm kiếm bạn bè..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2 max-h-[30vh] overflow-y-auto custom-scrollbar pr-1">
            {friends.length > 0 ? (
              friends.map((friend) => (
                <div
                  key={friend.id}
                  onClick={() => onToggleMember(friend)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${
                    selectedMembers.some((m) => m.id === friend.id)
                      ? "bg-primary/10 border-primary/50 shadow-sm"
                      : "bg-surface-main border-border-main hover:bg-background-main hover:border-primary/30"
                  }`}
                >
                  <div className="relative shrink-0">
                    <Avatar
                      src={friend.avatarUrl}
                      name={friend.fullName || friend.username}
                      size="md"
                    />
                    {selectedMembers.some((m) => m.id === friend.id) && (
                      <div className="absolute -top-1 -right-1 size-4.5 bg-primary rounded-full flex items-center justify-center border-2 border-surface-main animate-in zoom-in text-white">
                        <X size={10} weight="bold" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-main font-bold text-sm group-hover:text-primary transition-colors truncate">
                      {friend.fullName || friend.username}
                    </p>
                    <p className="text-text-secondary text-xs truncate">
                      @{friend.username}
                    </p>
                  </div>
                  {!selectedMembers.length && (
                    <IconButton
                      icon={Send}
                      variant="ghost"
                      size="sm"
                      aria-label="Nhắn tin"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartNewChat(friend.id);
                      }}
                      className="text-text-secondary group-hover:text-primary transition-all opacity-0 group-hover:opacity-100"
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-text-secondary flex flex-col items-center gap-2">
                <UserX size={40} className="opacity-20" />
                <p className="text-xs italic">Không tìm thấy bạn bè nào</p>
              </div>
            )}
          </div>

          {selectedMembers.length > 0 && (
            <div className="mt-5 pt-4 border-t border-border-main space-y-4 animate-in slide-in-from-bottom-2 duration-200">
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-1">
                {selectedMembers.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-2 bg-background-main pl-1 pr-2 py-1 rounded-full border border-primary/20"
                  >
                    <Avatar
                      src={m.avatarUrl}
                      name={m.fullName || m.username}
                      size="xs"
                    />
                    <span className="text-xs text-text-main font-medium max-w-[80px] truncate">
                      {m.fullName || m.username}
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleMember(m)}
                      className="text-text-secondary hover:text-red-400 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {selectedMembers.length > 1 && (
                  <Input
                    placeholder="Tên nhóm (tùy chọn)..."
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                )}
                <Button
                  variant="primary"
                  size="md"
                  onClick={onCreateGroup}
                  className="w-full"
                >
                  {selectedMembers.length === 1
                    ? "Bắt đầu trò chuyện"
                    : `Tạo nhóm (${selectedMembers.length})`}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
