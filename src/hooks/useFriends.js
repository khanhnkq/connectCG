import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import FriendService from '../services/friend/FriendService';
import FriendRequestService from '../services/friend/FriendRequestService';
import { updateFriendsCount } from '../redux/slices/userSlice';

export function useFriends(userId = null) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.user);
    const [friends, setFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFriends = async () => {
        setIsLoading(true);
        try {
            let response;
            if (userId) {
                // Fetch friends of a specific user
                response = await FriendService.getFriends(userId, { size: 100 });
            } else {
                // Fetch friends of current user
                response = await FriendService.getMyFriends({ size: 100 });
            }

            let mappedFriends = (response.data.content || response.data || []).map(f => ({ ...f, type: 'FRIEND' }));

            // If viewing someone else's friends, enrich with pending request data
            if (userId && user) {
                try {
                    // Fetch current user's pending requests (both sent and received)
                    const pendingResponse = await FriendRequestService.getPendingRequests(0, 100);
                    const pendingRequests = pendingResponse.data.content || [];

                    // Create a map of userId -> request info
                    const requestMap = new Map();
                    pendingRequests.forEach(req => {
                        requestMap.set(req.senderId, {
                            isRequestReceiver: true,  // Current user received this request
                            requestId: req.requestId
                        });
                    });

                    // Also fetch sent requests
                    const currentUserId = user?.id || user?.userId || user?.sub;

                    // Enrich friends data with request info
                    mappedFriends = mappedFriends.map(friend => {
                        if (friend.relationshipStatus === 'PENDING') {
                            const requestInfo = requestMap.get(friend.id);
                            if (requestInfo) {
                                // Current user received request from this friend
                                return { ...friend, ...requestInfo };
                            } else {
                                // Current user sent request to this friend
                                return {
                                    ...friend,
                                    isRequestReceiver: false,
                                    // requestId might not be available for sent requests
                                };
                            }
                        }
                        return friend;
                    });
                } catch (error) {
                    console.error("Error enriching friend data with requests:", error);
                }
            }

            setFriends(mappedFriends);
        } catch (error) {
            console.error("Error fetching friends:", error);
            toast.error("Không thể tải danh sách bạn bè");
        } finally {
            setIsLoading(false);
        }
    };

    const updateLocalFriendsCount = (increment) => {
        const currentUserId = user?.id || user?.userId || user?.sub;
        if (currentUserId && (!userId || userId === currentUserId) && profile) {
            // Only update if viewing own profile
            const newCount = Math.max(0, (profile.friendsCount || 0) + increment);
            dispatch(updateFriendsCount(newCount));
        }
    };

    const handleUnfriend = async (friendId) => {
        const tid = toast.loading("Đang xử lý...");
        try {
            await FriendService.unfriend(friendId);
            toast.success("Đã hủy kết bạn", { id: tid });
            setFriends(prev => prev.filter(f => f.id !== friendId));
            updateLocalFriendsCount(-1); // Decrease count by 1
            return true;
        } catch (error) {
            console.error("Error unfriending:", error);
            toast.error("Không thể hủy kết bạn", { id: tid });
            return false;
        }
    };

    const updateFriendStatus = (friendId, newStatus) => {
        setFriends(prev =>
            prev.map(f => f.id === friendId ? { ...f, relationshipStatus: newStatus } : f)
        );
    };

    useEffect(() => {
        fetchFriends();
    }, [userId]);

    return {
        friends,
        isLoading,
        fetchFriends,
        handleUnfriend,
        updateFriendStatus
    };
}

export function useFriendRequests() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.user);
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingRequests, setProcessingRequests] = useState({});

    const fetchRequests = async () => {
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
    };

    const updateLocalFriendsCount = (increment) => {
        if (profile) {
            const newCount = Math.max(0, (profile.friendsCount || 0) + increment);
            dispatch(updateFriendsCount(newCount));
        }
    };

    const handleAcceptRequest = async (request) => {
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
    };

    const handleRejectRequest = async (request) => {
        if (!window.confirm("Bạn muốn từ chối lời mời này?")) return false;

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
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return {
        requests,
        isLoading,
        processingRequests,
        fetchRequests,
        handleAcceptRequest,
        handleRejectRequest
    };
}
