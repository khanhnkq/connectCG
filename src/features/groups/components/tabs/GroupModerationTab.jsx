import React from "react";
import { CheckCircle, XCircle, ShieldCheck, UserMinus, Clock } from "@phosphor-icons/react";
import { Card } from "../../../../components/ui/card/Card";
import { Avatar } from "../../../../components/ui/avatar/Avatar";
import { Badge } from "../../../../components/ui/badge/Badge";
import { Button } from "../../../../components/ui/button/Button";

/**
 * Modern Flat GroupModerationTab Component
 */
export function GroupModerationTab({
  modTab = "Bài viết",
  onSelectModTab,
  pendingPosts = [],
  memberRequests = [],
  bannedMembers = [],
  onActionPost,
  onActionRequest,
  onUnbanMember,
}) {
  const tabs = [
    { key: "Bài viết", label: `Bài viết chờ duyệt (${pendingPosts.length})` },
    { key: "Yêu cầu", label: `Yêu cầu tham gia (${memberRequests.length})` },
    { key: "Bị cấm", label: `Thành viên bị cấm (${bannedMembers.length})` },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Sub-tabs header */}
      <div className="flex gap-2 border-b border-border-main pb-2 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = modTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onSelectModTab(tab.key)}
              className={`px-4 py-2 text-sm font-bold rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-text-secondary hover:text-text-main hover:bg-surface-subtle"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Sub-tab 1: Pending Posts */}
      {modTab === "Bài viết" && (
        <div className="space-y-4">
          {pendingPosts.length === 0 ? (
            <Card className="p-12 text-center border-border-main bg-surface-main">
              <Clock size={32} className="text-text-muted mx-auto mb-2" />
              <p className="text-sm font-medium text-text-secondary">
                Không có bài viết nào đang chờ duyệt.
              </p>
            </Card>
          ) : (
            pendingPosts.map((post) => (
              <Card
                key={post.id}
                className="p-5 border-border-main bg-surface-main space-y-4"
              >
                {/* Author & Actions header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-main">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={post.authorAvatar}
                      name={post.authorFullName || post.authorName}
                      size="md"
                      className="border border-border-main"
                    />
                    <div>
                      <h4 className="font-bold text-text-main text-sm">
                        {post.authorFullName || post.authorName}
                      </h4>
                      <p className="text-xs text-text-secondary">
                        @{post.authorName} •{" "}
                        {post.createdAt
                          ? new Date(post.createdAt).toLocaleString("vi-VN")
                          : "—"}
                      </p>
                    </div>

                    {post.aiStatus && (
                      <Badge
                        variant={post.aiStatus === "TOXIC" ? "danger" : "success"}
                        size="sm"
                      >
                        AI: {post.aiStatus}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onActionPost(post.id, "approve")}
                    >
                      Phê duyệt
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onActionPost(post.id, "reject")}
                    >
                      Từ chối
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="text-sm text-text-main leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </div>

                {/* Images */}
                {post.images && post.images.length > 0 && (
                  <div
                    className={`grid gap-2 pt-2 ${
                      post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
                    }`}
                  >
                    {post.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="Đính kèm"
                        className="w-full aspect-video object-cover rounded-xl border border-border-main"
                      />
                    ))}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}

      {/* Sub-tab 2: Member Requests */}
      {modTab === "Yêu cầu" && (
        <div className="space-y-4">
          {memberRequests.length === 0 ? (
            <Card className="p-12 text-center border-border-main bg-surface-main">
              <ShieldCheck size={32} className="text-text-muted mx-auto mb-2" />
              <p className="text-sm font-medium text-text-secondary">
                Không có yêu cầu gia nhập nào.
              </p>
            </Card>
          ) : (
            memberRequests.map((request) => (
              <Card
                key={request.userId}
                className="p-5 border-border-main bg-surface-main flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <Avatar
                    src={request.avatarUrl}
                    name={request.fullName}
                    size="lg"
                    className="border border-border-main"
                  />
                  <div>
                    <h4 className="font-bold text-text-main text-base">
                      {request.fullName}
                    </h4>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Yêu cầu gia nhập vào:{" "}
                      {request.joinedAt
                        ? new Date(request.joinedAt).toLocaleDateString("vi-VN")
                        : "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onActionRequest(request.userId, "approve")}
                  >
                    Phê duyệt
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onActionRequest(request.userId, "reject")}
                  >
                    Từ chối
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Sub-tab 3: Banned Members */}
      {modTab === "Bị cấm" && (
        <div className="space-y-4">
          {bannedMembers.length === 0 ? (
            <Card className="p-12 text-center border-border-main bg-surface-main">
              <UserMinus size={32} className="text-text-muted mx-auto mb-2" />
              <p className="text-sm font-medium text-text-secondary">
                Không có thành viên nào bị cấm.
              </p>
            </Card>
          ) : (
            bannedMembers.map((member) => (
              <Card
                key={member.userId}
                className="p-5 border-border-main bg-surface-main flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <Avatar
                    src={member.avatarUrl}
                    name={member.fullName}
                    size="lg"
                    className="border border-border-main opacity-60 grayscale"
                  />
                  <div>
                    <h4 className="font-bold text-text-main text-base">
                      {member.fullName}
                    </h4>
                    <Badge variant="danger" size="sm" className="mt-1">
                      Đã bị cấm khỏi nhóm
                    </Badge>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onUnbanMember(member.userId)}
                >
                  Gỡ lệnh cấm
                </Button>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default GroupModerationTab;
