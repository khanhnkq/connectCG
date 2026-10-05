import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

import {
  fetchUserProfile,
  updateUserAvatar,
  updateUserCover,
  updatePostsCount,
} from "../../../redux/slices/userSlice";
import UserProfileService from "../../../services/user/UserProfileService";
import FriendService from "../../../services/friend/FriendService";
import FriendRequestService from "../../../services/friend/FriendRequestService";
import ChatService from "../../../services/chat/ChatService";
import PostService from "../../../services/PostService";
import { uploadAvatar, uploadCover } from "../../../utils/uploadImage";

/**
 * Unified Profile Hook (SRP)
 * Manages profile data, posts, social relationship status, and asset uploads
 * for both the authenticated user ("self") and other members ("member").
 *
 * @param {Object|string|number} param - Either userId or config object { userId, mode }
 * @param {string} [modeParam] - "self" | "member" | "auto"
 */
export function useProfile(param, modeParam = "auto") {
  const config =
    typeof param === "object" && param !== null && !Array.isArray(param)
      ? param
      : { userId: param, mode: modeParam };

  const { userId: propUserId, mode = "auto" } = config;
  const routeParams = useParams();
  const rawUserId = propUserId || routeParams.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user: authUser } = useSelector((state) => state.auth);
  const authUserId = authUser?.id || authUser?.userId || authUser?.sub;

  // Determine whether this is viewing the authenticated user's own profile
  const isOwner =
    mode === "self"
      ? true
      : mode === "member"
      ? Boolean(rawUserId && authUserId && String(rawUserId) === String(authUserId))
      : Boolean(!rawUserId || (authUserId && String(rawUserId) === String(authUserId)));

  const effectiveUserId = isOwner ? authUserId : rawUserId;

  // Redux user profile for authenticated user
  const { profile: reduxProfile, loading: reduxLoading } = useSelector(
    (state) => state.user || {}
  );

  // Local state for external member profile
  const [memberProfile, setMemberProfile] = useState(null);
  const [loadingMember, setLoadingMember] = useState(!isOwner);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState("timeline");

  // Upload states
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  // Modal dialog states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: null, // "UNFRIEND" | "CANCEL_REQUEST" | "ACCEPT_REQUEST" | "REJECT_REQUEST"
  });

  // Posts state & post delete modal
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    postId: null,
  });

  // Redirect to my-profile if member URL matches current logged-in user
  useEffect(() => {
    if (
      mode === "member" &&
      rawUserId &&
      authUserId &&
      String(rawUserId) === String(authUserId)
    ) {
      navigate("/dashboard/my-profile", { replace: true });
    }
  }, [mode, rawUserId, authUserId, navigate]);

  // Fetch Member Profile when viewing someone else
  const fetchMemberProfile = useCallback(async (targetId) => {
    if (!targetId) return;
    try {
      setLoadingMember(true);
      const response = await UserProfileService.getUserProfile(targetId);
      let profileData = response.data;

      // Check if we are the receiver of a pending friend request
      if (
        profileData &&
        profileData.relationshipStatus !== "FRIEND" &&
        profileData.relationshipStatus !== "SELF"
      ) {
        try {
          const requestsRes = await FriendRequestService.getPendingRequests(0, 100);
          const incomingReq = requestsRes.data?.content?.find(
            (req) => String(req.senderId) === String(profileData.userId)
          );

          if (incomingReq) {
            profileData = {
              ...profileData,
              relationshipStatus: "WAITING",
              isRequestReceiver: true,
              requestId: incomingReq.requestId,
              requestSent: false,
            };
          }
        } catch (err) {
          console.error("Error checking pending requests:", err);
        }
      }

      setMemberProfile(profileData);
    } catch (error) {
      console.error("Lỗi khi tải hồ sơ thành viên:", error);
      setMemberProfile(null);
    } finally {
      setLoadingMember(false);
    }
  }, []);

  // Fetch profile on change
  useEffect(() => {
    if (isOwner) {
      if (effectiveUserId) {
        dispatch(fetchUserProfile(effectiveUserId));
      }
    } else if (effectiveUserId) {
      fetchMemberProfile(effectiveUserId);
    }
  }, [isOwner, effectiveUserId, dispatch, fetchMemberProfile]);

  // Unified profile data
  const profile = isOwner ? reduxProfile : memberProfile;
  const loading = isOwner ? reduxLoading && !reduxProfile : loadingMember;

  // Normalized avatar URL
  const userAvatar =
    profile?.currentAvatarUrl ||
    profile?.avatar ||
    profile?.avatarUrl ||
    "";

  // Fetch posts for user
  const fetchPosts = useCallback(async (userId) => {
    if (!userId) return;
    setLoadingPosts(true);
    try {
      const response = await PostService.getPostsByUserId(userId);
      const sorted = (response.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPosts(sorted);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  useEffect(() => {
    if (effectiveUserId) {
      fetchPosts(effectiveUserId);
    }
  }, [effectiveUserId, fetchPosts]);

  // Handlers for posts
  const handlePostCreated = useCallback(
    (newPost) => {
      if (newPost?.status === "APPROVED") {
        setPosts((prev) => [newPost, ...prev]);
        if (isOwner && profile) {
          dispatch(updatePostsCount((profile.postsCount || 0) + 1));
        }
      }
    },
    [isOwner, profile, dispatch]
  );

  const handleDeletePost = useCallback((postId) => {
    setDeleteModal({ isOpen: true, postId });
  }, []);

  const confirmDelete = useCallback(async () => {
    const { postId } = deleteModal;
    if (!postId) return;

    try {
      await PostService.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      toast.success("Xóa bài viết thành công");
      if (isOwner && profile && profile.postsCount > 0) {
        dispatch(updatePostsCount(profile.postsCount - 1));
      }
    } catch (error) {
      console.error("Xóa bài viết thất bại:", error);
      toast.error("Xóa bài viết thất bại");
    } finally {
      setDeleteModal({ isOpen: false, postId: null });
    }
  }, [deleteModal, isOwner, profile, dispatch]);

  const handleUpdatePost = useCallback(async (postId, updatedData) => {
    try {
      const response = await PostService.updatePost(postId, updatedData);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, ...response.data } : p))
      );
      toast.success("Cập nhật bài viết thành công");
    } catch (error) {
      console.error("Cập nhật bài viết thất bại:", error);
      toast.error("Cập nhật bài viết thất bại");
    }
  }, []);

  // Avatar and Cover Uploads (Owner)
  const handleAvatarChange = useCallback(
    async (file) => {
      if (!file) return;
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Kích thước ảnh đại diện không được vượt quá 2MB");
        return;
      }

      try {
        setIsUploadingAvatar(true);
        const url = await uploadAvatar(file);
        await dispatch(updateUserAvatar(url)).unwrap();
        toast.success("Cập nhật ảnh đại diện thành công!");
      } catch (error) {
        toast.error(typeof error === "string" ? error : "Lỗi khi cập nhật ảnh đại diện");
        console.error(error);
      } finally {
        setIsUploadingAvatar(false);
      }
    },
    [dispatch]
  );

  const handleCoverChange = useCallback(
    async (file) => {
      if (!file) return;
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Kích thước ảnh bìa không được vượt quá 2MB");
        return;
      }

      try {
        setIsUploadingCover(true);
        const url = await uploadCover(file);
        await dispatch(updateUserCover(url)).unwrap();
        toast.success("Cập nhật ảnh bìa thành công!");
      } catch (error) {
        toast.error(typeof error === "string" ? error : "Lỗi khi cập nhật ảnh bìa");
        console.error(error);
      } finally {
        setIsUploadingCover(false);
      }
    },
    [dispatch]
  );

  // Social / Relationship actions (Member)
  const sendFriendRequest = useCallback(async () => {
    if (!profile?.userId) return;
    try {
      await FriendRequestService.sendRequest(profile.userId);
      setMemberProfile((prev) => ({
        ...prev,
        relationshipStatus: "PENDING",
        requestSent: true,
        isRequestReceiver: false,
      }));
      toast.success("Đã gửi lời mời kết bạn!");
    } catch (error) {
      console.error("Lỗi khi gửi lời mời kết bạn:", error);
      toast.error(error.response?.data?.message || "Không thể gửi lời mời kết bạn.");
    }
  }, [profile?.userId]);

  const unfriend = useCallback(async () => {
    if (!profile?.userId) return;
    try {
      await FriendService.unfriend(profile.userId);
      setMemberProfile((prev) => ({
        ...prev,
        relationshipStatus: "NONE",
        friendsCount: Math.max(0, (prev?.friendsCount || 1) - 1),
      }));
      toast.success(`Đã hủy kết bạn với ${profile.fullName || "người dùng"}`);
    } catch (error) {
      console.error("Lỗi khi hủy kết bạn:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  }, [profile?.userId, profile?.fullName]);

  const cancelFriendRequest = useCallback(async () => {
    if (!profile?.userId) return;
    const toastId = toast.loading("Đang hủy lời mời...");
    try {
      await FriendRequestService.cancelRequest(profile.userId);
      setMemberProfile((prev) => ({
        ...prev,
        relationshipStatus: "STRANGER",
      }));
      toast.success("Đã hủy lời mời kết bạn", { id: toastId });
    } catch {
      toast.error("Không thể hủy lời mời", { id: toastId });
    }
  }, [profile?.userId]);

  const acceptFriendRequest = useCallback(async () => {
    if (!profile?.userId) return;
    try {
      let reqId = profile.requestId;
      if (!reqId) {
        const requestsRes = await FriendRequestService.getPendingRequests(0, 100);
        const incomingReq = requestsRes.data?.content?.find(
          (req) => String(req.senderId) === String(profile.userId)
        );
        reqId = incomingReq?.requestId;
      }
      if (!reqId) {
        toast.error("Không tìm thấy thông tin lời mời.");
        return;
      }
      await FriendRequestService.acceptRequest(reqId);
      setMemberProfile((prev) => ({
        ...prev,
        relationshipStatus: "FRIEND",
        friendsCount: (prev?.friendsCount || 0) + 1,
        isRequestReceiver: false,
        requestId: null,
      }));
      toast.success("Đã chấp nhận lời mời kết bạn!");
    } catch (error) {
      console.error("Lỗi khi chấp nhận kết bạn:", error);
      toast.error("Không thể chấp nhận lời mời.");
    }
  }, [profile?.userId, profile?.requestId]);

  const rejectFriendRequest = useCallback(async () => {
    if (!profile?.userId) return;
    try {
      let reqId = profile.requestId;
      if (!reqId) {
        const requestsRes = await FriendRequestService.getPendingRequests(0, 100);
        const incomingReq = requestsRes.data?.content?.find(
          (req) => String(req.senderId) === String(profile.userId)
        );
        reqId = incomingReq?.requestId;
      }
      if (!reqId) {
        toast.error("Không tìm thấy thông tin lời mời.");
        return;
      }
      await FriendRequestService.rejectRequest(reqId);
      setMemberProfile((prev) => ({
        ...prev,
        relationshipStatus: "STRANGER",
        isRequestReceiver: false,
        requestId: null,
      }));
      toast.success("Đã từ chối lời mời.");
    } catch (error) {
      console.error("Lỗi khi từ chối kết bạn:", error);
      toast.error("Không thể từ chối lời mời.");
    }
  }, [profile?.userId, profile?.requestId]);

  const startChat = useCallback(async () => {
    if (!profile?.userId) return;
    const tid = toast.loading("Đang mở cuộc trò chuyện...");
    try {
      const response = await ChatService.getOrCreateDirectChat(profile.userId);
      const room = response.data;
      toast.success("Đã kết nối!", { id: tid });
      navigate("/dashboard/chat", {
        state: { selectedRoomKey: room.firebaseRoomKey },
      });
    } catch (error) {
      console.error("Error starting chat:", error);
      toast.error("Không thể tạo cuộc trò chuyện", { id: tid });
    }
  }, [profile?.userId, navigate]);

  // Execute confirm action based on confirmDialog.type
  const handleConfirmAction = useCallback(async () => {
    const type = confirmDialog.type;
    setConfirmDialog({ isOpen: false, type: null });

    if (type === "UNFRIEND") {
      await unfriend();
    } else if (type === "CANCEL_REQUEST") {
      await cancelFriendRequest();
    } else if (type === "ACCEPT_REQUEST") {
      await acceptFriendRequest();
    } else if (type === "REJECT_REQUEST") {
      await rejectFriendRequest();
    }
  }, [
    confirmDialog.type,
    unfriend,
    cancelFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
  ]);

  return {
    profile,
    loading,
    isOwner,
    effectiveUserId,
    authUser,
    userAvatar,
    activeTab,
    setActiveTab,
    posts,
    loadingPosts,
    fetchPosts,
    handlePostCreated,
    handleDeletePost,
    confirmDelete,
    handleUpdatePost,
    deleteModal,
    setDeleteModal,
    isUploadingAvatar,
    isUploadingCover,
    handleAvatarChange,
    handleCoverChange,
    sendFriendRequest,
    unfriend,
    cancelFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    startChat,
    isEditModalOpen,
    setIsEditModalOpen,
    showReportModal,
    setShowReportModal,
    confirmDialog,
    setConfirmDialog,
    handleConfirmAction,
  };
}

export default useProfile;
