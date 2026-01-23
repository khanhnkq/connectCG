import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import React, { useEffect, useState } from 'react';
import { findMyGroups, findDiscoverGroups, findAllGroup, searchGroups } from '../../services/groups/GroupService';
import toast from 'react-hot-toast';

export default function GroupsManagement() {
    const navigate = useNavigate();
    const [yourGroups, setYourGroups] = useState([]);
    const [discoverGroups, setDiscoverGroups] = useState([]);
    const [allGroups, setAllGroups] = useState([]);
    const [searchResults, setSearchResults] = useState(null); // null means not searching
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'my', 'discover'
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [myGroupsData, discoverData, allData] = await Promise.all([
                    findMyGroups(),
                    findDiscoverGroups(),
                    findAllGroup()
                ]);
                setYourGroups(myGroupsData);
                setDiscoverGroups(discoverData);
                setAllGroups(allData);
            } catch (error) {
                console.error("Failed to fetch groups:", error);
                toast.error("Không thể tải danh sách nhóm.");
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim().length > 0) {
            try {
                const results = await searchGroups(query);
                setSearchResults(results);
            } catch (error) {
                console.error("Search failed:", error);
            }
        } else {
            setSearchResults(null);
        }
    };

    const checkIfAdmin = (group) => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return false;
        try {
            const userData = JSON.parse(userStr);
            // Check both username and optional id for robustness
            return group.ownerName === userData.username || (userData.id && group.ownerId === userData.id);
        } catch (e) {
            return false;
        }
    };

    const renderGroupCard = (group) => {
        const isAdmin = checkIfAdmin(group);
        const imageUrl = group.image || 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000';

        return (
            <div
                key={group.id}
                className="bg-card-dark rounded-3xl border border-[#3e2b1d] overflow-hidden flex flex-col hover:border-primary/30 transition-all group h-full shadow-2xl relative"
            >
                {/* Wrap content in Link to make it clickable */}
                <Link
                    to={`/dashboard/feed?groupId=${group.id}`}
                    className="flex flex-col h-full"
                >
                    <div className="h-44 bg-cover bg-center relative" style={{ backgroundImage: `url("${imageUrl}")` }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-5 right-5">
                            <h4 className="text-white font-bold text-xl leading-tight group-hover:text-primary transition-colors line-clamp-1">{group.name}</h4>
                            <p className="text-gray-400 text-xs mt-1 font-medium italic">@{group.ownerName}</p>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2">
                            {isAdmin && (
                                <div className="bg-orange-500/90 backdrop-blur-md text-[#231810] text-[8px] font-black px-2.5 py-1 rounded-lg border border-white/20 shadow-lg">
                                    ADMIN
                                </div>
                            )}
                            <div className="bg-black/60 backdrop-blur-xl px-2.5 py-1.5 rounded-xl flex items-center gap-2 border border-white/10 shadow-lg">
                                <span className="material-symbols-outlined text-primary text-[16px]">groups</span>
                                <span className="text-white text-[11px] font-black uppercase tracking-tight">{group.privacy}</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1 bg-gradient-to-b from-card-dark to-[#1a120b]">
                        <p className="text-text-secondary text-sm mb-6 line-clamp-2 leading-relaxed h-10">{group.description || 'Chưa có mô tả cho nhóm này.'}</p>
                        <div className="mt-auto flex gap-3">
                            <div
                                className="flex-1 py-3 rounded-2xl bg-primary text-[#231810] font-black text-xs transition-all uppercase tracking-widest hover:bg-orange-600 active:scale-95 text-center flex items-center justify-center"
                            >
                                Vào nhóm
                            </div>

                            {/* The settings button must BE OUTSIDE the parent Link or handle stopPropagation VERY carefully. 
                                In React, nested Links/anchors are invalid. 
                                So we place the button outside the Link and use absolute positioning OR 
                                we make the settings button a separate element that is NOT inside the Link.
                            */}
                        </div>
                    </div>
                </Link>

                {/* Place settings button as a sibling to the Link, then position it. 
                    Alternatively, keep it inside but use a separate container.
                */}
                {isAdmin && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(`/dashboard/groups/edit/${group.id}`);
                        }}
                        className="absolute bottom-6 right-8 px-4 py-3 rounded-2xl bg-[#342418] text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all active:scale-95 flex items-center justify-center z-10"
                        title="Cài đặt nhóm"
                    >
                        <span className="material-symbols-outlined text-lg leading-none">settings</span>
                    </button>
                )}
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

    const displayedGroups = searchResults !== null
        ? searchResults
        : activeTab === 'all'
            ? allGroups
            : activeTab === 'my'
                ? yourGroups
                : discoverGroups;

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
                                {['all', 'my', 'discover'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => {
                                            setActiveTab(tab);
                                            setSearchResults(null);
                                            setSearchQuery('');
                                        }}
                                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab && searchResults === null
                                            ? 'bg-primary text-[#231810] shadow-lg'
                                            : 'text-text-secondary hover:text-white'
                                            }`}
                                    >
                                        {tab === 'all' ? 'Tất cả' : tab === 'my' ? 'Của tôi' : 'Khám phá'}
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
                                    placeholder="Tìm kiếm bộ lạc của bạn..."
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
                        {searchResults !== null && (
                            <div className="mb-8">
                                <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">search_check</span>
                                    Kết quả tìm kiếm cho "{searchQuery}" ({searchResults.length})
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
                                {searchResults !== null && (
                                    <button
                                        onClick={() => { setSearchResults(null); setSearchQuery(''); }}
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
