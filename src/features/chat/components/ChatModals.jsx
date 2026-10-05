import React from "react";
import toast from "react-hot-toast";
import NewChatModal from "../../../components/chat/NewChatModal.jsx";
import InviteMemberModal from "../../../components/chat/InviteMemberModal.jsx";
import ReportModal from "../../../components/report/ReportModal";
import { ConfirmDialog } from "../../../components/ui/modal/ConfirmDialog";
import reportService from "../../../services/ReportService";

export function ChatModals({
  activeRoom,
  showNewChatModal,
  setShowNewChatModal,
  newChatMembers,
  setNewChatMembers,
  newChatGroupName,
  setNewChatGroupName,
  showReportUser,
  setShowReportUser,
  actions,
}) {
  return (
    <>
      <ConfirmDialog
        isOpen={actions.showClearConfirm}
        onClose={() => actions.setShowClearConfirm(false)}
        onConfirm={actions.handleClearHistory}
        title="Xóa lịch sử cuộc trò chuyện"
        message="Tin nhắn chỉ bị xóa ở phía bạn, thành viên khác vẫn xem được."
        type="warning"
      />
      <ConfirmDialog
        isOpen={actions.showLeaveConfirm}
        onClose={() => actions.setShowLeaveConfirm(false)}
        onConfirm={actions.handleLeaveGroup}
        title="Rời khỏi nhóm"
        message={`Bạn có chắc muốn rời khỏi nhóm "${activeRoom?.name}"?`}
        type="danger"
      />
      <ConfirmDialog
        isOpen={actions.showDeleteConfirm}
        onClose={() => actions.setShowDeleteConfirm(false)}
        onConfirm={actions.handleDeleteGroup}
        title="Giải tán nhóm"
        message={`Hành động này sẽ xóa vĩnh viễn nhóm "${activeRoom?.name}" và toàn bộ tin nhắn.`}
        type="danger"
      />
      <ConfirmDialog
        isOpen={Boolean(actions.kickMemberData)}
        onClose={() => actions.setKickMemberData(null)}
        onConfirm={actions.confirmKickMember}
        title="Xác nhận thành viên"
        message={`Bạn có chắc muốn cập nhật trạng thái của ${actions.kickMemberData?.fullName}?`}
        type="warning"
      />
      <ReportModal
        isOpen={showReportUser}
        onClose={() => setShowReportUser(false)}
        title={`Báo cáo ${activeRoom?.name || "người dùng"}`}
        subtitle="Giúp chúng tôi hiểu rõ hơn về sự việc"
        targetPayload={{
          targetType: activeRoom?.type === "GROUP" ? "GROUP" : "USER",
          targetId: activeRoom?.id,
        }}
        onSubmit={async (data) => {
          try {
            await reportService.createReport(data);
            toast.success("Đã gửi báo cáo thành công");
            setShowReportUser(false);
          } catch {
            toast.error("Gửi báo cáo thất bại");
          }
        }}
      />
      <NewChatModal
        show={showNewChatModal}
        onClose={() => {
          setShowNewChatModal(false);
          setNewChatMembers([]);
          setNewChatGroupName("");
        }}
        friends={actions.friends}
        selectedMembers={newChatMembers}
        onToggleMember={(m) =>
          setNewChatMembers((prev) =>
            prev.some((x) => x.id === m.id) ? prev.filter((x) => x.id !== m.id) : [...prev, m]
          )
        }
        onStartNewChat={async (uid) => {
          await actions.handleStartNewChat(uid);
          setShowNewChatModal(false);
        }}
        groupName={newChatGroupName}
        setGroupName={setNewChatGroupName}
        onCreateGroup={async () => {
          await actions.handleCreateGroup(newChatMembers, newChatGroupName);
          setShowNewChatModal(false);
          setNewChatMembers([]);
          setNewChatGroupName("");
        }}
      />
      <InviteMemberModal
        show={actions.showInviteModal}
        onClose={() => actions.setShowInviteModal(false)}
        friends={actions.inviteFriends}
        selectedInvitees={actions.selectedInvitees}
        onToggleInvitee={actions.toggleInvitee}
        onInvite={actions.handleInviteMember}
        activeRoomName={activeRoom?.name}
        isLoading={actions.isInviting}
      />
    </>
  );
}

export default ChatModals;
