import { useNavigate } from "react-router-dom";
import ProfileNavbar from "../profile/ProfileNavbar";
import ProfileAbout from "../profile/ProfileAbout";
import ProfilePhotos from "../profile/ProfilePhotos";
import ProfileHobbies from "../profile/ProfileHobbies";
import ProfileFriends from "../profile/ProfileFriends";

export default function FriendProfileDetail({
    activeItem,
    fullProfile,
    isProfileLoading,
    activeProfileTab,
    setActiveProfileTab,
    setActiveItem,
    viewMode,
    onStartChat,
    onUnfriend,
    onAddFriend,
    onAcceptRequest,
    onRejectRequest
}) {
    const navigate = useNavigate();

    if (!activeItem) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-text-secondary gap-6 p-8 text-center bg-gradient-to-br from-background-main to-surface-main">
                <div className="size-32 rounded-full bg-gradient-to-br from-surface-main to-background-main border-4 border-border-main flex items-center justify-center mb-2 shadow-2xl">
                    <span className="material-symbols-outlined text-6xl opacity-20 text-primary">contacts</span>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-text-main mb-3">Thông tin chi tiết</h2>
                    <p className="text-sm max-w-md mx-auto text-text-secondary/80 leading-relaxed">
                        Chọn một người từ danh sách bên trái để xem hồ sơ chi tiết và thực hiện các hành động.
                    </p>
                </div>
            </div>
        );
    }

    if (isProfileLoading) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-5 bg-gradient-to-br from-background-main to-surface-main">
                <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <div className="text-center">
                    <p className="text-text-main font-medium text-lg animate-pulse">Đang tải hồ sơ...</p>
                    <p className="text-text-secondary text-sm mt-1">Vui lòng đợi</p>
                </div>
            </div>
        );
    }

    if (!fullProfile) {
        return (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-background-main to-surface-main">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-text-secondary/20 mb-3">error</span>
                    <p className="text-text-secondary">Không có dữ liệu</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-background-main">
            {/* Cover Photo with Gradient Overlay */}
            <div className="h-56 w-full relative group overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url("${fullProfile.currentCoverUrl || 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80'}")` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-background-main"></div>

                {/* Back Button */}
                <button
                    onClick={() => setActiveItem(null)}
                    className="xl:hidden absolute top-4 left-4 p-2.5 bg-black/50 hover:bg-black/70 rounded-xl text-white backdrop-blur-md transition-all z-10 shadow-lg"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
            </div>

            {/* Profile Info Section */}
            <div className="px-6 md:px-8 pb-8 -mt-20 relative">
                {/* Avatar & Name */}
                <div className="flex flex-col items-center">
                    <div className="size-32 md:size-36 rounded-2xl bg-gradient-to-br from-surface-main to-background-main p-1.5 border-4 border-background-main shadow-2xl mb-4 relative z-10 group">
                        <div
                            className="w-full h-full rounded-xl bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                            style={{ backgroundImage: `url("${fullProfile.currentAvatarUrl || fullProfile.image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}")` }}
                        ></div>
                    </div>

                    <h1 className="text-3xl font-extrabold text-white text-center mb-1">
                        {fullProfile.fullName || fullProfile.name}
                    </h1>
                    <p className="text-text-secondary font-medium text-base mb-3">@{fullProfile.username}</p>

                    {/* Suggestion Badge */}
                    {fullProfile.type === 'SUGGESTION' && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-xl border border-primary/30 backdrop-blur-sm">
                            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                            <span>{fullProfile.reason}</span>
                        </div>
                    )}

                    {/* Quick Stats */}
                    {fullProfile.friendsCount > 0 && (
                        <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#2A1D15] rounded-xl border border-[#3A2A20]">
                            <span className="material-symbols-outlined text-primary text-[20px]">group</span>
                            <span className="text-white font-medium text-sm">{fullProfile.friendsCount} bạn bè</span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    {viewMode === 'ALL' ? (
                        <>
                            <button
                                onClick={() => onStartChat(fullProfile.userId || fullProfile.id)}
                                className="px-6 py-3 bg-primary hover:bg-orange-600 text-[#231810] font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2 hover:scale-105"
                            >
                                <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                                Nhắn tin
                            </button>
                            <button
                                onClick={() => navigate(`/dashboard/member/${fullProfile.userId || fullProfile.id}`)}
                                className="px-6 py-3 bg-[#2A1D15] hover:bg-[#3A2A20] text-white font-bold rounded-xl border border-[#3A2A20] transition-all flex items-center gap-2"
                                title="Xem hồ sơ đầy đủ"
                            >
                                <span className="material-symbols-outlined text-[20px]">person</span>
                                Xem hồ sơ
                            </button>
                            <button
                                onClick={() => onUnfriend(fullProfile.userId || fullProfile.id)}
                                className="px-4 py-3 bg-[#2A1D15] hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/30 text-white font-bold rounded-xl border border-[#3A2A20] transition-all"
                                title="Hủy kết bạn"
                            >
                                <span className="material-symbols-outlined text-[20px]">person_remove</span>
                            </button>
                        </>
                    ) : viewMode === 'REQUESTS' ? (
                        <>
                            <button
                                onClick={() => onAcceptRequest(activeItem)}
                                className="px-8 py-3 bg-primary hover:bg-orange-600 text-[#231810] font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2 hover:scale-105"
                            >
                                <span className="material-symbols-outlined">check_circle</span>
                                Chấp nhận
                            </button>
                            <button
                                onClick={() => onRejectRequest(activeItem)}
                                className="px-8 py-3 bg-[#2A1D15] hover:bg-red-500/20 hover:text-red-500 text-white font-bold rounded-xl border border-[#3A2A20] hover:border-red-500/30 transition-all flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">cancel</span>
                                Từ chối
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => onAddFriend(fullProfile.userId || fullProfile.id)}
                            className="px-10 py-3 bg-primary hover:bg-orange-600 text-[#231810] font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2 hover:scale-105"
                        >
                            <span className="material-symbols-outlined">person_add</span>
                            Kết bạn
                        </button>
                    )}
                </div>

                {/* Profile Tabs */}
                <div className="mt-10">
                    <ProfileNavbar
                        activeTab={activeProfileTab}
                        setActiveTab={setActiveProfileTab}
                        friendsCount={fullProfile.friendsCount}
                    />

                    <div className="mt-6">
                        {activeProfileTab === 'timeline' && (
                            <div className="text-center py-16 bg-[#2A1D15] rounded-2xl border border-[#3A2A20]">
                                <div className="size-16 rounded-full bg-[#1A120B] border-2 border-[#3A2A20] flex items-center justify-center mx-auto mb-4">
                                    <span className="material-symbols-outlined text-4xl opacity-30 text-primary">lock</span>
                                </div>
                                <p className="text-text-secondary text-sm mb-4">Bài viết được hiển thị ở trang cá nhân chính.</p>
                                <button
                                    onClick={() => navigate(`/dashboard/member/${fullProfile.userId || fullProfile.id}`)}
                                    className="px-6 py-2.5 bg-primary hover:bg-orange-600 text-[#231810] font-bold rounded-xl transition-all"
                                >
                                    Đi tới trang cá nhân
                                </button>
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
    );
}
