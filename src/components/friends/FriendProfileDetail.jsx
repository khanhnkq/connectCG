import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AddressBook,
  WarningCircle,
  ArrowLeft,
  Sparkle,
  Users,
  ChatCircleDots,
  User,
  UserMinus,
  CheckCircle,
  XCircle,
  UserPlus,
  EyeSlash,
  LockKey,
} from "@phosphor-icons/react";
import ProfileNavbar from "../profile/ProfileNavbar";
import ProfileAbout from "../profile/ProfileAbout";
import ProfilePhotos from "../profile/ProfilePhotos";
import ProfileHobbies from "../profile/ProfileHobbies";
import ProfileFriends from "../profile/ProfileFriends";
import ConfirmModal from "../common/ConfirmModal";

export default function FriendProfileDetail({
  activeItem,
  fullProfile,
  isProfileLoading,
  activeProfileTab,
  setActiveProfileTab,
  setActiveItem,
  viewMode,
  onStartChat,
  onUnfriend,
  onAddFriend,
  onAcceptRequest,
  onRejectRequest,
  onDismissSuggestion,
}) {
  const navigate = useNavigate();

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "danger",
    title: "",
    message: "",
    onConfirm: null,
  });

  const closeModal = () => {
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  const handleUnfriendClick = () => {
    setConfirmModal({
      isOpen: true,
      type: "warning",
      title: "Hủy kết bạn?",
      message: `Bạn có chắc muốn hủy kết bạn với ${
        fullProfile.fullName || fullProfile.name
      }? Bạn sẽ cần gửi lời mời lại nếu muốn kết bạn.`,
      onConfirm: () => {
        onUnfriend(fullProfile.userId || fullProfile.id);
        closeModal();
      },
    });
  };

  const handleRejectClick = () => {
    setConfirmModal({
      isOpen: true,
      type: "warning",
      title: "Từ chối lời mời?",
      message: `Bạn có chắc muốn từ chối lời mời kết bạn từ ${
        activeItem.senderFullName || activeItem.senderUsername
      }?`,
      onConfirm: () => {
        onRejectRequest(activeItem);
        closeModal();
      },
    });
  };

  const handleDismissClick = () => {
    setConfirmModal({
      isOpen: true,
      type: "info",
      title: "Ẩn gợi ý?",
      message: `Bạn sẽ không thấy ${
        fullProfile.fullName || fullProfile.name
      } trong danh sách gợi ý nữa.`,
      onConfirm: () => {
        onDismissSuggestion(fullProfile.userId || fullProfile.id);
        closeModal();
      },
    });
  };

  const handleAddFriendClick = () => {
    setConfirmModal({
      isOpen: true,
      type: "info",
      title: "Gửi lời mời kết bạn?",
      message: `Bạn muốn gửi lời mời kết bạn đến ${
        fullProfile.fullName || fullProfile.name
      }?`,
      onConfirm: () => {
        onAddFriend(fullProfile.userId || fullProfile.id);
        closeModal();
      },
    });
  };

  const handleAcceptClick = () => {
    setConfirmModal({
      isOpen: true,
      type: "info",
      title: "Chấp nhận lời mời?",
      message: `Bạn muốn chấp nhận lời mời kết bạn từ ${
        activeItem.senderFullName || activeItem.senderUsername
      }?`,
      onConfirm: () => {
        onAcceptRequest(activeItem);
        closeModal();
      },
    });
  };

  if (!activeItem) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-text-secondary gap-6 p-8 text-center bg-gradient-to-br from-background-main to-surface-main">
        <div className="size-32 rounded-full bg-gradient-to-br from-surface-main to-background-main border-0 flex items-center justify-center mb-2 shadow-2xl">
          <AddressBook size={56} className="opacity-20 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text-main mb-3">
            Thông tin chi tiết
          </h2>
          <p className="text-sm max-w-md mx-auto text-text-secondary/80 leading-relaxed">
            Chọn một người từ danh sách bên trái để xem hồ sơ chi tiết và thực
            hiện các hành động.
          </p>
        </div>
      </div>
    );
  }

  if (isProfileLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-5 bg-gradient-to-br from-background-main to-surface-main">
        <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center">
          <p className="text-text-main font-medium text-lg animate-pulse">
            Đang tải hồ sơ...
          </p>
          <p className="text-text-secondary text-sm mt-1">Vui lòng đợi</p>
        </div>
      </div>
    );
  }

  if (!fullProfile) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-background-main to-surface-main">
        <div className="text-center">
          <WarningCircle size={48} className="text-text-secondary/20 mb-3 mx-auto" />
          <p className="text-text-secondary">Không có dữ liệu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-background-main">
      {/* Cover Photo with Gradient Overlay */}
      <div className="h-56 w-full relative group overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundImage: `url("${
              fullProfile.currentCoverUrl ||
              "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80"
            }")`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-background-main"></div>

        {/* Back Button */}
        <button
          onClick={() => setActiveItem(null)}
          className="xl:hidden absolute top-4 left-4 p-2.5 bg-black/50 hover:bg-black/70 rounded-xl text-white backdrop-blur-md transition-all z-10 shadow-lg border-0"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Profile Info Section */}
      <div className="px-6 md:px-8 pb-8 -mt-20 relative">
        {/* Avatar & Name */}
        <div className="flex flex-col items-center">
          <div className="size-32 md:size-36 rounded-2xl bg-gradient-to-br from-surface-main to-background-main p-1.5 ring-4 ring-background-main shadow-2xl mb-4 relative z-10 group">
            <div
              className="w-full h-full rounded-xl bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
              style={{
                backgroundImage: `url("${
                  fullProfile.currentAvatarUrl ||
                  fullProfile.image ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }")`,
              }}
            ></div>
          </div>

          <h1 className="text-3xl font-extrabold text-white text-center mb-1">
            {fullProfile.fullName || fullProfile.name}
          </h1>
          <p className="text-text-secondary font-medium text-base mb-3">
            @{fullProfile.username}
          </p>

          {/* Suggestion Badge */}
          {fullProfile.type === "SUGGESTION" && (
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-xl border-0 backdrop-blur-sm">
              <Sparkle size={18} weight="fill" />
              <span>{fullProfile.reason}</span>
            </div>
          )}

          {/* Quick Stats */}
          {fullProfile.friendsCount > 0 && (
            <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-surface-subtle rounded-xl border-0">
              <Users size={20} className="text-primary" />
              <span className="text-white font-medium text-sm">
                {fullProfile.friendsCount} bạn bè
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {viewMode === "ALL" ? (
            <>
              <button
                onClick={() =>
                  onStartChat(fullProfile.userId || fullProfile.id)
                }
                className="px-6 py-3 bg-primary hover:bg-orange-600 text-[#231810] font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2 hover:scale-105 border-0"
              >
                <ChatCircleDots size={20} weight="fill" />
                Nhắn tin
              </button>
              <button
                onClick={() =>
                  navigate(
                    `/dashboard/member/${fullProfile.userId || fullProfile.id}`,
                  )
                }
                className="px-6 py-3 bg-surface-subtle hover:bg-surface-subtle/80 text-text-main font-bold rounded-xl border-0 transition-all flex items-center gap-2"
                title="Xem hồ sơ đầy đủ"
              >
                <User size={20} />
                Xem hồ sơ
              </button>
              <button
                onClick={handleUnfriendClick}
                className="px-4 py-3 bg-surface-subtle hover:bg-red-500/20 hover:text-red-500 text-text-secondary font-bold rounded-xl border-0 transition-all"
                title="Hủy kết bạn"
              >
                <UserMinus size={20} />
              </button>
            </>
          ) : viewMode === "REQUESTS" ? (
            <>
              <button
                onClick={handleAcceptClick}
                className="px-8 py-3 bg-primary hover:bg-orange-600 text-[#231810] font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2 hover:scale-105 border-0"
              >
                <CheckCircle size={20} weight="fill" />
                Chấp nhận
              </button>
              <button
                onClick={handleRejectClick}
                className="px-8 py-3 bg-surface-subtle hover:bg-red-500/20 hover:text-red-500 text-text-secondary font-bold rounded-xl border-0 transition-all flex items-center gap-2"
              >
                <XCircle size={20} weight="fill" />
                Từ chối
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleAddFriendClick}
                className="px-8 py-3 bg-primary hover:bg-orange-600 text-[#231810] font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2 hover:scale-105 border-0"
              >
                <UserPlus size={20} weight="fill" />
                Kết bạn
              </button>
              {viewMode === "SUGGESTIONS" && onDismissSuggestion && (
                <button
                  onClick={handleDismissClick}
                  className="px-6 py-3 bg-surface-subtle hover:bg-surface-subtle/80 text-text-secondary hover:text-white font-bold rounded-xl border-0 transition-all flex items-center gap-2"
                  title="Ẩn gợi ý này"
                >
                  <EyeSlash size={20} />
                  Ẩn
                </button>
              )}
            </>
          )}
        </div>

        {/* Profile Tabs */}
        <div className="mt-10">
          <ProfileNavbar
            activeTab={activeProfileTab}
            setActiveTab={setActiveProfileTab}
            friendsCount={fullProfile.friendsCount}
          />

          <div className="mt-6">
            {activeProfileTab === "timeline" && (
              <div className="text-center py-16 bg-surface-subtle rounded-2xl border-0">
                <div className="size-16 rounded-full bg-surface-main border-0 flex items-center justify-center mx-auto mb-4">
                  <LockKey size={32} className="opacity-30 text-primary" />
                </div>
                <p className="text-text-secondary text-sm mb-4">
                  Bài viết được hiển thị ở trang cá nhân chính.
                </p>
                <button
                  onClick={() =>
                    navigate(
                      `/dashboard/member/${
                        fullProfile.userId || fullProfile.id
                      }`,
                    )
                  }
                  className="px-6 py-2.5 bg-primary hover:bg-orange-600 text-[#231810] font-bold rounded-xl transition-all"
                >
                  Đi tới trang cá nhân
                </button>
              </div>
            )}
            {activeProfileTab === "about" && (
              <ProfileAbout profile={fullProfile} isOwner={false} />
            )}
            {activeProfileTab === "photos" && (
              <ProfilePhotos profile={fullProfile} isOwner={false} />
            )}
            {activeProfileTab === "hobbies" && (
              <ProfileHobbies profile={fullProfile} isOwner={false} />
            )}
            {activeProfileTab === "friends" && (
              <ProfileFriends profile={fullProfile} isOwner={false} />
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        type={confirmModal.type}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onClose={closeModal}
        confirmText="Xác nhận"
        cancelText="Hủy"
      />
    </div>
  );
}
