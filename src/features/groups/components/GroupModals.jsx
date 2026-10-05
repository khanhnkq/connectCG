import React from "react";
import toast from "react-hot-toast";
import InviteMemberModal from "../../../components/groups/InviteMemberModal";
import TransferOwnershipModal from "../../../components/groups/TransferOwnershipModal";
import ReportModal from "../../../components/report/ReportModal";
import { ConfirmDialog } from "../../../components/ui/modal/ConfirmDialog";
import reportService from "../../../services/ReportService";

export function GroupModals({
  group,
  members = [],
  bannedMembers = [],
  authenticatedUser,
  showInviteModal,
  setShowInviteModal,
  handleInviteMembers,
  showTransferOwnershipModal,
  setShowTransferOwnershipModal,
  handleTransferOwnership,
  showReportGroup,
  setShowReportGroup,
  showTransferConfirmModal,
  setShowTransferConfirmModal,
  memberToTransfer,
  confirmTransferOwnership,
  deleteModal,
  setDeleteModal,
  confirmDelete,
  showBanModal,
  setShowBanModal,
  memberToBan,
  confirmBanMember,
  showLeaveModal,
  setShowLeaveModal,
  confirmLeaveGroup,
}) {
  return (
    <>
      <InviteMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={handleInviteMembers}
        existingMemberIds={members.map((m) => m.userId)}
        bannedUserIds={bannedMembers.map((m) => m.userId)}
      />
      <TransferOwnershipModal
        isOpen={showTransferOwnershipModal}
        onClose={() => setShowTransferOwnershipModal(false)}
        members={members}
        currentUserId={authenticatedUser?.id}
        onTransfer={handleTransferOwnership}
      />
      <ReportModal
        isOpen={showReportGroup}
        onClose={() => setShowReportGroup(false)}
        title={`Báo cáo nhóm ${group?.name || ""}`}
        subtitle="Chọn lý do báo cáo nhóm này"
        reasons={["Nội dung không phù hợp", "Spam", "Quấy rối", "Giả mạo", "Khác"]}
        targetPayload={{ targetType: "GROUP", targetId: group?.id }}
        onSubmit={async (data) => {
          try {
            await reportService.createReport(data);
            toast.success("Đã gửi báo cáo thành công");
            setShowReportGroup(false);
          } catch {
            toast.error("Gửi báo cáo thất bại");
          }
        }}
      />
      <ConfirmDialog
        isOpen={showTransferConfirmModal}
        onClose={() => setShowTransferConfirmModal(false)}
        onConfirm={confirmTransferOwnership}
        title="Chuyển quyền quản trị"
        message={`Bạn có chắc muốn chuyển quyền chủ sở hữu cho ${memberToTransfer?.fullName}?`}
        type="warning"
      />
      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, postId: null })}
        onConfirm={confirmDelete}
        title="Xóa bài viết"
        message="Hành động này không thể hoàn tác. Bạn có chắc muốn xóa bài viết?"
        type="danger"
      />
      <ConfirmDialog
        isOpen={showBanModal}
        onClose={() => setShowBanModal(false)}
        onConfirm={confirmBanMember}
        title="Cấm thành viên"
        message={`Bạn có chắc muốn cấm ${memberToBan?.fullName} khỏi nhóm vĩnh viễn?`}
        type="danger"
      />
      <ConfirmDialog
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onConfirm={confirmLeaveGroup}
        title="Rời khỏi nhóm"
        message={`Bạn có chắc muốn rời nhóm "${group?.name}"?`}
        type="danger"
      />
    </>
  );
}

export default GroupModals;
