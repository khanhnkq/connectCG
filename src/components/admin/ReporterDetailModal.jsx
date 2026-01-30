import { Mail, Cake, Calendar } from "lucide-react";
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

  return (
    <div
      className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-surface-dark w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : user ? (
          <div>
            {/* Cover & Avatar */}
            <div className="relative h-24 bg-gradient-to-r from-primary/20 to-purple-500/20">
              <img
                src={
                  user.currentCoverUrl || "https://via.placeholder.com/400x150"
                }
                className="w-full h-full object-cover opacity-50"
                alt=""
              />
              <div className="absolute -bottom-8 left-6">
                <img
                  src={
                    user.currentAvatarUrl || "https://via.placeholder.com/100"
                  }
                  className="size-16 rounded-full border-4 border-surface-dark bg-surface-dark"
                  alt=""
                />
              </div>
            </div>

            <div className="pt-10 px-6 pb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {user.fullName}
                  </h3>
                  <p className="text-text-muted text-sm">
                    @{user.username || "unknown"}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    user.role === "ADMIN"
                      ? "bg-indigo-500/20 text-indigo-400"
                      : "bg-white/5 text-text-muted"
                  }`}
                >
                  {user.role || "USER"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 p-3 rounded-xl text-center">
                  <p className="text-xs text-text-muted uppercase font-bold">
                    Friends
                  </p>
                  <p className="text-lg font-black text-white">
                    {user.friendsCount || 0}
                  </p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl text-center">
                  <p className="text-xs text-text-muted uppercase font-bold">
                    Posts
                  </p>
                  <p className="text-lg font-black text-white">{0}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Mail className="text-text-muted" size={18} />
                  {user.email}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Cake className="text-text-muted" size={18} />
                  {user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Calendar className="text-text-muted" size={18} />
                  Joined:{" "}
                  {user.createdAt || user.created_at
                    ? new Date(
                        user.createdAt || user.created_at,
                      ).toLocaleDateString()
                    : "Unknown"}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold transition-all"
                >
                  Close
                </button>
                {/* <button onClick={onBan} className="flex-1 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-bold transition-all border border-red-500/20">
                                     Ban User
                                 </button> */}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-text-muted">User not found</div>
        )}
      </div>
    </div>
  );
};

export default ReporterDetailModal;
