import React from "react";
import { Phone, Video, ArrowLeft, Info, UserPlus, Images } from "@phosphor-icons/react";
import { Avatar } from "../ui/avatar/Avatar";
import { IconButton } from "../ui/button/Button";

const ChatHeader = ({ activeRoom, onBack, onShowSettings, onInviteMember, onShowMediaGallery }) => {
  if (!activeRoom) return null;

  return (
    <div className="h-20 flex items-center justify-between px-4 md:px-6 bg-background-main/95 backdrop-blur-md sticky top-0 z-30 transition-colors duration-300">
      <div className="flex items-center gap-2 md:gap-4">
        <IconButton
          icon={ArrowLeft}
          variant="ghost"
          size="sm"
          aria-label="Quay lại"
          onClick={onBack}
          className="md:hidden -ml-2"
        />
        <Avatar
          src={activeRoom.avatarUrl}
          name={activeRoom.name || "Phòng chat"}
          size="md"
          status="online"
          className="cursor-pointer"
        />
        <div>
          <h3 className="text-text-main font-bold text-base flex items-center gap-2">
            {activeRoom.name || "Đang tải..."}
          </h3>
          <p className="text-text-secondary text-xs flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500 inline-block"></span>
            Đang kết nối
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-text-secondary">
        <IconButton
          icon={Phone}
          variant="ghost"
          size="md"
          aria-label="Gọi thoại (Sắp ra mắt)"
          disabled
        />
        <IconButton
          icon={Video}
          variant="ghost"
          size="md"
          aria-label="Gọi video (Sắp ra mắt)"
          disabled
        />
        <IconButton
          icon={Images}
          variant="ghost"
          size="md"
          aria-label="Xem hình ảnh đã chia sẻ"
          onClick={onShowMediaGallery}
        />
        {activeRoom.type === "GROUP" && (
          <IconButton
            icon={UserPlus}
            variant="ghost"
            size="md"
            aria-label="Thêm thành viên"
            onClick={onInviteMember}
          />
        )}
        <IconButton
          icon={Info}
          variant="ghost"
          size="md"
          aria-label="Thông tin cuộc trò chuyện"
          onClick={onShowSettings}
          className="md:hidden"
        />
      </div>
    </div>
  );
};

export default ChatHeader;
