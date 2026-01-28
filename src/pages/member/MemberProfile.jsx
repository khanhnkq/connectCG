import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import FriendService from '../../services/friend/FriendService';
import FriendRequestService from '../../services/friend/FriendRequestService';
import UserProfileService from '../../services/user/UserProfileService';
import ChatService from '../../services/chat/ChatService';
import ProfileAbout from '../../components/profile/ProfileAbout';
import ProfilePhotos from '../../components/profile/ProfilePhotos';
import ProfileHobbies from '../../components/profile/ProfileHobbies';
import ProfileFriends from '../../components/profile/ProfileFriends';
import ReportModal from '../../components/report/ReportModal';
import reportService from '../../services/ReportService';
import toast from 'react-hot-toast';

export default function MemberProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useSelector((state) => state.auth);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('timeline'); // timeline, about, photos, hobbies, friends
    const [showReportModal, setShowReportModal] = useState(false);

    const handleStartChat = async () => {
        const tid = toast.loading("Đang mở cuộc trò chuyện...");
        try {
            const response = await ChatService.getOrCreateDirectChat(profile.id);
            const room = response.data;
            toast.success("Đã kết nối!", { id: tid });
            navigate('/chat', { state: { selectedRoomKey: room.firebaseRoomKey } });
        } catch (error) {
            console.error("Error starting chat:", error);
            toast.error("Không thể tạo cuộc trò chuyện", { id: tid });
        }
    };

    useEffect(() => {
        const fetchMemberProfile = async () => {
            try {
                setLoading(true);
                const response = await UserProfileService.getUserProfile(id);
                setProfile(response.data);
            } catch (error) {
                console.error("Lỗi khi tải hồ sơ thành viên:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchMemberProfile();
        }
    }, [id]);
    const handleUnfriend = async () => {
        if (window.confirm(`Bạn có chắc muốn hủy kết bạn với ${profile.fullName}?`)) {
            try {
                await FriendService.unfriend(profile.userId);
                // Cập nhật state UI
                setProfile(prev => ({
                    ...prev,
                    relationshipStatus: 'NONE',
                    friendsCount: prev.friendsCount - 1
                }));
                toast.success(`Đã hủy kết bạn với ${profile.fullName}`);
            } catch (error) {
                console.error("Lỗi khi hủy kết bạn:", error);
                toast.error("Có lỗi xảy ra, vui lòng thử lại.");
            }
        }
    };

    const handleSendFriendRequest = async () => {
        try {
            await FriendRequestService.sendRequest(profile.userId);
            setProfile(prev => ({
                ...prev,
                relationshipStatus: 'PENDING' // Update local state immediately
            }));
            toast.success("Đã gửi lời mời kết bạn!");
        } catch (error) {
            console.error("Lỗi khi gửi lời mời:", error);
            toast.error(error.response?.data?.message || "Không thể gửi lời mời.");
        }
    };

    if (loading) {
        return (
            <div className="bg-background-dark min-h-screen flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-text-secondary font-bold">Đang tải hồ sơ thành viên...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="bg-background-dark min-h-screen flex items-center justify-center text-white p-6 text-center">
                <div>
                    <span className="material-symbols-outlined text-6xl text-red-500 mb-4">person_off</span>
                    <h2 className="text-2xl font-bold mb-2">Không tìm thấy thành viên</h2>
                    <p className="text-text-secondary mb-6">Thông tin người dùng này không khả dụng.</p>
                    <button onClick={() => window.history.back()} className="bg-primary text-[#231810] px-6 py-2 rounded-xl font-bold">Quay lại</button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto pb-20">
            {/* Header/Cover */}
            <div className="bg-[#342418] border-b border-[#3e2b1d]">
                <div className="w-full max-w-6xl mx-auto">
                    <div className="relative w-full h-64 md:h-80 lg:h-96 group overflow-hidden rounded-b-3xl">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url("${profile?.currentCoverUrl || 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80'}")` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    </div>
                    <div className="px-4 md:px-8 pb-4 relative">
                        <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 md:-mt-12 gap-6 relative z-10 mb-6">
                            <div className="relative shrink-0">
                                <div className="size-32 md:size-44 rounded-full border-4 border-[#342418] bg-[#221710] p-1 shadow-2xl">
                                    <div
                                        className="w-full h-full rounded-full bg-cover bg-center"
                                        style={{ backgroundImage: `url("${profile?.currentAvatarUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}")` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="flex-1 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                                <div className="mb-2 md:mb-4">
                                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-1">
                                        {profile?.fullName || profile?.username}
                                    </h1>
                                    <p className="text-text-secondary font-medium text-sm flex items-center gap-2">
                                        <span className="text-text-secondary/80">{profile?.city?.name || 'Vị trí ẩn'}</span>
                                    </p>
                                    <div className="flex gap-4 mt-3 text-sm text-text-secondary">
                                        <span><strong className="text-white">{profile?.friendsCount || 0}</strong> Bạn bè</span>
                                        <span><strong className="text-white">{profile?.postsCount || 0}</strong> Bài viết</span>
                                    </div>
                                </div>
                                <div className="flex gap-3 mb-4 w-full md:w-auto">
                                    {profile.relationshipStatus === 'FRIEND' ? (
                                        <button
                                            onClick={handleUnfriend}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#493222] text-primary border border-primary/30 font-bold px-6 py-3 rounded-xl transition-all hover:bg-red-900/30 hover:text-red-500 hover:border-red-500/50"
                                            title="Click để hủy kết bạn"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">person_remove</span>
                                            Đã là bạn bè
                                        </button>
                                    ) : profile.relationshipStatus === 'PENDING' ? (
                                        <button
                                            disabled
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#493222] text-text-secondary border border-primary/30 font-bold px-6 py-3 rounded-xl transition-all opacity-80 cursor-not-allowed"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">mark_email_read</span>
                                            Đã gửi lời mời
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleSendFriendRequest}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary hover:bg-orange-600 text-[#231810] font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">person_add</span>
                                            Kết bạn
                                        </button>
                                    )}
                                    <button
                                        onClick={handleStartChat}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#493222] hover:bg-primary/20 text-white hover:text-primary font-bold px-4 py-3 rounded-xl transition-all"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">mail</span>
                                        Nhắn tin
                                    </button>
                                    <button
                                        onClick={() => setShowReportModal(true)}
                                        className="flex items-center justify-center gap-2 bg-[#493222] hover:bg-red-500/10 text-text-secondary hover:text-red-500 font-bold px-4 py-3 rounded-xl transition-all"
                                        title="Báo cáo người dùng"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">report</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-1 overflow-x-auto pb-1 border-t border-[#493222] pt-2 scrollbar-hide">
                            <button
                                onClick={() => setActiveTab('timeline')}
                                className={`px-6 py-3 font-bold transition-all whitespace-nowrap ${activeTab === 'timeline' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-white hover:bg-[#493222]/50 rounded-t-lg'}`}
                            >
                                Dòng thời gian
                            </button>
                            <button
                                onClick={() => setActiveTab('about')}
                                className={`px-6 py-3 font-bold transition-all whitespace-nowrap ${activeTab === 'about' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-white hover:bg-[#493222]/50 rounded-t-lg'}`}
                            >
                                Giới thiệu
                            </button>
                            <button
                                onClick={() => setActiveTab('photos')}
                                className={`px-6 py-3 font-bold transition-all whitespace-nowrap ${activeTab === 'photos' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-white hover:bg-[#493222]/50 rounded-t-lg'}`}
                            >
                                Ảnh
                            </button>
                            <button
                                onClick={() => setActiveTab('hobbies')}
                                className={`px-6 py-3 font-bold transition-all whitespace-nowrap ${activeTab === 'hobbies' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-white hover:bg-[#493222]/50 rounded-t-lg'}`}
                            >
                                Sở thích
                            </button>
                            <button
                                onClick={() => setActiveTab('friends')}
                                className={`px-6 py-3 font-bold transition-all whitespace-nowrap ${activeTab === 'friends' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-white hover:bg-[#493222]/50 rounded-t-lg'}`}
                            >
                                Bạn bè ({profile?.friendsCount || 0})
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-6xl mx-auto px-4 md:px-8 mt-8">
                <div className={`grid grid-cols-1 ${activeTab === 'timeline' ? 'lg:grid-cols-12' : 'lg:grid-cols-1'} gap-6`}>
                    {/* Left Column - Only show on timeline */}
                    {activeTab === 'timeline' && (
                        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
                            <div className="bg-[#342418] rounded-2xl border border-[#3e2b1d] p-5 shadow-sm">
                                <h3 className="text-white font-bold text-lg mb-4">Giới thiệu</h3>
                                <p className="text-text-secondary text-sm leading-relaxed mb-4">
                                    {profile?.bio || 'Người dùng này chưa cập nhật tiểu sử.'}
                                </p>
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3 text-text-secondary text-sm">
                                        <span className="material-symbols-outlined text-[20px]">work</span>
                                        <span>Nghề nghiệp: <strong>{profile?.occupation || 'Chưa cập nhật'}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-3 text-text-secondary text-sm">
                                        <span className="material-symbols-outlined text-[20px]">favorite</span>
                                        <span>Tình trạng: <strong>{profile?.maritalStatus || 'Chưa cập nhật'}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-3 text-text-secondary text-sm">
                                        <span className="material-symbols-outlined text-[20px]">location_on</span>
                                        <span>Đến từ: <strong>{profile?.city?.name || 'Chưa cập nhật'}</strong></span>
                                    </div>
                                </div>
                            </div>

                            {/* Hobbies Section */}
                            {profile?.hobbies?.length > 0 && (
                                <div className="bg-[#342418] rounded-2xl border border-[#3e2b1d] p-5 shadow-sm">
                                    <h3 className="text-white font-bold text-lg mb-4">Sở thích</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.hobbies.map((hobby, index) => (
                                            <span key={index} className="bg-[#493222] text-primary text-xs font-bold px-3 py-1.5 rounded-full border border-primary/20">
                                                {hobby.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Right Column */}
                    <div className={`${activeTab === 'timeline' ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-1'} flex flex-col gap-6`}>
                        {activeTab === 'timeline' && (
                            <div className="flex flex-col gap-6 text-center py-20 bg-[#342418] rounded-2xl border border-[#3e2b1d]">
                                <span className="material-symbols-outlined text-5xl text-text-secondary/30 mb-4">lock</span>
                                <p className="text-text-secondary italic">Bài viết của người này đang được ẩn.</p>
                            </div>
                        )}

                        {activeTab === 'about' && (
                            <ProfileAbout profile={profile} isOwner={false} />
                        )}

                        {activeTab === 'photos' && (
                            <ProfilePhotos profile={profile} isOwner={false} />
                        )}

                        {activeTab === 'hobbies' && (
                            <ProfileHobbies profile={profile} isOwner={false} />
                        )}

                        {activeTab === 'friends' && (
                            <ProfileFriends profile={profile} isOwner={false} />
                        )}
                    </div>
                </div>
            </div>
            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                onSubmit={async (payload) => {
                    const toastId = toast.loading("Đang gửi báo cáo...", {
                        style: { background: "#1A120B", color: "#FFD8B0" }
                    });
                    try {
                        await reportService.createReport(payload);
                        toast.success("Đã gửi báo cáo thành công!", {
                            id: toastId,
                            style: { background: "#1A120B", color: "#FF8A2A", border: "1px solid #FF8A2A" }
                        });
                        setShowReportModal(false);
                    } catch (error) {
                        console.error(error);
                        toast.error("Gửi báo cáo thất bại!", {
                            id: toastId,
                            style: { background: "#1A120B", color: "#FF6A00" }
                        });
                    }
                }}
                title="Báo cáo người dùng"
                subtitle={`Báo cáo ${profile?.fullName || 'người dùng'}`}
                question="Tại sao bạn muốn báo cáo người dùng này?"
                reasons={[
                    "Giả mạo người khác",
                    "Tên giả hoặc không phù hợp",
                    "Đăng nội dung quấy rối/bắt nạt",
                    "Spam hoặc lừa đảo",
                    "Ngôn từ thù ghét",
                    "Khác"
                ]}
                targetPayload={{
                    targetType: "USER",
                    targetId: parseInt(id)
                }}
                user={{
                    avatar: profile?.currentAvatarUrl,
                    name: profile?.fullName
                }}
            />
        </div>

    );
}
