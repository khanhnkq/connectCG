import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  findById,
  getGroupMembers,
  leaveGroup,
  inviteMembers,
  joinGroup,
  getPendingRequests,
  approveRequest,
  rejectRequest,
  banMember,
  transferOwnership,
  getPendingPosts,
  approvePost,
  rejectPost,
  getGroupPosts,
  acceptInvitation,
  declineInvitation,
  getBannedMembers,
  unbanMember,
} from "../../../services/groups/GroupService";
import { usePostManagement } from "../../../hooks/usePostManagement";
import { useWebSocket } from "../../../context/WebSocketContext";

/**
 * Custom Hook: useGroupDetail
 * Encapsulates all business logic, real-time WebSocket events, role management,
 * and data-fetching for a Group detail view.
 */
export function useGroupDetail(propGroupId) {
  const { id: paramId } = useParams();
  const id = propGroupId || paramId;
  const navigate = useNavigate();

  const authenticatedUser = useSelector((state) => state.auth?.user);
  const { stompClient, isConnected } = useWebSocket() || {};

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("Bản tin");
  const [modTab, setModTab] = useState("Bài viết");

  // Membership & Members
  const [userMembership, setUserMembership] = useState(null);
  const [members, setMembers] = useState([]);
  const [memberRequests, setMemberRequests] = useState([]);
  const [bannedMembers, setBannedMembers] = useState([]);

  // Pending posts & approved posts
  const [pendingPosts, setPendingPosts] = useState([]);
  const {
    posts: approvedPosts,
    setPosts: setApprovedPosts,
    deleteModal,
    setDeleteModal,
    handleDeletePost,
    handleUpdatePost,
    confirmDelete,
  } = usePostManagement();

  const setApprovedPostsRef = useRef(setApprovedPosts);
  setApprovedPostsRef.current = setApprovedPosts;
  const authenticatedUserId = authenticatedUser?.id;

  // Modals state
  const [showReportGroup, setShowReportGroup] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showTransferOwnershipModal, setShowTransferOwnershipModal] = useState(false);
  const [showTransferConfirmModal, setShowTransferConfirmModal] = useState(false);
  const [memberToBan, setMemberToBan] = useState(null);
  const [memberToTransfer, setMemberToTransfer] = useState(null);
  const [isLeavingGroup, setIsLeavingGroup] = useState(false);

  const sortPosts = (postList) => {
    return [...postList].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if (a.isPinned && b.isPinned) {
        return new Date(b.pinnedAt) - new Date(a.pinnedAt);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  const fetchBannedMembers = useCallback(async () => {
    if (!id) return;
    try {
      const data = await getBannedMembers(id);
      setBannedMembers(data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách bị cấm:", error);
    }
  }, [id]);

  const fetchGroupData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const groupData = await findById(id);
      setGroup(groupData);

      if (groupData?.currentUserStatus === "BANNED") {
        toast.error("Bạn đã bị cấm khỏi nhóm này do vi phạm quy định.", {
          duration: 6000,
          icon: "🚫",
        });
        navigate("/dashboard/groups");
        return;
      }

      if (groupData?.currentUserStatus) {
        setUserMembership({
          status: groupData.currentUserStatus,
          role: groupData.currentUserRole,
        });
      }

      const currentUserId = authenticatedUserId ? Number(authenticatedUserId) : null;
      const membership = groupData?.currentUserStatus;

      let effectiveIsAdmin = false;
      if (currentUserId && groupData) {
        const isOwner = Number(groupData.ownerId) === Number(currentUserId);
        const isGroupAdmin = groupData.currentUserRole === "ADMIN";

        if (membership === "ACCEPTED") {
          effectiveIsAdmin = isGroupAdmin || isOwner;
          setIsAdmin(effectiveIsAdmin);
        } else if (isOwner) {
          effectiveIsAdmin = true;
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      }

      // If admin, fetch pending requests and pending posts
      if (effectiveIsAdmin) {
        try {
          const requests = await getPendingRequests(id);
          setMemberRequests(requests || []);
          const pPosts = await getPendingPosts(id);
          setPendingPosts(pPosts || []);
        } catch {
          console.log("No pending data access");
        }
      }

      const canViewContent =
        groupData?.privacy === "PUBLIC" ||
        membership === "ACCEPTED" ||
        Number(groupData?.ownerId) === Number(currentUserId);

      if (canViewContent) {
        try {
          const posts = await getGroupPosts(id);
          setApprovedPostsRef.current(sortPosts(posts || []));
        } catch (postError) {
          if (postError.response?.status !== 403) {
            console.error("Failed to fetch posts:", postError);
          } else {
            setApprovedPostsRef.current([]);
          }
        }

        try {
          const membersData = await getGroupMembers(id);
          setMembers(membersData || []);
        } catch (memberError) {
          if (memberError.response?.status !== 403) {
            console.error("Failed to fetch members:", memberError);
          } else {
            setMembers([]);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch group:", error);
      toast.error("Không thể tải thông tin nhóm");
      navigate("/dashboard/groups");
    } finally {
      setLoading(false);
    }
  }, [id, navigate, authenticatedUserId]);

  useEffect(() => {
    fetchGroupData();
  }, [fetchGroupData]);

  useEffect(() => {
    if (activeTab === "Kiểm duyệt" && isAdmin) {
      fetchBannedMembers();
    }
  }, [activeTab, isAdmin, fetchBannedMembers]);

  // Real-time WebSocket subscriptions
  useEffect(() => {
    const currentUserId = authenticatedUser ? Number(authenticatedUser.id) : null;
    const canViewGroup =
      group?.privacy === "PUBLIC" ||
      group?.currentUserStatus === "ACCEPTED" ||
      Number(group?.ownerId) === currentUserId;

    if (!stompClient || !isConnected || !group || !canViewGroup) return undefined;

    const dispatchEvent = (eventName) => (message) => {
      window.dispatchEvent(
        new CustomEvent(eventName, { detail: JSON.parse(message.body) })
      );
    };

    const subscriptions = [
      stompClient.subscribe(
        `/topic/groups/${id}/posts`,
        dispatchEvent("postEvent")
      ),
      stompClient.subscribe(
        `/topic/groups/${id}/membership`,
        dispatchEvent("membershipEvent")
      ),
    ];

    if (isAdmin) {
      subscriptions.push(
        stompClient.subscribe(
          `/topic/groups/${id}/posts/pending`,
          dispatchEvent("postEvent")
        ),
        stompClient.subscribe(
          `/topic/groups/${id}/membership/pending`,
          dispatchEvent("membershipEvent")
        )
      );
    }

    return () => subscriptions.forEach((s) => s.unsubscribe());
  }, [stompClient, isConnected, group, id, isAdmin, authenticatedUser]);

  // Handle Real-time Membership Events
  useEffect(() => {
    const handleMembershipEvent = (e) => {
      const { action, groupId: eventGroupId, userId, member } = e.detail;
      if (Number(eventGroupId) !== Number(id)) return;

      const currentUserId = authenticatedUser ? Number(authenticatedUser.id) : null;
      const targetUserId = Number(userId);

      if (action === "JOINED" || action === "APPROVED") {
        if (member) {
          setMembers((prev) => {
            const exists = prev.some((m) => Number(m.userId) === targetUserId);
            return exists ? prev : [...prev, member];
          });
          setGroup((prev) =>
            prev ? { ...prev, memberCount: (prev.memberCount || 0) + 1 } : prev
          );
        }
        setMemberRequests((prev) =>
          prev.filter((r) => Number(r.userId) !== targetUserId)
        );
      } else if (action === "LEFT") {
        if (targetUserId === currentUserId) {
          navigate("/dashboard/groups");
          return;
        }
        setMembers((prev) =>
          prev.filter((m) => Number(m.userId) !== targetUserId)
        );
        setGroup((prev) =>
          prev
            ? { ...prev, memberCount: Math.max(0, (prev.memberCount || 0) - 1) }
            : prev
        );
      } else if (action === "REQUESTED") {
        if (member) {
          setMemberRequests((prev) => {
            const exists = prev.some((r) => Number(r.userId) === targetUserId);
            return exists ? prev : [...prev, member];
          });
        }
      } else if (action === "BANNED") {
        if (targetUserId === currentUserId) {
          navigate("/dashboard/groups");
          return;
        }
        setMembers((prev) =>
          prev.filter((m) => Number(m.userId) !== targetUserId)
        );
        setGroup((prev) =>
          prev
            ? { ...prev, memberCount: Math.max(0, (prev.memberCount || 0) - 1) }
            : prev
        );
        fetchBannedMembers();
      } else if (action === "UNBANNED") {
        fetchBannedMembers();
      }
    };

    window.addEventListener("membershipEvent", handleMembershipEvent);
    return () => window.removeEventListener("membershipEvent", handleMembershipEvent);
  }, [id, activeTab, fetchBannedMembers, navigate, authenticatedUser]);

  // Handle Real-time Post Events
  useEffect(() => {
    const handlePostEvent = (e) => {
      const { action, post, postId, groupId: eventGroupId } = e.detail;
      const targetGroupId = eventGroupId || (post && post.groupId);
      if (Number(targetGroupId) !== Number(id)) return;

      if (action === "CREATED") {
        if (post.status === "APPROVED") {
          setApprovedPosts((prev) => {
            const exists = prev.some((p) => p.id === post.id);
            return exists ? prev : sortPosts([post, ...prev]);
          });
        } else if (post.status === "PENDING" && isAdmin) {
          setPendingPosts((prev) => {
            const exists = prev.some((p) => p.id === post.id);
            return exists ? prev : [post, ...prev];
          });
        }
      } else if (action === "UPDATED") {
        if (post.status === "APPROVED") {
          setApprovedPosts((prev) => {
            const newList = prev.map((p) => (p.id === post.id ? post : p));
            return sortPosts(newList);
          });
          setPendingPosts((prev) => prev.filter((p) => p.id !== post.id));
        } else if (post.status === "PENDING") {
          setPendingPosts((prev) =>
            prev.map((p) => (p.id === post.id ? post : p))
          );
          setApprovedPosts((prev) => prev.filter((p) => p.id !== post.id));
        }
      } else if (action === "DELETED") {
        setApprovedPosts((prev) => prev.filter((p) => p.id !== postId));
        setPendingPosts((prev) => prev.filter((p) => p.id !== postId));
      }
    };

    window.addEventListener("postEvent", handlePostEvent);
    return () => window.removeEventListener("postEvent", handlePostEvent);
  }, [id, isAdmin, setApprovedPosts]);

  // Handlers
  const handleLeaveGroup = () => {
    if (!group) return;
    const currentUserId = authenticatedUser ? Number(authenticatedUser.id) : null;
    const ownerIdNum = Number(group.ownerId);

    if (currentUserId && ownerIdNum && currentUserId === ownerIdNum) {
      setIsLeavingGroup(true);
      setShowTransferOwnershipModal(true);
      return;
    }
    setShowLeaveModal(true);
  };

  const confirmLeaveGroup = async () => {
    try {
      const isRequest = userMembership?.status === "REQUESTED";
      await leaveGroup(id || group.id);
      toast.success(
        isRequest ? "Đã hủy yêu cầu tham gia!" : "Đã rời nhóm thành công"
      );
      setShowLeaveModal(false);

      if (isRequest) {
        fetchGroupData();
      } else {
        navigate("/dashboard/groups");
      }
    } catch (error) {
      console.error("Failed to leave group:", error);
      const errorMsg =
        error.response?.data?.message || "Không thể rời nhóm";
      toast.error(errorMsg);
    }
  };

  const handleTransferOwnership = async (selectedMember) => {
    try {
      await transferOwnership(group.id, selectedMember.userId, isLeavingGroup);
      toast.success(
        isLeavingGroup
          ? "Đã chuyển quyền và rời nhóm thành công"
          : `Đã chuyển quyền cho ${selectedMember.fullName} thành công`
      );
      setShowTransferOwnershipModal(false);

      if (isLeavingGroup) {
        navigate("/dashboard/groups");
      } else {
        fetchGroupData();
      }
    } catch (error) {
      console.error("Failed to transfer ownership:", error);
      toast.error(error.response?.data?.message || "Không thể chuyển quyền");
    }
  };

  const handleInviteMembers = async (selectedFriendIds) => {
    try {
      await inviteMembers(group.id, selectedFriendIds);
      toast.success("Đã mời thành viên thành công!");
      setShowInviteModal(false);
      const updatedMembers = await getGroupMembers(group.id);
      setMembers(updatedMembers || []);
    } catch (error) {
      console.error("Failed to invite members:", error);
      toast.error("Không thể mời thành viên");
    }
  };

  const handleJoinGroup = async () => {
    try {
      await joinGroup(group.id);
      if (group.privacy === "PRIVATE") {
        toast.success("Đã gửi yêu cầu gia nhập. Vui lòng đợi phê duyệt!");
      } else {
        toast.success("Chào mừng bạn gia nhập nhóm!");
      }
      fetchGroupData();
    } catch (error) {
      console.error("Failed to join group:", error);
      toast.error(error.response?.data?.message || "Không thể thực hiện yêu cầu");
    }
  };

  const handleAcceptInvite = async () => {
    try {
      await acceptInvitation(group.id);
      toast.success("Chào mừng bạn gia nhập nhóm!");
      fetchGroupData();
    } catch (error) {
      console.error("Failed to accept invite:", error);
      toast.error("Không thể chấp nhận lời mời");
    }
  };

  const handleDeclineInvite = async () => {
    try {
      await declineInvitation(group.id);
      toast.success("Đã từ chối lời mời");
      fetchGroupData();
    } catch (error) {
      console.error("Failed to decline invite:", error);
      toast.error("Không thể từ chối lời mời");
    }
  };

  const handleBanMember = (member) => {
    setMemberToBan(member);
    setShowBanModal(true);
  };

  const confirmBanMember = async () => {
    if (!memberToBan) return;
    try {
      await banMember(group.id, memberToBan.userId);
      toast.success(`Đã cấm vĩnh viễn ${memberToBan.fullName} khỏi nhóm`);
      setShowBanModal(false);
      setMembers((prev) =>
        prev.filter((m) => Number(m.userId) !== Number(memberToBan.userId))
      );
      fetchGroupData();
      setMemberToBan(null);
      fetchBannedMembers();
    } catch (error) {
      console.error("Failed to ban member:", error);
      toast.error(error.response?.data?.message || "Không thể cấm thành viên");
    }
  };

  const handleUnbanMember = async (userId) => {
    try {
      await unbanMember(id, userId);
      toast.success("Đã gỡ lệnh cấm thành công");
      setBannedMembers((prev) => prev.filter((m) => m.userId !== userId));
    } catch {
      toast.error("Gỡ lệnh cấm thất bại");
    }
  };

  const handleUpdateRole = (targetUserId, targetUsername, targetFullName, newRole) => {
    if (newRole !== "OWNER") return;
    setMemberToTransfer({
      userId: targetUserId,
      username: targetUsername,
      fullName: targetFullName,
    });
    setShowTransferConfirmModal(true);
  };

  const confirmTransferOwnership = async () => {
    if (!memberToTransfer) return;
    try {
      await transferOwnership(group.id, memberToTransfer.userId);
      toast.success(
        `Đã chuyển quyền quản trị cho ${memberToTransfer.fullName || memberToTransfer.username}`
      );
      setShowTransferConfirmModal(false);
      setMemberToTransfer(null);
      fetchGroupData();
    } catch (error) {
      console.error("Failed to transfer ownership:", error);
      toast.error(error.response?.data?.message || "Thao tác thất bại");
    }
  };

  const handleActionPost = async (postId, action) => {
    try {
      if (action === "approve") {
        await approvePost(id, postId);
        toast.success("Đã duyệt bài viết!");
      } else {
        await rejectPost(id, postId, false);
        toast.success("Đã xóa bài viết!");
      }
      fetchGroupData();
    } catch (error) {
      console.error("Action failed:", error);
      toast.error(error.response?.data?.message || "Thao tác thất bại");
    }
  };

  const handleActionRequest = async (userId, action) => {
    try {
      if (action === "approve") {
        await approveRequest(group.id, userId);
        toast.success("Đã duyệt thành viên!");
      } else {
        await rejectRequest(group.id, userId);
        toast.success("Đã từ chối yêu cầu!");
      }
      fetchGroupData();
    } catch (error) {
      console.error("Action failed:", error);
      toast.error(error.response?.data?.message || "Thao tác thất bại");
    }
  };

  const handlePostCreated = (newPost) => {
    if (newPost.status === "APPROVED") {
      setApprovedPosts((prev) => {
        const exists = prev.some((p) => p.id === newPost.id);
        return exists ? prev : [newPost, ...prev];
      });
      toast.success("Đăng bài viết thành công!");
    }
  };

  return {
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
    handleUpdateRole,
    confirmTransferOwnership,
    handleActionPost,
    handleActionRequest,
    handlePostCreated,
    fetchGroupData,
  };
}

export default useGroupDetail;
