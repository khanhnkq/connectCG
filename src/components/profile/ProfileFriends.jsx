import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FriendService from '../../services/friend/FriendService';

const ProfileFriends = ({ profile, isOwner }) => {
    const navigate = useNavigate();
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (profile?.userId) {
            const loadFriends = async () => {
                try {
                    setLoading(true);
                    const response = await FriendService.getFriends(profile.userId, { size: 50 });
                    setFriends(response.data.content || response.data || []);
                } catch (error) {
                    console.error("Lỗi khi tải danh sách bạn bè:", error);
                } finally {
                    setLoading(false);
                }
            };
            loadFriends();
        }
    }, [profile?.userId]);

    return (
        <div className="bg-[#342418] rounded-2xl border border-[#3e2b1d] p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold text-xl flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">group</span>
                    {isOwner ? 'Danh sách bạn bè' : 'Bạn bè'}
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-text-secondary text-sm">{profile?.friendsCount || 0} người bạn</span>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="size-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : friends.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {friends.map((friend) => (
                        <div key={friend.id} className="bg-[#493222] hover:bg-[#5c402d] p-3 rounded-2xl border border-white/5 flex items-center gap-4 transition-all group">
                            <div className="relative">
                                <div
                                    className="size-16 rounded-xl bg-cover bg-center shadow-inner"
                                    style={{ backgroundImage: `url("${friend.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}")` }}
                                ></div>
                                <div className="absolute -bottom-1 -right-1 size-4 bg-green-500 border-2 border-[#493222] rounded-full"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-bold text-lg truncate group-hover:text-primary transition-colors">
                                    {friend.fullName}
                                </h4>
                                <p className="text-text-secondary text-xs truncate">@{friend.username}</p>
                                <p className="text-text-secondary/60 text-[10px] mt-1 italic">{friend.occupation || 'Chưa cập nhật nghề nghiệp'}</p>
                            </div>
                            <button
                                onClick={() => navigate(`/dashboard/member/${friend.id}`)}
                                className="bg-primary/10 hover:bg-primary text-primary hover:text-[#231810] p-2.5 rounded-xl transition-all"
                                title="Xem hồ sơ"
                            >
                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <span className="material-symbols-outlined text-5xl text-text-secondary/20 mb-3">person_search</span>
                    <p className="text-text-secondary italic">
                        {isOwner ? 'Bạn chưa chọn người bạn nào.' : 'Người dùng này chưa có bạn bè.'}
                    </p>
                    {isOwner && (
                        <button
                            onClick={() => navigate('/dashboard/explore')}
                            className="text-primary font-bold mt-2 hover:underline"
                        >
                            Tìm kiếm bạn bè ngay
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfileFriends;
