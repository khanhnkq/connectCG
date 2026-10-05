import React from "react";
import { Key, Gavel, Users } from "@phosphor-icons/react";
import { Card } from "../../../../components/ui/card/Card";
import { Avatar } from "../../../../components/ui/avatar/Avatar";
import { Badge } from "../../../../components/ui/badge/Badge";
import { IconButton } from "../../../../components/ui/button/Button";

/**
 * Modern Flat GroupMembersTab Component
 */
export function GroupMembersTab({
  members = [],
  currentUserId,
  ownerId,
  isAdmin = false,
  onTransferOwnership,
  onBanMember,
}) {
  const isOwner = Number(currentUserId) === Number(ownerId);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header Summary */}
      <div className="flex justify-between items-center px-1">
        <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
          <Users size={20} className="text-primary" />
          <span>Danh sách thành viên</span>
        </h3>
        <Badge variant="default">{members.length} thành viên</Badge>
      </div>

      {/* Member List Card */}
      <Card className="border-border-main bg-surface-main overflow-hidden divide-y divide-border-main p-0">
        {members.length > 0 ? (
          members.map((member) => {
            const isSelf = Number(member.userId) === Number(currentUserId);
            const canOwnerManage = isOwner && !isSelf;
            const canAdminManage =
              isAdmin &&
              !isOwner &&
              member.role === "MEMBER" &&
              !isSelf;

            return (
              <div
                key={member.userId}
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-surface-subtle transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <Avatar
                    src={member.avatarUrl}
                    name={member.fullName || member.username}
                    size="md"
                    className="border border-border-main"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-main text-sm">
                        {member.fullName || member.username}
                      </span>
                      <Badge
                        variant={
                          member.role === "OWNER"
                            ? "primary"
                            : member.role === "ADMIN"
                            ? "warning"
                            : "default"
                        }
                        size="sm"
                      >
                        {member.role === "OWNER"
                          ? "Chủ nhóm"
                          : member.role === "ADMIN"
                          ? "Quản trị viên"
                          : "Thành viên"}
                      </Badge>
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Đã gia nhập:{" "}
                      {member.joinedAt
                        ? new Date(member.joinedAt).toLocaleDateString("vi-VN")
                        : "—"}
                    </p>
                  </div>
                </div>

                {/* Member Management Actions */}
                <div className="flex items-center gap-1.5">
                  {canOwnerManage && (
                    <IconButton
                      icon={Key}
                      variant="secondary"
                      size="sm"
                      aria-label="Chuyển nhượng quyền sở hữu"
                      onClick={() => onTransferOwnership?.(member)}
                      className="text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
                    />
                  )}

                  {(canOwnerManage || canAdminManage) && (
                    <IconButton
                      icon={Gavel}
                      variant="secondary"
                      size="sm"
                      aria-label="Cấm khỏi nhóm"
                      onClick={() => onBanMember?.(member)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    />
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-text-secondary text-sm">
            Chưa có thành viên nào trong nhóm.
          </div>
        )}
      </Card>
    </div>
  );
}

export default GroupMembersTab;
