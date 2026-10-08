import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGroupDetail } from "./hooks/useGroupDetail";
import { GroupHeader } from "./components/GroupHeader";
import { GroupFeedTab } from "./components/tabs/GroupFeedTab";
import { GroupMembersTab } from "./components/tabs/GroupMembersTab";
import { GroupModerationTab } from "./components/tabs/GroupModerationTab";
import { GroupModals } from "./components/GroupModals";
import { Tabs } from "../../components/ui/tabs/Tabs";
import { Card } from "../../components/ui/card/Card";

/**
 * Modern Flat GroupDetailPage (< 150 lines)
 * SOLID Orchestrator for Group feature
 */
export function GroupDetailPage({ groupId }) {
  const navigate = useNavigate();
  const authenticatedUser = useSelector((state) => state.auth?.user);
  const currentUserProfile = useSelector((state) => state.user?.profile);

  const groupData = useGroupDetail(groupId);
  const {
    group,
    loading,
    isAdmin,
    activeTab,
    setActiveTab,
    modTab,
    setModTab,
    userMembership,
    members,
    memberRequests,
    bannedMembers,
    pendingPosts,
    approvedPosts,
    deleteModal,
    setDeleteModal,
    handleDeletePost,
    handleUpdatePost,
    confirmDelete,
    showReportGroup,
    setShowReportGroup,
    showInviteModal,
    setShowInviteModal,
    showBanModal,
    setShowBanModal,
    showLeaveModal,
    setShowLeaveModal,
    showTransferOwnershipModal,
    setShowTransferOwnershipModal,
    showTransferConfirmModal,
    setShowTransferConfirmModal,
    memberToBan,
    memberToTransfer,
    handleLeaveGroup,
    confirmLeaveGroup,
    handleTransferOwnership,
    handleInviteMembers,
    handleJoinGroup,
    handleAcceptInvite,
    handleDeclineInvite,
    handleBanMember,
    confirmBanMember,
    handleUnbanMember,
    confirmTransferOwnership,
    handleActionPost,
    handleActionRequest,
    handlePostCreated,
  } = groupData;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="size-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!group) return null;

  const totalModPending = pendingPosts.length + memberRequests.length + bannedMembers.length;
  const canViewTabs = group.privacy === "PUBLIC" || userMembership?.status === "ACCEPTED" || isAdmin;

  return (
    <div className="w-full pb-16">
      <GroupHeader
        group={group}
        isAdmin={isAdmin}
        userMembership={userMembership}
        onNavigateBack={() => navigate("/dashboard/groups")}
        onEditGroup={() => navigate(`/dashboard/groups/edit/${group.id}`)}
        onLeaveGroup={handleLeaveGroup}
        onInviteClick={() => setShowInviteModal(true)}
        onJoinGroup={handleJoinGroup}
        onAcceptInvite={handleAcceptInvite}
        onDeclineInvite={handleDeclineInvite}
        onReportClick={() => setShowReportGroup(true)}
      />

      {/* Tabs navigation */}
      <div className="border-0 bg-surface-main sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List className="w-fit">
              {canViewTabs && (
                <>
                  <Tabs.Trigger value="Bản tin">Bản tin</Tabs.Trigger>
                  <Tabs.Trigger value="Thành viên">Thành viên</Tabs.Trigger>
                  <Tabs.Trigger value="Ảnh">Ảnh</Tabs.Trigger>
                  <Tabs.Trigger value="Sự kiện">Sự kiện</Tabs.Trigger>
                </>
              )}
              {isAdmin && (
                <Tabs.Trigger value="Kiểm duyệt" badge={totalModPending || undefined}>
                  Kiểm duyệt
                </Tabs.Trigger>
              )}
            </Tabs.List>
          </Tabs>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === "Bản tin" && (
          <GroupFeedTab
            group={group}
            userMembership={userMembership}
            isAdmin={isAdmin}
            posts={approvedPosts}
            currentUserProfile={currentUserProfile}
            onPostCreated={handlePostCreated}
            onDeletePost={handleDeletePost}
            onUpdatePost={handleUpdatePost}
            onJoinGroup={handleJoinGroup}
          />
        )}

        {activeTab === "Thành viên" && (
          <GroupMembersTab
            members={members}
            currentUserId={authenticatedUser?.id}
            ownerId={group.ownerId}
            isAdmin={isAdmin}
            onTransferOwnership={(member) => handleTransferOwnership(member.userId)}
            onBanMember={handleBanMember}
          />
        )}

        {activeTab === "Kiểm duyệt" && isAdmin && (
          <GroupModerationTab
            modTab={modTab}
            onSelectModTab={setModTab}
            pendingPosts={pendingPosts}
            memberRequests={memberRequests}
            bannedMembers={bannedMembers}
            onActionPost={handleActionPost}
            onActionRequest={handleActionRequest}
            onUnbanMember={handleUnbanMember}
          />
        )}

        {(activeTab === "Ảnh" || activeTab === "Sự kiện") && (
          <div className="max-w-md mx-auto py-12">
            <Card className="p-8 text-center border-0 bg-surface-main shadow-sm">
              <h4 className="font-bold text-text-main text-sm">Tính năng đang hoàn thiện</h4>
              <p className="text-xs text-text-secondary mt-1">
                Khu vực {activeTab.toLowerCase()} của nhóm sẽ sớm được cập nhật.
              </p>
            </Card>
          </div>
        )}
      </div>

      {/* Modals & Dialogs */}
      <GroupModals
        group={group}
        members={members}
        bannedMembers={bannedMembers}
        authenticatedUser={authenticatedUser}
        showInviteModal={showInviteModal}
        setShowInviteModal={setShowInviteModal}
        handleInviteMembers={handleInviteMembers}
        showTransferOwnershipModal={showTransferOwnershipModal}
        setShowTransferOwnershipModal={setShowTransferOwnershipModal}
        handleTransferOwnership={handleTransferOwnership}
        showReportGroup={showReportGroup}
        setShowReportGroup={setShowReportGroup}
        showTransferConfirmModal={showTransferConfirmModal}
        setShowTransferConfirmModal={setShowTransferConfirmModal}
        memberToTransfer={memberToTransfer}
        confirmTransferOwnership={confirmTransferOwnership}
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        confirmDelete={confirmDelete}
        showBanModal={showBanModal}
        setShowBanModal={setShowBanModal}
        memberToBan={memberToBan}
        confirmBanMember={confirmBanMember}
        showLeaveModal={showLeaveModal}
        setShowLeaveModal={setShowLeaveModal}
        confirmLeaveGroup={confirmLeaveGroup}
      />
    </div>
  );
}

export default GroupDetailPage;
