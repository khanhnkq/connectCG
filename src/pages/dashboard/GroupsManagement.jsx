import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import React, { useEffect, useState } from 'react';
import { findMyGroups, findDiscoverGroups, findPendingInvitations, acceptInvitation, declineInvitation, searchGroups, joinGroup } from '../../services/groups/GroupService';
import toast from 'react-hot-toast';

export default function GroupsManagement() {
    const navigate = useNavigate();
    const [yourGroups, setYourGroups] = useState([]);
    const [discoverGroups, setDiscoverGroups] = useState([]);
    const [pendingInvitations, setPendingInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('my'); // 'my', 'discover', 'invites'
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [myGroupsData, discoverData, invitationsData] = await Promise.all([
                    findMyGroups(),
                    findDiscoverGroups(),
                    findPendingInvitations()
                ]);
                setYourGroups(myGroupsData);
                setDiscoverGroups(discoverData);
                setPendingInvitations(invitationsData);
            } catch (error) {
                console.error("Failed to fetch groups:", error);
                toast.error("Không thể tải danh sách nhóm.");
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

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
                findPendingInvitations()
            ]);
            setYourGroups(myGroupsData);
            setPendingInvitations(invitationsData);
        } catch (error) {
            toast.error("Không thể chấp nhận lời mời.");
        }
    };

    const handleDeclineInvite = async (groupId) => {
        try {
            await declineInvitation(groupId);
            toast.success("Đã từ chối lời mời.");
            const invitationsData = await findPendingInvitations();
            setPendingInvitations(invitationsData);
        } catch (error) {
            toast.error("Không thể từ chối lời mời.");
        }
    };

    const handleJoinGroup = async (groupId) => {
        try {
            await joinGroup(groupId);

            // Tìm nhóm trong discoverGroups để kiểm tra privacy
            const targetGroup = discoverGroups.find(g => g.id === groupId);
            const isPublic = targetGroup?.privacy === 'PUBLIC';

            if (isPublic) {
                toast.success("Chào mừng bạn gia nhập nhóm!");
                // Cập nhật state ngay lập tức cho nhóm Public
                setDiscoverGroups(prev => prev.map(g =>
                    g.id === groupId
                        ? { ...g, currentUserStatus: 'ACCEPTED' }
                        : g
                ));
                // Refresh myGroups để thêm nhóm mới vào
                const myGroupsData = await findMyGroups();
                setYourGroups(myGroupsData);
            } else {
                toast.success("Đã gửi yêu cầu gia nhập nhóm!");
                // Cập nhật state cho nhóm Private
                setDiscoverGroups(prev => prev.map(g =>
                    g.id === groupId
                        ? { ...g, currentUserStatus: 'REQUESTED' }
                        : g
                ));
            }
        } catch (error) {
            console.error("Join failed:", error);
            const errorMsg = typeof error.response?.data === 'string'
                ? error.response.data
                : (error.response?.data?.message || "Không thể thực hiện yêu cầu gia nhập.");
            toast.error(errorMsg);
        }
    };

    const checkIfAdmin = (group) => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return false;
        try {
            const userData = JSON.parse(userStr);
            return group.ownerId == userData.id || group.currentUserRole === 'ADMIN';
        } catch (e) {
            return false;
        }
    };

    const isOwner = (group) => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return false;
        try {
            const userData = JSON.parse(userStr);
            return group.ownerId == userData.id;
        } catch (e) {
            return false;
        }
    };

    const renderGroupCard = (group) => {
        const isAdmin = checkIfAdmin(group);
        const isOwnerVal = isOwner(group);
        const imageUrl = group.image || 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000';
        const isMember = group.currentUserStatus === 'ACCEPTED';
        const isPending = group.currentUserStatus === 'REQUESTED' || group.currentUserStatus === 'PENDING';

        return (
            <div
                key={group.id}
                className={`bg-card-dark rounded-3xl border overflow-hidden flex flex-col hover:border-primary/30 transition-all group h-full shadow-2xl relative ${isAdmin ? 'border-orange-500/50 shadow-orange-500/10' : 'border-[#3e2b1d]'}`}
            >
                {/* Clickable Area: Image & Header - Only if member or admin */}
                <div className="relative h-44 overflow-hidden">
                    {isMember || isAdmin ? (
                        <Link
                            to={`/dashboard/groups/${group.id}`}
                            className="absolute inset-0 z-10 block cursor-pointer"
                        />
                    ) : null}

                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url("${imageUrl}")` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                    {/* Status & Privacy Badges - Top Right */}
                    <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-20">
                        {isAdmin && (
                            <div className="bg-orange-500 text-[#231810] text-[10px] font-black px-3 py-1.5 rounded-xl border border-white/20 shadow-xl flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-sm">shield_person</span>
                                ADMIN
                            </div>
                        )}
                        <div className="bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/10 shadow-lg">
                            <span className="material-symbols-outlined text-primary text-[18px]">
                                {group.privacy === 'PUBLIC' ? 'public' : 'lock'}
                            </span>
                            <span className="text-white text-[11px] font-black uppercase tracking-wider">{group.privacy}</span>
                        </div>
                    </div>

                    {/* Admin Counts (Pending items) */}
                    {isAdmin && (group.pendingRequestsCount > 0 || group.pendingPostsCount > 0) && (
                        <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                            {group.pendingRequestsCount > 0 && (
                                <div className="bg-red-500/90 backdrop-blur-md text-white px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/20 shadow-xl" title={`${group.pendingRequestsCount} yêu cầu tham gia`}>
                                    <span className="material-symbols-outlined text-[16px]">person_add</span>
                                    <span className="text-[11px] font-bold">{group.pendingRequestsCount}</span>
                                </div>
                            )}
                            {group.pendingPostsCount > 0 && (
                                <div className="bg-blue-500/90 backdrop-blur-md text-white px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/20 shadow-xl" title={`${group.pendingPostsCount} bài viết chờ duyệt`}>
                                    <span className="material-symbols-outlined text-[16px]">post_add</span>
                                    <span className="text-[11px] font-bold">{group.pendingPostsCount}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="absolute bottom-4 left-5 right-5 z-20 pointer-events-none">
                        <h4 className="text-white font-bold text-xl leading-tight group-hover:text-primary transition-colors line-clamp-1">{group.name}</h4>
                        <p className="text-text-secondary text-xs font-medium italic opacity-80 flex items-center gap-1 mt-1">
                            <span className="material-symbols-outlined text-xl">person</span>
                            {group.ownerFullName || group.ownerName}
                        </p>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-6 flex flex-col flex-1 bg-gradient-to-b from-card-dark to-[#1a120b]">
                    <p className="text-text-secondary text-sm mb-6 line-clamp-2 leading-relaxed h-10">{group.description || 'Chưa có mô tả cho nhóm này.'}</p>

                    <div className="mt-auto flex gap-3 relative z-30">
                        {activeTab === 'invites' ? (
                            <>
                                <button
                                    onClick={() => handleAcceptInvite(group.id)}
                                    className="flex-1 py-3 rounded-2xl bg-primary text-[#231810] font-black text-xs transition-all uppercase tracking-widest hover:bg-orange-600 active:scale-95 flex items-center justify-center"
                                >
                                    Chấp nhận
                                </button>
                                <button
                                    onClick={() => handleDeclineInvite(group.id)}
                                    className="flex-1 py-3 rounded-2xl bg-[#342418] text-red-500 border border-red-500/20 font-black text-xs transition-all uppercase tracking-widest hover:bg-red-500 hover:text-white active:scale-95 flex items-center justify-center"
                                >
                                    Từ chối
                                </button>
                            </>
                        ) : isPending ? (
                            <div className="flex-1 py-3 rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/20 font-black text-xs transition-all uppercase tracking-widest text-center flex items-center justify-center italic">
                                Đang chờ duyệt
                            </div>
                        ) : isMember || isAdmin ? (
                            <button
                                onClick={() => navigate(`/dashboard/groups/${group.id}`)}
                                className="flex-1 py-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 font-black text-xs transition-all uppercase tracking-widest hover:bg-primary hover:text-[#231810] active:scale-95 flex items-center justify-center"
                            >
                                <span className="material-symbols-outlined text-sm mr-2">login</span>
                                Vào nhóm
                            </button>
                        ) : (
                            <button
                                onClick={() => handleJoinGroup(group.id)}
                                className="flex-1 py-3 rounded-2xl bg-primary text-[#231810] font-black text-xs transition-all uppercase tracking-widest hover:bg-orange-600 active:scale-95 flex items-center justify-center"
                            >
                                <span className="material-symbols-outlined text-sm mr-2">person_add</span>
                                Tham gia
                            </button>
                        )}

                        {isAdmin && (
                            <button
                                onClick={() => navigate(`/dashboard/groups/edit/${group.id}`)}
                                className="px-4 py-3 rounded-2xl bg-[#342418] text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all active:scale-95 flex items-center justify-center group/settings"
                                title="Cài đặt nhóm"
                            >
                                <span className="material-symbols-outlined text-lg leading-none group-hover/settings:rotate-90 transition-transform">settings</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="bg-[#0f0a06] min-h-screen flex items-center justify-center">
                <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    const filteredGroups = (groups) => {
        if (!searchQuery.trim()) return groups;
        const query = searchQuery.toLowerCase();
        return groups.filter(g =>
            g.name?.toLowerCase().includes(query) ||
            g.description?.toLowerCase().includes(query)
        );
    };

    const displayedGroups = activeTab === 'my'
        ? filteredGroups(yourGroups)
        : activeTab === 'discover'
            ? filteredGroups(discoverGroups)
            : filteredGroups(pendingInvitations);

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen flex w-full">
            <Sidebar />

            <main className="flex-1 h-full overflow-y-auto relative scroll-smooth bg-background-dark">
                <div className="max-w-7xl mx-auto w-full pb-20">
                    {/* Header */}
                    <div className="sticky top-0 z-30 bg-background-dark/95 backdrop-blur-xl border-b border-[#342418] p-4 flex justify-between items-center px-8">
                        <div className="flex items-center gap-8">
                            <h2 className="text-2xl font-extrabold text-white tracking-tight">Community Hub</h2>

                            {/* Tabs */}
                            <div className="flex bg-[#1a120b] p-1 rounded-2xl border border-[#3e2b1d]">
                                {['my', 'discover', 'invites'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => {
                                            setActiveTab(tab);
                                            setSearchQuery('');
                                        }}
                                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab
                                            ? 'bg-primary text-[#231810] shadow-lg'
                                            : 'text-text-secondary hover:text-white'
                                            }`}
                                    >
                                        {tab === 'my' ? 'Của tôi' : tab === 'discover' ? 'Khám phá' : 'Lời mời'}
                                        {tab === 'invites' && pendingInvitations.length > 0 && (
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

                        <div className="flex items-center gap-4">
                            <div className="relative w-80 group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-lg">search</span>
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="block w-full pl-11 pr-4 py-2.5 border border-[#3e2b1d] rounded-2xl bg-[#1a120b] text-white placeholder-text-secondary/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-xs font-medium"
                                    placeholder={
                                        activeTab === 'my' ? "Tìm kiếm nhóm của bạn..." :
                                            activeTab === 'discover' ? "Khám phá nhóm mới..." :
                                                "Tìm lời mời..."
                                    }
                                />
                            </div>
                            <Link
                                to="/dashboard/groups/create"
                                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-[#231810] hover:bg-orange-600 transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-500/20 active:scale-95 group"
                            >
                                <span className="material-symbols-outlined text-xl group-hover:rotate-90 transition-transform">add</span>
                                Tạo nhóm
                            </Link>
                        </div>
                    </div>

                    <div className="px-8 py-10">
                        {searchQuery.trim() !== '' && (
                            <div className="mb-8">
                                <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">search_check</span>
                                    Tìm thấy {displayedGroups.length} nhóm {activeTab === 'my' ? 'của bạn' : 'để khám phá'} cho "{searchQuery}"
                                </h3>
                            </div>
                        )}

                        {displayedGroups.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {displayedGroups.map(group => renderGroupCard(group))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 bg-card-dark/30 rounded-[3rem] border border-dashed border-[#3e2b1d]">
                                <span className="material-symbols-outlined text-6xl text-text-muted mb-4 opacity-20">groups_3</span>
                                <p className="text-text-secondary font-medium">Không tìm thấy nhóm nào phù hợp.</p>
                                {searchQuery.trim() !== '' && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="mt-4 text-primary text-xs font-black uppercase tracking-widest hover:underline"
                                    >
                                        Xóa tìm kiếm
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
