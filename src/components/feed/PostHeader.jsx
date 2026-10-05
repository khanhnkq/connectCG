import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { DotsThree, CheckCircle, Users, Globe, Lock, Warning, Pencil, Trash, ShareNetwork, PushPin } from "@phosphor-icons/react";
import { Avatar } from "../ui/avatar/Avatar";
import { IconButton } from "../ui/button/Button";

export default function PostHeader({
  author, timeDisplay, groupId, groupName, visibility, aiStatus,
  isPinned, canPin, currentUserId, showMenu, setShowMenu,
  onEdit, onDelete, onTogglePin, onShare, onReport,
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [setShowMenu]);

  const isOwner = currentUserId && currentUserId === author?.id;

  return (
    <div className="p-5 md:p-6 flex justify-between items-start border-b border-border-main/40 mb-3">
      <div className="flex gap-3.5 items-center">
        <Link to={`/dashboard/member/${author?.id}`} className="shrink-0">
          <Avatar src={author?.avatar} name={author?.name} size="md" className="ring-1 ring-border-main hover:ring-primary transition-all" />
        </Link>
        <div className="flex flex-col justify-center min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 min-w-0">
            <Link to={`/dashboard/member/${author?.id}`} className="text-text-main font-bold text-base hover:underline transition-colors truncate max-w-[180px] sm:max-w-[240px]">
              {author?.name}
            </Link>
            {groupId && groupName && (
              <div className="flex items-baseline gap-1 min-w-0">
                <span className="text-text-muted font-normal text-xs whitespace-nowrap">đăng ở</span>
                <Link to={`/dashboard/groups/${groupId}`} className="text-primary font-bold text-sm hover:underline transition-colors truncate max-w-[120px] sm:max-w-[180px]">
                  {groupName}
                </Link>
              </div>
            )}
            {author?.isSystem && (
              <span className="bg-primary/10 text-primary text-[10px] font-black px-1.5 py-0.5 rounded-full border border-primary/20 tracking-tight uppercase flex items-center gap-0.5">
                <CheckCircle size={10} weight="fill" /> Chính thức
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-text-muted text-xs mt-0.5">
            <span>{timeDisplay}</span>
            <span>•</span>
            {visibility === "FRIENDS" ? <Users size={13} /> : visibility === "PRIVATE" ? <Lock size={13} /> : <Globe size={13} />}
            {aiStatus && aiStatus !== "SAFE" && aiStatus !== "NOT_CHECKED" && (
              <span className="ml-1.5 px-2 py-0.5 bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-bold border border-amber-500/20 flex items-center gap-1">
                <Warning size={10} /> Đánh dấu bởi AI
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="relative" ref={menuRef}>
        <IconButton icon={DotsThree} size="sm" variant="ghost" onClick={() => setShowMenu((prev) => !prev)} aria-label="Tác vụ bài viết" />
        {showMenu && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-surface-main rounded-xl border border-border-main z-20 overflow-hidden py-1">
            {isOwner && (
              <>
                <button type="button" onClick={() => { onEdit?.(); setShowMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-text-main hover:bg-surface-subtle flex items-center gap-2.5 transition-colors cursor-pointer">
                  <Pencil size={16} /> Chỉnh sửa
                </button>
                <button type="button" onClick={() => { onDelete?.(); setShowMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-danger/10 flex items-center gap-2.5 transition-colors cursor-pointer">
                  <Trash size={16} /> Xóa bài
                </button>
              </>
            )}
            <button type="button" onClick={() => { onShare?.(); setShowMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-text-main hover:bg-surface-subtle flex items-center gap-2.5 transition-colors cursor-pointer">
              <ShareNetwork size={16} /> Chia sẻ
            </button>
            {canPin && groupId && (
              <button type="button" onClick={() => { onTogglePin?.(); setShowMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-primary hover:bg-surface-subtle flex items-center gap-2.5 font-medium transition-colors cursor-pointer">
                <PushPin size={16} weight={isPinned ? "fill" : "regular"} /> {isPinned ? "Bỏ ghim bài viết" : "Ghim bài viết"}
              </button>
            )}
            <button type="button" onClick={() => { onReport?.(); setShowMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-500/10 flex items-center gap-2.5 transition-colors cursor-pointer">
              <Warning size={16} /> Báo cáo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
