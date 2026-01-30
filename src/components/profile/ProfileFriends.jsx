import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Eye,
  UserMinus,
  UserX,
  UserPlus,
  UserSearch,
  Loader2,
} from "lucide-react";
import FriendService from "../../services/friend/FriendService";
import FriendRequestService from "../../services/friend/FriendRequestService";
import ConfirmModal from "../admin/ConfirmModal";
import toast from "react-hot-toast";

const ProfileFriends = ({ profile, isOwner }) => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
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
      try {
        await FriendService.unfriend(friend.id);
        setFriends((prev) =>
          prev.map((f) =>
            f.id === friend.id ? { ...f, relationshipStatus: "stranger" } : f,
          ),
        );
        toast.success(`Đã hủy kết bạn với ${friend.fullName}`);
      } catch {
        toast.error("Lỗi khi hủy kết bạn");
      }
    } else if (type === "CANCEL_REQUEST") {
      try {
        await FriendRequestService.cancelRequest(friend.id);
        setFriends((prev) =>
          prev.map((f) =>
            f.id === friend.id ? { ...f, relationshipStatus: "stranger" } : f,
          ),
        );
        toast.success("Đã hủy lời mời kết bạn");
      } catch {
        toast.error("Không thể hủy lời mời");
      }
    }
  };

  const handleSendFriendRequest = async (friendId) => {
    try {
      await FriendRequestService.sendRequest(friendId);
      setFriends((prev) =>
        prev.map((f) =>
          f.id === friendId ? { ...f, relationshipStatus: "PENDING" } : f,
        ),
      );
      toast.success("Đã gửi lời mời kết bạn!");
    } catch {
      toast.error("Không thể gửi lời mời.");
    }
  };

  useEffect(() => {
    if (profile?.userId) {
      const loadFriends = async () => {
        try {
          setLoading(true);
          const response = await FriendService.getFriends(profile.userId, {
            size: 50,
          });
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
    <div className="bg-surface-main rounded-2xl border border-border-main p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-text-main font-bold text-xl flex items-center gap-2">
          <Users className="text-primary" size={20} />
          {isOwner ? "Danh sách bạn bè" : "Bạn bè"}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-text-secondary text-sm">
            {profile?.friendsCount || 0} người bạn
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="text-primary animate-spin" size={32} />
        </div>
      ) : friends.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="bg-background-main hover:bg-surface-main p-3 rounded-2xl border border-white/5 flex items-center gap-4 transition-all group"
            >
              <div className="relative">
                <div
                  className="size-16 rounded-xl bg-cover bg-center shadow-inner"
                  style={{
                    backgroundImage: `url("${
                      friend.avatarUrl ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }")`,
                  }}
                ></div>
                <div className="absolute -bottom-1 -right-1 size-4 bg-green-500 border-2 border-[#493222] rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-text-main font-bold text-lg truncate group-hover:text-primary transition-colors">
                  {friend.fullName}
                </h4>
                <p className="text-text-secondary text-xs truncate">
                  @{friend.username}
                </p>
                <p className="text-text-secondary/60 text-[10px] mt-1 italic">
                  {friend.occupation || "Chưa cập nhật nghề nghiệp"}
                </p>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <button
                  onClick={() => navigate(`/dashboard/member/${friend.id}`)}
                  className={`bg-primary/10 hover:bg-primary text-primary hover:text-text-main p-2 rounded-lg transition-all flex items-center justify-center ${
                    friend.relationshipStatus === "SELF" ? "hidden" : ""
                  }`}
                  title="Xem hồ sơ"
                >
                  <Eye size={18} />
                </button>
                {friend.relationshipStatus === "SELF" && (
                  <span className="text-primary font-bold text-sm bg-primary/10 px-3 py-2 rounded-lg pointer-events-none select-none">
                    Bạn
                  </span>
                )}
                {friend.relationshipStatus === "FRIEND" ? (
                  <button
                    onClick={() => confirmUnfriend(friend)}
                    className="bg-surface-main hover:bg-red-500/20 text-text-secondary hover:text-red-500 p-2 rounded-lg transition-all flex items-center justify-center"
                    title="Hủy kết bạn"
                  >
                    <UserMinus size={18} />
                  </button>
                ) : friend.relationshipStatus === "PENDING" ? (
                  <button
                    onClick={() => confirmCancelRequest(friend)}
                    className="bg-surface-main hover:bg-red-500/20 text-text-secondary hover:text-red-500 p-2 rounded-lg transition-all flex items-center justify-center"
                    title="Hủy lời mời"
                  >
                    <UserX size={18} />
                  </button>
                ) : friend.relationshipStatus === "SELF" ? null : (
                  <button
                    onClick={() => handleSendFriendRequest(friend.id)}
                    className="bg-surface-main hover:bg-primary text-text-secondary hover:text-text-main p-2 rounded-lg transition-all flex items-center justify-center"
                    title="Kết bạn"
                  >
                    <UserPlus size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 flex flex-col items-center justify-center">
          <UserSearch className="text-text-secondary/20 mb-3" size={48} />
          <p className="text-text-secondary italic">
            {isOwner
              ? "Bạn chưa chọn người bạn nào."
              : "Người dùng này chưa có bạn bè."}
          </p>
          {isOwner && (
            <button
              onClick={() => navigate("/dashboard/explore")}
              className="text-primary font-bold mt-2 hover:underline"
            >
              Tìm kiếm bạn bè ngay
            </button>
          )}
        </div>
      )}

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
