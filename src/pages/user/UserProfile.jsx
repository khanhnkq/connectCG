import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import PostComposer from '../../components/feed/PostComposer';
import { fetchUserProfile, updateUserAvatar, updateUserCover } from '../../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import ProfileAbout from '../../components/profile/ProfileAbout';
import ProfilePhotos from '../../components/profile/ProfilePhotos';
import ProfileHobbies from '../../components/profile/ProfileHobbies';
import ProfileFriends from '../../components/profile/ProfileFriends';
import { uploadAvatar, uploadCover } from '../../utils/uploadImage';
import { toast } from 'react-toastify';
import EditProfileModal from '../../components/profile/EditProfileModal';
import ProfileNavbar from '../../components/profile/ProfileNavbar';

export default function UserProfile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { profile, loading } = useSelector((state) => state.user);
    const [activeTab, setActiveTab] = useState('timeline'); // timeline, about, photos, hobbies, friends
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [isUploadingCover, setIsUploadingCover] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Hidden file inputs
    const avatarInputRef = useRef(null);
    const coverInputRef = useRef(null);

    useEffect(() => {
        const userId = user?.id || user?.userId || user?.sub;
        if (userId && !profile) {
            dispatch(fetchUserProfile(userId));
        }
    }, [user, profile, dispatch]);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setIsUploadingAvatar(true);
            const url = await uploadAvatar(file);
            await dispatch(updateUserAvatar(url)).unwrap();
            toast.success("Cập nhật ảnh đại diện thành công!");
        } catch (error) {
            toast.error(typeof error === 'string' ? error : "Lỗi khi cập nhật ảnh");
            console.error(error);
        } finally {
            setIsUploadingAvatar(false);
            // Reset input
            if (avatarInputRef.current) avatarInputRef.current.value = '';
        }
    };

    const handleCoverChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setIsUploadingCover(true);
            const url = await uploadCover(file);
            await dispatch(updateUserCover(url)).unwrap();
            toast.success("Cập nhật ảnh bìa thành công!");
        } catch (error) {
            toast.error(typeof error === 'string' ? error : "Lỗi khi cập nhật ảnh");
            console.error(error);
        } finally {
            setIsUploadingCover(false);
            if (coverInputRef.current) coverInputRef.current.value = '';
        }
    };

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
        <>
            <div className="w-full mx-auto pb-20">
                <div className="bg-[#342418] border-b border-[#3e2b1d]">
                    <div className="w-full max-w-6xl mx-auto">
                        <div className="relative w-full h-64 md:h-80 lg:h-96 group overflow-hidden rounded-b-3xl">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
                                style={{ backgroundImage: `url("${profile?.currentCoverUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsQ9A8n-xledNJ474f_Uhr7BscPR1rdWpPA3nmUJNmpVX91H1g0qzMfr9cBVIkAenCL-nwTE3eotkyfDk29zimFvN8-jZdH8iZX_YRdmarPfVxzJHgiu1ByzFcVxZgVSRg7T53DVEFW8xt5qrbXibpwvQ3F4V3ihwBBXzyqv1ev1YEqcfkx6qOp-1indkKl5YuDjQFL0NRPqq7VW_dBlXrrZONIiwbkNX-tnHGk4jNiXLsc5kJ9cNeUOM226fUgjqHbFWB_pkARIM'}")` }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                            {/* Cover Photo Upload */}
                            <input
                                type="file"
                                ref={coverInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleCoverChange}
                            />
                            <button
                                onClick={() => coverInputRef.current?.click()}
                                disabled={isUploadingCover}
                                className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white backdrop-blur-md px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 z-20"
                            >
                                <span className="material-symbols-outlined text-lg">camera_alt</span>
                                <span className="hidden sm:inline">
                                    {isUploadingCover ? 'Đang tải lên...' : 'Thay đổi ảnh bìa'}
                                </span>
                            </button>
                        </div>
                        <div className="px-4 md:px-8 pb-4 relative">
                            <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 md:-mt-12 gap-6 relative z-10 mb-6">
                                <div className="relative shrink-0">
                                    <div className="size-32 md:size-44 rounded-full border-4 border-[#342418] bg-[#221710] p-1 shadow-2xl relative group">
                                        <div
                                            className="w-full h-full rounded-full bg-cover bg-center group-hover:opacity-80 transition-opacity"
                                            style={{ backgroundImage: `url("${profile?.currentAvatarUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}")` }}
                                        ></div>

                                        {/* Avatar Upload */}
                                        <input
                                            type="file"
                                            ref={avatarInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                        />
                                        <button
                                            onClick={() => avatarInputRef.current?.click()}
                                            disabled={isUploadingAvatar}
                                            className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white disabled:opacity-100"
                                        >
                                            <span className="material-symbols-outlined text-3xl">photo_camera</span>
                                        </button>

                                        {isUploadingAvatar && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full z-10">
                                                <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        )}
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
                                        <button
                                            onClick={() => setIsEditModalOpen(true)}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary hover:bg-orange-600 text-[#231810] font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">edit_square</span>
                                            Chỉnh sửa hồ sơ
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <ProfileNavbar
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                friendsCount={profile?.friendsCount}
                            />
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
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                profile={profile}
            />
        </>
    );
}
