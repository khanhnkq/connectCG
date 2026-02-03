import { User } from "lucide-react";
import React, { useState, useEffect } from "react";
import UserProfileService from "../../services/user/UserProfileService";

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
    <div
      className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-surface w-full max-w-[550px] rounded-[32px] border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : user ? (
          <div>
            {/* Header / Cover */}
            <div className="relative h-28 w-full">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url("${
                    user.currentCoverUrl ||
                    "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80"
                  }")`,
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/40"></div>
            </div>

            {/* Profile Info - Centered */}
            <div className="px-6 pb-8 -mt-[4.5rem] relative flex flex-col items-center">
              {/* Avatar */}
              <div className="size-[6.5rem] rounded-[24px] bg-surface p-1.5 shadow-2xl skew-y-0 rotate-0">
                <img
                  src={
                    user.currentAvatarUrl ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  className="w-full h-full rounded-[20px] object-cover"
                  alt=""
                />
              </div>

              {/* Name & Badge */}
              <div className="text-center mt-3">
                <h3 className="text-2xl font-[900] text-text-main tracking-tight flex items-center justify-center gap-2">
                  {user.fullName}
                  {user.role === "ADMIN" && (
                    <span className="bg-primary/20 text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-primary/20">
                      Admin
                    </span>
                  )}
                </h3>
                <p className="text-text-muted text-sm font-semibold">
                  @{user.username || "unknown"}
                </p>
              </div>

              {/* Stats Pill */}
              <div className="mt-4 bg-background rounded-full px-5 py-2 flex items-center gap-2 text-sm font-bold text-text-secondary shadow-inner border border-border">
                <User size={16} className="text-primary" />
                <span>{user.friendsCount || 0} bạn bè</span>
              </div>

              {/* Info Details Box */}
              <div className="w-full bg-background/50 rounded-xl mt-8 px-6 py-5 border border-border/50">
                <div className="flex items-center gap-2 mb-5">
                  <User size={16} className="text-primary" />
                  <h4 className="text-text-main/90 font-bold text-[15px]">
                    Thông tin chi tiết
                  </h4>
                </div>

                <div className="space-y-4">
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
                    value={user.dateOfBirth || "Chưa cập nhật"}
                  />
                  <InfoRow
                    label="Tìm kiếm"
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

              <button
                onClick={onClose}
                className="mt-8 text-text-muted hover:text-text-main text-sm font-extrabold uppercase tracking-wider transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-text-muted">User not found</div>
        )}
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center text-[13px] border-b border-border/30 last:border-0 pb-3 last:pb-0">
    <span className="text-text-muted font-medium">{label}</span>
    <span className="text-text-main font-bold">{value}</span>
  </div>
);

export default ReporterDetailModal;
