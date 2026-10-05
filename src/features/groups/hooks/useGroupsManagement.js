import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useDebounce } from "../../../hooks/useDebounce";
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
} from "../../../services/groups/GroupService";

/**
 * Custom Hook: useGroupsManagement
 * Handles state management, pagination, search, realtime events and actions
 * for the Groups Management feature.
 */
export function useGroupsManagement() {
  const authenticatedUser = useSelector((state) => state.auth.user);
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab & Search States
  const activeTab = searchParams.get("tab") || "my";
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  // Group Lists
  const [managedGroups, setManagedGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [discoverGroups, setDiscoverGroups] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);

  // Loading States
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Pagination Trackers
  const managedPageRef = useRef(0);
  const joinedPageRef = useRef(0);
  const discoverPageRef = useRef(0);
  const fetchingRef = useRef(false);
  const loaderRef = useRef(null);

  const [managedHasMore, setManagedHasMore] = useState(true);
  const [joinedHasMore, setJoinedHasMore] = useState(true);
  const [discoverHasMore, setDiscoverHasMore] = useState(true);

  // Fetch groups according to tab and search query
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
          const newData = response.content || response || [];
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
                  const newData = res.content || res || [];
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
              const data = res.content || res || [];
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
              setPendingInvitations(invites.content || invites || []);
              setHasMore(false);
              break;
            }
            default:
              break;
          }
        }
      } catch (error) {
        console.error("Fetch groups error:", error);
        if (error.response?.status !== 400) {
          toast.error("Không thể tải danh sách nhóm.");
        }
      } finally {
        setLoading(false);
        setIsFetchingMore(false);
        fetchingRef.current = false;
      }
    },
    [activeTab, debouncedSearchQuery, hasMore, managedHasMore, joinedHasMore, discoverHasMore],
  );

  // Trigger initial load or search update
  useEffect(() => {
    fetchGroups(true);
  }, [activeTab, debouncedSearchQuery, fetchGroups]);

  // IntersectionObserver for infinite scrolling
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0]?.isIntersecting &&
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

  // Tab switching handler
  const handleTabChange = useCallback((newTab) => {
    setSearchParams(
      (prev) => {
        prev.set("tab", newTab);
        return prev;
      },
      { replace: true },
    );
    setSearchQuery("");
  }, [setSearchParams]);

  // Action: Accept invite
  const handleAcceptInvite = useCallback(async (groupId) => {
    try {
      await acceptInvitation(groupId);
      toast.success("Đã chấp nhận lời mời tham gia nhóm!");
      fetchGroups(true);
    } catch {
      toast.error("Không thể chấp nhận lời mời.");
    }
  }, [fetchGroups]);

  // Action: Decline invite
  const handleDeclineInvite = useCallback(async (groupId) => {
    try {
      await declineInvitation(groupId);
      toast.success("Đã từ chối lời mời.");
      setPendingInvitations((prev) => prev.filter((g) => g.id !== groupId));
    } catch {
      toast.error("Không thể từ chối lời mời.");
    }
  }, []);

  // Action: Join group
  const handleJoinGroup = useCallback(async (groupId) => {
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
  }, [discoverGroups, fetchGroups]);

  // Action: Cancel join request
  const handleCancelJoinRequest = useCallback(async (groupId) => {
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
  }, []);

  // Helper: check if authenticated user is admin/owner
  const checkIfAdmin = useCallback((group) => {
    return (
      Number(group.ownerId) === Number(authenticatedUser?.id) ||
      group.currentUserRole === "ADMIN"
    );
  }, [authenticatedUser?.id]);

  // Real-time synchronization
  useEffect(() => {
    const handleEvent = (e) => {
      const { action, groupId, userId } = e.detail || {};
      if (Number(userId) !== Number(authenticatedUser?.id)) return;

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
  }, [fetchGroups, authenticatedUser?.id]);

  // Filter groups locally based on search input
  const filteredGroups = useCallback((groups) => {
    if (!searchQuery.trim()) return groups || [];
    const q = searchQuery.toLowerCase();
    return (groups || []).filter(
      (g) =>
        g.name?.toLowerCase().includes(q) ||
        g.description?.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const displayedGroups =
    activeTab === "my"
      ? []
      : activeTab === "discover"
      ? discoverGroups
      : pendingInvitations;

  return {
    activeTab,
    searchQuery,
    setSearchQuery,
    managedGroups,
    joinedGroups,
    discoverGroups,
    pendingInvitations,
    displayedGroups,
    loading,
    isFetchingMore,
    hasMore,
    loaderRef,
    handleTabChange,
    handleAcceptInvite,
    handleDeclineInvite,
    handleJoinGroup,
    handleCancelJoinRequest,
    checkIfAdmin,
    filteredGroups,
    refetch: () => fetchGroups(true),
  };
}

export default useGroupsManagement;
