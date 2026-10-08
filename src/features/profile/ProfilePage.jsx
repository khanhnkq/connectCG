import React from "react";
import { UserMinus } from "@phosphor-icons/react";
import toast from "react-hot-toast";

import { useProfile } from "./hooks/useProfile";
import ProfileHeader from "./components/ProfileHeader";
import ProfileTabs from "./components/ProfileTabs";
import ProfileSidebar from "./components/ProfileSidebar";
import PostComposer from "../../components/feed/PostComposer";
import PostCard from "../../components/feed/PostCard";
import ProfileAbout from "../../components/profile/ProfileAbout";
import ProfileLibrary from "../../components/profile/ProfileLibrary";
import ProfileHobbies from "../../components/profile/ProfileHobbies";
import ProfileFriends from "../../components/profile/ProfileFriends";
import ProfileEditModal from "./components/ProfileEditModal";
import ReportModal from "../../components/report/ReportModal";
import { ConfirmDialog } from "../../components/ui/modal/ConfirmDialog";
import { Button } from "../../components/ui/button/Button";
import reportService from "../../services/ReportService";

/**
 * Unified ProfilePage Component
 * Merges UserProfile (self mode) and MemberProfile (member mode) into
 * a single SRP-driven, highly maintainable page.
 *
 * @param {string} [mode="auto"] - "self" | "member" | "auto"
 * @param {string|number} [userId] - Optional explicit target userId
 */
export function ProfilePage({ mode = "auto", userId = null }) {
  const {
    profile,
    loading,
    isOwner,
    effectiveUserId,
    userAvatar,
    activeTab,
    setActiveTab,
    posts,
    loadingPosts,
    handlePostCreated,
    handleDeletePost,
    confirmDelete,
    handleUpdatePost,
    deleteModal,
    setDeleteModal,
    isUploadingAvatar,
    isUploadingCover,
    handleAvatarChange,
    handleCoverChange,
    sendFriendRequest,
    startChat,
    isEditModalOpen,
    setIsEditModalOpen,
    editFlow,
    setEditFlow,
    showReportModal,
    setShowReportModal,
    confirmDialog,
    setConfirmDialog,
    handleConfirmAction,
  } = useProfile(userId, mode);

  // Loading state
  if (loading || (!profile && isOwner)) {
    return (
      <div className="bg-background-main min-h-[60vh] flex items-center justify-center text-text-main">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-text-secondary font-bold text-sm">
            {isOwner
              ? "Đang tải hồ sơ của bạn..."
              : "Đang tải hồ sơ thành viên..."}
          </p>
        </div>
      </div>
    );
  }

  // Not found member profile
  if (!profile && !isOwner) {
    return (
      <div className="bg-background-main min-h-[60vh] flex items-center justify-center text-text-main p-6 text-center">
        <div>
          <UserMinus className="size-16 text-danger mb-4 mx-auto" />
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy thành viên</h2>
          <p className="text-text-secondary mb-6 text-sm">
            Thông tin người dùng này không khả dụng.
          </p>
          <Button variant="primary" onClick={() => window.history.back()}>
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto pb-20">
      {/* Profile Header */}
      <ProfileHeader
        profile={profile}
        isOwner={isOwner}
        onEditProfile={() => {
          setEditFlow("basic");
          setIsEditModalOpen(true);
        }}
        onOpenMediaFlow={() => {
          setEditFlow("media");
          setIsEditModalOpen(true);
        }}
        onAvatarChange={handleAvatarChange}
        onCoverChange={handleCoverChange}
        isUploadingAvatar={isUploadingAvatar}
        isUploadingCover={isUploadingCover}
        onSendFriendRequest={sendFriendRequest}
        onConfirmUnfriend={() =>
          setConfirmDialog({ isOpen: true, type: "UNFRIEND" })
        }
        onConfirmCancelRequest={() =>
          setConfirmDialog({ isOpen: true, type: "CANCEL_REQUEST" })
        }
        onConfirmAcceptRequest={() =>
          setConfirmDialog({ isOpen: true, type: "ACCEPT_REQUEST" })
        }
        onConfirmRejectRequest={() =>
          setConfirmDialog({ isOpen: true, type: "REJECT_REQUEST" })
        }
        onStartChat={startChat}
        onOpenReport={() => setShowReportModal(true)}
        onTabChange={setActiveTab}
      />

      {/* Main Content Area */}
      <div className="w-full max-w-6xl mx-auto px-4 md:px-8 mt-6">
        {/* Navigation Tabs */}
        <ProfileTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          friendsCount={profile?.friendsCount || 0}
        />

        {/* Tab Panels */}
        {activeTab === "timeline" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            {/* Left Column: Intro & Hobbies */}
            <div className="lg:col-span-5 xl:col-span-4">
              <ProfileSidebar profile={profile} isOwner={isOwner} />
            </div>

            {/* Right Column: Timeline Feed */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
              {isOwner && (
                <PostComposer
                  userAvatar={userAvatar}
                  onPostCreated={handlePostCreated}
                />
              )}

              {loadingPosts ? (
                <div className="flex justify-center p-8 bg-surface-main rounded-2xl border-0">
                  <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onDelete={isOwner ? handleDeletePost : undefined}
                    onUpdate={isOwner ? handleUpdatePost : undefined}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 text-center py-16 bg-surface-main rounded-2xl border-0">
                  <UserMinus className="size-12 text-text-muted/40" />
                  <p className="text-text-secondary italic text-sm">
                    {isOwner
                      ? "Bạn chưa có bài viết nào. Hãy chia sẻ suy nghĩ của bạn!"
                      : "Người dùng này chưa có bài viết nào."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="mt-6">
            <ProfileAbout profile={profile} isOwner={isOwner} />
          </div>
        )}

        {(activeTab === "photos" || activeTab === "library") && (
          <div className="mt-6">
            <ProfileLibrary profile={profile} isOwner={isOwner} />
          </div>
        )}

        {activeTab === "hobbies" && (
          <div className="mt-6">
            <ProfileHobbies profile={profile} isOwner={isOwner} />
          </div>
        )}

        {activeTab === "friends" && (
          <div className="mt-6">
            <ProfileFriends profile={profile} isOwner={isOwner} />
          </div>
        )}
      </div>

      {/* Owner Modals */}
      {isOwner && (
        <>
          <ProfileEditModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            profile={profile}
            initialFlow={editFlow}
          />
          <ConfirmDialog
            isOpen={deleteModal.isOpen}
            onClose={() => setDeleteModal({ isOpen: false, postId: null })}
            onConfirm={confirmDelete}
            title="Xóa bài viết"
            message="Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác."
            confirmText="Xóa"
            cancelText="Hủy"
            type="danger"
          />
        </>
      )}

      {/* Member Modals */}
      {!isOwner && (
        <>
          <ConfirmDialog
            isOpen={confirmDialog.isOpen}
            onClose={() => setConfirmDialog({ isOpen: false, type: null })}
            onConfirm={handleConfirmAction}
            title={
              confirmDialog.type === "UNFRIEND"
                ? "Hủy kết bạn"
                : confirmDialog.type === "CANCEL_REQUEST"
                ? "Hủy lời mời kết bạn"
                : confirmDialog.type === "ACCEPT_REQUEST"
                ? "Chấp nhận lời mời?"
                : "Từ chối lời mời?"
            }
            message={
              confirmDialog.type === "UNFRIEND"
                ? `Bạn có chắc muốn hủy kết bạn với ${
                    profile?.fullName || "người dùng này"
                  }?`
                : confirmDialog.type === "CANCEL_REQUEST"
                ? "Bạn có chắc chắn muốn hủy lời mời kết bạn này?"
                : confirmDialog.type === "ACCEPT_REQUEST"
                ? `Bạn muốn chấp nhận lời mời kết bạn từ ${
                    profile?.fullName || "người dùng này"
                  }?`
                : `Bạn có chắc muốn từ chối lời mời kết bạn từ ${
                    profile?.fullName || "người dùng này"
                  }?`
            }
            type={
              confirmDialog.type === "ACCEPT_REQUEST"
                ? "info"
                : confirmDialog.type === "REJECT_REQUEST"
                ? "warning"
                : "danger"
            }
            confirmText={
              confirmDialog.type === "UNFRIEND"
                ? "Hủy kết bạn"
                : confirmDialog.type === "CANCEL_REQUEST"
                ? "Hủy lời mời"
                : confirmDialog.type === "ACCEPT_REQUEST"
                ? "Chấp nhận"
                : "Từ chối"
            }
            cancelText="Hủy"
          />

          <ReportModal
            isOpen={showReportModal}
            onClose={() => setShowReportModal(false)}
            onSubmit={async (payload) => {
              const toastId = toast.loading("Đang gửi báo cáo...");
              try {
                await reportService.createReport(payload);
                toast.success("Đã gửi báo cáo thành công!", { id: toastId });
                setShowReportModal(false);
              } catch (error) {
                console.error(error);
                toast.error("Gửi báo cáo thất bại!", { id: toastId });
              }
            }}
            title="Báo cáo người dùng"
            subtitle={`Báo cáo ${profile?.fullName || "người dùng"}`}
            question="Tại sao bạn muốn báo cáo người dùng này?"
            reasons={[
              "Giả mạo người khác",
              "Tên giả hoặc không phù hợp",
              "Đăng nội dung quấy rối/bắt nạt",
              "Spam hoặc lừa đảo",
              "Ngôn từ thù ghét",
              "Khác",
            ]}
            targetPayload={{
              targetType: "USER",
              targetId: parseInt(effectiveUserId || profile?.userId),
            }}
            user={{
              avatar: profile?.currentAvatarUrl,
              name: profile?.fullName,
            }}
          />
        </>
      )}
    </div>
  );
}

export default ProfilePage;
