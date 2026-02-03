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
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showKickModal, setShowKickModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showTransferConfirmModal, setShowTransferConfirmModal] =
    useState(false);
  const [memberToKick, setMemberToKick] = useState(null);
  const [memberToTransfer, setMemberToTransfer] = useState(null);

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
    handleUpdatePost,
    confirmDelete,
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
      if (currentUserId) {
        // Check Group management rights: Owner OR Group Admin
        if (
          groupData.ownerId === currentUserId ||
          groupData.currentUserRole === "ADMIN"
        ) {
          setIsAdmin(true);

          // Admin capabilities: Fetch pending lists
          try {
            const requests = await getPendingRequests(id);
            setMemberRequests(requests);
            const pPosts = await getPendingPosts(id);
            setPendingPosts(pPosts);
          } catch {
            console.log(
              "Not authorized to fetch pending items (or handled by API)",
            );
          }
        } else {
          setIsAdmin(false);
        }
      }

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
    } catch (error) {
      console.error("Failed to fetch group:", error);
      toast.error("Không thể tải thông tin nhóm");
      navigate("/dashboard/groups");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchGroupData();
  }, [fetchGroupData]);

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
    }
  };

  const confirmKickMember = async () => {
    if (!memberToKick) return;
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
    }
  };

  const handleActionPost = async (postId, action) => {
    try {
      if (action === "approve") {
        await approvePost(group.id, postId);
        toast.success("Đã duyệt bài viết!");
      } else {
        await rejectPost(group.id, postId);
        toast.success("Đã xóa bài viết!");
      }
      // Refresh data
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
      // Refresh data
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
                    className="flex-1 sm:flex-none h-10 px-6 rounded-full bg-primary hover:bg-orange-600 text-[#231810] font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                  >
                    <CheckCircle2 size={20} />
                    Chấp nhận
                  </button>
                  <button
                    onClick={handleDeclineInvite}
                    className="flex-1 sm:flex-none h-10 px-6 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 backdrop-blur-md font-bold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <UserMinus size={20} />
                    Từ chối
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleJoinGroup}
                  className="flex-1 sm:flex-none h-10 px-6 rounded-full bg-primary hover:bg-orange-600 text-[#231810] font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                  <PlusCircle size={20} />
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
                { en: "Photos", vi: "Ảnh" },
                { en: "Events", vi: "Sự kiện" },
              ]
                .filter(
                  () =>
                    group.privacy === "PUBLIC" ||
                    userMembership?.status === "ACCEPTED" ||
                    isAdmin,
                )
                .map((tab) => (
                  <button
                    key={tab.en}
                    onClick={() => setActiveTab(tab.vi)}
                    className={`py-4 font-bold text-sm tracking-wide whitespace-nowrap transition-all border-b-2 ${
                      activeTab === tab.vi
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
                  className={`py-4 font-black text-sm tracking-widest whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                    activeTab === "Kiểm duyệt"
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
                {group.privacy === "PRIVATE" &&
                userMembership?.status !== "ACCEPTED" &&
                !isAdmin ? (
                  <div className="bg-surface-main rounded-[2.5rem] p-12 border border-border-main text-center space-y-6">
                    <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-8">
                      <Lock size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-text-main">
                      Đây là nhóm Riêng tư
                    </h2>
                    <p className="text-text-secondary max-w-md mx-auto leading-relaxed">
                      {userMembership?.status === "PENDING"
                        ? "Bạn đã nhận được lời mời tham gia nhóm này. Vui lòng phản hồi lời mời ở phía trên để xem nội dung."
                        : userMembership?.status === "REQUESTED"
                        ? "Yêu cầu gia nhập của bạn đang chờ quản trị viên phê duyệt. Nội dung sẽ hiển thị sau khi yêu cầu được chấp nhận."
                        : "Nội dung và danh sách thành viên của nhóm này đã được ẩn. Vui lòng gia nhập nhóm để tham gia cộng đồng."}
                    </p>
                    {!userMembership?.status && (
                      <button
                        onClick={handleJoinGroup}
                        className="px-10 py-4 bg-primary hover:bg-orange-600 text-[#231810] font-black rounded-2xl transition-all shadow-xl shadow-primary/20 uppercase tracking-widest"
                      >
                        Gửi yêu cầu gia nhập
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
                            className="px-8 py-3 bg-primary hover:bg-orange-600 text-[#231810] font-black rounded-xl transition-all shadow-lg shadow-primary/20 uppercase tracking-widest text-xs"
                          >
                            Tham gia ngay
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
                              className={`px-2 py-0.5 text-[10px] font-black rounded uppercase ${
                                member.role === "ADMIN"
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

          {activeTab === "Kiểm duyệt" && isAdmin && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="flex gap-4 border-b border-border-main">
                <button
                  onClick={() => setModTab("Bài viết")}
                  className={`pb-3 px-4 text-sm font-bold transition-all border-b-2 ${
                    modTab === "Bài viết"
                      ? "text-primary border-primary"
                      : "text-text-secondary border-transparent"
                  }`}
                >
                  Bài viết chờ duyệt
                </button>
                <button
                  onClick={() => setModTab("Yêu cầu")}
                  className={`pb-3 px-4 text-sm font-bold transition-all border-b-2 ${
                    modTab === "Yêu cầu"
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

                          {post.images && post.images.length > 0 && (
                            <div
                              className={`grid gap-2 ${
                                post.images.length === 1
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
                        className="p-6 bg-card-dark border border-[#3e2b1d] rounded-2xl flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={request.avatarUrl}
                            className="size-14 rounded-full border-2 border-primary/20"
                            alt=""
                          />
                          <div>
                            <p className="font-black text-text-main text-lg">
                              {request.fullName}
                            </p>
                            <p className="text-xs text-text-secondary mt-1 italic">
                              Đã yêu cầu vào{" "}
                              {new Date(request.joinedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              handleActionRequest(request.userId, "approve")
                            }
                            className="px-6 py-2.5 bg-primary text-text-main font-black rounded-xl text-sm transition-all hover:scale-105"
                          >
                            Phê duyệt
                          </button>
                          <button
                            onClick={() =>
                              handleActionRequest(request.userId, "reject")
                            }
                            className="px-6 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 font-black rounded-xl text-sm transition-all hover:bg-red-500/20"
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
        existingMemberIds={members.map((m) => m.userId)}
      />

      {/* Kick Member Confirmation Modal */}
      {showKickModal && memberToKick && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-main border border-border-main rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto">
              <UserMinus size={36} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-text-main">
                Xác nhận xóa thành viên
              </h2>
              <p className="text-text-secondary text-sm">
                Bạn có chắc chắn muốn mời{" "}
                <span className="text-text-main font-bold">
                  {memberToKick.fullName}
                </span>{" "}
                ra khỏi nhóm không?
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowKickModal(false);
                  setMemberToKick(null);
                }}
                className="flex-1 py-3 bg-surface-main hover:bg-background-main text-text-main font-bold rounded-xl transition-all text-xs uppercase tracking-widest"
              >
                Hủy
              </button>
              <button
                onClick={confirmKickMember}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-black rounded-xl transition-all shadow-lg shadow-red-500/20 text-xs uppercase tracking-widest"
              >
                Đồng ý xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {showTransferConfirmModal && memberToTransfer && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-main border border-border-main rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="size-16 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mx-auto">
              <Key size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white">
                Xác nhận chuyển quyền
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed">
                Bạn có chắc chắn muốn chuyển quyền chủ sở hữu cho{" "}
                <span className="text-text-main font-bold">
                  {memberToTransfer.fullName}
                </span>
                ?
              </p>
              <p className="text-text-secondary text-xs italic">
                * Bạn sẽ trở thành thành viên thường sau khi chuyển quyền.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowTransferConfirmModal(false);
                  setMemberToTransfer(null);
                }}
                className="flex-1 py-3 bg-surface-main hover:bg-background-main text-text-main font-bold rounded-xl transition-all text-xs uppercase tracking-widest"
              >
                Hủy
              </button>
              <button
                onClick={confirmTransferOwnership}
                className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl transition-all shadow-lg shadow-orange-500/20 text-xs uppercase tracking-widest"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Group Confirmation Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1a120b] border border-[#3e2b1d] rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto">
              <LogOut size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white">
                Xác nhận rời nhóm
              </h2>
              <p className="text-text-secondary text-sm">
                Bạn có chắc chắn muốn rời khỏi nhóm{" "}
                <span className="text-white font-bold">{group.name}</span>{" "}
                không?
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowLeaveModal(false)}
                className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all text-xs uppercase tracking-widest"
              >
                Hủy
              </button>
              <button
                onClick={confirmLeaveGroup}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-black rounded-xl transition-all shadow-lg shadow-red-500/20 text-xs uppercase tracking-widest"
              >
                Xác nhận rời
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, postId: null })}
        onConfirm={confirmDelete}
        title="Xóa bài viết"
        message="Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
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
