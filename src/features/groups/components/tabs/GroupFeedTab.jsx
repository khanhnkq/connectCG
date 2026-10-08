import React from "react";
import { Lock, Globe, Calendar, ChatsCircle, Article } from "@phosphor-icons/react";
import PostComposer from "../../../../components/feed/PostComposer";
import PostCard from "../../../../components/feed/PostCard";
import { Button } from "../../../../components/ui/button/Button";
import { Card } from "../../../../components/ui/card/Card";

/**
 * Modern Flat GroupFeedTab Component
 */
export function GroupFeedTab({
  group,
  userMembership,
  isAdmin,
  posts = [],
  currentUserProfile,
  onPostCreated,
  onDeletePost,
  onUpdatePost,
  onJoinGroup,
}) {
  const isPrivateLocked =
    group.privacy === "PRIVATE" &&
    userMembership?.status !== "ACCEPTED" &&
    !isAdmin;

  if (isPrivateLocked) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <Card className="p-8 text-center space-y-5 border-0 bg-surface-main">
          <div className="size-16 rounded-2xl bg-amber-500/10 border-0 text-amber-500 flex items-center justify-center mx-auto">
            <Lock size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-text-main">
              Đây là nhóm Riêng tư
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed max-w-md mx-auto">
              {userMembership?.status === "PENDING"
                ? "Bạn đã nhận được lời mời tham gia nhóm này. Vui lòng phản hồi lời mời ở phía trên để xem nội dung."
                : userMembership?.status === "REQUESTED"
                ? "Yêu cầu gia nhập của bạn đang chờ quản trị viên phê duyệt. Nội dung sẽ hiển thị sau khi yêu cầu được chấp nhận."
                : "Nội dung và danh sách bài viết của nhóm này chỉ dành riêng cho thành viên chính thức."}
            </p>
          </div>
          {!userMembership?.status && (
            <div className="pt-2">
              <Button variant="primary" onClick={onJoinGroup}>
                Gửi yêu cầu gia nhập
              </Button>
            </div>
          )}
        </Card>
      </div>
    );
  }

  const isAcceptedMember = userMembership?.status === "ACCEPTED";
  const userAvatar =
    currentUserProfile?.currentAvatarUrl ||
    currentUserProfile?.avatarUrl ||
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Feed Column */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {isAcceptedMember ? (
          <PostComposer
            userAvatar={userAvatar}
            groupId={group.id}
            onPostCreated={onPostCreated}
          />
        ) : (
          <Card className="p-6 border-0 bg-surface-main">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 border-0 text-primary flex items-center justify-center shrink-0">
                  <ChatsCircle size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-text-main text-sm">
                    Tham gia thảo luận
                  </h4>
                  <p className="text-xs text-text-secondary">
                    Gia nhập nhóm để có thể đăng bài viết và chia sẻ cùng cộng đồng.
                  </p>
                </div>
              </div>
              <Button variant="primary" size="sm" onClick={onJoinGroup}>
                Tham gia ngay
              </Button>
            </div>
          </Card>
        )}

        {/* Posts List */}
        <div className="flex flex-col gap-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={onDeletePost}
                onUpdate={onUpdatePost}
                isAdmin={isAdmin}
              />
            ))
          ) : (
            <Card className="p-12 text-center border-0 bg-surface-main">
              <div className="size-14 rounded-2xl bg-surface-subtle border-0 flex items-center justify-center text-text-muted mx-auto mb-3">
                <Article size={28} />
              </div>
              <h4 className="font-bold text-text-main text-sm">
                Chưa có bài viết nào
              </h4>
              <p className="text-xs text-text-secondary mt-1">
                Hãy là người đầu tiên chia sẻ thông tin hoặc thảo luận trong nhóm này.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Side Info Column */}
      <div className="hidden lg:flex flex-col gap-6">
        <Card className="p-6 border-0 bg-surface-main sticky top-20">
          <h3 className="text-base font-bold text-text-main mb-3">
            Giới thiệu về nhóm
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed mb-5">
            {group.description || "Chưa có mô tả cho nhóm này."}
          </p>

          <div className="space-y-3 pt-3">
            <div className="flex items-center gap-3 text-xs text-text-secondary">
              <Globe size={16} className="text-primary shrink-0" />
              <span>
                Quyền riêng tư:{" "}
                <strong className="text-text-main font-semibold">
                  {group.privacy === "PUBLIC" ? "Công khai" : "Riêng tư"}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-text-secondary">
              <Calendar size={16} className="text-primary shrink-0" />
              <span>
                Ngày tạo:{" "}
                <strong className="text-text-main font-semibold">
                  {group.createdAt
                    ? new Date(group.createdAt).toLocaleDateString("vi-VN")
                    : "—"}
                </strong>
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default GroupFeedTab;
