import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserSearchService from '../../services/user/UserSearchService';
import CityService from '../../services/CityService';
import FriendRequestService from '../../services/friend/FriendRequestService';
import ChatService from '../../services/chat/ChatService';
import ConfirmModal from '../../components/admin/ConfirmModal';
import toast from 'react-hot-toast';

import CitySelect from '../../components/common/CitySelect';
import UserFilter from '../../components/search/UserFilter';

export default function AdvancedMemberSearch() {
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sendingRequests, setSendingRequests] = useState({});
    const [keyword, setKeyword] = useState('');
    const [pagination, setPagination] = useState({ page: 0, size: 8, totalPages: 0 });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, receiverId: null });

    const [maritalStatus, setMaritalStatus] = useState('');
    const [lookingFor, setLookingFor] = useState('');
    const [cityCode, setCityCode] = useState('');

    // Mock suggestions data (merged from FriendSuggestions)
    const [suggestions, setSuggestions] = useState([
        {
            id: 1,
            name: 'Hồng Nhung',
            age: 24,
            location: 'Hà Nội',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA61rF2qJA_61d08hoKQD1vgLttk99SWH-2mhQvPCoH57mhr0UjI8L7ybrsEWnI2oLFtMUesiVK-j9CGmOjLqaDBSP4VGvvtSiwItxsARYkGe8mEsW7qwBkWXGsCjQLKe10vZ7AQv05zjKn0dsPLE5BUEJCjrwzv9TUcPhyKj43H7MuKHeGmqxrZrq5_s7ODalnsrwBejsIxD4NsrZetKdfuu5WRkwVCT304dnvOmT15inm4rJUGChESlWiT5jnp5f3NqPpm8kKCv0',
            mutualFriends: 12,
            reason: 'Có cùng sở thích: Du lịch',
            online: true
        },
        {
            id: 2,
            name: 'Tuấn Anh',
            age: 29,
            location: 'TP. HCM',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdoLrCwAT83JCL6U8m7TnDC0oM8kn4OVr5XeeYADi_UYRinmq2C0fIwzychqDESZvGWD0nS5EqD_0hTACwjoHHIUqj1bI5Ic1EQZ75Oef8FoxX0B7g4dp_lmTjf44WtIpjrF_Ygs2b0iQ90dlQzFyapA7Oh2Pm1-peCNesZBogBZhUpUCXOnp5_KqLP9H-cm69o1uTTt-sGGAzw11HFpXZ7pvgNJkIjC9OPnhWLCMwXKlgZz2nKU2pguarVqXSrrVwTiSrRLt4h5g',
            mutualFriends: 8,
            reason: 'Thành viên mới gần bạn',
            online: false
        },
        {
            id: 3,
            name: 'Minh Thư',
            age: 26,
            location: 'Đà Nẵng',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA2lYtnTFCA75HFG_52JszPx-az718WMOboPAn-G1i24N852_c8WMA84zaSIjPhM2bLmVoY8itXvafnzxb5VjPbzRUZp6AXCKTfAEXa9jysG_6eND1TYZ0D1OFOXHtOKIWA2x0OJxEozgg2vR_FVWQLKzKDMrEuV3ZX9MEa8yOLevyaZjSYY0z7uQTwuSXWp4HBjjqAcBcZLqU4iAoqv71JyHkK1TW8TD9Rt3KVz3qa5jC8Xq-idWXHr3qpktV4H962cWYDM__P1Y',
            mutualFriends: 5,
            reason: 'Có cùng sở thích: Nghệ thuật',
            online: true
        },
        {
            id: 4,
            name: 'Quốc Bảo',
            age: 28,
            location: 'Cần Thơ',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5XMIpiqrD96rbcu3BjxqHOkpiTb_uUr6zVOzb3_EuEuyT7BKqTEpoqxuP4Q5_KQvP60A_2VSvikFgb-T6dHDeoW_JBguXbEb2aBZWpYU2ZHqnq9-UbMsPrpz9nuSS5PoGtucwsXXNpETlS5qomt4Lt5QiBEH-IIExc6OiETtXvtpKy0BwNQlgjk1GYSXjtSmGV42SJAbFmDxmcSZYbOTUNXQk7EwH1M2sDDKY33EOblUP98AmvedKaka_lnog0uPtQE6vFnDMUuk',
            mutualFriends: 18,
            reason: 'Bạn của Sarah Jenkins',
            online: true
        }
    ]);

    const handleStartChat = async (userId) => {
        const tid = toast.loading("Đang mở cuộc trò chuyện...");
        try {
            const response = await ChatService.getOrCreateDirectChat(userId);
            const room = response.data;
            toast.success("Đã kết nối!", { id: tid });
            navigate('/chat', { state: { selectedRoomKey: room.firebaseRoomKey } });
        } catch (error) {
            console.error("Error starting chat:", error);
            toast.error("Không thể tạo cuộc trò chuyện", { id: tid });
        }
    };




    useEffect(() => {
        // No fetchCities needed here
    }, []);

    // Reset to page 0 when filters change
    useEffect(() => {
        setPagination(prev => ({ ...prev, page: 0 }));
    }, [maritalStatus, lookingFor, keyword, cityCode]);

    useEffect(() => {
        fetchMembers();
    }, [maritalStatus, lookingFor, keyword, cityCode, pagination.page]);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.page,
                size: pagination.size,
                maritalStatus: maritalStatus || null,
                lookingFor: lookingFor || null,
                keyword: keyword || null,
                cityCode: cityCode || null,
            };
            const response = await UserSearchService.searchMembers(params);
            // Append new data if loading more pages, replace if it's the first page
            setMembers(prev => pagination.page === 0 ? response.data.content : [...prev, ...response.data.content]);
            setPagination(prev => ({ ...prev, totalPages: response.data.totalPages }));
        } catch (error) {
            console.error('Search failed', error);
            // toast.error('Lỗi khi tải danh sách thành viên');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setKeyword('');
        setMaritalStatus('');
        setLookingFor('');
        setCityCode('');
        setPagination(prev => ({ ...prev, page: 0 }));
    };

    const handleLoadMore = () => {
        if (pagination.page < pagination.totalPages - 1) {
            setPagination(prev => ({ ...prev, page: prev.page + 1 }));
        }
    };

    const handleSendFriendRequest = async (receiverId) => {
        setSendingRequests(prev => ({ ...prev, [receiverId]: true }));
        try {
            await FriendRequestService.sendRequest(receiverId);
            toast.success('Đã gửi lời mời kết bạn!');
            // Update local state to reflect request sent
            setMembers(prevMembers =>
                prevMembers.map(member =>
                    member.userId === receiverId
                        ? { ...member, requestSent: true }
                        : member
                )
            );
        } catch (error) {
            console.error('Failed to send friend request', error);
            const errorMessage = error.response?.data?.message || 'Không thể gửi lời mời kết bạn';
            toast.error(errorMessage);
        } finally {
            setSendingRequests(prev => ({ ...prev, [receiverId]: false }));
        }
    };

    const handleAcceptRequest = async (requestId, memberId) => {
        setSendingRequests(prev => ({ ...prev, [memberId]: true }));
        try {
            await FriendRequestService.acceptRequest(requestId);
            toast.success('Đã chấp nhận lời mời kết bạn!');
            // Update member to friend status
            setMembers(prevMembers =>
                prevMembers.map(member =>
                    member.userId === memberId
                        ? { ...member, isFriend: true, requestSent: false, requestId: null, isRequestReceiver: false }
                        : member
                )
            );
        } catch (error) {
            console.error('Failed to accept request', error);
            toast.error('Không thể chấp nhận lời mời');
        } finally {
            setSendingRequests(prev => ({ ...prev, [memberId]: false }));
        }
    };

    const handleRejectRequest = async (requestId, memberId) => {
        setSendingRequests(prev => ({ ...prev, [memberId]: true }));
        try {
            await FriendRequestService.rejectRequest(requestId);
            toast.success('Đã từ chối lời mời');
            // Remove request status
            setMembers(prevMembers =>
                prevMembers.map(member =>
                    member.userId === memberId
                        ? { ...member, requestSent: false, requestId: null, isRequestReceiver: false }
                        : member
                )
            );
        } catch (error) {
            console.error('Failed to reject request', error);
            toast.error('Không thể từ chối lời mời');
        } finally {
            setSendingRequests(prev => ({ ...prev, [memberId]: false }));
        }
    };

    const confirmCancelRequest = (receiverId) => {
        setConfirmModal({ isOpen: true, receiverId });
    };

    const handleCancelRequest = async () => {
        const receiverId = confirmModal.receiverId;
        setConfirmModal({ isOpen: false, receiverId: null });

        const toastId = toast.loading('Đang hủy lời mời...');
        setSendingRequests(prev => ({ ...prev, [receiverId]: true }));
        try {
            await FriendRequestService.cancelRequest(receiverId);
            toast.success('Đã hủy lời mời kết bạn', { id: toastId });
            setMembers(prevMembers =>
                prevMembers.map(member =>
                    member.userId === receiverId
                        ? { ...member, requestSent: false }
                        : member
                )
            );
        } catch (error) {
            console.error('Failed to cancel request', error);
            toast.error('Không thể hủy lời mời', { id: toastId });
        } finally {
            setSendingRequests(prev => ({ ...prev, [receiverId]: false }));
        }
    };

    return (
        <>
            <div className="flex flex-1 overflow-hidden relative">
                <main className="flex-1 overflow-y-auto bg-background-dark p-4 md:p-8 custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="mb-8">
                            {/* Suggestions Section */}
                            <div className="mb-12">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">recommend</span>
                                    Gợi ý kết bạn
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {suggestions.map((person) => (
                                        <article
                                            key={person.id}
                                            className="flex flex-col bg-[#2a1d15] rounded-2xl overflow-hidden border border-[#3e2b1d] hover:border-primary/50 transition-all shadow-xl group"
                                        >
                                            <div className="h-48 w-full overflow-hidden relative">
                                                <img
                                                    src={person.image}
                                                    alt={person.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                {person.online && (
                                                    <div className="absolute top-4 right-4 size-3 bg-green-500 border-2 border-[#2a1d15] rounded-full shadow-lg"></div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#2a1d15] via-transparent to-transparent opacity-60"></div>
                                                <div className="absolute bottom-3 left-3 bg-[#3a2b22]/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/10">
                                                    <p className="text-primary text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[12px]">info</span>
                                                        {person.reason}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="p-4 flex flex-col flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-white font-bold text-lg group-hover:text-primary transition-colors">
                                                        {person.name}, {person.age}
                                                    </h3>
                                                    <span className="text-text-secondary text-xs flex items-center gap-1 font-medium bg-[#3a2b22] px-2 py-1 rounded-full">
                                                        <span className="material-symbols-outlined text-[12px]">location_on</span>
                                                        {person.location}
                                                    </span>
                                                </div>

                                                <p className="text-text-secondary text-xs mb-4 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[16px]">group</span>
                                                    {person.mutualFriends} bạn chung
                                                </p>

                                                <div className="mt-auto flex gap-2">
                                                    <button className="flex-1 py-2 rounded-xl bg-primary hover:bg-orange-600 text-[#231810] font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-1">
                                                        <span className="material-symbols-outlined text-[16px]">person_add</span>
                                                        Kết bạn
                                                    </button>
                                                    <button
                                                        onClick={() => handleStartChat(person.id)}
                                                        className="size-9 rounded-xl bg-[#3a2b22] hover:bg-[#493222] text-white transition-colors border border-white/5 flex items-center justify-center"
                                                        title="Nhắn tin"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>

                            <div className="h-[1px] w-full bg-[#3e2b1d] mb-10"></div>

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-white">Tìm bạn mới</h1>
                                    <p className="text-text-secondary text-sm mt-1">Kết nối với những người phù hợp nhất.</p>
                                </div>
                                <button
                                    onClick={handleReset}
                                    className="text-sm font-bold text-primary hover:text-orange-400 flex items-center gap-1 bg-[#2a1d15] px-4 py-2 rounded-lg border border-[#3e2b1d] hover:border-primary/50 transition-all"
                                >
                                    <span className="material-symbols-outlined text-sm">restart_alt</span>
                                    Đặt lại bộ lọc
                                </button>
                            </div>

                            {/* Filter Bar */}
                            <UserFilter
                                keyword={keyword}
                                setKeyword={setKeyword}
                                cityCode={cityCode}
                                setCityCode={setCityCode}
                                maritalStatus={maritalStatus}
                                setMaritalStatus={setMaritalStatus}
                                lookingFor={lookingFor}
                                setLookingFor={setLookingFor}
                                onReset={handleReset}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                            {members.map((member) => (
                                <article
                                    key={member.userId}
                                    className="flex flex-col bg-[#2a1d15] rounded-xl overflow-hidden border border-[#3e2b1d] hover:border-primary/50 transition-colors shadow-lg"
                                >
                                    <div className="h-64 sm:h-[16rem] w-full overflow-hidden relative">
                                        <Link to={`/dashboard/member/${member.userId}`} className="block w-full h-full">
                                            <img
                                                src={member.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                                alt={member.fullName}
                                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                            />
                                        </Link>
                                    </div>

                                    <div className="p-4 flex flex-col flex-1">
                                        <h3 className="text-white font-bold text-lg leading-tight mb-1">
                                            <Link to={`/dashboard/member/${member.userId}`} className="hover:text-primary transition-colors">
                                                {member.fullName}
                                            </Link>
                                        </h3>
                                        <p className="text-text-secondary text-sm mb-2">{member.cityName || 'Chưa cập nhật'}</p>

                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-text-secondary text-sm font-medium">
                                                {member.mutualFriends ? `${member.mutualFriends} bạn chung` : 'Không có bạn chung'}
                                            </span>
                                        </div>

                                        <div className="mt-auto flex flex-col gap-2">
                                            {member.isFriend ? (
                                                <button className="w-full py-2 rounded-lg bg-[#3a2b22] text-white font-bold text-sm cursor-default">
                                                    Đã là bạn bè
                                                </button>
                                            ) : member.requestSent && member.isRequestReceiver ? (
                                                <div className="flex flex-col gap-2 w-full">
                                                    <button
                                                        onClick={() => handleAcceptRequest(member.requestId, member.userId)}
                                                        disabled={sendingRequests[member.userId]}
                                                        className="w-full py-2 rounded-lg bg-primary hover:bg-orange-600 text-[#231810] font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">
                                                            {sendingRequests[member.userId] ? 'sync' : 'done'}
                                                        </span>
                                                        {sendingRequests[member.userId] ? 'Đang xử lý...' : 'Chấp nhận'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectRequest(member.requestId, member.userId)}
                                                        disabled={sendingRequests[member.userId]}
                                                        className="w-full py-2 rounded-lg bg-[#342418] hover:bg-red-500/20 hover:text-red-500 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">close</span>
                                                        Từ chối
                                                    </button>
                                                </div>
                                            ) : member.requestSent ? (
                                                <button
                                                    onClick={() => confirmCancelRequest(member.userId)}
                                                    disabled={sendingRequests[member.userId]}
                                                    className="w-full py-2 rounded-lg bg-[#3a2b22] text-white/50 hover:text-red-500 hover:bg-red-500/10 font-bold text-sm cursor-pointer transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <span className="material-symbols-outlined text-sm">done</span>
                                                    {sendingRequests[member.userId] ? 'Đang hủy...' : 'Đã gửi yêu cầu'}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleSendFriendRequest(member.userId)}
                                                    disabled={sendingRequests[member.userId]}
                                                    className="w-full py-2 rounded-lg bg-primary hover:bg-orange-600 text-[#231810] font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <span className="material-symbols-outlined text-sm">
                                                        {sendingRequests[member.userId] ? 'sync' : 'person_add'}
                                                    </span>
                                                    {sendingRequests[member.userId] ? 'Đang gửi...' : 'Kết bạn'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {pagination.page < pagination.totalPages - 1 && (
                            <div className="mt-12 flex justify-center pb-8">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loading}
                                    className="px-8 py-3 rounded-full bg-[#342418] hover:bg-[#493222] text-white font-bold border border-[#493222] transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Đang tải...' : 'Xem thêm kết quả'}
                                </button>
                            </div>
                        )}
                    </div>
                </main >

            </div >
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, receiverId: null })}
                onConfirm={handleCancelRequest}
                title="Hủy lời mời kết bạn"
                message="Bạn có chắc chắn muốn hủy lời mời kết bạn này? Hành động này không thể hoàn tác."
                type="danger"
                confirmText="Hủy kết bạn"
                cancelText="Đóng"
            />
        </>
    );
}

