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
} from "lucide-react";
import FriendRequestService from "../../services/friend/FriendRequestService";
import ConfirmModal from "../common/ConfirmModal";
import toast from "react-hot-toast";
import { useFriends } from "../../hooks/useFriends";

const ProfileFriends = ({ profile, isOwner }) => {
  const navigate = useNavigate();
  const { friends, isLoading, handleUnfriend, updateFriendStatus } = useFriends(profile?.userId);

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
        toast.success("Đã hủy lời mời kết bạn");
      } catch {
        toast.error("Không thể hủy lời mời");
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
      <div className="p-6 border-b border-border-main bg-gradient-to-r from-surface-main to-background-main">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Users className="text-primary" size={24} />
            </div>
            <div>
              <h3 className="text-text-main font-bold text-xl">
                {isOwner ? "Danh sách bạn bè" : "Bạn bè"}
              </h3>
              <p className="text-text-secondary text-sm">
                {profile?.friendsCount || 0} người bạn
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="text-primary animate-spin" size={40} />
              <p className="text-text-secondary text-sm">Đang tải...</p>
            </div>
          </div>
        ) : friends.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="group relative bg-background-main hover:bg-surface-main rounded-2xl border border-border-main hover:border-primary/30 transition-all duration-300 overflow-hidden"
              >
                {/* Card Content */}
                <div className="p-4">
                  {/* Avatar & Info */}
                  <div
                    className="flex items-start gap-3 cursor-pointer"
                    onClick={() => navigate(`/dashboard/member/${friend.id}`)}
                  >
                    <div className="relative shrink-0">
                      <div
                        className="size-14 rounded-xl bg-cover bg-center ring-2 ring-border-main group-hover:ring-primary/50 transition-all"
                        style={{
                          backgroundImage: `url("${friend.avatarUrl ||
                            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }")`,
                        }}
                      ></div>
                      {friend.isOnline && (
                        <div className="absolute -bottom-1 -right-1 size-4 bg-green-500 rounded-full border-2 border-background-main"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-text-main font-bold text-base truncate group-hover:text-primary transition-colors">
                        {friend.fullName}
                      </h4>
                      {friend.occupation && (
                        <p className="text-text-secondary/70 text-xs mt-1 truncate">
                          {friend.occupation}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-2">
                    {friend.relationshipStatus === "SELF" ? (
                      <div className="w-full text-center py-2 bg-primary/10 text-primary text-sm font-bold rounded-lg">
                        Bạn
                      </div>
                    ) : friend.relationshipStatus === "FRIEND" ? (
                      <>
                        <button
                          onClick={() => navigate(`/dashboard/chat`)}
                          className="flex-1 py-2 px-3 bg-primary hover:bg-orange-600 text-text-main font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2"
                          title="Nhắn tin"
                        >
                          <MessageCircle size={16} />
                          <span className="hidden sm:inline">Nhắn tin</span>
                        </button>
                        <button
                          onClick={() => confirmUnfriend(friend)}
                          className="p-2 bg-surface-main hover:bg-red-500/20 text-text-secondary hover:text-red-500 rounded-lg transition-all"
                          title="Hủy kết bạn"
                        >
                          <UserMinus size={18} />
                        </button>
                      </>
                    ) : friend.relationshipStatus === "PENDING" ? (
                      <button
                        onClick={() => confirmCancelRequest(friend)}
                        className="w-full py-2 px-3 bg-surface-main hover:bg-red-500/20 text-text-secondary hover:text-red-500 font-medium text-sm rounded-lg transition-all flex items-center justify-center gap-2"
                        title="Hủy lời mời"
                      >
                        <UserX size={16} />
                        Hủy lời mời
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSendFriendRequest(friend.id)}
                        className="w-full py-2 px-3 bg-primary hover:bg-orange-600 text-text-main font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2"
                        title="Kết bạn"
                      >
                        <UserPlus size={16} />
                        Kết bạn
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center justify-center">
            <div className="size-20 rounded-full bg-background-main border-2 border-border-main flex items-center justify-center mb-4">
              <UserSearch className="text-text-secondary/30" size={40} />
            </div>
            <h4 className="text-text-main font-bold text-lg mb-2">
              {isOwner ? "Chưa có bạn bè" : "Người dùng chưa có bạn bè"}
            </h4>
            <p className="text-text-secondary text-sm mb-4 max-w-xs">
              {isOwner
                ? "Hãy bắt đầu kết nối với những người bạn mới!"
                : "Người dùng này chưa kết bạn với ai."}
            </p>
            {isOwner && (
              <button
                onClick={() => navigate("/dashboard/friends")}
                className="px-6 py-2.5 bg-primary hover:bg-orange-600 text-text-main font-bold rounded-xl transition-all"
              >
                Tìm kiếm bạn bè
              </button>
            )}
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
            : "Hủy lời mời kết bạn"
        }
        message={
          confirmModal.type === "UNFRIEND"
            ? `Bạn có chắc muốn hủy kết bạn với ${confirmModal.friend?.fullName}?`
            : "Bạn có chắc chắn muốn hủy lời mời kết bạn này?"
        }
        type="danger"
        confirmText={
          confirmModal.type === "UNFRIEND" ? "Hủy kết bạn" : "Hủy lời mời"
        }
        cancelText="Đóng"
      />
    </div>
  );
};

export default ProfileFriends;
