import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  MessageCircle,
  UserMinus,
  UserX,
  UserPlus,
  UserSearch,
  Loader2,
  MoreVertical,
  Check,
  X,
  Search,
} from "lucide-react";
import FriendRequestService from "../../services/friend/FriendRequestService";
import ConfirmModal from "../common/ConfirmModal";
import toast from "react-hot-toast";
import { useFriends } from "../../hooks/useFriends";

import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

const ProfileFriends = ({ profile, isOwner }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Use the refactored hook
  const {
    friends,
    isLoading,
    hasMore,
    loadMore,
    updateFilter,
    handleUnfriend,
    updateFriendStatus,
  } = useFriends(profile?.userId, { name: "" });

  // Debounce search update
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      updateFilter({ name: searchTerm });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, updateFilter]);

  // Infinite Scroll Observer
  const observer = useRef();
  const lastFriendElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, loadMore],
  );

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null,
    friend: null,
  });

  const confirmUnfriend = (friend) => {
    setConfirmModal({ isOpen: true, type: "UNFRIEND", friend });
  };

  const confirmCancelRequest = (friend) => {
    setConfirmModal({ isOpen: true, type: "CANCEL_REQUEST", friend });
  };

  const confirmAcceptRequest = (friend) => {
    setConfirmModal({ isOpen: true, type: "ACCEPT_REQUEST", friend });
  };

  const confirmRejectRequest = (friend) => {
    setConfirmModal({ isOpen: true, type: "REJECT_REQUEST", friend });
  };

  const handleConfirmAction = async () => {
    const { type, friend } = confirmModal;
    setConfirmModal({ isOpen: false, type: null, friend: null });

    if (!friend) return;

    if (type === "UNFRIEND") {
      const success = await handleUnfriend(friend.id);
      if (success) {
        updateFriendStatus(friend.id, "stranger");
      }
    } else if (type === "CANCEL_REQUEST") {
      try {
        await FriendRequestService.cancelRequest(friend.id);
        updateFriendStatus(friend.id, "stranger");
        toast.success("Đã thu hồi lời mời kết bạn");
      } catch {
        toast.error("Không thể thu hồi lời mời");
      }
    } else if (type === "ACCEPT_REQUEST") {
      try {
        if (!friend.requestId) {
          toast.error("Không tìm thấy thông tin lời mời.");
          return;
        }
        await FriendRequestService.acceptRequest(friend.requestId);
        updateFriendStatus(friend.id, "FRIEND");
        toast.success("Đã chấp nhận lời mời kết bạn!");
      } catch {
        toast.error("Không thể chấp nhận lời mời.");
      }
    } else if (type === "REJECT_REQUEST") {
      try {
        if (!friend.requestId) {
          toast.error("Không tìm thấy thông tin lời mời.");
          return;
        }
        await FriendRequestService.rejectRequest(friend.requestId);
        updateFriendStatus(friend.id, "STRANGER");
        toast.success("Đã từ chối lời mời.");
      } catch {
        toast.error("Không thể từ chối lời mời.");
      }
    }
  };

  const handleSendFriendRequest = async (friendId) => {
    try {
      await FriendRequestService.sendRequest(friendId);
      updateFriendStatus(friendId, "PENDING");
      toast.success("Đã gửi lời mời kết bạn!");
    } catch {
      toast.error("Không thể gửi lời mời.");
    }
  };

  return (
    <div className="bg-surface-main rounded-2xl border border-border-main shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div>
            <h3 className="text-text-main font-black text-2xl tracking-tight flex items-center gap-2">
              {isOwner ? "Bạn bè" : "Danh sách bạn bè"}
              <span className="bg-surface-main px-3 py-1 rounded-full text-xs font-bold text-text-secondary border border-border-main">
                {profile?.friendsCount || 0}
              </span>
            </h3>
          </div>

          <div className="relative w-full sm:w-72 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-text-secondary group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 bg-surface-main hover:bg-background-main border border-border-main focus:border-primary/50 rounded-2xl leading-5 text-text-main placeholder-text-secondary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium"
              placeholder="Tìm kiếm bạn bè..."
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {friends.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {friends.map((friend, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -4 }}
                key={friend.id}
                ref={index === friends.length - 1 ? lastFriendElementRef : null}
                className="group relative flex flex-col items-center p-5 bg-gradient-to-br from-surface-main/90 via-surface-main/60 to-background-main/90 backdrop-blur-md rounded-3xl border border-border-main/50 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                {/* Avatar Section */}
                <div
                  className="relative cursor-pointer mb-3"
                  onClick={() => navigate(`/dashboard/member/${friend.id}`)}
                >
                  <div className="relative">
                    <div
                      className="size-20 rounded-2xl bg-cover bg-center ring-4 ring-background-main shadow-lg group-hover:scale-105 transition-transform duration-500"
                      style={{
                        backgroundImage: `url("${
                          friend.avatarUrl ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }")`,
                      }}
                    />
                    {friend.isOnline && (
                      <div className="absolute -bottom-1 -right-1 size-5 bg-green-500 rounded-full border-4 border-surface-main shadow-sm z-10" />
                    )}
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex flex-col items-center text-center w-full mb-4 px-1">
                  <h4
                    className="text-text-main font-black text-lg truncate w-full group-hover:text-primary transition-colors cursor-pointer"
                    onClick={() => navigate(`/dashboard/member/${friend.id}`)}
                  >
                    {friend.fullName}
                  </h4>
                  {friend.occupation ? (
                    <span className="text-text-secondary/70 text-xs font-semibold uppercase tracking-wider mt-1 px-2 py-0.5 bg-background-main/50 rounded-lg border border-border-main/30">
                      {friend.occupation}
                    </span>
                  ) : (
                    <span className="text-text-secondary/40 text-[10px] uppercase font-bold tracking-widest mt-1">
                      Thành viên
                    </span>
                  )}
                </div>

                {/* Relationship Badge or Actions */}
                <div className="w-full mt-auto">
                  {friend.relationshipStatus === "SELF" ? (
                    <div className="w-full py-2.5 bg-primary/5 text-primary text-sm font-bold rounded-xl border border-primary/20 text-center">
                      Bạn
                    </div>
                  ) : friend.relationshipStatus === "FRIEND" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/dashboard/chat`)}
                        className="flex-1 py-2.5 bg-primary text-text-main font-bold text-sm rounded-xl hover:bg-orange-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group/btn"
                      >
                        <MessageCircle
                          size={18}
                          className="group-hover/btn:scale-110 transition-transform"
                        />
                        <span className="hidden sm:inline">Nhắn tin</span>
                      </button>
                      <button
                        onClick={() => confirmUnfriend(friend)}
                        className="p-2.5 bg-background-main/50 hover:bg-status-error/10 text-text-secondary hover:text-status-error border border-border-main/50 hover:border-status-error/30 rounded-xl transition-all"
                        title="Hủy kết bạn"
                      >
                        <UserMinus size={18} />
                      </button>
                    </div>
                  ) : friend.relationshipStatus === "WAITING" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => confirmAcceptRequest(friend)}
                        className="flex-1 py-2.5 bg-primary text-text-main font-bold text-sm rounded-xl hover:bg-orange-600 transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <Check size={18} />
                        Đồng ý
                      </button>
                      <button
                        onClick={() => confirmRejectRequest(friend)}
                        className="p-2.5 bg-background-main/50 border border-border-main/50 text-text-secondary rounded-xl hover:bg-status-error/10 hover:text-status-error transition-all"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : friend.relationshipStatus === "PENDING" ? (
                    <button
                      onClick={() => confirmCancelRequest(friend)}
                      className="w-full py-2.5 bg-surface-main border border-border-main/50 text-text-secondary font-bold text-sm rounded-xl hover:bg-background-main hover:text-status-error transition-all flex items-center justify-center gap-2"
                    >
                      <UserX size={18} />
                      Thu hồi
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSendFriendRequest(friend.id)}
                      className="w-full py-2.5 bg-background-main hover:bg-primary border border-primary/20 hover:border-primary text-primary hover:text-text-main font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-primary/20"
                    >
                      <UserPlus size={18} />
                      Kết bạn
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="text-center py-20 flex flex-col items-center justify-center">
              {/* Empty State Logic */}
              <div className="size-20 rounded-full bg-background-main border-2 border-border-main flex items-center justify-center mb-4">
                <UserSearch className="text-text-secondary/30" size={40} />
              </div>
              <h4 className="text-text-main font-bold text-lg mb-2">
                {searchTerm
                  ? "Không tìm thấy kết quả"
                  : isOwner
                  ? "Chưa có bạn bè"
                  : "Người dùng chưa có bạn bè"}
              </h4>
              <p className="text-text-secondary text-sm mb-4 max-w-xs">
                {searchTerm
                  ? `Không tìm thấy bạn bè nào khớp với "${searchTerm}"`
                  : isOwner
                  ? "Hãy bắt đầu kết nối với những người bạn mới!"
                  : "Người dùng này chưa kết bạn với ai."}
              </p>
              {isOwner && !searchTerm && (
                <button
                  onClick={() => navigate("/dashboard/friends")}
                  className="px-6 py-2.5 bg-primary hover:bg-orange-600 text-text-main font-bold rounded-xl transition-all"
                >
                  Tìm kiếm bạn bè
                </button>
              )}
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-6 py-2.5 bg-surface-main border border-border-main hover:bg-surface-hover text-text-main font-bold rounded-xl transition-all"
                >
                  Xóa tìm kiếm
                </button>
              )}
            </div>
          )
        )}

        {/* Loading Indicator for Infinite Scroll */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="text-primary animate-spin" size={32} />
              <p className="text-text-secondary text-xs">Đang tải thêm...</p>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() =>
          setConfirmModal({ isOpen: false, type: null, friend: null })
        }
        onConfirm={handleConfirmAction}
        title={
          confirmModal.type === "UNFRIEND"
            ? "Hủy kết bạn"
            : confirmModal.type === "CANCEL_REQUEST"
            ? "Thu hồi lời mời"
            : confirmModal.type === "ACCEPT_REQUEST"
            ? "Chấp nhận lời mời?"
            : "Từ chối lời mời?"
        }
        message={
          confirmModal.type === "UNFRIEND"
            ? `Bạn có chắc muốn hủy kết bạn với ${confirmModal.friend?.fullName}?`
            : confirmModal.type === "CANCEL_REQUEST"
            ? `Bạn có chắc muốn thu hồi lời mời kết bạn gửi đến ${confirmModal.friend?.fullName}?`
            : confirmModal.type === "ACCEPT_REQUEST"
            ? `Bạn muốn chấp nhận lời mời kết bạn từ ${confirmModal.friend?.fullName}?`
            : `Bạn có chắc muốn từ chối lời mời kết bạn từ ${confirmModal.friend?.fullName}?`
        }
        type={
          confirmModal.type === "ACCEPT_REQUEST"
            ? "info"
            : confirmModal.type === "REJECT_REQUEST"
            ? "warning"
            : "danger"
        }
        confirmText={
          confirmModal.type === "UNFRIEND"
            ? "Hủy kết bạn"
            : confirmModal.type === "CANCEL_REQUEST"
            ? "Thu hồi"
            : confirmModal.type === "ACCEPT_REQUEST"
            ? "Chấp nhận"
            : "Từ chối"
        }
        cancelText="Hủy"
      />
    </div>
  );
};

export default ProfileFriends;
