import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import FriendService from '../services/friend/FriendService';
import FriendRequestService from '../services/friend/FriendRequestService';
import { updateFriendsCount } from '../redux/slices/userSlice';

export function useFriends(userId = null, initialParams = {}) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.user);

    // State
    const [friends, setFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState({ name: "", ...initialParams });

    // Constants
    const PAGE_SIZE = 12; // Reasonable size for grid

    // Reset list when filters change (search or userId changes)
    useEffect(() => {
        setFriends([]);
        setPage(0);
        setHasMore(true);
        // Does not trigger fetch here, fetch is triggered by loadMore or initial effect depending on design
        // Actually, let's trigger fetch here or let the infinite scroll component do it.
        // Better pattern: Filter change -> Reset -> Trigger Fetch Page 0
        fetchFriends(0, filters.name, true);
    }, [userId, filters.name]); // Re-fetch if user or search term changes

    const fetchFriends = useCallback(async (pageToFetch, searchName, isReset = false) => {
        setIsLoading(true);
        try {
            const fetchParams = {
                page: pageToFetch,
                size: PAGE_SIZE,
                name: searchName
            };

            let response;
            if (userId) {
                response = await FriendService.getFriends(userId, fetchParams);
            } else {
                response = await FriendService.getMyFriends(fetchParams);
            }

            let newFriends = (response.data.content || response.data || []).map(f => ({ ...f, type: 'FRIEND' }));

            // Enrichment Logic (Same as before)
            if (userId && user) {
                // ... (Keeping enrichment logic simple for brevity, assumed copied or we can keep it if needed)
                // For infinite scroll, enrichment might be expensive per chunk.
                // Let's copy the enrichment logic but ensure it runs on the new chunk only.
                try {
                    const pendingResponse = await FriendRequestService.getPendingRequests(0, 100);
                    const pendingRequests = pendingResponse.data.content || [];
                    const requestMap = new Map();
                    pendingRequests.forEach(req => {
                        requestMap.set(req.senderId, {
                            isRequestReceiver: true,
                            requestId: req.requestId
                        });
                    });

                    newFriends = newFriends.map(friend => {
                        if (friend.relationshipStatus === 'PENDING') {
                            const requestInfo = requestMap.get(friend.id);
                            if (requestInfo) {
                                return { ...friend, ...requestInfo };
                            } else {
                                return { ...friend, isRequestReceiver: false };
                            }
                        }
                        return friend;
                    });
                } catch (e) {
                    console.error("Enrich error", e);
                }
            }

            if (isReset) {
                setFriends(newFriends);
            } else {
                setFriends(prev => {
                    // Avoid duplicates just in case
                    const existingIds = new Set(prev.map(f => f.id));
                    const uniqueNew = newFriends.filter(f => !existingIds.has(f.id));
                    return [...prev, ...uniqueNew];
                });
            }

            // Check if we reached the end
            const totalElements = response.data.totalElements || 0; // Check API response structure
            const currentCount = isReset ? newFriends.length : friends.length + newFriends.length; // Approximate
            // Better: response.data.last or content.length < size
            if (newFriends.length < PAGE_SIZE || response.data.last) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

        } catch (error) {
            console.error("Error fetching friends:", error);
            toast.error("Không thể tải danh sách bạn bè");
        } finally {
            setIsLoading(false);
        }
    }, [userId, user]); // Removed dependencies to avoid loops, controlled by useEffect

    const loadMore = useCallback(() => {
        if (!isLoading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchFriends(nextPage, filters.name, false);
        }
    }, [isLoading, hasMore, page, filters.name, fetchFriends]);

    const updateFilter = useCallback((newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    const handleUnfriend = useCallback(async (friendId) => {
        const tid = toast.loading("Đang xử lý...");
        try {
            await FriendService.unfriend(friendId);
            toast.success("Đã hủy kết bạn", { id: tid });
            setFriends(prev => prev.filter(f => f.id !== friendId));
            return true;
        } catch (error) {
            toast.error("Không thể hủy kết bạn", { id: tid });
            return false;
        }
    }, []);

    const updateFriendStatus = useCallback((friendId, newStatus) => {
        setFriends(prev =>
            prev.map(f => f.id === friendId ? { ...f, relationshipStatus: newStatus } : f)
        );
    }, []);

    return {
        friends,
        isLoading,
        hasMore,
        loadMore,
        updateFilter,
        handleUnfriend,
        updateFriendStatus
    };
}

export function useFriendRequests() {
    const dispatch = useDispatch();
    // const { user } = useSelector((state) => state.auth); // Unused
    const { profile } = useSelector((state) => state.user);
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingRequests, setProcessingRequests] = useState({});

    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await FriendRequestService.getPendingRequests(0, 100);
            const mappedRequests = (response.data.content || []).map(r => ({ ...r, type: 'REQUEST' }));
            setRequests(mappedRequests);
        } catch (error) {
            console.error("Error fetching requests:", error);
            toast.error("Không thể tải lời mời kết bạn");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateLocalFriendsCount = useCallback((increment) => {
        if (profile) {
            const newCount = Math.max(0, (profile.friendsCount || 0) + increment);
            dispatch(updateFriendsCount(newCount));
        }
    }, [profile, dispatch]);

    const handleAcceptRequest = useCallback(async (request) => {
        setProcessingRequests(prev => ({ ...prev, [request.requestId]: 'accepting' }));
        try {
            await FriendRequestService.acceptRequest(request.requestId);
            toast.success("Đã chấp nhận lời mời!");
            setRequests(prev => prev.filter(r => r.requestId !== request.requestId));
            updateLocalFriendsCount(1); // Increase count by 1
            return true;
        } catch (error) {
            console.error("Error accepting request:", error);
            toast.error("Lỗi khi chấp nhận lời mời");
            return false;
        } finally {
            setProcessingRequests(prev => ({ ...prev, [request.requestId]: null }));
        }
    }, [updateLocalFriendsCount]);

    const handleRejectRequest = useCallback(async (request) => {


        setProcessingRequests(prev => ({ ...prev, [request.requestId]: 'rejecting' }));
        try {
            await FriendRequestService.rejectRequest(request.requestId);
            toast.success("Đã từ chối lời mời");
            setRequests(prev => prev.filter(r => r.requestId !== request.requestId));
            // No need to refresh profile for reject
            return true;
        } catch (error) {
            console.error("Error rejecting request:", error);
            toast.error("Lỗi khi từ chối lời mời");
            return false;
        } finally {
            setProcessingRequests(prev => ({ ...prev, [request.requestId]: null }));
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    return {
        requests,
        isLoading,
        processingRequests,
        fetchRequests,
        handleAcceptRequest,
        handleRejectRequest
    };
}
