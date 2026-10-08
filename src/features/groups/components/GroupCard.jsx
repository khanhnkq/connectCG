import React from "react";
import { Link } from "react-router-dom";
import {
  Gear,
  Globe,
  Lock,
  User,
  ShieldCheck,
  UserPlus,
  Article,
} from "@phosphor-icons/react";
import { Card } from "../../../components/ui/card/Card";
import { Badge } from "../../../components/ui/badge/Badge";
import { Button } from "../../../components/ui/button/Button";

/**
 * Modern Flat GroupCard Component
 * Follows Modern Flat Design 2026:
 * - Zero drop shadow, zero blur
 * - 1px crisp border
 * - Border-free solid Badges
 * - Mutual exclusivity Buttons (Text-only or Icon-only)
 */
export const GroupCard = ({
  group,
  activeTab,
  isAdmin,
  onAccept,
  onDecline,
  onCancelRequest,
  onJoin,
  onNavigate,
}) => {
  const imageUrl =
    group.image ||
    "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000";
  const isMember = group.currentUserStatus === "ACCEPTED";
  const isPublic = group.privacy === "PUBLIC";

  return (
    <Card
      className="rounded-2xl border-0 bg-surface-main overflow-hidden flex flex-col group h-full transition-all shadow-sm hover:shadow-md"
    >
      {/* Banner / Cover */}
      <div className="relative h-44 overflow-hidden select-none bg-surface-subtle">
        <Link
          to={`/dashboard/groups/${group.id}`}
          className="absolute inset-0 z-10 block cursor-pointer"
          aria-label={`Chi tiết nhóm ${group.name}`}
        />
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url("${imageUrl}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3.5 right-3.5 flex flex-col items-end gap-1.5 z-20">
          {isAdmin && (
            <Badge
              variant="primary"
              size="sm"
              icon={ShieldCheck}
              className="rounded-lg shadow-none font-bold"
            >
              ADMIN
            </Badge>
          )}
          <Badge
            variant="default"
            size="sm"
            icon={isPublic ? Globe : Lock}
            className="rounded-lg shadow-none font-medium"
          >
            {isPublic ? "Công khai" : "Riêng tư"}
          </Badge>
        </div>

        {/* Admin Badges: Pending Requests / Pending Posts */}
        {isAdmin &&
          (group.pendingRequestsCount > 0 || group.pendingPostsCount > 0) && (
            <div className="absolute bottom-3.5 right-3.5 flex gap-1.5 z-20">
              {group.pendingRequestsCount > 0 && (
                <Badge
                  variant="danger"
                  size="sm"
                  icon={UserPlus}
                  className="rounded-lg shadow-none font-bold"
                  title={`${group.pendingRequestsCount} yêu cầu tham gia`}
                >
                  {group.pendingRequestsCount}
                </Badge>
              )}
              {group.pendingPostsCount > 0 && (
                <Badge
                  variant="primary"
                  size="sm"
                  icon={Article}
                  className="rounded-lg shadow-none font-bold"
                  title={`${group.pendingPostsCount} bài viết chờ duyệt`}
                >
                  {group.pendingPostsCount}
                </Badge>
              )}
            </div>
          )}

        {/* Group Name & Owner */}
        <div className="absolute bottom-3.5 left-4 right-4 z-20 pointer-events-none">
          <h4 className="text-white font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
            {group.name}
          </h4>
          <p className="text-white/80 text-xs font-medium flex items-center gap-1.5 mt-1">
            <User size={14} className="shrink-0 text-white/70" />
            <span className="truncate">
              {group.ownerFullName || group.ownerName || "Ẩn danh"}
            </span>
          </p>
        </div>
      </div>

      {/* Content & Action Buttons */}
      <div className="p-5 flex flex-col flex-1 bg-surface-main">
        <p className="text-text-secondary text-sm mb-5 line-clamp-2 leading-relaxed h-10">
          {group.description || "Chưa có mô tả cho nhóm này."}
        </p>

        <div className="mt-auto flex items-center gap-2.5 relative z-10 pt-2">
          {activeTab === "invites" ? (
            <>
              <Button
                variant="primary"
                size="md"
                className="flex-1 rounded-xl"
                onClick={() => onAccept?.(group.id)}
              >
                Chấp nhận
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="flex-1 rounded-xl text-danger hover:bg-danger hover:text-white border-0"
                onClick={() => onDecline?.(group.id)}
              >
                Từ chối
              </Button>
            </>
          ) : group.currentUserStatus === "REQUESTED" ? (
            <Button
              variant="secondary"
              size="md"
              className="flex-1 rounded-xl text-primary border-0"
              onClick={() => onCancelRequest?.(group.id)}
            >
              Hủy yêu cầu
            </Button>
          ) : group.currentUserStatus === "PENDING" ? (
            <Button
              variant="secondary"
              size="md"
              disabled
              className="flex-1 rounded-xl italic opacity-75"
            >
              Đang chờ
            </Button>
          ) : isMember || isAdmin ? (
            <Button
              variant="secondary"
              size="md"
              className="flex-1 rounded-xl font-bold"
              onClick={() => onNavigate?.(`/dashboard/groups/${group.id}`)}
            >
              Vào nhóm
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              className="flex-1 rounded-xl font-bold"
              onClick={() => onJoin?.(group.id)}
            >
              Tham gia
            </Button>
          )}

          {isAdmin && (
            <Button
              variant="secondary"
              size="md"
              icon={Gear}
              aria-label="Cài đặt nhóm"
              className="rounded-xl shrink-0 border-0"
              onClick={() => onNavigate?.(`/dashboard/groups/edit/${group.id}`)}
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default React.memo(GroupCard);
