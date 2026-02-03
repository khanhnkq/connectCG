import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from 'react-hot-toast';
import ChatService from "../../services/chat/ChatService";
import UserProfileService from "../../services/user/UserProfileService";
import FriendSuggestionService from "../../services/FriendSuggestionService";
import FriendRequestService from "../../services/friend/FriendRequestService";

import { useFriends, useFriendRequests } from "../../hooks/useFriends";
import FriendsSidebar from "../../components/friends/FriendsSidebar";
import FriendsListPanel from "../../components/friends/FriendsListPanel";
import FriendProfileDetail from "../../components/friends/FriendProfileDetail";

export default function FriendsPage() {
    const { user: currentUser } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // UI State
    const [viewMode, setViewMode] = useState('ALL');
    const [activeItem, setActiveItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeProfileTab, setActiveProfileTab] = useState('about');

    // Profile Detail State
    const [fullProfile, setFullProfile] = useState(null);
    const [isProfileLoading, setIsProfileLoading] = useState(false);

    // Suggestions State
    const [suggestions, setSuggestions] = useState([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    const [processingSuggestions, setProcessingSuggestions] = useState({});

    // Custom Hooks
    const { friends, isLoading: friendsLoading, handleUnfriend, fetchFriends } = useFriends();
    const {
        requests,
        isLoading: requestsLoading,
        processingRequests,
        handleAcceptRequest: acceptRequest,
        handleRejectRequest: rejectRequest,
        fetchRequests
    } = useFriendRequests();

    // Fetch Suggestions
    const fetchSuggestions = async () => {
        setSuggestionsLoading(true);
        try {
            const response = await FriendSuggestionService.getSuggestions(0, 50);
            const formattedSuggestions = response.data.content.map(item => ({
                ...item,
                id: item.userId, // Map userId to id for consistent usage
                type: 'SUGGESTION'
            }));
            setSuggestions(formattedSuggestions);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            toast.error("Không thể tải danh sách gợi ý");
        } finally {
            setSuggestionsLoading(false);
        }
    };

    // Fetch suggestions when switching to SUGGESTIONS view
    useEffect(() => {
        if (viewMode === 'SUGGESTIONS' && suggestions.length === 0) {
            fetchSuggestions();
        }
    }, [viewMode, suggestions.length]);

    // Handle URL query parameter for tab
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'suggestions') {
            setViewMode('SUGGESTIONS');
            // Remove query param after setting viewMode
            setSearchParams({});
        } else if (tab === 'requests') {
            setViewMode('REQUESTS');
            setSearchParams({});
        } else if (tab === 'all') {
            setViewMode('ALL');
            setSearchParams({});
        }
    }, [searchParams, setSearchParams]);

    // Fetch data on mount
    useEffect(() => {
        const loadAllData = async () => {
            // Parallel fetch for counts
            fetchFriends();
            fetchRequests();
            if (suggestions.length === 0) {
                fetchSuggestions();
            }
        };
        loadAllData();
    }, []); // Run once on mount

    // Fetch full profile when activeItem changes
    useEffect(() => {
        const fetchFullProfile = async () => {
            if (!activeItem) {
                setFullProfile(null);
                return;
            }

            const targetId = activeItem.userId || activeItem.id || activeItem.senderId;
            setIsProfileLoading(true);

            try {
                // Always fetch fresh profile data to ensure accuracy
                const response = await UserProfileService.getUserProfile(targetId);
                setFullProfile(response.data);

                // If displaying suggestion, merge extra info from suggestion item
                if (activeItem.type === 'SUGGESTION') {
                    // Keep suggestion specific data if needed
                }

                setActiveProfileTab('about');
            } catch (error) {
                console.error("Error fetching profile:", error);
                // Fallback to activeItem data if fetch fails
                setFullProfile(activeItem);
            } finally {
                setIsProfileLoading(false);
            }
        };

        fetchFullProfile();
    }, [activeItem]);

    // Handlers
    const handleStartChat = async (friendId) => {
        const tid = toast.loading("Đang kết nối...");
        try {
            const response = await ChatService.getOrCreateDirectChat(friendId);
            const room = response.data;
            toast.success("Đã mở cuộc trò chuyện!", { id: tid });
            navigate('/dashboard/chat', { state: { selectedRoomKey: room.firebaseRoomKey } });
        } catch (error) {
            console.error("Error starting chat:", error);
            toast.error("Lỗi khi kết nối", { id: tid });
        }
    };

    const handleUnfriendWrapper = async (friendId) => {
        const success = await handleUnfriend(friendId);
        if (success && activeItem?.id === friendId) {
            setActiveItem(null);
        }
    };

    const handleAddFriend = async (id) => {
        setProcessingSuggestions(prev => ({ ...prev, [id]: 'adding' }));
        const tid = toast.loading("Đang gửi lời mời...");
        try {
            await FriendRequestService.sendFriendRequest(id);
            toast.success("Đã gửi lời mời kết bạn!", { id: tid });

            // Remove from suggestions list visually
            setSuggestions(prev => prev.filter(s => s.userId !== id));

            if (activeItem?.userId === id) {
                setActiveItem(null);
            }
        } catch (error) {
            console.error("Error sending friend request:", error);
            toast.error(error.response?.data?.message || "Lỗi khi gửi lời mời", { id: tid });
        } finally {
            setProcessingSuggestions(prev => {
                const newState = { ...prev };
                delete newState[id];
                return newState;
            });
        }
    };

    const handleDismissSuggestion = async (id) => {
        setProcessingSuggestions(prev => ({ ...prev, [id]: 'dismissing' }));
        try {
            await FriendSuggestionService.dismissSuggestion(id);
            toast.success("Đã ẩn gợi ý");
            setSuggestions(prev => prev.filter(s => s.userId !== id));

            if (activeItem?.userId === id) {
                setActiveItem(null);
            }
        } catch (error) {
            console.error("Error dismissing suggestion:", error);
            toast.error("Lỗi khi ẩn gợi ý");
        } finally {
            setProcessingSuggestions(prev => {
                const newState = { ...prev };
                delete newState[id];
                return newState;
            });
        }
    };

    const handleAcceptRequestWrapper = async (request) => {
        const success = await acceptRequest(request);
        if (success && activeItem?.requestId === request.requestId) {
            setActiveItem(null);
        }
    };

    const handleRejectRequestWrapper = async (request) => {
        const success = await rejectRequest(request);
        if (success && activeItem?.requestId === request.requestId) {
            setActiveItem(null);
        }
    };

    // Filter Logic
    const getDisplayedList = () => {
        let list = [];
        if (viewMode === 'ALL') list = friends;
        else if (viewMode === 'SUGGESTIONS') list = suggestions;
        else if (viewMode === 'REQUESTS') list = requests;

        if (!list) return [];

        return list.filter(item => {
            if (viewMode === 'REQUESTS') {
                const name = item.senderFullName || item.senderUsername || '';
                const username = item.senderUsername || '';
                return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    username.toLowerCase().includes(searchTerm.toLowerCase());
            }
            const name = item.fullName || item.username || '';
            const username = item.username || '';
            return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                username.toLowerCase().includes(searchTerm.toLowerCase());
        });
    };

    const displayedList = getDisplayedList();

    // Determine loading state based on view mode
    let isLoading = false;
    if (viewMode === 'ALL') isLoading = friendsLoading;
    else if (viewMode === 'REQUESTS') isLoading = requestsLoading;
    else if (viewMode === 'SUGGESTIONS') isLoading = suggestionsLoading;

    if (isLoading && displayedList.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-background-main">
                <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex overflow-hidden bg-background-main relative">
            <FriendsSidebar
                viewMode={viewMode}
                setViewMode={setViewMode}
                setActiveItem={setActiveItem}
                friendsCount={friends.length}
                requestsCount={requests.length}
                suggestionsCount={suggestions.length}
            />

            <FriendsListPanel
                viewMode={viewMode}
                displayedList={displayedList}
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                processingRequests={viewMode === 'SUGGESTIONS' ? processingSuggestions : processingRequests}
                onAcceptRequest={handleAcceptRequestWrapper}
                onRejectRequest={handleRejectRequestWrapper}
                onAddFriend={handleAddFriend}
                onDismissSuggestion={handleDismissSuggestion}
            />

            <div className={`${activeItem ? 'flex' : 'hidden'} xl:flex flex-1 flex-col bg-background-secondary relative border-l border-border-main`}>
                <FriendProfileDetail
                    activeItem={activeItem}
                    fullProfile={fullProfile}
                    isProfileLoading={isProfileLoading}
                    activeProfileTab={activeProfileTab}
                    setActiveProfileTab={setActiveProfileTab}
                    setActiveItem={setActiveItem}
                    viewMode={viewMode}
                    onStartChat={handleStartChat}
                    onUnfriend={handleUnfriendWrapper}
                    onAddFriend={handleAddFriend}
                    onDismissSuggestion={handleDismissSuggestion}
                    onAcceptRequest={handleAcceptRequestWrapper}
                    onRejectRequest={handleRejectRequestWrapper}
                />
            </div>
        </div>
    );
}
