import React, { useState, useEffect } from 'react';
import { getFriends } from '../../services/FriendService';
import toast from 'react-hot-toast';

export default function InviteMemberModal({ isOpen, onClose, onInvite }) {
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchFriends();
            setSelectedFriends([]);
            setSearchTerm('');
        }
    }, [isOpen]);

    const fetchFriends = async () => {
        setLoading(true);
        try {
            // Fetch friends of current user
            // Assuming getFriends supports pagination or returns a list. 
            // Here we ask for a reasonable page size or all if possible.
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const data = await getFriends({ userId: user.id, size: 100 });
                setFriends(data.content || data); // Adjust based on API response structure (Page vs List)
            }
        } catch (error) {
            console.error("Failed to fetch friends:", error);
            toast.error("Không thể tải danh sách bạn bè");
        } finally {
            setLoading(false);
        }
    };

    const toggleSelection = (friendId) => {
        setSelectedFriends(prev =>
            prev.includes(friendId)
                ? prev.filter(id => id !== friendId)
                : [...prev, friendId]
        );
    };

    const handleInvite = () => {
        if (selectedFriends.length === 0) return;
        onInvite(selectedFriends);
    };

    const filteredFriends = friends.filter(friend =>
        friend.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1a120b] border border-[#3e2b1d] rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-[#3e2b1d]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white">Mời bạn bè</h3>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-text-secondary hover:text-white transition-all">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">search</span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm bạn bè..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#120a05] border border-[#3e2b1d] rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {loading ? (
                        <div className="text-center py-8 text-text-secondary">Đang tải...</div>
                    ) : filteredFriends.length === 0 ? (
                        <div className="text-center py-8 text-text-secondary">Không tìm thấy bạn bè nào.</div>
                    ) : (
                        filteredFriends.map(friend => (
                            <div
                                key={friend.id}
                                onClick={() => toggleSelection(friend.id)}
                                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${selectedFriends.includes(friend.id)
                                    ? 'bg-primary/10 border-primary/50'
                                    : 'hover:bg-white/5 border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={friend.avatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                        alt=""
                                        className="size-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className={`font-bold text-sm ${selectedFriends.includes(friend.id) ? 'text-primary' : 'text-white'}`}>
                                            {friend.fullName}
                                        </p>
                                        <p className="text-xs text-text-secondary">@{friend.username}</p>
                                    </div>
                                </div>
                                <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedFriends.includes(friend.id)
                                    ? 'bg-primary border-primary'
                                    : 'border-text-secondary'
                                    }`}>
                                    {selectedFriends.includes(friend.id) && (
                                        <span className="material-symbols-outlined text-[14px] text-black font-bold">check</span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 border-t border-[#3e2b1d] bg-[#1a120b]">
                    <button
                        onClick={handleInvite}
                        disabled={selectedFriends.length === 0}
                        className="w-full py-4 bg-primary text-[#0f0a06] font-black rounded-xl shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">person_add</span>
                        Mời {selectedFriends.length > 0 ? `${selectedFriends.length} người` : ''}
                    </button>
                </div>
            </div>
        </div>
    );
}
