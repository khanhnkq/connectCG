import React, { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  ShieldCheck,
  Users,
  Settings,
  LogOut,
  UserPlus,
  Hourglass,
  CheckCircle2,
  PlusCircle,
  AlertTriangle,
  Gavel,
  Lock,
  PlusSquare,
  Globe,
  History,
  Key,
  UserMinus,
  MessageSquare,
  Home,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import PostComposer from "../../components/feed/PostComposer";
import PostCard from "../../components/feed/PostCard";
import toast from "react-hot-toast";
import ReportModal from "../../components/report/ReportModal";
import {
  findById,
  getGroupMembers,
  leaveGroup,
  inviteMembers,
  joinGroup,
  getPendingRequests,
  approveRequest,
  rejectRequest,
  kickMember,
  transferOwnership,
  updateGroupMemberRole,
  getPendingPosts,
  approvePost,
  rejectPost,
  getGroupPosts,
  acceptInvitation,
  declineInvitation,
  getBannedMembers,
  unbanMember,
} from "../../services/groups/GroupService";
import InviteMemberModal from "../../components/groups/InviteMemberModal";
import TransferOwnershipModal from "../../components/groups/TransferOwnershipModal";
import reportService from "../../services/ReportService";
import ConfirmModal from "../../components/common/ConfirmModal";
import { usePostManagement } from "../../hooks/usePostManagement";

const GroupDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // Group-level admin/owner

  const [activeTab, setActiveTab] = useState("Bản tin");
  const [showReportGroup, setShowReportGroup] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [bannedMembers, setBannedMembers] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showKickModal, setShowKickModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showTransferConfirmModal, setShowTransferConfirmModal] =
    useState(false);
  const [memberToKick, setMemberToKick] = useState(null);
  const [memberToTransfer, setMemberToTransfer] = useState(null);
  const [memberToUnban, setMemberToUnban] = useState(null);
  const [postToAction, setPostToAction] = useState(null); // { id, action: 'approve' | 'reject' }
  const [requestToAction, setRequestToAction] = useState(null); // { userId, action: 'approve' | 'reject', fullName }
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  const [pendingPosts, setPendingPosts] = useState([]);
  const [memberRequests, setMemberRequests] = useState([]);
  const [modTab, setModTab] = useState("Bài viết");
  const [members, setMembers] = useState([]);
  const [userMembership, setUserMembership] = useState(null); // { userId, status, role }

  const {
    posts: approvedPosts,
    setPosts: setApprovedPosts,
    deleteModal,
    setDeleteModal,
    handleDeletePost,
    confirmDelete,
    handleUpdatePost,
    isConfirmLoading: isPostDeleting,
  } = usePostManagement();

  const [showTransferOwnershipModal, setShowTransferOwnershipModal] =
    useState(false);
  // Helper function to decode JWT and get user ID & ROLE
  const getUserInfoFromToken = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      return {
        id: decoded.userId || decoded.sub || decoded.id,
        role:
          decoded.role ||
          decoded.authorities ||
          (decoded.realm_access ? decoded.realm_access.roles : null),
      };
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  };

  // Legacy support for just ID
  const getUserIdFromToken = () => {
    const info = getUserInfoFromToken();
    return info ? info.id : null;
  };

  const fetchGroupData = useCallback(async () => {
    try {
      const groupData = await findById(id);
      setGroup(groupData);

      // Set user membership from the group data directly (includes status/role)
      if (groupData.currentUserStatus) {
        setUserMembership({
          status: groupData.currentUserStatus,
          role: groupData.currentUserRole,
        });
      } else {
        setUserMembership(null);
      }

      // Check if current user is admin (Group Owner OR Group Admin OR System Admin)
      const userInfo = getUserInfoFromToken();
      const userStr = localStorage.getItem("user"); // Fallback to localStorage user object if needed

      let currentUserId = null;

      if (userInfo) {
        currentUserId = Number(userInfo.id);
        // Check role from token - handle both formats and case sensitivity
        // Check system admin role if needed in future
      } else if (userStr) {
        const userData = JSON.parse(userStr);
        currentUserId = userData.id;
      }
      // 3. Determine access rights for content
      const status = groupData.currentUserStatus;
      const isGroupAdminLocal = groupData.ownerId === currentUserId || groupData.currentUserRole === "ADMIN";
      const isSystemAdmin = userInfo?.role === "ADMIN" || (Array.isArray(userInfo?.role) && userInfo.role.includes("ADMIN"));

      const hasFullAccess = isGroupAdminLocal || isSystemAdmin;
      setIsAdmin(hasFullAccess);

      if (hasFullAccess) {
        // Admin capabilities: Fetch pending lists
        try {
          const requests = await getPendingRequests(id);
          setMemberRequests(requests);
          const pPosts = await getPendingPosts(id);
          setPendingPosts(pPosts);
        } catch (e) {
          console.log("Admin fetch error (expected if permissions tight):", e);
        }
      }

      // 4. Conditional Content Fetching (Posts and Members)
      const isMember = status === "ACCEPTED";
      const isPublic = groupData.privacy === "PUBLIC";
      const isBanned = status === "BANNED";
      const canViewContent = hasFullAccess || isMember || (isPublic && !isBanned);

      if (canViewContent) {
        // Fetch approved posts for the feed with its own catch
        try {
          const posts = await getGroupPosts(id);
          setApprovedPosts(posts);
        } catch (postError) {
          console.error("Failed to fetch posts:", postError);
          setApprovedPosts([]);
        }

        // Fetch members list with its own catch
        try {
          const membersData = await getGroupMembers(id);
          setMembers(membersData);
        } catch (memberError) {
          console.error("Failed to fetch members:", memberError);
          setMembers([]);
        }
      } else {
        setApprovedPosts([]);
        setMembers([]);
      }
    } catch (error) {
      console.error("Failed to fetch group:", error);
      toast.error("Không thể tải thông tin nhóm");
      navigate("/dashboard/groups");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const handleFetchBannedMembers = useCallback(async () => {
    try {
      const data = await getBannedMembers(id);
      setBannedMembers(data);
    } catch (error) {
      console.error("Failed to fetch banned members:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchGroupData();
    if (isAdmin) {
      handleFetchBannedMembers();
    }
  }, [fetchGroupData, isAdmin, handleFetchBannedMembers]);

  // Real-time synchronization for posts
  useEffect(() => {
    const handlePostEvent = (e) => {
      const { action, post, postId } = e.detail;
      // If the post belongs to this group
      if (post && Number(post.groupId) === Number(id)) {
        if (action === "CREATED") {
          // If approved, add to newsfeed
          if (post.status === "APPROVED") {
            setApprovedPosts((prev) => {
              if (prev.some((p) => p.id === post.id)) return prev;
              return [post, ...prev];
            });
            // Try removing from pending if it was there
            setPendingPosts((prev) => prev.filter((p) => p.id !== post.id));
          } else if (post.status === "PENDING") {
            // New pending post
            setPendingPosts((prev) => {
              if (prev.some((p) => p.id === post.id)) return prev;
              return [post, ...prev];
            });
          }
        } else if (action === "UPDATED") {
          if (post.status === "APPROVED") {
            setApprovedPosts((prev) =>
              prev.map((p) => (p.id === post.id ? post : p)),
            );
          } else if (post.status === "PENDING") {
            setPendingPosts((prev) =>
              prev.map((p) => (p.id === post.id ? post : p)),
            );
          }
        }
      } else if (action === "DELETED" && postId) {
        setApprovedPosts((prev) => prev.filter((p) => p.id !== postId));
        setPendingPosts((prev) => prev.filter((p) => p.id !== postId));
      }
    };

    window.addEventListener("postEvent", handlePostEvent);
    return () => window.removeEventListener("postEvent", handlePostEvent);
  }, [id]);

  // Real-time synchronization for members
  useEffect(() => {
    const handleMembershipEvent = (e) => {
      const { action, groupId, userId, member } = e.detail;
      if (Number(groupId) !== Number(id)) return;

      if (action === "APPROVED" || action === "JOINED") {
        if (member) {
          setMembers((prev) => {
            if (prev.some((m) => m.userId === member.userId)) return prev;
            return [...prev, member];
          });
        }
        if (action === "APPROVED") {
          setMemberRequests((prev) => prev.filter((r) => r.userId !== userId));
        }
        setGroup(prev => prev ? { ...prev, memberCount: (prev.memberCount || 0) + 1 } : prev);
      } else if (action === "REQUESTED") {
        if (member) {
          setMemberRequests((prev) => {
            if (prev.some((r) => r.userId === member.userId)) return prev;
            return [...prev, member];
          });
        }
      } else if (action === "REJECTED") {
        setMemberRequests((prev) => prev.filter((r) => r.userId !== userId));
      } else if (action === "KICKED" || action === "LEFT" || action === "BANNED") {
        setMembers((prev) => prev.filter((m) => m.userId !== userId));
        setGroup(prev => prev ? { ...prev, memberCount: Math.max(0, (prev.memberCount || 0) - 1) } : prev);

        // If current user is the one who left/kicked, redirect or refresh status
        if (Number(userId) === Number(getUserIdFromToken())) {
          fetchGroupData();
        }
      }
    };

    window.dispatchEvent(new CustomEvent("debug", { detail: "Listener added" }));
    window.addEventListener("membershipEvent", handleMembershipEvent);
    return () => window.removeEventListener("membershipEvent", handleMembershipEvent);
  }, [id, fetchGroupData]);

  const handleLeaveGroup = () => {
    if (!group) return;
    const currentUserId = getUserIdFromToken();
    const userIdNum = Number(currentUserId);
    const ownerIdNum = Number(group.ownerId);
    if (userIdNum && ownerIdNum && userIdNum === ownerIdNum) {
      setShowTransferOwnershipModal(true);
      return;
    }
    setShowLeaveModal(true);
  };

  const confirmLeaveGroup = async () => {
    setIsConfirmLoading(true);
    try {
      const isRequest = userMembership?.status === "REQUESTED";
      await leaveGroup(id || group.id);
      toast.success(
        isRequest ? "Đã hủy yêu cầu tham gia!" : "Đã rời nhóm thành công",
      );
      setShowLeaveModal(false);

      if (isRequest) {
        // If it was just a request, we can just refresh data instead of navigating away
        fetchGroupData();
      } else {
        navigate("/dashboard/groups");
      }
    } catch (error) {
      console.error("Failed to leave group:", error);
      const errorMsg =
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : null) ||
        "Không thể rời nhóm";
      toast.error(errorMsg);
    } finally {
      setIsConfirmLoading(false);
    }
  };
  const handleTransferOwnership = async (selectedMember) => {
    try {
      await transferOwnership(group.id, selectedMember.userId);
      toast.success(
        `Đã chuyển quyền cho ${selectedMember.fullName} thành công`,
      );
      setShowTransferOwnershipModal(false);
      fetchGroupData(); // Refresh current page instead of navigating away
    } catch (error) {
      console.error("Failed to transfer ownership:", error);
      const errorMsg = error.response?.data || "Không thể chuyển quyền";
      toast.error(errorMsg);
    }
  };

  const handleInviteMembers = async (selectedFriendIds) => {
    try {
      await inviteMembers(group.id, selectedFriendIds);
      toast.success("Đã mời thành viên thành công!");
      setShowInviteModal(false);
      // Refresh members list
      const updatedMembers = await getGroupMembers(group.id);
      setMembers(updatedMembers);
    } catch (error) {
      console.error("Failed to invite members:", error);
      toast.error("Không thể mời thành viên");
    }
  };

  const handleJoinGroup = async () => {
    setIsConfirmLoading(true);
    try {
      await joinGroup(group.id);
      if (group.privacy === "PRIVATE") {
        toast.success("Đã gửi yêu cầu gia nhập. Vui lòng đợi phê duyệt!");
      } else {
        toast.success("Chào mừng bạn gia nhập nhóm!");
      }
      // Refresh data instantly without manual reload
      fetchGroupData();
    } catch (error) {
      console.error("Failed to action request:", error);
      const errorMsg =
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : null) ||
        "Không thể thực hiện yêu cầu";
      toast.error(errorMsg);
    } finally {
      setIsConfirmLoading(false);
    }
  };

  const handleAcceptInvite = async () => {
    setIsConfirmLoading(true);
    try {
      await acceptInvitation(group.id);
      toast.success("Chào mừng bạn gia nhập nhóm!");
      fetchGroupData();
    } catch (error) {
      console.error("Failed to accept invite:", error);
      toast.error("Không thể chấp nhận lời mời");
    } finally {
      setIsConfirmLoading(false);
    }
  };

  const handleDeclineInvite = async () => {
    setIsConfirmLoading(true);
    try {
      await declineInvitation(group.id);
      toast.success("Đã từ chối lời mời");
      fetchGroupData();
    } catch (error) {
      console.error("Failed to decline invite:", error);
      toast.error("Không thể từ chối lời mời");
    } finally {
      setIsConfirmLoading(false);
    }
  };

  const handleKickMember = (member) => {
    setMemberToKick(member);
    setShowKickModal(true);
  };

  const handleUpdateRole = async (targetUserId, targetUsername, newRole) => {
    if (newRole !== "OWNER") return;

    setMemberToTransfer({ userId: targetUserId, username: targetUsername });
    setShowTransferConfirmModal(true);
  };

  const confirmTransferOwnership = async () => {
    if (!memberToTransfer) return;
    setIsConfirmLoading(true);
    try {
      await updateGroupMemberRole(group.id, memberToTransfer.userId, "OWNER");
      toast.success(
        `Đã chuyển quyền quản trị cho ${memberToTransfer.fullName}`,
      );
      setShowTransferConfirmModal(false);
      setMemberToTransfer(null);
      fetchGroupData();
    } catch (error) {
      console.error("Failed to update role:", error);
      const errorMsg =
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : null) ||
        "Thao tác thất bại";
      toast.error(errorMsg);
    } finally {
      setIsConfirmLoading(false);
    }
  };

  const confirmKickMember = async () => {
    if (!memberToKick) return;
    setIsConfirmLoading(true);
    try {
      await kickMember(group.id, memberToKick.userId);
      toast.success(`Đã mời ${memberToKick.fullName} ra khỏi nhóm`);
      setShowKickModal(false);
      setMemberToKick(null);
      fetchGroupData();
    } catch (error) {
      console.error("Failed to kick member:", error);
      const errorMsg =
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : null) ||
        "Không thể xóa thành viên";
      toast.error(errorMsg);
    } finally {
      setIsConfirmLoading(false);
    }
  };

  const handleActionPost = (postId, action) => {
    if (action === "reject") {
      setPostToAction({ id: postId, action: "reject" });
    } else {
      // For approval, no need for confirm modal unless preferred. User said "Phần Duyệt bài và Duyệt thành viên vẫn đang dùng thông báo mặc định của trình duyệt (window.confirm)"
      // So I should probably add confirm modal for both if they were using window.confirm.
      setPostToAction({ id: postId, action: "approve" });
    }
  };

  const confirmPostAction = async () => {
    if (!postToAction) return;
    const { id: postId, action } = postToAction;

    setIsConfirmLoading(true);
    try {
      if (action === "approve") {
        await approvePost(id, postId);
        // Toast handled by effect if we rely on WS, but let's keep it here for direct feedback
        toast.success("Đã duyệt bài viết!");
      } else {
        await rejectPost(id, postId);
        toast.success("Đã xóa bài viết và cộng gậy vi phạm!");
      }
      setPostToAction(null);
      // fetchGroupData() will refresh lists, but WS broadcast will also do it.
      fetchGroupData();
    } catch (error) {
      console.error("Action failed:", error);
      const errorMsg =
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : null) ||
        "Thao tác thất bại";
      toast.error(errorMsg);
    } finally {
      setIsConfirmLoading(false);
    }
  };

  const handleActionRequest = (userId, fullName, action) => {
    setRequestToAction({ userId, fullName, action });
  };

  const confirmRequestAction = async () => {
    if (!requestToAction) return;
    const { userId, action } = requestToAction;

    setIsConfirmLoading(true);
    try {
      if (action === "approve") {
        await approveRequest(group.id, userId);
        toast.success("Đã duyệt thành viên!");
      } else {
        await rejectRequest(group.id, userId);
        toast.success("Đã từ chối yêu cầu!");
      }
      setRequestToAction(null);
      fetchGroupData();
    } catch (error) {
      console.error("Action failed:", error);
      const errorMsg =
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : null) ||
        "Thao tác thất bại";
      toast.error(errorMsg);
    } finally {
      setIsConfirmLoading(false);
    }
  };


  useEffect(() => {
    if (activeTab === "Bị cấm" && isAdmin) {
      handleFetchBannedMembers();
    }
  }, [activeTab, isAdmin, handleFetchBannedMembers]);

  const handleUnbanMember = async (userId) => {
    setMemberToUnban(userId);
  };

  const confirmUnbanMember = async () => {
    if (!memberToUnban) return;
    try {
      await unbanMember(id, memberToUnban);
      toast.success("Đã gỡ lệnh cấm thành công");
      handleFetchBannedMembers(); // Refresh list
    } catch (error) {
      toast.error("Gỡ lệnh cấm thất bại");
    } finally {
      setMemberToUnban(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-background-main min-h-screen flex items-center justify-center">
        <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!group) return null;

  const imageUrl =
    group.image ||
    "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000";

  return (
    <>
      <div className="w-full pb-20">
        {/* Group Header */}
        <div className="relative w-full h-64 md:h-80 lg:h-96">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("${imageUrl}")`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background-main via-background-main/60 to-transparent" />
          </div>

          <button
            onClick={() => navigate("/dashboard/groups")}
            className="absolute top-6 left-6 z-10 size-10 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/10 flex items-center justify-center transition-all group"
            title="Quay lại"
          >
            <ArrowLeft
              className="group-hover:-translate-x-0.5 transition-transform"
              size={20}
            />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-7xl mx-auto">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl md:text-5xl font-extrabold text-text-main tracking-tight drop-shadow-lg flex items-center gap-3">
                  {group.name}
                  {isAdmin && (
                    <ShieldCheck
                      className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                      size={40}
                      title="Quản trị viên"
                    />
                  )}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="bg-primary/20 backdrop-blur-sm text-primary border border-primary/30 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                    Nhóm {group.privacy === "PUBLIC" ? "Công khai" : "Riêng tư"}
                  </span>
                </div>
              </div>
              <p className="text-white/90 font-medium text-sm md:text-base flex items-center gap-2 drop-shadow-sm">
                <Users size={18} className="text-primary" />
                <span>{group.memberCount || 0} Thành viên</span>
                <span className="size-1 bg-white/40 rounded-full"></span>
                <span className="text-primary font-bold">Đang hoạt động</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {isAdmin && (
                <button
                  onClick={() => navigate(`/dashboard/groups/edit/${group.id}`)}
                  className="flex-1 sm:flex-none h-10 px-6 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Settings size={20} />
                  Sửa
                </button>
              )}

              {userMembership?.status === "ACCEPTED" ? (
                <>
                  <button
                    onClick={handleLeaveGroup}
                    className="flex-1 sm:flex-none h-10 px-6 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 backdrop-blur-md font-bold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut size={20} />
                    Rời nhóm
                  </button>

                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex-1 sm:flex-none h-10 px-6 rounded-full bg-white/10 hover:bg-white/20 text-text-main border border-white/20 backdrop-blur-md font-bold text-sm transition-all flex items-center justify-center gap-2"
                    title="Mời bạn bè tham gia nhóm"
                  >
                    <UserPlus size={20} />
                    Mời
                  </button>
                </>
              ) : userMembership?.status === "REQUESTED" ? (
                <button
                  onClick={handleLeaveGroup}
                  className="flex-1 sm:flex-none h-10 px-6 rounded-full bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 backdrop-blur-md font-bold text-sm transition-all flex items-center justify-center gap-2 group/cancel"
                  title="Nhấn để hủy yêu cầu tham gia"
                >
                  <Hourglass
                    size={20}
                    className="group-hover/cancel:rotate-12 transition-transform"
                  />
                  Hủy yêu cầu
                </button>
              ) : userMembership?.status === "PENDING" ? (
                <div className="flex gap-2 flex-1 sm:flex-none">
                  <button
                    onClick={handleAcceptInvite}
                    disabled={isConfirmLoading}
                    className="flex-1 sm:flex-none h-10 px-6 rounded-full bg-primary hover:bg-orange-600 text-[#231810] font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {isConfirmLoading ? (
                      <div className="size-4 border-2 border-[#231810]/20 border-t-[#231810] rounded-full animate-spin" />
                    ) : (
                      <CheckCircle2 size={20} />
                    )}
                    Chấp nhận
                  </button>
                  <button
                    onClick={handleDeclineInvite}
                    disabled={isConfirmLoading}
                    className="flex-1 sm:flex-none h-10 px-6 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 backdrop-blur-md font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isConfirmLoading ? (
                      <div className="size-4 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
                    ) : (
                      <UserMinus size={20} />
                    )}
                    Từ chối
                  </button>
                </div>
              ) : userMembership?.status === "BANNED" ? (
                <button
                  disabled
                  className="flex-1 sm:flex-none h-10 px-6 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700 font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <Gavel size={20} />
                  Đã bị cấm
                </button>
              ) : (
                <button
                  onClick={handleJoinGroup}
                  disabled={isConfirmLoading}
                  className="flex-1 sm:flex-none h-10 px-6 rounded-full bg-primary hover:bg-orange-600 text-[#231810] font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {isConfirmLoading ? (
                    <div className="size-4 border-2 border-[#231810]/20 border-t-[#231810] rounded-full animate-spin" />
                  ) : (
                    <PlusCircle size={20} />
                  )}
                  {group.privacy === "PRIVATE"
                    ? "Yêu cầu tham gia"
                    : "Tham gia nhóm"}
                </button>
              )}

              <button
                onClick={() => setShowReportGroup(true)}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-yellow-500/10 hover:bg-yellow-500 text-yellow-500 hover:text-white border border-yellow-500/20 backdrop-blur-md transition-all"
                title="Báo cáo nhóm"
              >
                <AlertTriangle size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-border-main sticky top-0 bg-background-main/95 backdrop-blur-xl z-50">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="flex gap-8 overflow-x-auto hide-scrollbar">
              {[
                { en: "Feed", vi: "Bản tin" },
                { en: "Members", vi: "Thành viên" },
                ...(isAdmin ? [{ en: "Banned", vi: "Bị cấm" }] : []), // Add banned tab
                { en: "About", vi: "Giới thiệu" },
                { en: "Events", vi: "Sự kiện" },
              ]
                .filter(
                  () =>
                    (group.privacy === "PUBLIC" && userMembership?.status !== "BANNED") ||
                    userMembership?.status === "ACCEPTED" ||
                    isAdmin,
                )
                .map((tab) => (
                  <button
                    key={tab.en}
                    onClick={() => setActiveTab(tab.vi)}
                    className={`py-4 font-bold text-sm tracking-wide whitespace-nowrap transition-all border-b-2 ${activeTab === tab.vi
                      ? "text-primary border-primary"
                      : "text-text-secondary hover:text-text-main border-transparent"
                      }`}
                  >
                    {tab.vi}
                  </button>
                ))}
              {isAdmin && (
                <button
                  onClick={() => setActiveTab("Kiểm duyệt")}
                  className={`py-4 font-black text-sm tracking-widest whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${activeTab === "Kiểm duyệt"
                    ? "text-orange-400 border-orange-400"
                    : "text-text-secondary hover:text-orange-400 border-transparent"
                    }`}
                >
                  <Gavel size={18} />
                  KIỂM DUYỆT
                  {(pendingPosts.length > 0 || memberRequests.length > 0) && (
                    <span className="size-5 bg-orange-500 text-text-main text-[10px] rounded-full flex items-center justify-center">
                      {pendingPosts.length + memberRequests.length}
                    </span>
                  )}
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto w-full px-6 py-8">
          {activeTab === "Bản tin" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 flex flex-col gap-6">
                {(group.privacy === "PRIVATE" &&
                  userMembership?.status !== "ACCEPTED" &&
                  !isAdmin) || userMembership?.status === "BANNED" ? (
                  <div className="bg-surface-main rounded-[2.5rem] p-12 border border-border-main text-center space-y-6">
                    <div className={`size-24 rounded-full flex items-center justify-center mx-auto mb-8 ${userMembership?.status === "BANNED" ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"
                      }`}>
                      {userMembership?.status === "BANNED" ? <Gavel size={40} /> : <Lock size={40} />}
                    </div>
                    <h2 className="text-3xl font-black text-text-main">
                      {userMembership?.status === "BANNED" ? "Bạn đã bị cấm" : "Đây là nhóm Riêng tư"}
                    </h2>
                    <p className="text-text-secondary max-w-md mx-auto leading-relaxed">
                      {userMembership?.status === "BANNED"
                        ? "Bạn đã bị cấm khỏi nhóm này do vi phạm tiêu chuẩn cộng đồng. Bạn không thể xem nội dung hoặc tham gia thảo luận."
                        : userMembership?.status === "PENDING"
                          ? "Bạn đã nhận được lời mời tham gia nhóm này. Vui lòng phản hồi lời mời ở phía trên để xem nội dung."
                          : userMembership?.status === "REQUESTED"
                            ? "Yêu cầu gia nhập của bạn đang chờ quản trị viên phê duyệt. Nội dung sẽ hiển thị sau khi yêu cầu được chấp nhận."
                            : "Nội dung và danh sách thành viên của nhóm này đã được ẩn. Vui lòng gia nhập nhóm để tham gia cộng đồng."}
                    </p>
                    {(!userMembership?.status) ? (
                      <button
                        onClick={handleJoinGroup}
                        disabled={isConfirmLoading}
                        className="px-10 py-4 bg-primary hover:bg-orange-600 text-[#231810] font-black rounded-2xl transition-all shadow-xl shadow-primary/20 uppercase tracking-widest disabled:opacity-50"
                      >
                        {isConfirmLoading ? "Vui lòng đợi..." : "Gửi yêu cầu gia nhập"}
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate("/dashboard/feed")}
                        className="px-10 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-black rounded-2xl transition-all shadow-xl border border-zinc-700 uppercase tracking-widest flex items-center justify-center gap-2 mx-auto"
                      >
                        <Home size={20} />
                        Về Trang Chủ
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    {userMembership?.status === "ACCEPTED" ? (
                      <PostComposer
                        userAvatar={
                          JSON.parse(localStorage.getItem("userProfile"))
                            ?.currentAvatarUrl ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        groupId={group.id}
                        onPostCreated={(newPost) => {
                          if (newPost.status === "APPROVED") {
                            setApprovedPosts((prev) => [newPost, ...prev]);
                            toast.success("Đăng bài viết thành công!");
                          } else if (newPost.status === "PENDING") {
                            toast("Bài viết đang chờ quản trị viên duyệt.", {
                              icon: "⏳",
                              style: {
                                borderRadius: "10px",
                                background: "#333",
                                color: "#fff",
                              },
                            });
                          }
                        }}
                      />
                    ) : (
                      <div className="bg-surface-main rounded-[2rem] p-8 border border-border-main text-center mb-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                          <div className="flex items-center gap-4 text-left">
                            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                              <MessageSquare size={24} />
                            </div>
                            <div>
                              <h4 className="text-text-main font-bold">
                                Tham gia cộng đồng
                              </h4>
                              <p className="text-text-secondary text-sm">
                                Hãy tham gia nhóm để bắt đầu chia sẻ và thảo
                                luận cùng mọi người.
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={handleJoinGroup}
                            disabled={isConfirmLoading}
                            className="px-8 py-3 bg-primary hover:bg-orange-600 text-[#231810] font-black rounded-xl transition-all shadow-lg shadow-primary/20 uppercase tracking-widest text-xs disabled:opacity-50"
                          >
                            {isConfirmLoading ? "Đang xử lý..." : "Tham gia ngay"}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-6">
                      {approvedPosts.length > 0 ? (
                        approvedPosts.map((post) => (
                          <PostCard
                            key={post.id}
                            post={post}
                            onDelete={handleDeletePost}
                            onUpdate={handleUpdatePost}
                          />
                        ))
                      ) : (
                        <div className="bg-surface-main rounded-3xl p-12 border border-border-main text-center">
                          <div className="size-16 rounded-full bg-white/5 flex items-center justify-center text-text-secondary mx-auto mb-4">
                            <PlusSquare size={30} />
                          </div>
                          <p className="text-text-secondary font-medium">
                            Chưa có bài viết nào trong nhóm này.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="hidden lg:flex flex-col gap-6">
                <div className="bg-surface-main rounded-2xl p-6 border border-border-main">
                  <h3 className="text-text-main font-bold text-lg mb-3">
                    Giới thiệu về nhóm
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">
                    {group.description || "Chưa có mô tả."}
                  </p>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <Globe size={18} className="text-text-secondary" />
                      <span>
                        Nhóm{" "}
                        {group.privacy === "PUBLIC" ? "Công khai" : "Riêng tư"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <History size={18} className="text-text-secondary" />
                      <span>
                        Đã tạo vào{" "}
                        {new Date(group.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Thành viên" && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-xl font-bold text-text-main">
                  Thành viên nhóm
                </h3>
                <span className="text-sm text-text-secondary">
                  {group.memberCount || 0} thành viên
                </span>
              </div>
              <div className="bg-surface-main border border-border-main rounded-3xl overflow-hidden divide-y divide-border-main">
                {members.length > 0 ? (
                  members.map((member) => (
                    <div
                      key={member.userId}
                      className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={member.avatarUrl}
                          className="size-12 rounded-full border-2 border-border-main"
                          alt=""
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-text-main">
                              {member.fullName}
                            </p>
                            <span
                              className={`px-2 py-0.5 text-[10px] font-black rounded uppercase ${member.role === "ADMIN"
                                ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                                : "bg-zinc-800 text-zinc-400"
                                }`}
                            >
                              {member.role === "ADMIN"
                                ? "Quản trị viên"
                                : member.role === "OWNER"
                                  ? "Chủ nhóm"
                                  : "Thành viên"}
                            </span>
                          </div>
                          <p className="text-xs text-text-secondary mt-0.5 italic">
                            Đã gia nhập vào{" "}
                            {new Date(member.joinedAt).toLocaleDateString()}
                          </p>
                          {member.violationCount > 0 && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded text-[10px] font-bold uppercase">
                                <Gavel size={10} />
                                {member.violationCount} gậy vi phạm
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Role Management Actions */}
                      <div className="flex items-center gap-2">
                        {/* Only the Owner can transfer ownership to others */}
                        {Number(getUserIdFromToken()) ===
                          Number(group.ownerId) &&
                          member.userId !== Number(getUserIdFromToken()) && (
                            <div className="flex gap-1">
                              <button
                                onClick={() =>
                                  handleUpdateRole(
                                    member.userId,
                                    member.fullName,
                                    "OWNER",
                                  )
                                }
                                className="p-2 text-yellow-500/40 hover:text-yellow-500 transition-colors"
                                title="Chuyển nhượng quyền sở hữu"
                              >
                                <Key size={20} />
                              </button>

                              <button
                                onClick={() => handleKickMember(member)}
                                className="p-2 text-red-500/40 hover:text-red-500 transition-colors"
                                title="Mời ra khỏi nhóm"
                              >
                                <UserMinus size={20} />
                              </button>
                            </div>
                          )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-text-secondary">
                    Chưa có thành viên nào.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "Bị cấm" && isAdmin && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-xl font-bold text-text-main">
                  Thành viên bị cấm
                </h3>
                <span className="text-sm text-text-secondary">
                  {bannedMembers.length || 0} thành viên
                </span>
              </div>
              <div className="bg-surface-main border border-border-main rounded-3xl overflow-hidden divide-y divide-border-main">
                {bannedMembers.length > 0 ? (
                  bannedMembers.map((member) => (
                    <div
                      key={member.userId}
                      className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={member.avatarUrl}
                          className="size-12 rounded-full border-2 border-border-main grayscale opacity-70"
                          alt=""
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-text-main line-through decoration-red-500/50 decoration-2">
                              {member.fullName}
                            </p>
                            <span className="px-2 py-0.5 text-[10px] font-black rounded uppercase bg-red-500/10 text-red-500 border border-red-500/20">
                              BANNED
                            </span>
                          </div>
                          <p className="text-xs text-text-secondary mt-0.5 italic">
                            Vi phạm lần cuối:{" "}
                            {member.lastViolationAt
                              ? new Date(member.lastViolationAt).toLocaleDateString()
                              : "N/A"}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded text-[10px] font-bold uppercase">
                              <Gavel size={10} />
                              {member.violationCount} gậy vi phạm
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleUnbanMember(member.userId)}
                        className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                      >
                        <ShieldCheck size={16} />
                        Gỡ lệnh cấm
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-text-secondary">
                    Chưa có thành viên nào bị cấm.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "Kiểm duyệt" && isAdmin && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="flex gap-4 border-b border-border-main">
                <button
                  onClick={() => setModTab("Bài viết")}
                  className={`pb-3 px-4 text-sm font-bold transition-all border-b-2 ${modTab === "Bài viết"
                    ? "text-primary border-primary"
                    : "text-text-secondary border-transparent"
                    }`}
                >
                  Bài viết chờ duyệt
                </button>
                <button
                  onClick={() => setModTab("Yêu cầu")}
                  className={`pb-3 px-4 text-sm font-bold transition-all border-b-2 ${modTab === "Yêu cầu"
                    ? "text-primary border-primary"
                    : "text-text-secondary border-transparent"
                    }`}
                >
                  Yêu cầu tham gia ({memberRequests.length})
                </button>
              </div>

              {modTab === "Bài viết" ? (
                <div className="space-y-6">
                  {pendingPosts.length === 0 ? (
                    <div className="text-center py-20 bg-card-dark rounded-3xl border border-[#3e2b1d] text-text-secondary font-medium">
                      Không có bài viết nào đang chờ duyệt.
                    </div>
                  ) : (
                    pendingPosts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-card-dark border border-[#3e2b1d] rounded-3xl overflow-hidden shadow-2xl"
                      >
                        {/* Post Header */}
                        <div className="p-6 border-b border-[#3e2b1d] flex items-center justify-between bg-white/[0.02]">
                          <div className="flex items-center gap-4">
                            <img
                              src={post.authorAvatar}
                              className="size-12 rounded-full border-2 border-primary/20 object-cover"
                              alt=""
                            />
                            <div>
                              <p className="font-black text-text-main">
                                {post.authorFullName}
                              </p>
                              <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold mt-0.5">
                                @{post.authorName} •{" "}
                                {new Date(post.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleActionPost(post.id, "approve")
                              }
                              className="px-5 py-2.5 bg-primary text-[#0f0a06] font-black rounded-xl text-xs uppercase tracking-widest transition-all hover:scale-105 hover:bg-orange-500 shadow-lg shadow-primary/20"
                            >
                              Phê duyệt
                            </button>
                            <button
                              onClick={() =>
                                handleActionPost(post.id, "reject")
                              }
                              className="px-5 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 font-black rounded-xl text-xs uppercase tracking-widest transition-all hover:bg-red-500/20"
                            >
                              Xóa bỏ
                            </button>
                          </div>
                        </div>

                        {/* Post Content */}
                        <div className="p-6 space-y-4">
                          <div className="text-text-main leading-relaxed whitespace-pre-wrap">
                            {post.content}
                          </div>

                          {/* AI Moderation Result Badge */}
                          <div className={`p-4 rounded-2xl border ${post.aiStatus === 'TOXIC'
                            ? 'bg-red-500/5 border-red-500/20 text-red-500'
                            : post.aiStatus === 'SUSPICIOUS'
                              ? 'bg-yellow-500/5 border-yellow-500/20 text-yellow-500'
                              : 'bg-green-500/5 border-green-500/20 text-green-500'
                            }`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                                <ShieldCheck size={16} />
                                Phân tích từ AI: {post.aiStatus || 'CHƯA KIỂM TRA'}
                              </div>
                              {post.aiScore !== null && (
                                <div className="text-xs font-black">
                                  Độ tin cậy: {(post.aiScore * 100).toFixed(0)}%
                                </div>
                              )}
                            </div>
                            <p className="text-xs opacity-80 leading-relaxed font-medium">
                              {post.aiReason || "Không có lý do chi tiết từ AI."}
                            </p>
                            <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-red-400">
                              <AlertTriangle size={12} />
                              LƯU Ý: Từ chối bài viết này sẽ tính 1 gậy vi phạm cho tác giả.
                            </div>
                          </div>

                          {post.images && post.images.length > 0 && (
                            <div
                              className={`grid gap-2 ${post.images.length === 1
                                ? "grid-cols-1"
                                : "grid-cols-2"
                                }`}
                            >
                              {post.images.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  className="w-full aspect-video object-cover rounded-2xl border border-white/5"
                                  alt=""
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {memberRequests.length === 0 ? (
                    <div className="text-center py-20 bg-card-dark rounded-3xl border border-[#3e2b1d] text-text-secondary">
                      Không có yêu cầu gia nhập nào.
                    </div>
                  ) : (
                    memberRequests.map((request) => (
                      <div
                        key={request.userId}
                        className="p-6 bg-card-dark border border-[#3e2b1d] rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={request.avatarUrl}
                            className="size-12 rounded-full border-2 border-primary/20"
                            alt=""
                          />
                          <div>
                            <p className="font-bold text-text-main">
                              {request.fullName}
                            </p>
                            <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold">
                              @{request.username} •{" "}
                              {new Date(request.joinedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                          <button
                            onClick={() =>
                              handleActionRequest(
                                request.userId,
                                request.fullName,
                                "approve",
                              )
                            }
                            className="flex-1 md:flex-none h-10 px-6 rounded-xl bg-primary text-[#0f0a06] font-black text-xs uppercase tracking-widest transition-all hover:bg-orange-500 shadow-lg shadow-primary/20"
                          >
                            Chấp nhận
                          </button>
                          <button
                            onClick={() =>
                              handleActionRequest(
                                request.userId,
                                request.fullName,
                                "reject",
                              )
                            }
                            className="flex-1 md:flex-none h-10 px-6 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 font-black text-xs uppercase tracking-widest transition-all hover:bg-red-500/20"
                          >
                            Từ chối
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ReportModal
        isOpen={showReportGroup}
        onClose={() => setShowReportGroup(false)}
        title={`Báo cáo nhóm ${group.name}`}
        subtitle="Hãy cho chúng tôi biết lý do bạn muốn báo cáo nhóm này"
        reasons={[
          "Nội dung không phù hợp",
          "Spam hoặc lừa đảo",
          "Quấy rối hoặc bắt nạt",
          "Ngôn từ thù ghét",
          "Nhóm giả mạo",
          "Khác",
        ]}
        targetPayload={{ targetType: "GROUP", targetId: group.id }}
        onSubmit={async (data) => {
          try {
            await reportService.createReport(data);
            toast.success("Đã gửi báo cáo thành công");
            setShowReportGroup(false);
          } catch (error) {
            console.error("Report failed:", error);
            toast.error("Gửi báo cáo thất bại");
          }
        }}
      />

      <InviteMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={handleInviteMembers}
        existingMemberIds={[
          ...members.map((m) => m.userId),
          ...bannedMembers.map((m) => m.userId),
        ]}
      />

      <ConfirmModal
        isOpen={showKickModal && !!memberToKick}
        onClose={() => {
          setShowKickModal(false);
          setMemberToKick(null);
        }}
        onConfirm={confirmKickMember}
        title="Xác nhận xóa thành viên"
        message={`Bạn có chắc chắn muốn mời ${memberToKick?.fullName} ra khỏi nhóm không?`}
        confirmText="Đồng ý xóa"
        cancelText="Hủy"
        type="danger"
        isLoading={isConfirmLoading}
      />

      <ConfirmModal
        isOpen={showTransferConfirmModal && !!memberToTransfer}
        onClose={() => {
          setShowTransferConfirmModal(false);
          setMemberToTransfer(null);
        }}
        onConfirm={confirmTransferOwnership}
        title="Xác nhận chuyển quyền"
        message={`Bạn có chắc chắn muốn chuyển quyền chủ sở hữu cho ${memberToTransfer?.fullName}? * Bạn sẽ trở thành thành viên thường sau khi chuyển quyền.`}
        confirmText="Xác nhận"
        cancelText="Hủy"
        type="warning"
        isLoading={isConfirmLoading}
      />

      <ConfirmModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onConfirm={confirmLeaveGroup}
        title="Xác nhận rời nhóm"
        message={`Bạn có chắc chắn muốn rời khỏi nhóm ${group.name} không?`}
        confirmText="Xác nhận rời"
        cancelText="Hủy"
        type="danger"
        isLoading={isConfirmLoading}
      />

      <ConfirmModal
        isOpen={!!memberToUnban}
        onClose={() => setMemberToUnban(null)}
        onConfirm={confirmUnbanMember}
        title="Xác nhận gỡ lệnh cấm"
        message="Bạn có chắc chắn muốn gỡ lệnh cấm cho thành viên này?"
        confirmText="Xác nhận"
        cancelText="Hủy"
        type="danger"
        isLoading={isPostDeleting}
      />

      {/* Approve/Reject Post Modal */}
      <ConfirmModal
        isOpen={!!postToAction}
        onClose={() => setPostToAction(null)}
        onConfirm={confirmPostAction}
        title={
          postToAction?.action === "approve"
            ? "Phê duyệt bài viết"
            : "Từ chối bài viết"
        }
        message={
          postToAction?.action === "approve"
            ? "Bạn có chắc chắn muốn phê duyệt bài viết này để hiển thị trên bản tin của nhóm?"
            : "Xóa bài viết này sẽ tính 1 gậy vi phạm cho tác giả. Bạn có chắc chắn muốn từ chối bài viết này?"
        }
        confirmText={postToAction?.action === "approve" ? "Duyệt ngay" : "Xóa bài"}
        cancelText="Hủy"
        type={postToAction?.action === "approve" ? "warning" : "danger"}
        isLoading={isConfirmLoading}
      />

      {/* Approve/Reject Member Request Modal */}
      <ConfirmModal
        isOpen={!!requestToAction}
        onClose={() => setRequestToAction(null)}
        onConfirm={confirmRequestAction}
        title={
          requestToAction?.action === "approve"
            ? "Chấp nhận thành viên"
            : "Từ chối yêu cầu"
        }
        message={
          requestToAction?.action === "approve"
            ? `Bạn có chắc chắn muốn phê duyệt cho ${requestToAction?.fullName} gia nhập cộng đồng?`
            : `Bạn có chắc chắn muốn từ chối yêu cầu gia nhập của ${requestToAction?.fullName}?`
        }
        confirmText={
          requestToAction?.action === "approve" ? "Chấp nhận" : "Tư chối"
        }
        cancelText="Hủy"
        type={requestToAction?.action === "approve" ? "warning" : "danger"}
        isLoading={isConfirmLoading}
      />

      {/* Transfer Ownership Modal */}
      <TransferOwnershipModal
        isOpen={showTransferOwnershipModal}
        onClose={() => setShowTransferOwnershipModal(false)}
        members={members}
        currentUserId={getUserIdFromToken()}
        onTransfer={handleTransferOwnership}
      />
    </>
  );
};

export default GroupDetailPage;
