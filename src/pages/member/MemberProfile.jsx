import {
  UserX,
  UserMinus,
  MailCheck,
  UserPlus,
  Mail,
  AlertTriangle,
  Briefcase,
  Heart,
  MapPin,
  Lock,
  ChevronLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import FriendService from "../../services/friend/FriendService";
import FriendRequestService from "../../services/friend/FriendRequestService";
import UserProfileService from "../../services/user/UserProfileService";
import ChatService from "../../services/chat/ChatService";
import ProfileAbout from "../../components/profile/ProfileAbout";
import ProfilePhotos from "../../components/profile/ProfilePhotos";
import ProfileHobbies from "../../components/profile/ProfileHobbies";
import ProfileFriends from "../../components/profile/ProfileFriends";
import ReportModal from "../../components/report/ReportModal";
import ConfirmModal from "../../components/common/ConfirmModal";
import reportService from "../../services/ReportService";
import PostService from "../../services/PostService";
import PostCard from "../../components/feed/PostCard";
import toast from "react-hot-toast";

export default function MemberProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("timeline"); // timeline, about, photos, hobbies, friends
  const [showReportModal, setShowReportModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null,
  }); // type: 'UNFRIEND' | 'CANCEL_REQUEST'

  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      if (activeTab === "timeline" && id) {
        setLoadingPosts(true);
        try {
          const response = await PostService.getPostsByUserId(id);
          // Assuming response.data is the array of posts
          const sortedPosts = (response.data || []).sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setPosts(sortedPosts);
        } catch (error) {
          console.error("Error fetching user posts:", error);
        } finally {
          setLoadingPosts(false);
        }
      }
      
    };

    fetchPosts();
  }, [id,activeTab]);


  const handleStartChat = async () => {
    const tid = toast.loading("Đang mở cuộc trò chuyện...");
    try {
      const response = await ChatService.getOrCreateDirectChat(profile.id);
      const room = response.data;
      toast.success("Đã kết nối!", { id: tid });
      navigate("/chat", { state: { selectedRoomKey: room.firebaseRoomKey } });
    } catch (error) {
      console.error("Error starting chat:", error);
      toast.error("Không thể tạo cuộc trò chuyện", { id: tid });
    }
  };

  useEffect(() => {
    const fetchMemberProfile = async () => {
      try {
        setLoading(true);
        const response = await UserProfileService.getUserProfile(id);
        let profileData = response.data;

        // FIX: Check if we are the receiver of a pending request
        // The API might not return isRequestReceiver, so we check our pending list
        if (profileData.relationshipStatus !== "FRIEND") {
          try {
            // Fetch first page of pending requests to see if this user sent one
            const requestsRes = await FriendRequestService.getPendingRequests(
              0,
              100,
            );
            const incomingReq = requestsRes.data.content.find(
              (req) => req.senderId == profileData.userId,
            );

            if (incomingReq) {
              profileData = {
                ...profileData,
                relationshipStatus: "PENDING",
                isRequestReceiver: true,
                requestId: incomingReq.requestId,
                requestSent: false, // We didn't send it, we received it
              };
            }
          } catch (err) {
            console.error("Error checking pending requests", err);
          }
        }

        setProfile(profileData);
      } catch (error) {
        console.error("Lỗi khi tải hồ sơ thành viên:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMemberProfile();
    }
  }, [id]);
  const confirmUnfriend = () => {
    setConfirmModal({ isOpen: true, type: "UNFRIEND" });
  };

  const confirmCancelRequest = () => {
    setConfirmModal({ isOpen: true, type: "CANCEL_REQUEST" });
  };

  const handleConfirmAction = async () => {
    const type = confirmModal.type;
    setConfirmModal({ isOpen: false, type: null });

    if (type === "UNFRIEND") {
      try {
        await FriendService.unfriend(profile.userId);
        setProfile((prev) => ({
          ...prev,
          relationshipStatus: "NONE",
          friendsCount: prev.friendsCount - 1,
        }));
        toast.success(`Đã hủy kết bạn với ${profile.fullName}`);
      } catch (error) {
        console.error("Lỗi khi hủy kết bạn:", error);
        toast.error("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } else if (type === "CANCEL_REQUEST") {
      const toastId = toast.loading("Đang hủy lời mời...");
      try {
        await FriendRequestService.cancelRequest(profile.userId);
        setProfile((prev) => ({
          ...prev,
          relationshipStatus: "STRANGER",
        }));
        toast.success("Đã hủy lời mời kết bạn", { id: toastId });
      } catch {
        toast.error("Không thể hủy lời mời", { id: toastId });
      }
    }
  };

  const handleSendFriendRequest = async () => {
    try {
      await FriendRequestService.sendRequest(profile.userId);
      setProfile((prev) => ({
        ...prev,
        relationshipStatus: "PENDING", // Update local state immediately
        requestSent: true,
        isRequestReceiver: false,
      }));
      toast.success("Đã gửi lời mời kết bạn!");
    } catch (error) {
      console.error("Lỗi khi gửi lời mời:", error);
      toast.error(error.response?.data?.message || "Không thể gửi lời mời.");
    }
  };

  const handleAcceptRequest = async () => {
    try {
      // Need requestId from profile. In AdvancedSearch it was member.requestId
      // If profile doesn't have requestId, this might be tricky.
      // Usually UserProfile DTO should have requestId if relationshipStatus is PENDING.
      // Assuming profile.requestId exists.
      if (!profile.requestId) {
        toast.error("Không tìm thấy thông tin lời mời.");
        return;
      }
      await FriendRequestService.acceptRequest(profile.requestId);
      setProfile((prev) => ({
        ...prev,
        relationshipStatus: "FRIEND",
        friendsCount: (prev.friendsCount || 0) + 1,
        isRequestReceiver: false,
        requestId: null,
      }));
      toast.success("Đã chấp nhận lời mời kết bạn!");
    } catch (error) {
      console.error("Lỗi khi chấp nhận:", error);
      toast.error("Không thể chấp nhận lời mời.");
    }
  };

  const handleRejectRequest = async () => {
    try {
      if (!profile.requestId) {
        toast.error("Không tìm thấy thông tin lời mời.");
        return;
      }
      await FriendRequestService.rejectRequest(profile.requestId);
      setProfile((prev) => ({
        ...prev,
        relationshipStatus: "STRANGER", // or NONE
        isRequestReceiver: false,
        requestId: null,
      }));
      toast.success("Đã từ chối lời mời.");
    } catch (error) {
      console.error("Lỗi khi từ chối:", error);
      toast.error("Không thể từ chối lời mời.");
    }
  };

  if (loading) {
    return (
      <div className="bg-background-main min-h-screen flex items-center justify-center text-text-main">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-secondary font-bold">
            Đang tải hồ sơ thành viên...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-background-main min-h-screen flex items-center justify-center text-text-main p-6 text-center">
        <div>
          <UserX className="size-16 text-red-500 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy thành viên</h2>
          <p className="text-text-secondary mb-6">
            Thông tin người dùng này không khả dụng.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-primary text-[#231810] px-6 py-2 rounded-xl font-bold flex items-center justify-center gap-2 mx-auto"
          >
            <ChevronLeft size={20} />
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto pb-20">
      {/* Header/Cover */}
      <div className="bg-surface-main border-b border-border-main">
        <div className="w-full max-w-6xl mx-auto">
          <div className="relative w-full h-64 md:h-80 lg:h-96 group overflow-hidden rounded-b-3xl">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `url("${profile?.currentCoverUrl ||
                  "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80"
                  }")`,
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          </div>
          <div className="px-4 md:px-8 pb-4 relative">
            <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 md:-mt-12 gap-6 relative z-10 mb-6">
              <div className="relative shrink-0">
                <div className="size-32 md:size-44 rounded-full border-4 border-surface-main bg-background-main p-1 shadow-2xl">
                  <div
                    className="w-full h-full rounded-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url("${profile?.currentAvatarUrl ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }")`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="flex-1 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div className="mb-2 md:mb-4">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-text-main tracking-tight mb-1">
                    {profile?.fullName || profile?.username}
                  </h1>
                  <p className="text-text-secondary font-medium text-sm flex items-center gap-2">
                    <span className="text-text-secondary/80">
                      {profile?.city?.name || "Vị trí ẩn"}
                    </span>
                  </p>
                  <div className="flex gap-4 mt-3 text-sm text-text-secondary">
                    <span>
                      <strong className="text-text-main">
                        {profile?.friendsCount || 0}
                      </strong>{" "}
                      Bạn bè
                    </span>
                    <span>
                      <strong className="text-text-main">
                        {profile?.postsCount || 0}
                      </strong>{" "}
                      Bài viết
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 mb-4 w-full md:w-auto">
                  {profile.relationshipStatus === "FRIEND" ? (
                    <button
                      onClick={confirmUnfriend}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-surface-main text-primary border border-primary/30 font-bold px-6 py-3 rounded-xl transition-all hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50"
                      title="Click để hủy kết bạn"
                    >
                      <UserMinus size={20} />
                      Đã là bạn bè
                    </button>
                  ) : profile.relationshipStatus === "PENDING" &&
                    profile.isRequestReceiver ? (
                    <div className="flex gap-3 w-full md:w-auto flex-1 md:flex-none">
                      <button
                        onClick={handleAcceptRequest}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary hover:bg-orange-600 text-[#231810] font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20"
                      >
                        <MailCheck size={20} />
                        Chấp nhận
                      </button>
                      <button
                        onClick={handleRejectRequest}
                        className="flex-1 flex items-center justify-center gap-2 bg-surface-main hover:bg-red-500/20 text-text-main hover:text-red-500 font-bold px-6 py-3 rounded-xl transition-all border border-border-main hover:border-red-500/50"
                      >
                        <UserX size={20} />
                        Từ chối
                      </button>
                    </div>
                  ) : profile.relationshipStatus === "PENDING" ? (
                    <button
                      onClick={confirmCancelRequest}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-surface-main text-text-secondary border border-primary/30 font-bold px-6 py-3 rounded-xl transition-all hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50"
                    >
                      <MailCheck size={20} />
                      Đã gửi lời mời
                    </button>
                  ) : (
                    <button
                      onClick={handleSendFriendRequest}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary hover:bg-orange-600 text-[#231810] font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20"
                    >
                      <UserPlus size={20} />
                      Kết bạn
                    </button>
                  )}
                  <button
                    onClick={handleStartChat}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-surface-main hover:bg-primary/20 text-text-main hover:text-primary font-bold px-4 py-3 rounded-xl transition-all border border-border-main"
                  >
                    <Mail size={20} />
                    Nhắn tin
                  </button>
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="flex items-center justify-center gap-2 bg-surface-main hover:bg-red-500/10 text-text-secondary hover:text-red-500 font-bold px-4 py-3 rounded-xl transition-all border border-border-main"
                    title="Báo cáo người dùng"
                  >
                    <AlertTriangle size={20} />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1 border-t border-border-main pt-2 scrollbar-hide">
              <button
                onClick={() => setActiveTab("timeline")}
                className={`px-6 py-3 font-bold transition-all whitespace-nowrap ${activeTab === "timeline"
                    ? "text-primary border-b-2 border-primary"
                    : "text-text-secondary hover:text-text-main hover:bg-surface-main/50 rounded-t-lg"
                  }`}
              >
                Dòng thời gian
              </button>
              <button
                onClick={() => setActiveTab("about")}
                className={`px-6 py-3 font-bold transition-all whitespace-nowrap ${activeTab === "about"
                    ? "text-primary border-b-2 border-primary"
                    : "text-text-secondary hover:text-text-main hover:bg-surface-main/50 rounded-t-lg"
                  }`}
              >
                Giới thiệu
              </button>
              <button
                onClick={() => setActiveTab("photos")}
                className={`px-6 py-3 font-bold transition-all whitespace-nowrap ${activeTab === "photos"
                    ? "text-primary border-b-2 border-primary"
                    : "text-text-secondary hover:text-text-main hover:bg-surface-main/50 rounded-t-lg"
                  }`}
              >
                Ảnh
              </button>
              <button
                onClick={() => setActiveTab("hobbies")}
                className={`px-6 py-3 font-bold transition-all whitespace-nowrap ${activeTab === "hobbies"
                    ? "text-primary border-b-2 border-primary"
                    : "text-text-secondary hover:text-text-main hover:bg-surface-main/50 rounded-t-lg"
                  }`}
              >
                Sở thích
              </button>
              <button
                onClick={() => setActiveTab("friends")}
                className={`px-6 py-3 font-bold transition-all whitespace-nowrap ${activeTab === "friends"
                    ? "text-primary border-b-2 border-primary"
                    : "text-text-secondary hover:text-text-main hover:bg-surface-main/50 rounded-t-lg"
                  }`}
              >
                Bạn bè ({profile?.friendsCount || 0})
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 md:px-8 mt-8">
        <div
          className={`grid grid-cols-1 ${activeTab === "timeline" ? "lg:grid-cols-12" : "lg:grid-cols-1"
            } gap-6`}
        >
          {/* Left Column - Only show on timeline */}
          {activeTab === "timeline" && (
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
              <div className="bg-surface-main rounded-2xl border border-border-main p-5 shadow-sm">
                <h3 className="text-text-main font-bold text-lg mb-4">
                  Giới thiệu
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-4">
                  {profile?.bio || "Người dùng này chưa cập nhật tiểu sử."}
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-text-secondary text-sm">
                    <Briefcase size={20} />
                    <span>
                      Nghề nghiệp:{" "}
                      <strong className="text-text-main">
                        {profile?.occupation || "Chưa cập nhật"}
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-text-secondary text-sm">
                    <Heart size={20} />
                    <span>
                      Tình trạng:{" "}
                      <strong className="text-text-main">
                        {profile?.maritalStatus || "Chưa cập nhật"}
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-text-secondary text-sm">
                    <MapPin size={20} />
                    <span>
                      Đến từ:{" "}
                      <strong className="text-text-main">
                        {profile?.city?.name || "Chưa cập nhật"}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Hobbies Section */}
              {profile?.hobbies?.length > 0 && (
                <div className="bg-surface-main rounded-2xl border border-border-main p-5 shadow-sm">
                  <h3 className="text-text-main font-bold text-lg mb-4">
                    Sở thích
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.hobbies.map((hobby, index) => (
                      <span
                        key={index}
                        className="bg-background-main text-primary text-xs font-bold px-3 py-1.5 rounded-full border border-primary/20"
                      >
                        {hobby.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Right Column */}
          <div
            className={`${activeTab === "timeline"
                ? "lg:col-span-7 xl:col-span-8"
                : "lg:col-span-1"
              } flex flex-col gap-6`}
          >
            {activeTab === "timeline" && (
              <div className="flex flex-col gap-6">
                {loadingPosts ? (
                  <div className="flex justify-center p-8">
                    <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : posts.length > 0 ? (
                  posts.map((post) => <PostCard key={post.id} post={post} />)
                ) : (
                  <div className="flex flex-col gap-6 text-center py-20 bg-surface-main rounded-2xl border border-border-main">
                    <UserX className="size-12 text-text-secondary/30 mb-4 mx-auto" />
                    <p className="text-text-secondary italic">
                      Người dùng này chưa có bài viết nào.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "about" && (
              <ProfileAbout profile={profile} isOwner={false} />
            )}

            {activeTab === "photos" && (
              <ProfilePhotos profile={profile} isOwner={false} />
            )}

            {activeTab === "hobbies" && (
              <ProfileHobbies profile={profile} isOwner={false} />
            )}

            {activeTab === "friends" && (
              <ProfileFriends profile={profile} isOwner={false} />
            )}
          </div>
        </div>
      </div>
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={async (payload) => {
          const toastId = toast.loading("Đang gửi báo cáo...", {
            style: { background: "#1A120B", color: "#FFD8B0" },
          });
          try {
            await reportService.createReport(payload);
            toast.success("Đã gửi báo cáo thành công!", {
              id: toastId,
              style: {
                background: "#1A120B",
                color: "#FF8A2A",
                border: "1px solid #FF8A2A",
              },
            });
            setShowReportModal(false);
          } catch (error) {
            console.error(error);
            toast.error("Gửi báo cáo thất bại!", {
              id: toastId,
              style: { background: "#1A120B", color: "#FF6A00" },
            });
          }
        }}
        title="Báo cáo người dùng"
        subtitle={`Báo cáo ${profile?.fullName || "người dùng"}`}
        question="Tại sao bạn muốn báo cáo người dùng này?"
        reasons={[
          "Giả mạo người khác",
          "Tên giả hoặc không phù hợp",
          "Đăng nội dung quấy rối/bắt nạt",
          "Spam hoặc lừa đảo",
          "Ngôn từ thù ghét",
          "Khác",
        ]}
        targetPayload={{
          targetType: "USER",
          targetId: parseInt(id),
        }}
        user={{
          avatar: profile?.currentAvatarUrl,
          name: profile?.fullName,
        }}
      />
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null })}
        onConfirm={handleConfirmAction}
        title={
          confirmModal.type === "UNFRIEND"
            ? "Hủy kết bạn"
            : "Hủy lời mời kết bạn"
        }
        message={
          confirmModal.type === "UNFRIEND"
            ? `Bạn có chắc muốn hủy kết bạn với ${profile?.fullName}?`
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
}
