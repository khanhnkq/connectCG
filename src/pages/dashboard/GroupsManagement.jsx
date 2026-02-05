import { useNavigate, useSearchParams, Link } from "react-router-dom";
import React, { useEffect, useState, useCallback, useRef } from "react";
import GroupsRightSidebar from "../../components/groups/GroupsRightSidebar";
import GroupCard from "../../components/groups/GroupCard";
import { useDebounce } from "../../hooks/useDebounce";
import { ShieldCheck, Search, Plus, Users } from "lucide-react";
import {
  findDiscoverGroups,
  findPendingInvitations,
  acceptInvitation,
  declineInvitation,
  joinGroup,
  leaveGroup,
  searchGroups,
  findMyManagedGroups,
  findMyJoinedGroups,
} from "../../services/groups/GroupService";
import toast from "react-hot-toast";

export default function GroupsManagement() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // States
  const [managedGroups, setManagedGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [discoverGroups, setDiscoverGroups] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const activeTab = searchParams.get("tab") || "my";
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  // Refs for pagination tracking
  const managedPageRef = useRef(0);
  const joinedPageRef = useRef(0);
  const discoverPageRef = useRef(0);
  const fetchingRef = useRef(false);
  const loaderRef = useRef(null);

  const [managedHasMore, setManagedHasMore] = useState(true);
  const [joinedHasMore, setJoinedHasMore] = useState(true);
  const [discoverHasMore, setDiscoverHasMore] = useState(true);

  const fetchGroups = useCallback(
    async (isInitialLoad = false) => {
      if (!isInitialLoad && (fetchingRef.current || !hasMore)) return;

      try {
        fetchingRef.current = true;
        if (isInitialLoad) {
          setLoading(true);
          managedPageRef.current = 0;
          joinedPageRef.current = 0;
          discoverPageRef.current = 0;
          setManagedHasMore(true);
          setJoinedHasMore(true);
          setDiscoverHasMore(true);
          setHasMore(true);
        } else {
          setIsFetchingMore(true);
        }

        if (debouncedSearchQuery.trim()) {
          const response = await searchGroups(
            debouncedSearchQuery,
            discoverPageRef.current,
          );
          const newData = response.content || response;
          const isLast = response.last ?? true;

          setDiscoverGroups((prev) =>
            isInitialLoad ? newData : [...prev, ...newData],
          );
          setDiscoverHasMore(!isLast);
          setHasMore(!isLast);
          if (!isLast) discoverPageRef.current += 1;
        } else {
          switch (activeTab) {
            case "my": {
              const promises = [];
              const typeMap = [];
              if (managedHasMore || isInitialLoad) {
                promises.push(findMyManagedGroups(managedPageRef.current));
                typeMap.push("managed");
              }
              if (joinedHasMore || isInitialLoad) {
                promises.push(findMyJoinedGroups(joinedPageRef.current));
                typeMap.push("joined");
              }

              if (promises.length === 0) {
                setHasMore(false);
              } else {
                const results = await Promise.all(promises);
                let mMore = managedHasMore;
                let jMore = joinedHasMore;

                results.forEach((res, index) => {
                  const type = typeMap[index];
                  const newData = res.content || res;
                  const isLast = res.last ?? true;
                  if (type === "managed") {
                    setManagedGroups((prev) =>
                      isInitialLoad ? newData : [...prev, ...newData],
                    );
                    mMore = !isLast;
                    setManagedHasMore(!isLast);
                    if (!isLast) managedPageRef.current += 1;
                  } else {
                    setJoinedGroups((prev) =>
                      isInitialLoad ? newData : [...prev, ...newData],
                    );
                    jMore = !isLast;
                    setJoinedHasMore(!isLast);
                    if (!isLast) joinedPageRef.current += 1;
                  }
                });
                setHasMore(mMore || jMore);
              }
              break;
            }

            case "discover": {
              if (!discoverHasMore && !isInitialLoad) {
                setHasMore(false);
                break;
              }
              const res = await findDiscoverGroups(discoverPageRef.current);
              const data = res.content || res;
              const last = res.last ?? true;
              setDiscoverGroups((prev) =>
                isInitialLoad ? data : [...prev, ...data],
              );
              setDiscoverHasMore(!last);
              setHasMore(!last);
              if (!last) discoverPageRef.current += 1;
              break;
            }

            case "invites": {
              const invites = await findPendingInvitations();
              setPendingInvitations(invites.content || invites);
              setHasMore(false);
              break;
            }
          }
        }
      } catch (error) {
        console.error("Fetch groups error:", error);
        if (error.response?.status !== 400)
          toast.error("Không thể tải danh sách nhóm.");
      } finally {
        setLoading(false);
        setIsFetchingMore(false);
        fetchingRef.current = false;
      }
    },
    [activeTab, debouncedSearchQuery],
  );

  // Trigger initial load or search
  useEffect(() => {
    fetchGroups(true);
  }, [activeTab, debouncedSearchQuery, fetchGroups]);

  // Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !loading &&
          !isFetchingMore
        ) {
          fetchGroups(false);
        }
      },
      { threshold: 0.1 },
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, isFetchingMore, fetchGroups]);

  // Event Handlers
  const handleTabChange = (newTab) => {
    setSearchParams(
      (prev) => {
        prev.set("tab", newTab);
        return prev;
      },
      { replace: true },
    );
    setSearchQuery("");
  };

  const handleAcceptInvite = async (groupId) => {
    try {
      await acceptInvitation(groupId);
      toast.success("Đã chấp nhận lời mời tham gia nhóm!");
      fetchGroups(true);
    } catch {
      toast.error("Không thể chấp nhận lời mời.");
    }
  };

  const handleDeclineInvite = async (groupId) => {
    try {
      await declineInvitation(groupId);
      toast.success("Đã từ chối lời mời.");
      setPendingInvitations((prev) => prev.filter((g) => g.id !== groupId));
    } catch {
      toast.error("Không thể từ chối lời mời.");
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await joinGroup(groupId);
      const group = discoverGroups.find((g) => g.id === groupId);
      if (group?.privacy === "PUBLIC") {
        toast.success("Chào mừng bạn gia nhập nhóm!");
        setDiscoverGroups((prev) =>
          prev.map((g) =>
            g.id === groupId ? { ...g, currentUserStatus: "ACCEPTED" } : g,
          ),
        );
        fetchGroups(true);
      } else {
        toast.success("Đã gửi yêu cầu gia nhập nhóm!");
        setDiscoverGroups((prev) =>
          prev.map((g) =>
            g.id === groupId ? { ...g, currentUserStatus: "REQUESTED" } : g,
          ),
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Không thể thực hiện yêu cầu.",
      );
    }
  };

  const handleCancelJoinRequest = async (groupId) => {
    try {
      await leaveGroup(groupId);
      toast.success("Đã hủy yêu cầu tham gia!");
      setDiscoverGroups((prev) =>
        prev.map((g) =>
          g.id === groupId ? { ...g, currentUserStatus: null } : g,
        ),
      );
    } catch {
      toast.error("Không thể hủy yêu cầu.");
    }
  };

  const checkIfAdmin = (group) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return group.ownerId == user.id || group.currentUserRole === "ADMIN";
  };

  // Real-time synchronization
  useEffect(() => {
    const handleEvent = (e) => {
      const { action, groupId, userId } = e.detail;
      const currentUserId = JSON.parse(localStorage.getItem("user") || "{}").id;
      if (Number(userId) !== Number(currentUserId)) return;

      if (["ACCEPTED", "JOINED", "APPROVED", "INVITED"].includes(action)) {
        fetchGroups(true);
      } else if (["KICKED", "LEFT", "BANNED"].includes(action)) {
        setManagedGroups((prev) => prev.filter((g) => g.id !== groupId));
        setJoinedGroups((prev) => prev.filter((g) => g.id !== groupId));
        setPendingInvitations((prev) => prev.filter((g) => g.id !== groupId));
        setDiscoverGroups((prev) =>
          prev.map((g) =>
            g.id === groupId ? { ...g, currentUserStatus: null } : g,
          ),
        );
      }
    };
    window.addEventListener("membershipEvent", handleEvent);
    return () => window.removeEventListener("membershipEvent", handleEvent);
  }, [fetchGroups]);

  const filteredGroups = (groups) => {
    if (!searchQuery.trim()) return groups;
    const q = searchQuery.toLowerCase();
    return groups.filter(
      (g) =>
        g.name?.toLowerCase().includes(q) ||
        g.description?.toLowerCase().includes(q),
    );
  };

  const displayedGroups =
    activeTab === "my"
      ? []
      : activeTab === "discover"
      ? discoverGroups
      : pendingInvitations;

  return (
    <div className="flex w-full relative items-start transition-colors duration-300">
      <div className="flex-1 w-full bg-background-main min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-background-main/95 backdrop-blur-xl border-b border-border-main p-3 md:p-4 flex flex-col md:flex-row justify-between items-center px-4 md:px-8 gap-3 md:gap-0">
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-8 w-full md:w-auto">
            {/* Tabs */}
            <div className="flex bg-surface-main p-1 rounded-2xl border border-border-main w-full md:w-auto">
              {["my", "discover", "invites"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all relative ${
                    activeTab === tab
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
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 group xl:hidden">
              <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center text-text-secondary group-focus-within:text-primary transition-colors">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-9 md:pl-11 pr-4 py-2 md:py-2.5 border border-border-main rounded-2xl bg-surface-main text-text-main text-[10px] md:text-xs"
                placeholder="Tìm kiếm..."
              />
            </div>
            <Link
              to="/dashboard/groups/create"
              className="flex items-center justify-center gap-2 h-9 md:h-auto px-3 md:px-6 py-2 md:py-2.5 rounded-full bg-primary text-text-main hover:bg-orange-600 font-black text-xs uppercase shadow-lg"
            >
              <Plus size={18} />
              <span className="hidden md:inline">Tạo nhóm</span>
            </Link>
          </div>
        </div>

        <div className="px-4 md:px-8 py-6 md:py-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-text-secondary font-bold uppercase tracking-widest">
                Đang tải...
              </p>
            </div>
          ) : (
            <>
              {searchQuery.trim() !== "" && (
                <div className="mb-8">
                  <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Search size={18} />
                    Tìm thấy{" "}
                    {activeTab === "my"
                      ? filteredGroups(managedGroups).length +
                        filteredGroups(joinedGroups).length
                      : filteredGroups(displayedGroups).length}{" "}
                    kết quả cho "{searchQuery}"
                  </h3>
                </div>
              )}

              {activeTab === "my" ? (
                <div className="space-y-12">
                  {managedGroups.length > 0 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <h2 className="text-lg font-black text-text-main uppercase tracking-widest flex items-center gap-2">
                          <ShieldCheck className="text-orange-500" size={24} />
                          Nhóm bạn quản lý
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-border-main to-transparent" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredGroups(managedGroups).map((g) => (
                          <GroupCard
                            key={g.id}
                            group={g}
                            activeTab={activeTab}
                            isAdmin={true}
                            onNavigate={navigate}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {joinedGroups.length > 0 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <h2 className="text-lg font-black text-text-main uppercase tracking-widest flex items-center gap-2">
                          <Users className="text-primary" size={24} />
                          Nhóm bạn tham gia
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-border-main to-transparent" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredGroups(joinedGroups).map((g) => (
                          <GroupCard
                            key={g.id}
                            group={g}
                            activeTab={activeTab}
                            isAdmin={false}
                            onNavigate={navigate}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : filteredGroups(displayedGroups).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredGroups(displayedGroups).map((g) => (
                    <GroupCard
                      key={g.id}
                      group={g}
                      activeTab={activeTab}
                      isAdmin={checkIfAdmin(g)}
                      onAccept={handleAcceptInvite}
                      onDecline={handleDeclineInvite}
                      onJoin={handleJoinGroup}
                      onCancelRequest={handleCancelJoinRequest}
                      onNavigate={navigate}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center opacity-50">
                  <Users size={60} className="mx-auto mb-4" />
                  <p>Không tìm thấy nhóm phù hợp.</p>
                </div>
              )}

              <div ref={loaderRef} className="py-10 flex justify-center w-full">
                {isFetchingMore ? (
                  <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                ) : (
                  !hasMore &&
                  !loading && (
                    <span className="text-[10px] opacity-30 font-black uppercase tracking-widest">
                      Bạn đã xem hết tất cả
                    </span>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <GroupsRightSidebar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        displayedGroupsLength={
          activeTab === "my"
            ? managedGroups.length + joinedGroups.length
            : displayedGroups.length
        }
      />
    </div>
  );
}
