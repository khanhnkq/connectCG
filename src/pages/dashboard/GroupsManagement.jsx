import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useCallback } from "react";
import GroupsRightSidebar from "../../components/groups/GroupsRightSidebar";

import {
  ShieldCheck,
  Globe,
  Lock,
  UserPlus,
  PlusSquare,
  User,
  LogIn,
  Settings,
  Search,
  Plus,
  Users,
} from "lucide-react";
import {
  findMyGroups,
  findDiscoverGroups,
  findPendingInvitations,
  acceptInvitation,
  declineInvitation,
  joinGroup,
  leaveGroup,
  searchGroups,
} from "../../services/groups/GroupService";
import toast from "react-hot-toast";

export default function GroupsManagement() {
  const navigate = useNavigate();
  const [yourGroups, setYourGroups] = useState([]);
  const [discoverGroups, setDiscoverGroups] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("my"); // 'my', 'discover', 'invites'
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination states
  const [, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const loaderRef = React.useRef(null);

  const fetchGroups = useCallback(
    async (pageToFetch) => {
      try {
        if (pageToFetch === 0) setLoading(true);
        else setIsFetchingMore(true);

        let response;
        if (searchQuery.trim()) {
          response = await searchGroups(searchQuery, pageToFetch);
        } else {
          switch (activeTab) {
            case "my":
              response = await findMyGroups(pageToFetch);
              break;
            case "discover":
              response = await findDiscoverGroups(pageToFetch);
              break;
            case "invites":
              response = await findPendingInvitations(); // Invites might not be paginated yet, but let's assume it returns a list or adapt
              break;
          }
        }

        // Handle paginated response (Spring Page object has 'content', 'last', 'totalPages')
        const newData = response.content || response;
        const isLast = response.last !== undefined ? response.last : true;

        if (activeTab === "my") {
          setYourGroups((prev) =>
            pageToFetch === 0 ? newData : [...prev, ...newData],
          );
        } else if (activeTab === "discover") {
          setDiscoverGroups((prev) =>
            pageToFetch === 0 ? newData : [...prev, ...newData],
          );
        } else {
          setPendingInvitations(newData);
        }

        setHasMore(!isLast);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
        toast.error("Không thể tải danh sách nhóm.");
      } finally {
        setLoading(false);
        setIsFetchingMore(false);
      }
    },
    [activeTab, searchQuery],
  );

  useEffect(() => {
    setPage(0);
    fetchGroups(0, true);
  }, [activeTab]); // Only refetch when changing tabs, not on search

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !loading &&
          !isFetchingMore
        ) {
          setPage((prev) => {
            const nextPage = prev + 1;
            fetchGroups(nextPage);
            return nextPage;
          });
        }
      },
      { threshold: 0.1 },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, isFetchingMore, activeTab]); // Removed searchQuery

  // Real-time synchronization for groups
  useEffect(() => {
    const handleMembershipEvent = (e) => {
      const { action, groupId, userId, member } = e.detail;
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const currentUserId = JSON.parse(userStr).id;

      // Only care if it's about the current user
      if (Number(userId) !== Number(currentUserId)) return;

      if (action === "INVITED") {
        setPendingInvitations((prev) => {
          if (prev.some((g) => g.id === groupId)) return prev;
          // Note: In a real app we'd fetch the group DTO if member object is just a membership
          // But here let's trigger a refresh of invitations to be safe and lazy
          fetchGroups(0);
          return prev;
        });
      } else if (action === "ACCEPTED" || action === "JOINED" || action === "APPROVED") {
        // Refresh My Groups and Invitations
        fetchGroups(0);
      } else if (action === "KICKED" || action === "LEFT" || action === "BANNED") {
        setYourGroups(prev => prev.filter(g => g.id !== groupId));
        setPendingInvitations(prev => prev.filter(g => g.id !== groupId));
        // If we are in discover, reset status
        setDiscoverGroups(prev => prev.map(g => g.id === groupId ? { ...g, currentUserStatus: null } : g));
      }
    };

    window.addEventListener("membershipEvent", handleMembershipEvent);
    return () =>
      window.removeEventListener("membershipEvent", handleMembershipEvent);
  }, [fetchGroups]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAcceptInvite = async (groupId) => {
    try {
      await acceptInvitation(groupId);
      toast.success("Đã chấp nhận lời mời tham gia nhóm!");
      // Refresh data
      const [myGroupsData, invitationsData] = await Promise.all([
        findMyGroups(),
        findPendingInvitations(),
      ]);
      setYourGroups(myGroupsData.content || myGroupsData);
      setPendingInvitations(invitationsData.content || invitationsData);
    } catch {
      toast.error("Không thể chấp nhận lời mời.");
    }
  };

  const handleDeclineInvite = async (groupId) => {
    try {
      await declineInvitation(groupId);
      toast.success("Đã từ chối lời mời.");
      const invitationsData = await findPendingInvitations();
      setPendingInvitations(invitationsData);
    } catch {
      toast.error("Không thể từ chối lời mời.");
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await joinGroup(groupId);

      // Tìm nhóm trong discoverGroups để kiểm tra privacy
      const targetGroup = discoverGroups.find((g) => g.id === groupId);
      const isPublic = targetGroup?.privacy === "PUBLIC";

      if (isPublic) {
        toast.success("Chào mừng bạn gia nhập nhóm!");
        // Cập nhật state ngay lập tức cho nhóm Public
        setDiscoverGroups((prev) =>
          prev.map((g) =>
            g.id === groupId ? { ...g, currentUserStatus: "ACCEPTED" } : g,
          ),
        );
        // Refresh myGroups để thêm nhóm mới vào
        const myGroupsData = await findMyGroups();
        setYourGroups(myGroupsData.content || myGroupsData);
      } else {
        toast.success("Đã gửi yêu cầu gia nhập nhóm!");
        // Cập nhật state cho nhóm Private
        setDiscoverGroups((prev) =>
          prev.map((g) =>
            g.id === groupId ? { ...g, currentUserStatus: "REQUESTED" } : g,
          ),
        );
      }
    } catch (error) {
      console.error("Join failed:", error);
      const errorMsg =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message ||
          "Không thể thực hiện yêu cầu gia nhập.";
      toast.error(errorMsg);
    }
  };

  const handleCancelJoinRequest = async (groupId) => {
    try {
      await leaveGroup(groupId);
      toast.success("Đã hủy yêu cầu gia nhập nhóm!");
      // Update local state instead of full refresh
      setDiscoverGroups((prev) =>
        prev.map((g) =>
          g.id === groupId ? { ...g, currentUserStatus: null } : g,
        ),
      );
    } catch (error) {
      console.error("Cancel join request failed:", error);
      toast.error("Không thể hủy yêu cầu gia nhập.");
    }
  };

  const checkIfAdmin = (group) => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return false;
    try {
      const userData = JSON.parse(userStr);
      return group.ownerId == userData.id || group.currentUserRole === "ADMIN";
    } catch {
      return false;
    }
  };

  const renderGroupCard = (group) => {
    const isAdmin = checkIfAdmin(group);
    const imageUrl =
      group.image ||
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000";
    const isMember = group.currentUserStatus === "ACCEPTED";
    const isPending =
      group.currentUserStatus === "REQUESTED" ||
      group.currentUserStatus === "PENDING";

    return (
      <div
        key={group.id}
        className={`bg-white dark:bg-card-dark rounded-3xl border overflow-hidden flex flex-col hover:border-primary/30 transition-all group h-full shadow-md dark:shadow-2xl relative ${isAdmin
          ? "border-orange-500/50 dark:shadow-orange-500/10"
          : "border-gray-200 dark:border-[#3e2b1d]"
          }`}
      >
        {/* Clickable Area: Image & Header - Everyone can now see basic info */}
        <div className="relative h-44 overflow-hidden">
          <Link
            to={`/dashboard/groups/${group.id}`}
            className="absolute inset-0 z-10 block cursor-pointer"
          />

          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url("${imageUrl}")` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
          {/* Status & Privacy Badges - Top Right */}
          <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-20">
            {isAdmin && (
              <div className="bg-orange-500 text-[#231810] text-[10px] font-black px-3 py-1.5 rounded-xl border border-white/20 shadow-xl flex items-center gap-1.5">
                <ShieldCheck size={14} />
                ADMIN
              </div>
            )}
            <div className="bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/10 shadow-lg">
              {group.privacy === "PUBLIC" ? (
                <Globe size={18} className="text-primary" />
              ) : (
                <Lock size={18} className="text-primary" />
              )}
              <span className="text-text-main text-[11px] font-black uppercase tracking-wider">
                {group.privacy === "PUBLIC" ? "Công khai" : "Riêng tư"}
              </span>
            </div>
          </div>

          {/* Admin Counts (Pending items) */}
          {isAdmin &&
            (group.pendingRequestsCount > 0 || group.pendingPostsCount > 0) && (
              <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                {group.pendingRequestsCount > 0 && (
                  <div
                    className="bg-red-500/90 backdrop-blur-md text-white px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/10 shadow-xl"
                    title={`${group.pendingRequestsCount} yêu cầu tham gia`}
                  >
                    <UserPlus size={16} />
                    <span className="text-[11px] font-bold">
                      {group.pendingRequestsCount}
                    </span>
                  </div>
                )}
                {group.pendingPostsCount > 0 && (
                  <div
                    className="bg-blue-500/90 backdrop-blur-md text-white px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/20 shadow-xl"
                    title={`${group.pendingPostsCount} bài viết chờ duyệt`}
                  >
                    <PlusSquare size={16} />
                    <span className="text-[11px] font-bold">
                      {group.pendingPostsCount}
                    </span>
                  </div>
                )}
              </div>
            )}

          <div className="absolute bottom-4 left-5 right-5 z-20 pointer-events-none">
            <h4 className="text-white font-bold text-xl leading-tight group-hover:text-primary transition-colors line-clamp-1">
              {group.name}
            </h4>
            <p className="text-white/80 text-xs font-medium italic flex items-center gap-1 mt-1">
              <User size={16} />
              {group.ownerFullName || group.ownerName}
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 flex flex-col flex-1 bg-white dark:bg-surface-main">
          <p className="text-text-secondary text-sm mb-6 line-clamp-2 leading-relaxed h-10">
            {group.description || "Chưa có mô tả cho nhóm này."}
          </p>

          <div className="mt-auto flex gap-3 relative z-30">
            {activeTab === "invites" ? (
              <>
                <button
                  onClick={() => handleAcceptInvite(group.id)}
                  className="flex-1 py-3 rounded-2xl bg-primary text-text-main font-black text-xs transition-all uppercase tracking-widest hover:bg-orange-600 active:scale-95 flex items-center justify-center"
                >
                  Chấp nhận
                </button>
                <button
                  onClick={() => handleDeclineInvite(group.id)}
                  className="flex-1 py-3 rounded-2xl bg-surface-main text-red-500 border border-border-main font-black text-xs transition-all uppercase tracking-widest hover:bg-red-500 hover:text-white active:scale-95 flex items-center justify-center"
                >
                  Từ chối
                </button>
              </>
            ) : group.currentUserStatus === "REQUESTED" ? (
              <button
                onClick={() => handleCancelJoinRequest(group.id)}
                className="flex-1 py-3 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20 font-black text-xs transition-all uppercase tracking-widest text-center flex items-center justify-center hover:bg-orange-500 hover:text-white"
              >
                Hủy yêu cầu
              </button>
            ) : group.currentUserStatus === "PENDING" ? (
              <div className="flex-1 py-3 rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/20 font-black text-xs transition-all uppercase tracking-widest text-center flex items-center justify-center italic">
                Mời tham gia
              </div>
            ) : isMember || isAdmin ? (
              <button
                onClick={() => navigate(`/dashboard/groups/${group.id}`)}
                className="flex-1 py-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 font-black text-xs transition-all uppercase tracking-widest hover:bg-primary hover:text-text-main active:scale-95 flex items-center justify-center gap-2"
              >
                <LogIn size={16} />
                Vào nhóm
              </button>
            ) : (
              <button
                onClick={() => handleJoinGroup(group.id)}
                className="flex-1 py-3 rounded-2xl bg-primary text-text-main font-black text-xs transition-all uppercase tracking-widest hover:bg-orange-600 active:scale-95 flex items-center justify-center gap-2"
              >
                <UserPlus size={16} />
                Tham gia
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => navigate(`/dashboard/groups/edit/${group.id}`)}
                className="px-4 py-3 rounded-2xl bg-surface-main text-primary border border-border-main hover:bg-primary hover:text-white transition-all active:scale-95 flex items-center justify-center group/settings"
                title="Cài đặt nhóm"
              >
                <Settings
                  size={18}
                  className="group-hover/settings:rotate-90 transition-transform"
                />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-background-main min-h-screen flex items-center justify-center">
        <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const filteredGroups = (groups) => {
    if (!searchQuery.trim()) return groups;
    const query = searchQuery.toLowerCase();
    return groups.filter(
      (g) =>
        g.name?.toLowerCase().includes(query) ||
        g.description?.toLowerCase().includes(query),
    );
  };

  const activeGroups = activeTab === "my"
    ? yourGroups
    : activeTab === "discover"
      ? discoverGroups
      : pendingInvitations;

  const displayedGroups = Array.isArray(activeGroups)
    ? filteredGroups(activeGroups)
    : [];

  return (
    <div className="flex w-full relative items-start transition-colors duration-300">
      <div className="flex-1 w-full bg-background-main min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-background-main/95 backdrop-blur-xl border-b border-border-main p-4 flex flex-col md:flex-row justify-between items-center px-4 md:px-8 gap-4 md:gap-0">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full md:w-auto">
            <h2 className="text-2xl font-extrabold text-text-main tracking-tight">
              Community Hub
            </h2>

            {/* Tabs */}
            <div className="flex bg-surface-main p-1 rounded-2xl border border-border-main">
              {["my", "discover", "invites"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSearchQuery("");
                  }}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab
                      ? "bg-primary text-text-main shadow-lg"
                      : "text-text-secondary hover:text-primary"
                    }`}
                >
                  {tab === "my"
                    ? "Của tôi"
                    : tab === "discover"
                      ? "Khám phá"
                      : "Lời mời"}
                  {tab === "invites" && pendingInvitations.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] items-center justify-center text-white font-bold">
                        {pendingInvitations.length}
                      </span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            {/* Search Bar - Hidden on XL screens as it moves to sidebar */}
            <div className="relative w-full md:w-80 group xl:hidden">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-primary transition-colors">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                className="block w-full pl-11 pr-4 py-2.5 border border-border-main rounded-2xl bg-surface-main text-text-main placeholder-text-secondary/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-xs font-medium"
                placeholder={
                  activeTab === "my"
                    ? "Tìm kiếm nhóm của bạn..."
                    : activeTab === "discover"
                      ? "Khám phá nhóm mới..."
                      : "Tìm lời mời..."
                }
              />
            </div>
            <Link
              to="/dashboard/groups/create"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-text-main hover:bg-orange-600 transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-500/20 active:scale-95 group"
            >
              <Plus
                size={18}
                className="group-hover:rotate-90 transition-transform"
              />
              Tạo nhóm
            </Link>
          </div>
        </div>

        <div className="px-4 md:px-8 py-6 md:py-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-text-secondary animate-pulse text-sm font-bold uppercase tracking-widest">
                Đang tải dữ liệu...
              </p>
            </div>
          ) : (
            <>
              {searchQuery.trim() !== "" && (
                <div className="mb-8">
                  <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Search size={18} />
                    Tìm thấy {displayedGroups.length} nhóm{" "}
                    {activeTab === "my" ? "của bạn" : "để khám phá"} cho "
                    {searchQuery}"
                  </h3>
                </div>
              )}

              {displayedGroups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {displayedGroups.map((group) => renderGroupCard(group))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 bg-surface-main rounded-[3rem] border border-dashed border-border-main">
                  <Users
                    size={60}
                    className="text-text-muted mb-4 opacity-20"
                  />
                  <p className="text-text-secondary font-medium">
                    Không tìm thấy nhóm nào phù hợp.
                  </p>
                  {searchQuery.trim() !== "" && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-4 text-primary text-xs font-black uppercase tracking-widest hover:underline"
                    >
                      Xóa tìm kiếm
                    </button>
                  )}
                </div>
              )}

              {/* Loading / End of List Indicator */}
              <div ref={loaderRef} className="py-10 flex justify-center w-full">
                {isFetchingMore ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary animate-pulse">
                      Đang tải thêm...
                    </span>
                  </div>
                ) : !hasMore && displayedGroups.length > 0 ? (
                  <div className="flex flex-col items-center gap-2 opacity-30">
                    <div className="h-px w-20 bg-border-main" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                      Bạn đã xem hết tất cả
                    </span>
                    <div className="h-px w-20 bg-border-main" />
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>

      <GroupsRightSidebar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        displayedGroupsLength={displayedGroups.length}
      />
    </div>
  );
}
