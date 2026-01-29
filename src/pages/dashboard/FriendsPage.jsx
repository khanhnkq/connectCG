import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import FriendService from "../../services/friend/FriendService";
import ChatService from "../../services/chat/ChatService";
import UserProfileService from "../../services/user/UserProfileService";

import ProfileNavbar from "../../components/profile/ProfileNavbar";
import ProfileAbout from "../../components/profile/ProfileAbout";
import ProfilePhotos from "../../components/profile/ProfilePhotos";
import ProfileHobbies from "../../components/profile/ProfileHobbies";
import ProfileFriends from "../../components/profile/ProfileFriends";

export default function FriendsPage() {
    const { user: currentUser } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    // UI State
    const [viewMode, setViewMode] = useState('ALL'); // 'ALL' or 'SUGGESTIONS'
    const [activeItem, setActiveItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Profile Detail State
    const [fullProfile, setFullProfile] = useState(null);
    const [isProfileLoading, setIsProfileLoading] = useState(false);
    const [activeProfileTab, setActiveProfileTab] = useState('about');

    // Data State
    const [friends, setFriends] = useState([]);
    const [suggestions, setSuggestions] = useState([
        {
            id: 101, // Use different ID range or string
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

    // Fetch friends
    const fetchFriends = async () => {
        setIsLoading(true);
        try {
            const response = await FriendService.getMyFriends({ size: 100 });
            // Map to include type for consistent rendering
            const mappedFriends = (response.data.content || response.data || []).map(f => ({ ...f, type: 'FRIEND' }));
            setFriends(mappedFriends);
        } catch (error) {
            console.error("Error fetching friends:", error);
            toast.error("Không thể tải danh sách bạn bè");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFriends();
    }, []);

    // Fetch full profile when activeItem changes
    useEffect(() => {
        const fetchFullProfile = async () => {
            if (!activeItem) {
                setFullProfile(null);
                return;
            }

            // Using userId or id depending on what's available. Usually API expects ID (pk) or username/userId.
            // Assuming activeItem.id is the primary key for UserProfileService.getUserProfile(id)
            const targetId = activeItem.userId || activeItem.id;

            setIsProfileLoading(true);
            try {
                // Determine if we need to fetch real data or mock data for suggestions
                if (activeItem.type === 'SUGGESTION' && activeItem.id > 100) {
                    // Keep using the mock item as profile for suggestions to avoid 404
                    setFullProfile(activeItem);
                } else {
                    const response = await UserProfileService.getUserProfile(targetId);
                    setFullProfile(response.data);
                }
                setActiveProfileTab('about'); // Reset tab
            } catch (error) {
                console.error("Error fetching profile:", error);
                // Fallback to basic info if fetch fails
                setFullProfile(activeItem);
            } finally {
                setIsProfileLoading(false);
            }
        };

        fetchFullProfile();
    }, [activeItem]);


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

    const handleUnfriend = async (friendId) => {
        if (!window.confirm("Bạn có chắc chắn muốn hủy kết bạn?")) return;

        const tid = toast.loading("Đang xử lý...");
        try {
            await FriendService.unfriend(friendId);
            toast.success("Đã hủy kết bạn", { id: tid });
            setFriends(prev => prev.filter(f => f.id !== friendId)); // Adjust key if necessary (id or userId)
            if (activeItem?.id === friendId) setActiveItem(null);
        } catch (error) {
            console.error("Error unfriending:", error);
            toast.error("Không thể hủy kết bạn", { id: tid });
        }
    };

    const handleAddFriend = (id) => {
        toast.success("Đã gửi lời mời kết bạn!");
        // Mock remove from suggestion
        // setSuggestions(prev => prev.filter(s => s.id !== id));
    };

    // Filter Logic
    const getDisplayedList = () => {
        let list = viewMode === 'ALL' ? friends : suggestions;
        return list.filter(item =>
            item.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.username?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const displayedList = getDisplayedList();

    if (isLoading && viewMode === 'ALL' && friends.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-background-dark">
                <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex overflow-hidden bg-chat-bg relative">

            {/* COLUMN 1: LEFT SIDEBAR NAV */}
            <div className="hidden md:flex w-20 lg:w-64 flex-col border-r border-[#3A2A20] bg-background-dark shrink-0">
                <div className="p-5 border-b border-[#3A2A20] flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">diversity_3</span>
                    </div>
                    <span className="text-white font-bold text-lg hidden lg:block">Bạn bè</span>
                </div>

                <div className="p-3 space-y-1">
                    <button
                        onClick={() => { setViewMode('ALL'); setActiveItem(null); }}
                        className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${viewMode === 'ALL'
                            ? 'bg-[#3A2A20] text-primary'
                            : 'text-text-secondary hover:bg-[#2A1D15] hover:text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined">group</span>
                        <span className="font-medium hidden lg:block">Tất cả bạn bè</span>
                        <span className="ml-auto bg-[#1A120B] px-2 py-0.5 rounded text-xs hidden lg:block">{friends.length}</span>
                    </button>

                    <button
                        onClick={() => { setViewMode('SUGGESTIONS'); setActiveItem(null); }}
                        className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${viewMode === 'SUGGESTIONS'
                            ? 'bg-[#3A2A20] text-primary'
                            : 'text-text-secondary hover:bg-[#2A1D15] hover:text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined">person_add</span>
                        <span className="font-medium hidden lg:block">Gợi ý kết bạn</span>
                        <span className="ml-auto bg-[#1A120B] px-2 py-0.5 rounded text-xs hidden lg:block">{suggestions.length}</span>
                    </button>
                </div>
            </div>

            {/* COLUMN 2: CENTER LIST */}
            <div className={`${activeItem ? 'hidden xl:flex' : 'flex'} w-full md:w-80 lg:w-96 flex-col border-r border-[#3A2A20] bg-[#1E140F] shrink-0`}>
                <div className="p-5 border-b border-[#3A2A20] bg-[#1E140F]/95 backdrop-blur-md sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-white mb-4">
                        {viewMode === 'ALL' ? 'Danh sách bạn bè' : 'Gợi ý kết bạn'}
                    </h2>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-text-secondary text-[20px] group-focus-within:text-primary transition-colors">search</span>
                        </div>
                        <input
                            className="block w-full pl-10 pr-4 py-2.5 border border-[#3A2A20] rounded-xl bg-[#2A1D15] text-white placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                            placeholder="Tìm kiếm..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
                    {displayedList.length > 0 ? (
                        displayedList.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setActiveItem(item)}
                                className={`p-3 rounded-xl cursor-pointer relative group flex gap-3 items-center shadow-sm transition-all ${activeItem?.id === item.id
                                    ? 'bg-[#3A2A20] border border-[#493222]'
                                    : 'hover:bg-[#2A1D15] border border-transparent'
                                    }`}
                            >
                                <div className="relative shrink-0">
                                    <div
                                        className="size-12 rounded-full bg-cover bg-center border border-[#3A2A20]"
                                        style={{ backgroundImage: `url("${item.avatarUrl || item.image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}")` }}
                                    ></div>
                                    {item.isOnline && (
                                        <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-[#1E140F]"></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className={`font-bold text-sm truncate ${activeItem?.id === item.id ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>
                                        {item.fullName || item.name || item.username}
                                    </h3>
                                    <div className="flex items-center gap-1 text-xs text-text-secondary">
                                        {viewMode === 'SUGGESTIONS' && <span className="material-symbols-outlined text-[12px]">location_on</span>}
                                        <span className="truncate">{item.city || item.location || `@${item.username}`}</span>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-text-secondary text-[20px] opacity-0 group-hover:opacity-100 transition-opacity">
                                    chevron_right
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-text-secondary py-10 flex flex-col items-center">
                            <span className="material-symbols-outlined text-4xl opacity-20 mb-2">search_off</span>
                            <p>Không tìm thấy kết quả</p>
                        </div>
                    )}
                </div>
            </div>

            {/* COLUMN 3: RIGHT DETAILS */}
            <div className={`${activeItem ? 'flex' : 'hidden'} xl:flex flex-1 flex-col bg-chat-bg relative`}>
                {activeItem ? (
                    isProfileLoading ? (
                        <div className="h-full flex flex-col items-center justify-center gap-4">
                            <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-text-secondary text-sm animate-pulse">Đang tải hồ sơ...</p>
                        </div>
                    ) : fullProfile ? (
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {/* Cover & Header */}
                            <div className="h-48 w-full bg-gradient-to-r from-[#2A1D15] to-[#1A120B] relative group">
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url("${fullProfile.currentCoverUrl || 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80'}")` }}
                                ></div>
                                <div className="absolute inset-0 bg-black/20"></div>
                                <button
                                    onClick={() => setActiveItem(null)}
                                    className="xl:hidden absolute top-4 left-4 p-2 bg-black/40 rounded-full text-white hover:bg-black/60 backdrop-blur-sm z-10"
                                >
                                    <span className="material-symbols-outlined">arrow_back</span>
                                </button>
                            </div>

                            <div className="px-6 md:px-8 pb-8 -mt-12 relative">
                                <div className="flex flex-col items-center">
                                    <div className="size-24 md:size-32 rounded-full bg-[#1A120B] p-1 border-4 border-[#1A120B] shadow-2xl mb-4 relative z-10">
                                        <div
                                            className="w-full h-full rounded-full bg-cover bg-center"
                                            style={{ backgroundImage: `url("${fullProfile.currentAvatarUrl || fullProfile.image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}")` }}
                                        ></div>
                                    </div>
                                    <h1 className="text-2xl font-extrabold text-white text-center">
                                        {fullProfile.fullName || fullProfile.name}
                                    </h1>
                                    <p className="text-text-secondary font-medium">@{fullProfile.username}</p>

                                    {fullProfile.type === 'SUGGESTION' && (
                                        <span className="mt-2 px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full border border-primary/20">
                                            Gợi ý: {fullProfile.reason}
                                        </span>
                                    )}
                                </div>

                                <div className="mt-6 flex justify-center gap-3">
                                    {viewMode === 'ALL' ? (
                                        <>
                                            <button
                                                onClick={() => handleStartChat(fullProfile.userId || fullProfile.id)}
                                                className="px-5 py-2 bg-primary hover:bg-orange-600 text-[#231810] font-bold rounded-xl shadow-lg shadow-orange-500/10 transition-all flex items-center gap-2 text-sm"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                                                Nhắn tin
                                            </button>
                                            <button
                                                onClick={() => navigate(`/dashboard/member/${fullProfile.userId || fullProfile.id}`)}
                                                className="px-3 py-2 bg-[#2A1D15] hover:bg-[#3A2A20] text-white font-bold rounded-xl border border-[#3A2A20] transition-colors text-sm"
                                                title="Xem hồ sơ đầy đủ"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">person</span>
                                            </button>
                                            <button
                                                onClick={() => handleUnfriend(fullProfile.userId || fullProfile.id)}
                                                className="px-3 py-2 bg-[#2A1D15] hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/20 text-white font-bold rounded-xl border border-[#3A2A20] transition-colors text-sm"
                                                title="Hủy kết bạn"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">person_remove</span>
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleAddFriend(fullProfile.userId || fullProfile.id)}
                                            className="w-full sm:w-auto px-8 py-2.5 bg-primary hover:bg-orange-600 text-[#231810] font-bold rounded-xl shadow-lg shadow-orange-500/10 transition-all flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined">person_add</span>
                                            Kết bạn
                                        </button>
                                    )}
                                </div>

                                <div className="mt-8">
                                    <ProfileNavbar
                                        activeTab={activeProfileTab}
                                        setActiveTab={setActiveProfileTab}
                                        friendsCount={fullProfile.friendsCount}
                                    />

                                    <div className="mt-6">
                                        {activeProfileTab === 'timeline' && (
                                            <div className="text-center py-10 bg-[#2A1D15] rounded-xl border border-[#3A2A20]">
                                                <span className="material-symbols-outlined text-4xl opacity-20 mb-2">lock</span>
                                                <p className="text-text-secondary text-sm">Bài viết được hiển thị ở trang cá nhân chính.</p>
                                                <button onClick={() => navigate(`/dashboard/member/${fullProfile.userId || fullProfile.id}`)} className="text-primary text-sm font-bold mt-2 hover:underline">Đi tới trang cá nhân</button>
                                            </div>
                                        )}
                                        {activeProfileTab === 'about' && <ProfileAbout profile={fullProfile} isOwner={false} />}
                                        {activeProfileTab === 'photos' && <ProfilePhotos profile={fullProfile} isOwner={false} />}
                                        {activeProfileTab === 'hobbies' && <ProfileHobbies profile={fullProfile} isOwner={false} />}
                                        {activeProfileTab === 'friends' && <ProfileFriends profile={fullProfile} isOwner={false} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-text-secondary">Không có dữ liệu</p>
                        </div>
                    )
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-text-secondary gap-4 p-8 text-center">
                        <div className="size-24 rounded-full bg-[#1A120B] border-4 border-[#2A1D15] flex items-center justify-center mb-2">
                            <span className="material-symbols-outlined text-5xl opacity-30">contacts</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white mb-2">Thông tin chi tiết</h2>
                            <p className="text-sm max-w-xs mx-auto">Chọn một người từ danh sách để xem hồ sơ và thực hiện hành động.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
