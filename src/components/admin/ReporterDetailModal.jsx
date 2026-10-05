import React, { useState, useEffect } from "react";
import { User } from "@phosphor-icons/react";
import UserProfileService from "../../services/user/UserProfileService";
import { formatDate } from "../../utils/dateUtils";
import Modal from "../ui/modal/Modal";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import Skeleton from "../ui/feedback/Skeleton";

/**
 * Modern Flat Reporter Detail Modal
 */
const ReporterDetailModal = ({ userId, onClose }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await UserProfileService.getUserProfile(userId);
        setUser(res.data);
      } catch (error) {
        console.error("Failed to load reporter", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (!userId) return null;

  return (
    <Modal isOpen={Boolean(userId)} onClose={onClose} size="md">
      {loading ? (
        <div className="p-8 space-y-4 text-center">
          <Skeleton rounded="full" className="size-20 mx-auto" />
          <Skeleton className="h-5 w-40 mx-auto" />
          <Skeleton className="h-4 w-28 mx-auto" />
          <div className="space-y-2 pt-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ) : user ? (
        <div className="overflow-hidden">
          {/* Header / Cover */}
          <div className="relative h-28 w-full bg-surface-subtle border-b border-border-main">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url("${
                  user.currentCoverUrl ||
                  "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80"
                }")`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-main via-transparent to-black/20" />
          </div>

          {/* Profile Info - Centered */}
          <div className="px-6 pb-6 -mt-12 relative flex flex-col items-center">
            {/* Avatar */}
            <div className="size-24 rounded-2xl bg-surface-main p-1 border border-border-main overflow-hidden">
              <img
                src={
                  user.currentAvatarUrl ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                className="w-full h-full rounded-xl object-cover"
                alt=""
              />
            </div>

            {/* Name & Badge */}
            <div className="text-center mt-3">
              <h3 className="text-xl font-extrabold text-text-main tracking-tight flex items-center justify-center gap-2">
                {user.fullName}
                {user.role === "ADMIN" && (
                  <Badge variant="primary" size="sm">
                    Admin
                  </Badge>
                )}
              </h3>
              <p className="text-text-muted text-xs font-semibold">
                @{user.username || "unknown"}
              </p>
            </div>

            {/* Stats Pill */}
            <div className="mt-3 bg-surface-subtle rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-bold text-text-secondary border border-border-main">
              <User size={14} className="text-primary" />
              <span>{user.friendsCount || 0} bạn bè</span>
            </div>

            {/* Info Details Box */}
            <div className="w-full bg-surface-subtle/50 rounded-xl mt-6 px-5 py-4 border border-border-main">
              <div className="flex items-center gap-2 mb-4">
                <User size={16} className="text-primary" />
                <h4 className="text-text-main font-bold text-sm">
                  Thông tin chi tiết
                </h4>
              </div>

              <div className="space-y-3">
                <InfoRow
                  label="Giới tính"
                  value={
                    {
                      MALE: "Nam",
                      FEMALE: "Nữ",
                      OTHER: "Khác",
                    }[user.gender] || "Chưa cập nhật"
                  }
                />
                <InfoRow
                  label="Ngày sinh"
                  value={formatDate(user.dateOfBirth)}
                />
                <InfoRow
                  label="Mục đích"
                  value={
                    {
                      LOVE: "Tình yêu",
                      FRIENDS: "Bạn bè",
                      NETWORKING: "Kết nối",
                    }[user.lookingFor] || "Chưa cập nhật"
                  }
                />
                <InfoRow
                  label="Nghề nghiệp"
                  value={user.occupation || "Chưa cập nhật"}
                />
                <InfoRow
                  label="Tình trạng"
                  value={
                    {
                      SINGLE: "Độc thân",
                      MARRIED: "Đã kết hôn",
                      DIVORCED: "Ly hôn",
                    }[user.maritalStatus] || "Chưa cập nhật"
                  }
                />
                <InfoRow
                  label="Thành phố"
                  value={user.cityName || "Chưa cập nhật"}
                />
              </div>
            </div>

            <div className="w-full pt-6">
              <Button
                variant="secondary"
                size="md"
                onClick={onClose}
                className="w-full"
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-text-muted">
          Không tìm thấy thông tin người dùng
        </div>
      )}
    </Modal>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center text-xs border-b border-border-main/50 last:border-0 pb-2.5 last:pb-0">
    <span className="text-text-muted font-medium">{label}</span>
    <span className="text-text-main font-semibold">{value}</span>
  </div>
);

export default ReporterDetailModal;
