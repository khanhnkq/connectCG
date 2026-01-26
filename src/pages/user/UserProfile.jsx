import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from '../../components/layout/Sidebar.jsx';
import PostComposer from '../../components/feed/PostComposer';
import { fetchUserProfile } from '../../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import ProfileAbout from '../../components/profile/ProfileAbout';
import ProfilePhotos from '../../components/profile/ProfilePhotos';
import ProfileHobbies from '../../components/profile/ProfileHobbies';
import ProfileFriends from '../../components/profile/ProfileFriends';

export default function UserProfile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { profile, loading } = useSelector((state) => state.user);
    const [activeTab, setActiveTab] = useState('timeline'); // timeline, about, photos, hobbies, friends

    useEffect(() => {
        const userId = user?.id || user?.userId || user?.sub;
        if (userId && !profile) {
            dispatch(fetchUserProfile(userId));
        }
    }, [user, profile, dispatch]);

    if (loading || !profile) {
        return (
            <div className="bg-background-dark min-h-screen flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-text-secondary font-bold">Đang tải hồ sơ của bạn...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen flex w-full">
            <Sidebar />

            <main className="flex-1 h-full overflow-y-auto relative scroll-smooth bg-background-dark">
                <div className="w-full mx-auto pb-20">
                    <div className="bg-[#342418] border-b border-[#3e2b1d]">
                        <div className="w-full max-w-6xl mx-auto">
                            <div className="relative w-full h-64 md:h-80 lg:h-96 group overflow-hidden rounded-b-3xl">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: `url("${profile?.currentCoverUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsQ9A8n-xledNJ474f_Uhr7BscPR1rdWpPA3nmUJNmpVX91H1g0qzMfr9cBVIkAenCL-nwTE3eotkyfDk29zimFvN8-jZdH8iZX_YRdmarPfVxzJHgiu1ByzFcVxZgVSRg7T53DVEFW8xt5qrbXibpwvQ3F4V3ihwBBXzyqv1ev1YEqcfkx6qOp-1indkKl5YuDjQFL0NRPqq7VW_dBlXrrZONIiwbkNX-tnHGk4jNiXLsc5kJ9cNeUOM226fUgjqHbFWB_pkARIM'}")` }}
                                ></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                <button className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white backdrop-blur-md px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all">
                                    <span className="material-symbols-outlined text-lg">camera_alt</span>
                                    <span className="hidden sm:inline">Thay đổi ảnh bìa</span>
                                </button>
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
                                        <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 size-5 md:size-6 bg-green-500 border-4 border-[#342418] rounded-full" title="Online"></div>
                                    </div>
                                    <div className="flex-1 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                                        <div className="mb-2 md:mb-4">
                                            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-1">
                                                {profile?.fullName || profile?.username}
                                            </h1>
                                            <p className="text-text-secondary font-medium text-sm flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                                                Đang hoạt động
                                                <span className="text-text-secondary/50">•</span>
                                                <span className="text-text-secondary/80">{profile?.city?.name || 'Vị trí chưa cập nhật'}</span>
                                            </p>
                                            <div className="flex gap-4 mt-3 text-sm text-text-secondary">
                                                <span><strong className="text-white">{profile?.friendsCount || 0}</strong> Bạn bè</span>
                                                <span><strong className="text-white">{profile?.postsCount || 0}</strong> Bài viết</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 mb-4 w-full md:w-auto">
                                            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary hover:bg-orange-600 text-[#231810] font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20">
                                                <span className="material-symbols-outlined text-[20px]">edit_square</span>
                                                Chỉnh sửa hồ sơ
                                            </button>
                                            <button className="flex items-center justify-center gap-2 bg-[#493222] hover:bg-[#5c402d] text-white font-bold px-4 py-3 rounded-xl transition-all">
                                                <span className="material-symbols-outlined">settings</span>
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
                                            {profile?.bio || 'Bạn chưa cập nhật tiểu sử.'}
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
                                    <>
                                        <PostComposer userAvatar={profile?.currentAvatarUrl} />

                                        <div className="flex items-center justify-between bg-[#342418] p-3 px-5 rounded-2xl border border-[#3e2b1d]">
                                            <h2 className="text-white font-bold text-lg">Bài viết của bạn</h2>
                                            <div className="flex gap-2">
                                                <button className="flex items-center gap-1 bg-[#493222] text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-[#5c402d] transition-colors">
                                                    <span className="material-symbols-outlined text-[16px]">tune</span>
                                                    Bộ lọc
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-center py-20 bg-[#342418] rounded-2xl border border-[#3e2b1d]">
                                            <span className="material-symbols-outlined text-5xl text-text-secondary/30 mb-4">post_add</span>
                                            <p className="text-text-secondary italic">Bạn chưa đăng bài viết nào.</p>
                                            <button className="text-primary font-bold mt-2 hover:underline">Đăng bài ngay</button>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'about' && (
                                    <ProfileAbout profile={profile} isOwner={true} />
                                )}

                                {activeTab === 'photos' && (
                                    <ProfilePhotos profile={profile} isOwner={true} />
                                )}

                                {activeTab === 'hobbies' && (
                                    <ProfileHobbies profile={profile} isOwner={true} />
                                )}

                                {activeTab === 'friends' && (
                                    <ProfileFriends profile={profile} isOwner={true} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
