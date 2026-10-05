import React, { useRef } from "react";
import { Camera, Warning } from "@phosphor-icons/react";
import { Button } from "../../../components/ui/button/Button";

/**
 * Modern Flat ProfileHeader Component
 * Displays Cover Photo, Avatar with Status Dot, User Stats, and Contextual Action Controls.
 * Strict Mutual Exclusivity: Text-only or Icon-only buttons. Zero blur, zero drop-shadow.
 */
export function ProfileHeader({
  profile,
  isOwner = false,
  onEditProfile,
  onAvatarChange,
  onCoverChange,
  isUploadingAvatar = false,
  isUploadingCover = false,
  onSendFriendRequest,
  onConfirmUnfriend,
  onConfirmCancelRequest,
  onConfirmAcceptRequest,
  onConfirmRejectRequest,
  onStartChat,
  onOpenReport,
  onTabChange,
}) {
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onAvatarChange?.(file);
    }
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  const handleCoverFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onCoverChange?.(file);
    }
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const defaultCover =
    "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80";
  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const coverUrl = profile?.currentCoverUrl || defaultCover;
  const avatarUrl =
    profile?.currentAvatarUrl ||
    profile?.avatar ||
    profile?.avatarUrl ||
    defaultAvatar;

  const cityName =
    profile?.city?.name || profile?.cityName || "Vị trí chưa cập nhật";
  const displayName = profile?.fullName || profile?.username || "Người dùng";

  return (
    <div className="bg-surface-main border-b border-border-main">
      <div className="w-full max-w-6xl mx-auto">
        {/* Cover Photo */}
        <div className="relative w-full h-64 md:h-80 lg:h-96 group overflow-hidden rounded-b-3xl bg-surface-subtle">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
            style={{ backgroundImage: `url("${coverUrl}")` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Owner Cover Photo Upload Controls */}
          {isOwner && (
            <>
              <input
                type="file"
                ref={coverInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleCoverFile}
              />
              <div className="absolute bottom-4 right-4 z-20">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={isUploadingCover}
                  isLoading={isUploadingCover}
                  className="bg-black/60 hover:bg-black/80 text-white border-white/20"
                >
                  {isUploadingCover ? "Đang tải lên..." : "Thay đổi ảnh bìa"}
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Profile Info & Actions Bar */}
        <div className="px-4 md:px-8 pb-4 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 md:-mt-12 gap-6 relative z-10 mb-6">
            {/* Avatar Section */}
            <div className="relative shrink-0">
              <div className="size-32 md:size-44 rounded-full border-4 border-surface-main bg-background-main p-1 relative group overflow-hidden">
                <div
                  className="w-full h-full rounded-full bg-cover bg-center transition-opacity"
                  style={{ backgroundImage: `url("${avatarUrl}")` }}
                />

                {isOwner && (
                  <>
                    <input
                      type="file"
                      ref={avatarInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarFile}
                    />
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                      aria-label="Thay đổi ảnh đại diện"
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white disabled:opacity-100"
                    >
                      <Camera size={32} />
                    </button>
                    {isUploadingAvatar && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full z-10">
                        <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Online Status Dot */}
              <div
                className="absolute bottom-2 md:bottom-4 right-2 md:right-4 size-5 md:size-6 bg-emerald-500 border-4 border-surface-main rounded-full"
                title="Đang hoạt động"
              />
            </div>

            {/* Details & Action Buttons */}
            <div className="flex-1 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div className="mb-2 md:mb-4">
                <h1 className="text-3xl md:text-4xl font-extrabold text-text-main tracking-tight mb-1">
                  {displayName}
                </h1>
                <p className="text-text-secondary font-medium text-sm flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500 inline-block" />
                  <span>Đang hoạt động</span>
                  <span className="text-text-secondary/50">•</span>
                  <span className="text-text-secondary/80">{cityName}</span>
                </p>

                {/* Stats */}
                <div className="flex gap-4 mt-3 text-sm text-text-secondary">
                  <button
                    type="button"
                    onClick={() => onTabChange?.("friends")}
                    className="cursor-pointer hover:underline text-left"
                  >
                    <strong className="text-text-main font-bold">
                      {profile?.friendsCount || 0}
                    </strong>{" "}
                    Bạn bè
                  </button>
                  <button
                    type="button"
                    onClick={() => onTabChange?.("timeline")}
                    className="cursor-pointer hover:underline text-left"
                  >
                    <strong className="text-text-main font-bold">
                      {profile?.postsCount || 0}
                    </strong>{" "}
                    Bài viết
                  </button>
                </div>
              </div>

              {/* Action Buttons with Strict Mutual Exclusivity */}
              <div className="flex flex-wrap items-center gap-2.5 mb-4 w-full md:w-auto">
                {isOwner ? (
                  <Button
                    variant="primary"
                    onClick={onEditProfile}
                    className="flex-1 md:flex-none"
                  >
                    Chỉnh sửa hồ sơ
                  </Button>
                ) : (
                  <>
                    {/* Relationship action */}
                    {profile?.relationshipStatus === "FRIEND" ? (
                      <Button
                        variant="outline"
                        onClick={onConfirmUnfriend}
                        title="Click để hủy kết bạn"
                        className="flex-1 md:flex-none hover:border-danger hover:text-danger"
                      >
                        Đã là bạn bè
                      </Button>
                    ) : profile?.relationshipStatus === "WAITING" ||
                      (profile?.relationshipStatus === "PENDING" &&
                        profile?.isRequestReceiver) ? (
                      <div className="flex gap-2 flex-1 md:flex-none">
                        <Button
                          variant="primary"
                          onClick={onConfirmAcceptRequest}
                        >
                          Chấp nhận
                        </Button>
                        <Button
                          variant="outline"
                          onClick={onConfirmRejectRequest}
                          className="hover:border-danger hover:text-danger"
                        >
                          Từ chối
                        </Button>
                      </div>
                    ) : profile?.relationshipStatus === "PENDING" ? (
                      <Button
                        variant="outline"
                        onClick={onConfirmCancelRequest}
                        className="flex-1 md:flex-none"
                      >
                        Thu hồi lời mời
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={onSendFriendRequest}
                        className="flex-1 md:flex-none"
                      >
                        Kết bạn
                      </Button>
                    )}

                    {/* Chat button */}
                    <Button
                      variant="secondary"
                      onClick={onStartChat}
                      className="flex-1 md:flex-none"
                    >
                      Nhắn tin
                    </Button>

                    {/* Report icon button */}
                    <Button
                      icon={Warning}
                      variant="outline"
                      size="icon"
                      aria-label="Báo cáo người dùng"
                      onClick={onOpenReport}
                      title="Báo cáo người dùng"
                      className="hover:border-danger hover:text-danger"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
