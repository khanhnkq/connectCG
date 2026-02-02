import { Loader2, Check, X, UserPlus, Search, ChevronDown } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import UserSearchService from "../../services/user/UserSearchService";
import CityService from "../../services/CityService";
import FriendRequestService from "../../services/friend/FriendRequestService";
import ConfirmModal from "../../components/common/ConfirmModal";
import toast from "react-hot-toast";

import CitySelect from "../../components/common/CitySelect";
import ChatService from "../../services/chat/ChatService";
import MemberFilterSidebar from "./MemberFilterSidebar";

export default function AdvancedMemberSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendingRequests, setSendingRequests] = useState({});

  // Get keyword from URL if exists
  const queryParams = new URLSearchParams(location.search);
  const initialKeyword = queryParams.get("keyword") || "";

  const [keyword, setKeyword] = useState(initialKeyword);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 8,
    totalPages: 0,
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    receiverId: null,
  });

  const [maritalStatus, setMaritalStatus] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [cityCode, setCityCode] = useState("");

  const fetchMembers = useCallback(async () => {
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
      setMembers((prev) =>
        pagination.page === 0
          ? response.data.content
          : [...prev, ...response.data.content],
      );
      setPagination((prev) => ({
        ...prev,
        totalPages: response.data.totalPages,
      }));
    } catch (error) {
      console.error("Search failed", error);
      // toast.error('Lỗi khi tải danh sách thành viên');
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.size,
    maritalStatus,
    lookingFor,
    keyword,
    cityCode,
  ]);

  // Reset to page 0 when filters change (except keyword which is handled separately now)
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 0 }));
  }, [maritalStatus, lookingFor, cityCode]);

  // Sync keyword from URL when location changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const kw = params.get("keyword") || "";
    if (kw !== keyword) {
      setKeyword(kw);
      setPagination((prev) => ({ ...prev, page: 0 }));
    }
  }, [location.search]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleReset = () => {
    setKeyword("");
    setMaritalStatus("");
    setLookingFor("");
    setCityCode("");
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages - 1) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handleSendFriendRequest = async (receiverId) => {
    setSendingRequests((prev) => ({ ...prev, [receiverId]: true }));
    try {
      await FriendRequestService.sendRequest(receiverId);
      toast.success("Đã gửi lời mời kết bạn!");
      // Update local state to reflect request sent
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.userId === receiverId
            ? { ...member, requestSent: true }
            : member,
        ),
      );
    } catch (error) {
      console.error("Failed to send friend request", error);
      const errorMessage =
        error.response?.data?.message || "Không thể gửi lời mời kết bạn";
      toast.error(errorMessage);
    } finally {
      setSendingRequests((prev) => ({ ...prev, [receiverId]: false }));
    }
  };

  const handleAcceptRequest = async (requestId, memberId) => {
    setSendingRequests((prev) => ({ ...prev, [memberId]: true }));
    try {
      await FriendRequestService.acceptRequest(requestId);
      toast.success("Đã chấp nhận lời mời kết bạn!");
      // Update member to friend status
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.userId === memberId
            ? {
              ...member,
              isFriend: true,
              requestSent: false,
              requestId: null,
              isRequestReceiver: false,
            }
            : member,
        ),
      );
    } catch (error) {
      console.error("Failed to accept request", error);
      toast.error("Không thể chấp nhận lời mời");
    } finally {
      setSendingRequests((prev) => ({ ...prev, [memberId]: false }));
    }
  };

  const handleRejectRequest = async (requestId, memberId) => {
    setSendingRequests((prev) => ({ ...prev, [memberId]: true }));
    try {
      await FriendRequestService.rejectRequest(requestId);
      toast.success("Đã từ chối lời mời");
      // Remove request status
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.userId === memberId
            ? {
              ...member,
              requestSent: false,
              requestId: null,
              isRequestReceiver: false,
            }
            : member,
        ),
      );
    } catch (error) {
      console.error("Failed to reject request", error);
      toast.error("Không thể từ chối lời mời");
    } finally {
      setSendingRequests((prev) => ({ ...prev, [memberId]: false }));
    }
  };

  const confirmCancelRequest = (receiverId) => {
    setConfirmModal({ isOpen: true, receiverId });
  };

  const handleCancelRequest = async () => {
    const receiverId = confirmModal.receiverId;
    setConfirmModal({ isOpen: false, receiverId: null });

    const toastId = toast.loading("Đang hủy lời mời...");
    setSendingRequests((prev) => ({ ...prev, [receiverId]: true }));
    try {
      await FriendRequestService.cancelRequest(receiverId);
      toast.success("Đã hủy lời mời kết bạn", { id: toastId });
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.userId === receiverId
            ? { ...member, requestSent: false }
            : member,
        ),
      );
    } catch (error) {
      console.error("Failed to cancel request", error);
      toast.error("Không thể hủy lời mời", { id: toastId });
    } finally {
      setSendingRequests((prev) => ({ ...prev, [receiverId]: false }));
    }
  };

  const handleStartChat = async (userId) => {
    const tid = toast.loading("Đang mở cuộc trò chuyện...");
    try {
      const response = await ChatService.getOrCreateDirectChat(userId);
      const room = response.data;
      toast.success("Đã kết nối!", { id: tid });
      navigate("/chat", { state: { selectedRoomKey: room.firebaseRoomKey } });
    } catch (error) {
      console.error("Error starting chat:", error);
      toast.error("Không thể tạo cuộc trò chuyện", { id: tid });
    }
  };

  const suggestions = []; // Data suggestion chưa có API, tạm thời để trống

  return (
    <div className="flex flex-1 overflow-hidden relative bg-background-main">
      <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto">

          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-text-main flex items-center gap-2">
              <span className="p-2 rounded-lg bg-primary/10 text-primary">
                <Search size={24} />
              </span>
              Tìm kiếm thành viên
            </h1>
            <p className="text-text-secondary mt-1 ml-11">
              Kết nối với những người phù hợp với tiêu chí của bạn.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Left Sidebar - Filters */}
            <MemberFilterSidebar
              keyword={keyword} setKeyword={setKeyword}
              cityCode={cityCode} setCityCode={(code) => {
                setCityCode(code);
                setPagination(prev => ({ ...prev, page: 0 }));
              }}
              maritalStatus={maritalStatus} setMaritalStatus={setMaritalStatus}
              lookingFor={lookingFor} setLookingFor={setLookingFor}
              onReset={handleReset}
              className="hidden lg:block"
            />

            {/* Mobile Filter Toggle (Optional - can be improved with a drawer later) */}
            <div className="lg:hidden w-full mb-4">
              <details className="group bg-surface-main rounded-xl border border-border-main p-4">
                <summary className="font-bold text-text-main list-none cursor-pointer flex justify-between items-center">
                  <span>Bộ lọc tìm kiếm</span>
                  <ChevronDown className="group-open:rotate-180 transition-transform" />
                </summary>
                <div className="mt-4 pt-4 border-t border-border-main">
                  <MemberFilterSidebar
                    keyword={keyword} setKeyword={setKeyword}
                    cityCode={cityCode} setCityCode={(code) => {
                      setCityCode(code);
                      setPagination(prev => ({ ...prev, page: 0 }));
                    }}
                    maritalStatus={maritalStatus} setMaritalStatus={setMaritalStatus}
                    lookingFor={lookingFor} setLookingFor={setLookingFor}
                    onReset={handleReset}
                    className="!w-full"
                  />
                </div>
              </details>
            </div>

            {/* Right Content - Results */}
            <div className="flex-1 w-full">
              {/* Suggestions Section (Small snippet above results) */}
              {suggestions.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-text-main mb-4">Gợi ý cho bạn</h2>
                  {/* Suggestion Grid... (Simplified for now) */}
                </div>
              )}

              {/* Results Grid */}
              {loading && pagination.page === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="animate-spin text-primary h-8 w-8" />
                </div>
              ) : members.length === 0 ? (
                <div className="bg-surface-main rounded-2xl border border-border-main p-12 text-center">
                  <div className="mx-auto w-16 h-16 bg-background-main rounded-full flex items-center justify-center mb-4">
                    <Search className="text-text-secondary h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-text-main mb-2">Không tìm thấy kết quả</h3>
                  <p className="text-text-secondary max-w-md mx-auto">
                    Thử diều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn để thấy nhiều kết quả hơn.
                  </p>
                  <button onClick={handleReset} className="mt-6 text-primary font-medium hover:underline">
                    Xóa bộ lọc
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {members.map((member) => (
                    <article
                      key={member.userId}
                      className="flex flex-col bg-surface-main rounded-xl overflow-hidden border border-border-main hover:border-primary/50 transition-all shadow-sm hover:shadow-md group"
                    >
                      <div className="h-56 w-full overflow-hidden relative">
                        <Link
                          to={`/dashboard/member/${member.userId}`}
                          className="block w-full h-full"
                        >
                          <img
                            src={
                              member.avatarUrl ||
                              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }
                            alt={member.fullName}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>

                        {/* Status Badge Overlay (Optional) */}
                        {member.isFriend && (
                          <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                            BẠN BÈ
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="text-text-main font-bold text-lg leading-tight mb-1 truncate">
                          <Link
                            to={`/dashboard/member/${member.userId}`}
                            className="hover:text-primary transition-colors"
                          >
                            {member.fullName}
                          </Link>
                        </h3>
                        <div className="flex items-center gap-1.5 text-text-secondary text-sm mb-3">
                          <span className="material-symbols-outlined text-[16px]">location_on</span>
                          <span className="truncate">{member.cityName || "Chưa cập nhật"}</span>
                        </div>

                        <div className="mt-auto pt-4 border-t border-border-main flex flex-col gap-2">
                          {member.isFriend ? (
                            <button
                              onClick={() => handleStartChat(member.userId)}
                              className="w-full py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-bold text-sm transition-colors flex items-center justify-center gap-2"
                            >
                              <span className="material-symbols-outlined text-sm">chat</span>
                              Nhắn tin
                            </button>
                          ) : member.requestSent ? (
                            member.isRequestReceiver ? (
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() => handleAcceptRequest(member.requestId, member.userId)}
                                  disabled={sendingRequests[member.userId]}
                                  className="py-2 rounded-lg bg-primary text-white font-bold text-sm hover:bg-orange-600 transition-colors"
                                >
                                  Chấp nhận
                                </button>
                                <button
                                  onClick={() => handleRejectRequest(member.requestId, member.userId)}
                                  disabled={sendingRequests[member.userId]}
                                  className="py-2 rounded-lg bg-background-main text-text-main font-bold text-sm border border-border-main hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                                >
                                  Từ chối
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => confirmCancelRequest(member.userId)}
                                disabled={sendingRequests[member.userId]}
                                className="w-full py-2 rounded-lg bg-background-main text-text-secondary font-bold text-sm border border-border-main hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                              >
                                {sendingRequests[member.userId] ? "Đang xử lý..." : "Hủy lời mời"}
                              </button>
                            )
                          ) : (
                            <button
                              onClick={() => handleSendFriendRequest(member.userId)}
                              disabled={sendingRequests[member.userId]}
                              className="w-full py-2 rounded-lg bg-surface-main text-text-main font-bold text-sm border border-border-main hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                              <UserPlus size={16} />
                              {sendingRequests[member.userId] ? "Đang gửi..." : "Kết bạn"}
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {pagination.page < pagination.totalPages - 1 && (
                <div className="mt-12 flex justify-center pb-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="px-8 py-3 rounded-full bg-surface-main hover:bg-background-main text-text-main font-bold border border-border-main transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading && <Loader2 className="animate-spin h-4 w-4" />}
                    {loading ? "Đang tải..." : "Xem thêm kết quả"}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, receiverId: null })}
        onConfirm={handleCancelRequest}
        title="Hủy lời mời kết bạn"
        message="Bạn có chắc chắn muốn hủy lời mời kết bạn này?"
        type="danger"
        confirmText="Hủy kết bạn"
        cancelText="Đóng"
      />
    </div>
  );
}
