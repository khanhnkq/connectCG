import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

import RightSidebar from "../../components/layout/RightSidebar";
import { History, BellOff, Bell, UserPlus, Users, Trash2 } from "lucide-react";
import FriendRequestService from "../../services/friend/FriendRequestService";
import toast from "react-hot-toast";

export default function FriendRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingRequests, setProcessingRequests] = useState({});
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  });

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await FriendRequestService.getPendingRequests(
        pagination.page,
        pagination.size,
      );
      setRequests(response.data.content);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
      }));
    } catch (error) {
      console.error("Failed to fetch friend requests", error);
      toast.error("Không thể tải danh sách lời mời");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.size]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleAccept = async (requestId) => {
    setProcessingRequests((prev) => ({ ...prev, [requestId]: "accepting" }));
    try {
      await FriendRequestService.acceptRequest(requestId);
      toast.success("Đã chấp nhận lời mời kết bạn!");
      // Remove from list
      setRequests((prev) => prev.filter((req) => req.requestId !== requestId));
      setPagination((prev) => ({
        ...prev,
        totalElements: prev.totalElements - 1,
      }));
    } catch (error) {
      console.error("Failed to accept request", error);
      toast.error("Không thể chấp nhận lời mời");
    } finally {
      setProcessingRequests((prev) => ({ ...prev, [requestId]: null }));
    }
  };

  const handleReject = async (requestId) => {
    setProcessingRequests((prev) => ({ ...prev, [requestId]: "rejecting" }));
    try {
      await FriendRequestService.rejectRequest(requestId);
      toast.success("Đã từ chối lời mời");
      // Remove from list
      setRequests((prev) => prev.filter((req) => req.requestId !== requestId));
      setPagination((prev) => ({
        ...prev,
        totalElements: prev.totalElements - 1,
      }));
    } catch (error) {
      console.error("Failed to reject request", error);
      toast.error("Không thể từ chối lời mời");
    } finally {
      setProcessingRequests((prev) => ({ ...prev, [requestId]: null }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-8 pb-20">
      <header className="flex justify-between items-center mb-8 sticky top-0 bg-background-main/95 backdrop-blur-sm z-30 py-4 -mt-4 border-b border-border-main">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-extrabold text-text-main tracking-tight">
              Lời mời kết bạn
            </h1>
            <span className="bg-primary text-text-main text-xs font-black px-2.5 py-1 rounded-full shadow-lg shadow-orange-500/20">
              {pagination.totalElements}
            </span>
          </div>
          <p className="text-text-secondary text-sm font-medium">
            Quản lý các kết nối và yêu cầu kết bạn của bạn
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-main hover:bg-background-main text-text-main transition-all text-sm font-bold border border-border-main shadow-xl">
            <History size={20} />
            <span className="hidden sm:inline">Lời mời đã gửi</span>
          </button>
        </div>
      </header>

      {/* Friend Requests List */}
      <div className="flex flex-col gap-10">
        {loading && requests.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-text-secondary font-bold">Đang tải...</p>
            </div>
          </div>
        ) : requests.length === 0 ? (
          <section className="py-20 text-center bg-surface-main border border-border-main rounded-[3rem] border-dashed border-2">
            <div className="size-20 rounded-full bg-background-main flex items-center justify-center mx-auto mb-5 text-text-muted">
              <BellOff size={40} />
            </div>
            <h3 className="text-text-main font-black text-xl mb-2">
              Không có lời mời nào
            </h3>
            <p className="text-text-secondary text-sm mb-6 max-w-sm mx-auto font-medium">
              Bạn chưa có lời mời kết bạn mới.
            </p>
          </section>
        ) : (
          <section>
            <h2 className="text-text-main font-bold text-lg mb-5 flex items-center gap-2">
              <Bell className="text-primary" size={24} />
              Mới nhất{" "}
              <span className="text-text-secondary font-medium text-sm">
                ({pagination.totalElements} yêu cầu)
              </span>
            </h2>
            <div className="bg-surface-main rounded-[2rem] border border-border-main overflow-hidden shadow-2xl">
              {requests.map((request, index) => (
                <div
                  key={request.requestId}
                  className={`p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-background-main/50 transition-colors group ${
                    index < requests.length - 1
                      ? "border-b border-border-main/50"
                      : ""
                  }`}
                >
                  <div className="relative">
                    <Link to={`/dashboard/member/${request.senderId}`}>
                      <div
                        className="size-20 rounded-2xl bg-cover bg-center ring-4 ring-surface-main shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500"
                        style={{
                          backgroundImage: `url("${
                            request.senderAvatarUrl ||
                            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          }")`,
                        }}
                      ></div>
                    </Link>
                    <div className="absolute -bottom-2 -right-2 size-8 bg-primary rounded-xl flex items-center justify-center border-4 border-surface-main shadow-lg">
                      <UserPlus
                        size={18}
                        className="text-text-main font-black"
                      />
                    </div>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <Link to={`/dashboard/member/${request.senderId}`}>
                      <h3 className="text-text-main font-black text-xl hover:text-primary cursor-pointer transition-colors tracking-tight">
                        {request.senderFullName || request.senderUsername}
                      </h3>
                    </Link>
                    <p className="text-text-secondary text-sm mt-1 mb-3 font-medium">
                      @{request.senderUsername}
                    </p>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => handleAccept(request.requestId)}
                      disabled={processingRequests[request.requestId]}
                      className="flex-1 sm:flex-none bg-primary hover:bg-orange-600 text-text-main font-black text-sm px-8 py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingRequests[request.requestId] === "accepting"
                        ? "Đang xử lý..."
                        : "Chấp nhận"}
                    </button>
                    <button
                      onClick={() => handleReject(request.requestId)}
                      disabled={processingRequests[request.requestId]}
                      className="flex-1 sm:flex-none bg-background-main hover:bg-red-500/20 hover:text-red-500 text-text-main font-bold text-sm px-8 py-3 rounded-xl transition-all border border-border-main disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingRequests[request.requestId] === "rejecting"
                        ? "Đang xử lý..."
                        : "Xóa"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="py-10 text-center bg-surface-main border border-border-main rounded-[3rem] border-dashed border-2">
          <div className="size-20 rounded-full bg-background-main flex items-center justify-center mx-auto mb-5 text-text-muted">
            <Users size={40} />
          </div>
          <h3 className="text-text-main font-black text-xl mb-2">
            Tìm kiếm thêm bạn mới?
          </h3>
          <p className="text-text-secondary text-sm mb-6 max-w-sm mx-auto font-medium">
            Khám phá danh sách gợi ý của chúng tôi để mở rộng vòng kết nối của
            bạn.
          </p>
          <button className="px-10 py-3.5 rounded-full bg-primary hover:bg-orange-600 text-text-main font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-orange-500/10">
            Xem gợi ý ngay
          </button>
        </section>
      </div>
    </div>
  );
}
