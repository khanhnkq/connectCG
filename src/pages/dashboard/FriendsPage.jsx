import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import ChatService from "../../services/chat/ChatService";
import UserProfileService from "../../services/user/UserProfileService";

import { useFriends, useFriendRequests } from "../../hooks/useFriends";
import FriendsSidebar from "../../components/friends/FriendsSidebar";
import FriendsListPanel from "../../components/friends/FriendsListPanel";
import FriendProfileDetail from "../../components/friends/FriendProfileDetail";

export default function FriendsPage() {
    const { user: currentUser } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    // UI State
    const [viewMode, setViewMode] = useState('ALL');
    const [activeItem, setActiveItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeProfileTab, setActiveProfileTab] = useState('about');

    // Profile Detail State
    const [fullProfile, setFullProfile] = useState(null);
    const [isProfileLoading, setIsProfileLoading] = useState(false);

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

    // Mock suggestions data
    const [suggestions] = useState([
        {
            id: 101,
            userId: 101,
            fullName: 'Hồng Nhung',
            username: 'hongnhung',
            age: 24,
            city: 'Hà Nội',
            avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA61rF2qJA_61d08hoKQD1vgLttk99SWH-2mhQvPCoH57mhr0UjI8L7ybrsEWnI2oLFtMUesiVK-j9CGmOjLqaDBSP4VGvvtSiwItxsARYkGe8mEsW7qwBkWXGsCjQLKe10vZ7AQv05zjKn0dsPLE5BUEJCjrwzv9TUcPhyKj43H7MuKHeGmqxrZrq5_s7ODalnsrwBejsIxD4NsrZetKdfuu5WRkwVCT304dnvOmT15inm4rJUGChESlWiT5jnp5f3NqPpm8kKCv0',
            mutualFriends: 12,
            reason: 'Có cùng sở thích: Du lịch',
            isOnline: true,
            type: 'SUGGESTION'
        },
        {
            id: 102,
            userId: 102,
            fullName: 'Tuấn Anh',
            username: 'tuananh',
            age: 29,
            city: 'TP. HCM',
            avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdoLrCwAT83JCL6U8m7TnDC0oM8kn4OVr5XeeYADi_UYRinmq2C0fIwzychqDESZvGWD0nS5EqD_0hTACwjoHHIUqj1bI5Ic1EQZ75Oef8FoxX0B7g4dp_lmTjf44WtIpjrF_Ygs2b0iQ90dlQzFyapA7Oh2Pm1-peCNesZBogBZhUpUCXOnp5_KqLP9H-cm69o1uTTt-sGGAzw11HFpXZ7pvgNJkIjC9OPnhWLCMXWKlgZz2nKU2pguarVqXSrrVwTiSrRLt4h5g',
            mutualFriends: 8,
            reason: 'Thành viên mới gần bạn',
            isOnline: false,
            type: 'SUGGESTION'
        },
        {
            id: 103,
            userId: 103,
            fullName: 'Minh Thư',
            username: 'minhthu',
            age: 26,
            city: 'Đà Nẵng',
            avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA2lYtnTFCA75HFG_52JszPx-az718WMOboPAn-G1i24N852_c8WMA84zaSIjPhM2bLmVoY8itXvafnzxb5VjPbzRUZp6AXCKTfAEXa9jysG_6eND1TYZ0D1OFOXHtOKIWA2x0OJxEozgg2vR_FVWQLKzKDMrEuV3ZX9MEa8yOLevyaZjSYY0z7uQTwuSXWp4HBjjqAcBcZLqU4iAoqv71JyHkK1TW8TD9Rt3KVz3qa5jC8Xq-idWXHr3qpktV4H962cWYDM__P1Y',
            mutualFriends: 5,
            reason: 'Có cùng sở thích: Nghệ thuật',
            isOnline: true,
            type: 'SUGGESTION'
        },
    ]);

    // Fetch data based on view mode
    useEffect(() => {
        if (viewMode === 'ALL') {
            fetchFriends();
        } else if (viewMode === 'REQUESTS') {
            fetchRequests();
        }
    }, [viewMode]);

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
                if (activeItem.type === 'SUGGESTION' && activeItem.id > 100) {
                    setFullProfile(activeItem);
                } else {
                    const response = await UserProfileService.getUserProfile(targetId);
                    setFullProfile(response.data);
                }
                setActiveProfileTab('about');
            } catch (error) {
                console.error("Error fetching profile:", error);
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

    const handleAddFriend = (id) => {
        toast.success("Đã gửi lời mời kết bạn!");
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

        return list.filter(item => {
            if (viewMode === 'REQUESTS') {
                const name = item.senderFullName || item.senderUsername || '';
                const username = item.senderUsername || '';
                return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    username.toLowerCase().includes(searchTerm.toLowerCase());
            }
            return (item.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.username?.toLowerCase().includes(searchTerm.toLowerCase()));
        });
    };

    const displayedList = getDisplayedList();
    const isLoading = viewMode === 'ALL' ? friendsLoading : requestsLoading;

    if (isLoading && viewMode === 'ALL' && friends.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-background-dark">
                <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex overflow-hidden bg-chat-bg relative">
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
                processingRequests={processingRequests}
                onAcceptRequest={handleAcceptRequestWrapper}
                onRejectRequest={handleRejectRequestWrapper}
            />

            <div className={`${activeItem ? 'flex' : 'hidden'} xl:flex flex-1 flex-col bg-chat-bg relative`}>
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
                    onAcceptRequest={handleAcceptRequestWrapper}
                    onRejectRequest={handleRejectRequestWrapper}
                />
            </div>
        </div>
    );
}
