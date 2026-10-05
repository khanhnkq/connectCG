import React from "react";
import { ArrowLeft, ShieldCheck, Users, Warning } from "@phosphor-icons/react";
import { Button, IconButton } from "../../../components/ui/button/Button";
import { Badge } from "../../../components/ui/badge/Badge";

/**
 * Modern Flat GroupHeader Component
 * Standards:
 * - 0px drop shadow, 0px blur
 * - 1px crisp borders
 * - Strict button exclusivity (Text-only or Icon-only)
 */
export function GroupHeader({
  group,
  isAdmin = false,
  userMembership = null,
  onNavigateBack,
  onEditGroup,
  onLeaveGroup,
  onInviteClick,
  onJoinGroup,
  onAcceptInvite,
  onDeclineInvite,
  onReportClick,
}) {
  if (!group) return null;

  const imageUrl =
    group.image ||
    "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000";

  return (
    <div className="relative w-full bg-surface-main border-b border-border-main">
      {/* Cover Banner */}
      <div className="relative w-full h-56 md:h-72 lg:h-80 overflow-hidden bg-surface-subtle">
        <img
          src={imageUrl}
          alt={group.name}
          className="w-full h-full object-cover"
        />
        {/* Flat clean gradient overlay for readability without blur */}
        <div className="absolute inset-0 bg-gradient-to-t from-background-main/90 via-background-main/30 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <IconButton
            icon={ArrowLeft}
            variant="secondary"
            size="md"
            aria-label="Quay lại"
            onClick={onNavigateBack}
            className="bg-surface-main/90 hover:bg-surface-main text-text-main border-border-main"
          />
        </div>
      </div>

      {/* Group Info Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-main tracking-tight flex items-center gap-2">
              {group.name}
              {isAdmin && (
                <ShieldCheck
                  className="size-7 text-primary shrink-0"
                  weight="fill"
                  title="Quản trị viên"
                />
              )}
            </h1>
            <div className="flex items-center gap-2">
              <Badge variant={group.privacy === "PUBLIC" ? "primary" : "default"}>
                {group.privacy === "PUBLIC" ? "Công khai" : "Riêng tư"}
              </Badge>
              <Badge variant="default">Đang hoạt động</Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-text-secondary font-medium">
            <Users size={18} className="text-primary shrink-0" />
            <span>{group.memberCount || 0} thành viên</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {isAdmin && (
            <Button variant="secondary" onClick={onEditGroup}>
              Chỉnh sửa
            </Button>
          )}

          {userMembership?.status === "ACCEPTED" ? (
            <>
              <Button variant="danger" onClick={onLeaveGroup}>
                Rời nhóm
              </Button>
              <Button variant="secondary" onClick={onInviteClick}>
                Mời bạn bè
              </Button>
            </>
          ) : userMembership?.status === "REQUESTED" ? (
            <Button variant="secondary" onClick={onLeaveGroup}>
              Hủy yêu cầu
            </Button>
          ) : userMembership?.status === "PENDING" ? (
            <>
              <Button variant="primary" onClick={onAcceptInvite}>
                Chấp nhận
              </Button>
              <Button variant="secondary" onClick={onDeclineInvite} className="hover:border-danger hover:text-danger">
                Từ chối
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={onJoinGroup}>
              {group.privacy === "PRIVATE" ? "Yêu cầu tham gia" : "Tham gia nhóm"}
            </Button>
          )}

          <IconButton
            icon={Warning}
            variant="secondary"
            size="md"
            aria-label="Báo cáo nhóm"
            onClick={onReportClick}
            className="text-amber-500 hover:text-amber-600 hover:bg-amber-500/10 border-border-main"
          />
        </div>
      </div>
    </div>
  );
}

export default GroupHeader;
