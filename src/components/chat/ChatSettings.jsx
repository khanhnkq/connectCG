import React, { useState, useRef } from "react";
import { Camera, Pencil, Check, X, User, CaretRight as ChevronRight, UserMinus as UserX, Trash as Trash2, Flag, Info, Users, Play } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import FirebaseChatService from "../../services/chat/FirebaseChatService";
import { Avatar } from "../ui/avatar/Avatar";
import { Badge } from "../ui/badge/Badge";
import { IconButton } from "../ui/button/Button";

const ChatSettings = ({
  activeRoom,
  currentUser,
  onUpdateAvatar,
  onRenameRoom,
  onKickMember,
  setShowClearConfirm,
  setShowReportUser,
  setShowLeaveConfirm,
  setShowDeleteConfirm,
  onInviteMember,
  isOpen,
  onClose,
  onShowMediaGallery,
  onOpenLightbox,
}) => {
  const navigate = useNavigate();
  const chatAvatarInputRef = useRef(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const [previewImages, setPreviewImages] = useState([]);

  React.useEffect(() => {
    if (activeRoom?.firebaseRoomKey) {
      const minTimestamp = activeRoom?.clientClearedAt ? new Date(activeRoom.clientClearedAt).getTime() : 0;
      FirebaseChatService.getMediaMessages(activeRoom.firebaseRoomKey, 6, minTimestamp)
        .then(imgs => setPreviewImages(imgs))
        .catch(err => console.error("Error fetching preview images:", err));
    } else {
      setPreviewImages([]);
    }
  }, [activeRoom?.firebaseRoomKey, activeRoom?.clientClearedAt]);

  if (!activeRoom) {
    return (
      <aside className="hidden xl:flex w-80 flex-col bg-background-main overflow-y-auto shrink-0 z-20">
        <div className="flex-1 flex flex-col items-center justify-center text-text-secondary h-full p-8 text-center gap-3">
          <Info size={32} className="opacity-20" />
          <p className="text-xs italic">
            Chọn một cuộc trò chuyện để xem chi tiết
          </p>
        </div>
      </aside>
    );
  }

  const handleRename = () => {
    if (!tempName.trim() || tempName === activeRoom.name) {
      setIsEditingName(false);
      return;
    }
    onRenameRoom(tempName);
    setIsEditingName(false);
  };

  const isAdmin =
    activeRoom.members?.find((m) => m.id === currentUser.id)?.role === "ADMIN";

  return (
    <aside
      className={`${isOpen ? "flex" : "hidden"
        } xl:flex fixed xl:static inset-y-0 right-0 w-80 lg:w-96 xl:w-80 flex-col bg-background-main overflow-y-auto shrink-0 z-30 transition-all duration-300 shadow-2xl xl:shadow-none animate-in slide-in-from-right duration-300`}
    >
      {/* Mobile Close Button */}
      <div className="xl:hidden absolute top-4 right-4 z-10">
        <IconButton
          icon={X}
          variant="secondary"
          size="sm"
          aria-label="Đóng cài đặt"
          onClick={onClose}
        />
      </div>
      <div className="p-8 flex flex-col items-center">
        <div className="relative group/avatar mb-4">
          <Avatar
            src={activeRoom?.avatarUrl}
            name={activeRoom?.name || "Phòng chat"}
            size="2xl"
          />
          {activeRoom?.type === "GROUP" && (
            <>
              <button
                onClick={() => chatAvatarInputRef.current?.click()}
                className="absolute bottom-1 right-0 size-7 bg-primary rounded-full ring-2 ring-background-main text-white flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all shadow-md hover:scale-110 cursor-pointer"
                aria-label="Đổi ảnh đại diện nhóm"
              >
                <Camera size={14} />
              </button>
              <input
                type="file"
                ref={chatAvatarInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => onUpdateAvatar(e.target.files[0])}
              />
            </>
          )}
        </div>

        {isEditingName ? (
          <div className="flex gap-2 mb-1 w-full px-4">
            <input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="bg-surface-subtle border-0 text-text-main text-sm rounded-lg px-2 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
            />
            <button
              onClick={handleRename}
              className="text-primary flex items-center justify-center p-1 rounded hover:bg-surface-main cursor-pointer"
            >
              <Check size={18} />
            </button>
            <button
              onClick={() => setIsEditingName(false)}
              className="text-text-secondary flex items-center justify-center p-1 rounded hover:bg-surface-main cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <h2 className="text-text-main text-xl font-extrabold mb-1 text-center flex items-center gap-2 group/title">
            {activeRoom?.name || "Đang tải..."}
            {activeRoom?.type === "GROUP" && (
              <button
                onClick={() => {
                  setIsEditingName(true);
                  setTempName(activeRoom.name || "");
                }}
                className="opacity-0 group-hover/title:opacity-100 text-text-secondary hover:text-primary transition-all cursor-pointer"
              >
                <Pencil size={16} />
              </button>
            )}
          </h2>
        )}
        <Badge
          variant={activeRoom?.type === "GROUP" ? "primary" : "default"}
          size="sm"
          className="mb-4"
        >
          {activeRoom?.type === "GROUP"
            ? "Trò chuyện Nhóm"
            : "Trò chuyện Cá nhân"}
        </Badge>

        <div className="flex gap-3 w-full justify-center">
          {activeRoom?.type !== "GROUP" && (
            <button
              onClick={() =>
                navigate(`/dashboard/member/${activeRoom?.otherParticipantId}`)
              }
              className="flex flex-col items-center gap-1 group cursor-pointer"
            >
              <div className="size-10 rounded-full bg-surface-main group-hover:bg-primary group-hover:text-white flex items-center justify-center text-text-main transition-all">
                <User size={20} />
              </div>
              <span className="text-[10px] font-bold text-text-secondary group-hover:text-primary uppercase tracking-wider">
                Trang cá nhân
              </span>
            </button>
          )}

          {activeRoom?.type === "GROUP" && (
            <>
              <button
                onClick={() => setShowLeaveConfirm(true)}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="size-10 rounded-full bg-surface-main group-hover:bg-red-500/20 group-hover:text-red-500 flex items-center justify-center text-text-main transition-all">
                  <X size={20} />
                </div>
                <span className="text-[10px] font-bold text-text-secondary group-hover:text-red-500 uppercase tracking-wider">
                  Rời nhóm
                </span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                >
                  <div className="size-10 rounded-full bg-surface-main group-hover:bg-red-600/20 group-hover:text-red-600 flex items-center justify-center text-text-main transition-all">
                    <Trash2 size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-text-secondary group-hover:text-red-600 uppercase tracking-wider">
                    Giải tán
                  </span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="p-6">
        {activeRoom?.type === "GROUP" ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-text-main text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                <Users size={16} className="text-primary" />
                Thành viên ({activeRoom.members?.length || 0})
              </h3>
              <button
                onClick={onInviteMember}
                className="text-primary text-xs font-bold hover:underline cursor-pointer"
              >
                + Thêm
              </button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
              {activeRoom.members?.map((member) => (
                <div
                  key={member.id}
                  onClick={() => navigate(`/dashboard/member/${member.id}`)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-main cursor-pointer group transition-all"
                >
                  <Avatar
                    src={member.avatarUrl}
                    name={member.fullName}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-text-main text-sm font-bold truncate group-hover:text-primary transition-colors">
                      {member.fullName}
                    </p>
                    <Badge
                      variant={member.role === "ADMIN" ? "primary" : "default"}
                      size="sm"
                    >
                      {member.role === "ADMIN" ? "Quản trị viên" : "Thành viên"}
                    </Badge>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-text-secondary opacity-0 group-hover:opacity-100 transition-all"
                  />
                  {/* Kick Button for Admin */}
                  {isAdmin && member.id !== currentUser.id && (
                    <IconButton
                      icon={UserX}
                      variant="ghost"
                      size="sm"
                      aria-label="Xóa khỏi nhóm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onKickMember(member);
                      }}
                      className="text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100"
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        ) : null}

        {/* Luôn hiển thị phần Ảnh & Video cho cả Group và Direct */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-text-main text-sm font-bold uppercase tracking-wide">
              Ảnh & Video
            </h3>
            <button
              onClick={onShowMediaGallery}
              className="text-primary text-xs font-bold hover:underline cursor-pointer"
            >
              Xem tất cả
            </button>
          </div>

          {previewImages.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {previewImages.slice(0, 6).map((msg) => (
                <div
                  key={msg.id}
                  className={`aspect-square relative rounded-xl cursor-pointer hover:opacity-80 transition-opacity ${msg.type === 'video' ? 'bg-black/10' : 'bg-cover bg-center'}`}
                  style={msg.type === 'video' ? {} : { backgroundImage: `url("${msg.imageUrl}")` }}
                  onClick={() => onOpenLightbox && onOpenLightbox(msg.imageUrl, msg.type)}
                >
                  {msg.type === 'video' && (
                    <>
                      <video
                        src={msg.imageUrl}
                        className="w-full h-full object-cover rounded-xl"
                        muted
                        preload="metadata"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Play size={24} className="text-white opacity-90 drop-shadow-md" fill="white" />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-xs italic">Chưa có hình ảnh nào</p>
          )}
        </div>
      </div>

      <div className="p-5 mt-auto">
        <h3 className="text-text-main text-sm font-bold uppercase tracking-wide mb-3">
          Bảo mật & Hỗ trợ
        </h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-subtle hover:bg-surface-subtle/80 border-0 group transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3 text-text-secondary group-hover:text-text-main">
              <Trash2 size={20} />
              <span className="text-sm font-medium">Xóa lịch sử</span>
            </div>
          </button>

          <button
            onClick={() => setShowReportUser(true)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-subtle hover:bg-surface-subtle/80 border-0 group transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3 text-text-secondary group-hover:text-text-main">
              <Flag size={20} />
              <span className="text-sm font-medium">Báo cáo</span>
            </div>
            <ChevronRight size={16} className="text-text-secondary" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ChatSettings;
