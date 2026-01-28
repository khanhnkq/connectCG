import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar.jsx';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserSearchService from '../../services/user/UserSearchService';
import CityService from '../../services/CityService';
import FriendRequestService from '../../services/friend/FriendRequestService';
import toast from 'react-hot-toast';

export default function AdvancedMemberSearch() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sendingRequests, setSendingRequests] = useState({});
    const [keyword, setKeyword] = useState('');
    const [pagination, setPagination] = useState({ page: 0, size: 8, totalPages: 0 });

    const [maritalStatus, setMaritalStatus] = useState('');
    const [lookingFor, setLookingFor] = useState('');
    const [cityId, setCityId] = useState('');
    const [cities, setCities] = useState([]);
    const [selectedInterests, setSelectedInterests] = useState(['Du lịch', 'Leo núi']);

    const interests = ['Du lịch', 'Âm thực', 'Nấu ăn', 'Leo núi', 'Chơi game', 'Nghệ thuật', 'Gym'];

    const toggleInterest = (interest) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    useEffect(() => {
        fetchCities();
    }, []);

    // Reset to page 0 when filters change
    useEffect(() => {
        setPagination(prev => ({ ...prev, page: 0 }));
    }, [maritalStatus, lookingFor, keyword, cityId]);

    useEffect(() => {
        fetchMembers();
    }, [maritalStatus, lookingFor, keyword, cityId, pagination.page]);

    const fetchCities = async () => {
        try {
            const data = await CityService.getAllCities();
            setCities(data);
        } catch (error) {
            console.error('Failed to fetch cities', error);
        }
    };

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.page,
                size: pagination.size,
                maritalStatus: maritalStatus || null,
                lookingFor: lookingFor || null,
                keyword: keyword || null,
                cityId: cityId || null,
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
        setCityId('');
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

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen flex w-full">

            <div className="flex flex-1 overflow-hidden relative">
                {/* Main Content: Search Results */}
                <main className="flex-1 overflow-y-auto bg-background-dark p-4 md:p-8 custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto">
                        {/* Results Header */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-white">Tìm bạn mới</h1>
                            <p className="text-text-secondary text-sm mt-1">Sử dụng bộ lọc thông minh để tìm những người phù hợp nhất với bạn.</p>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                            {members.map((member) => (
                                <article
                                    key={member.userId}
                                    className="flex flex-col bg-[#2a1d15] rounded-xl overflow-hidden border border-[#3e2b1d] hover:border-primary/50 transition-colors shadow-lg"
                                >
                                    {/* Image Section - Top Half */}
                                    <div className="h-64 sm:h-[16rem] w-full overflow-hidden relative">
                                        <Link to={`/dashboard/member/${member.userId}`} className="block w-full h-full">
                                            <img
                                                src={member.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                                alt={member.fullName}
                                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                            />
                                        </Link>
                                        {/* Online status tag could be added here if available in API */}
                                    </div>

                                    {/* Content Section - Bottom Half */}
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

                                        {/* Buttons */}
                                        <div className="mt-auto flex flex-col gap-2">
                                            {member.isFriend ? (
                                                <button className="w-full py-2 rounded-lg bg-[#3a2b22] text-white font-bold text-sm cursor-default">
                                                    Đã là bạn bè
                                                </button>
                                            ) : member.requestSent && member.isRequestReceiver ? (
                                                // User received a request from this member
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
                                                // User sent a request to this member
                                                <button className="w-full py-2 rounded-lg bg-[#3a2b22] text-white/50 font-bold text-sm cursor-default flex items-center justify-center gap-2">
                                                    <span className="material-symbols-outlined text-sm">done</span>
                                                    Đã gửi yêu cầu
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
                                                    {sendingRequests[member.userId] ? '\u0110ang g\u1eedi...' : 'K\u1ebft b\u1ea1n'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Load More Button */}
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
                </main>

                {/* Search Filters Sidebar - Moved to Right */}
                <aside className="w-full md:w-[320px] lg:w-[340px] flex flex-col border-l border-[#342418] bg-[#221710] z-10 overflow-y-auto custom-scrollbar flex-none hidden md:flex">
                    <div className="p-5 pb-0">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-white text-xl font-bold leading-tight">Bộ lọc tìm kiếm</h2>
                            <button onClick={handleReset} className="text-sm font-bold text-primary hover:text-orange-400">Đặt lại</button>
                        </div>

                        {/* Search Bar */}
                        <div className="mb-6">
                            <label className="flex w-full items-center rounded-xl bg-[#342418] border border-[#493222] h-12 px-4 focus-within:ring-1 ring-primary/50 transition-all">
                                <span className="material-symbols-outlined text-text-secondary">search</span>
                                <input
                                    className="w-full bg-transparent border-none text-white placeholder-text-secondary/60 focus:ring-0 text-sm ml-2 focus:outline-none"
                                    placeholder="Tên, thành phố hoặc từ khóa..."
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                            </label>
                        </div>


                    </div>

                    {/* Accordions Container */}
                    <div className="flex flex-col px-5 pb-10 gap-4">
                        {/* Marital Status Accordion */}
                        <details className="group flex flex-col rounded-xl border border-[#342418] bg-[#2a1d15] overflow-hidden" open>
                            <summary className="flex cursor-pointer items-center justify-between gap-6 p-4 bg-transparent hover:bg-white/5 transition-colors list-none">
                                <p className="text-white text-sm font-bold">Tình trạng hôn nhân</p>
                                <span className="material-symbols-outlined text-text-secondary text-[20px] transition-transform group-open:rotate-180">
                                    expand_more
                                </span>
                            </summary>
                            <div className="px-4 pb-5 pt-1">
                                <div className="space-y-2">
                                    {['', 'SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'].map((status) => (
                                        <label key={status} className="flex items-center gap-3 cursor-pointer group/label">
                                            <div className={`size-4 rounded-full border flex items-center justify-center ${maritalStatus === status ? 'border-primary' : 'border-[#493222]'}`}>
                                                {maritalStatus === status && <div className="size-2 rounded-full bg-primary" />}
                                            </div>
                                            <input
                                                type="radio"
                                                name="maritalStatus"
                                                checked={maritalStatus === status}
                                                onChange={() => setMaritalStatus(status)}
                                                className="hidden"
                                            />
                                            <span className={`text-sm group-hover/label:text-white transition-colors ${maritalStatus === status ? 'text-white' : 'text-text-secondary'}`}>
                                                {status === '' ? 'Tất cả' : status === 'SINGLE' ? 'Độc thân' : status === 'MARRIED' ? 'Đã kết hôn' : status === 'DIVORCED' ? 'Đã ly hôn' : 'Góa'}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </details>

                        {/* Looking For Accordion */}
                        <details className="group flex flex-col rounded-xl border border-[#342418] bg-[#2a1d15] overflow-hidden" open>
                            <summary className="flex cursor-pointer items-center justify-between gap-6 p-4 bg-transparent hover:bg-white/5 transition-colors list-none">
                                <p className="text-white text-sm font-bold">Mục đích kết bạn</p>
                                <span className="material-symbols-outlined text-text-secondary text-[20px] transition-transform group-open:rotate-180">
                                    expand_more
                                </span>
                            </summary>
                            <div className="px-4 pb-5 pt-1">
                                <div className="space-y-2">
                                    {[
                                        { value: '', label: 'Tất cả' },
                                        { value: 'love', label: 'Tìm tình yêu' },
                                        { value: 'friends', label: 'Kết bạn' },
                                        { value: 'networking', label: 'Kết nối' }
                                    ].map((option) => (
                                        <label key={option.value} className="flex items-center gap-3 cursor-pointer group/label">
                                            <div className={`size-4 rounded-full border flex items-center justify-center ${lookingFor === option.value ? 'border-primary' : 'border-[#493222]'}`}>
                                                {lookingFor === option.value && <div className="size-2 rounded-full bg-primary" />}
                                            </div>
                                            <input
                                                type="radio"
                                                name="lookingFor"
                                                checked={lookingFor === option.value}
                                                onChange={() => setLookingFor(option.value)}
                                                className="hidden"
                                            />
                                            <span className={`text-sm group-hover/label:text-white transition-colors ${lookingFor === option.value ? 'text-white' : 'text-text-secondary'}`}>
                                                {option.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </details>

                        {/* City Filter Accordion (Replaces Location/Distance) */}
                        <details className="group flex flex-col rounded-xl border border-[#342418] bg-[#2a1d15] overflow-hidden" open>
                            <summary className="flex cursor-pointer items-center justify-between gap-6 p-4 bg-transparent hover:bg-white/5 transition-colors list-none">
                                <p className="text-white text-sm font-bold">Thành phố</p>
                                <span className="material-symbols-outlined text-text-secondary text-[20px] transition-transform group-open:rotate-180">
                                    expand_more
                                </span>
                            </summary>
                            <div className="px-4 pb-5 pt-1">
                                <div className="space-y-2">
                                    {/* Option: All Cities */}
                                    <label className="flex items-center gap-3 cursor-pointer group/label">
                                        <div className={`size-4 rounded-full border flex items-center justify-center ${!cityId ? 'border-primary' : 'border-[#493222]'}`}>
                                            {!cityId && <div className="size-2 rounded-full bg-primary" />}
                                        </div>
                                        <input
                                            type="radio"
                                            name="cityId"
                                            checked={!cityId}
                                            onChange={() => setCityId('')}
                                            className="hidden"
                                        />
                                        <span className={`text-sm group-hover/label:text-white transition-colors ${!cityId ? 'text-white' : 'text-text-secondary'}`}>
                                            Tất cả thành phố
                                        </span>
                                    </label>

                                    {/* Option: Specific Cities */}
                                    {cities.map((city) => (
                                        <label key={city.id} className="flex items-center gap-3 cursor-pointer group/label">
                                            <div className={`size-4 rounded-full border flex items-center justify-center ${cityId === city.id ? 'border-primary' : 'border-[#493222]'}`}>
                                                {cityId === city.id && <div className="size-2 rounded-full bg-primary" />}
                                            </div>
                                            <input
                                                type="radio"
                                                name="cityId"
                                                checked={cityId === city.id}
                                                onChange={() => setCityId(city.id)}
                                                className="hidden"
                                            />
                                            <span className={`text-sm group-hover/label:text-white transition-colors ${cityId === city.id ? 'text-white' : 'text-text-secondary'}`}>
                                                {city.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </details>

                        {/* Interests Accordion */}
                        <details className="group flex flex-col rounded-xl border border-[#342418] bg-[#2a1d15] overflow-hidden">
                            <summary className="flex cursor-pointer items-center justify-between gap-6 p-4 bg-transparent hover:bg-white/5 transition-colors list-none">
                                <p className="text-white text-sm font-bold">Sở thích</p>
                                <span className="material-symbols-outlined text-text-secondary text-[20px] transition-transform group-open:rotate-180">
                                    expand_more
                                </span>
                            </summary>
                            <div className="px-4 pb-5 pt-1">
                                <div className="flex flex-wrap gap-2">
                                    {interests.map((interest) => (
                                        <button
                                            key={interest}
                                            onClick={() => toggleInterest(interest)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${selectedInterests.includes(interest)
                                                ? 'bg-primary text-[#231810] border-primary'
                                                : 'bg-transparent text-text-secondary border-[#493222] hover:border-primary hover:text-primary'
                                                }`}
                                        >
                                            {interest}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </details>
                    </div>
                </aside>
            </div>
        </div >
    );
}
