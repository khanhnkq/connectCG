import { useState, useEffect, useCallback } from "react";
import postService from "../../../services/PostService";
import reportService from "../../../services/ReportService";
import toast from "react-hot-toast";

/**
 * Custom Hook for Post-level Actions & Real-time State
 * Handles reactions (optimistic update), realtime websocket sync,
 * pinning, updating, reporting, sharing, comments toggle, and media lightbox.
 */
export function usePostActions({
  postData,
  onUpdate,
  onDelete,
  canPin = false,
  stompClient = null,
  isConnected = false,
  defaultShowComments = false,
}) {
  const [showComments, setShowComments] = useState(defaultShowComments);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [videoPaused, setVideoPaused] = useState(false);

  // Optimistic reaction states
  const [localReaction, setLocalReaction] = useState(postData?.currentUserReaction ?? null);
  const [localReactCount, setLocalReactCount] = useState(postData?.reactCount ?? 0);
  const [localCommentCount, setLocalCommentCount] = useState(postData?.commentCount ?? 0);
  const [localShareCount, setLocalShareCount] = useState(postData?.shareCount ?? 0);

  // Sync prop changes from server
  useEffect(() => {
    setLocalReaction(postData?.currentUserReaction ?? null);
    setLocalReactCount(postData?.reactCount ?? 0);
    setLocalCommentCount(postData?.commentCount ?? 0);
    setLocalShareCount(postData?.shareCount ?? 0);
  }, [
    postData?.currentUserReaction,
    postData?.reactCount,
    postData?.commentCount,
    postData?.shareCount,
  ]);

  // STOMP WebSocket topic subscription when comments are open
  useEffect(() => {
    if (!stompClient || !isConnected || !postData?.id || !showComments) return undefined;

    const dispatchEvent = (eventName) => (message) => {
      try {
        window.dispatchEvent(
          new CustomEvent(eventName, { detail: JSON.parse(message.body) })
        );
      } catch (err) {
        console.error("Error parsing realtime message:", err);
      }
    };

    const subscriptions = [
      stompClient.subscribe(
        `/topic/posts/${postData.id}/reactions`,
        dispatchEvent("reactionEvent")
      ),
      stompClient.subscribe(
        `/topic/posts/${postData.id}/comments`,
        dispatchEvent("commentEvent")
      ),
    ];

    return () => {
      subscriptions.forEach((sub) => sub.unsubscribe());
    };
  }, [stompClient, isConnected, postData?.id, showComments]);

  // Realtime reaction event listener
  useEffect(() => {
    const handleReactionEvent = (e) => {
      const { postId, newReactCount } = e.detail;
      if (postId === postData?.id) {
        setLocalReactCount(newReactCount);
      }
    };
    window.addEventListener("reactionEvent", handleReactionEvent);
    return () => window.removeEventListener("reactionEvent", handleReactionEvent);
  }, [postData?.id]);

  // Realtime comment event listener
  useEffect(() => {
    const handleCommentEvent = (e) => {
      const { postId, newCommentCount } = e.detail;
      if (postId === postData?.id) {
        setLocalCommentCount(newCommentCount);
      }
    };
    window.addEventListener("commentEvent", handleCommentEvent);
    return () => window.removeEventListener("commentEvent", handleCommentEvent);
  }, [postData?.id]);

  // Realtime post updated event listener (for shareCount)
  useEffect(() => {
    const handlePostEvent = (e) => {
      const { action, postId, post: updatedPost } = e.detail;
      if (postId === postData?.id && action === "UPDATED" && updatedPost) {
        setLocalShareCount(updatedPost.shareCount || 0);
      }
    };
    window.addEventListener("postEvent", handlePostEvent);
    return () => window.removeEventListener("postEvent", handlePostEvent);
  }, [postData?.id]);

  // Optimistic React / Unreact
  const handleReact = useCallback(
    async (type) => {
      const previousReaction = localReaction;
      const previousCount = localReactCount;

      // Optimistic update
      setLocalReaction(type);
      if (previousReaction === null && type !== null) {
        setLocalReactCount((prev) => prev + 1);
      } else if (previousReaction !== null && type === null) {
        setLocalReactCount((prev) => Math.max(0, prev - 1));
      }

      try {
        if (type === null) {
          await postService.unreactToPost(postData.id);
        } else {
          await postService.reactToPost(postData.id, type);
        }
      } catch (error) {
        console.error("Reaction failed:", error);
        // Rollback
        setLocalReaction(previousReaction);
        setLocalReactCount(previousCount);
      }
    },
    [localReaction, localReactCount, postData?.id]
  );

  // Pin / Unpin
  const handleTogglePin = useCallback(async () => {
    if (!postData?.groupId || !postData?.id) return;
    try {
      await postService.togglePinPost(postData.groupId, postData.id);
      toast.success(postData.isPinned ? "Đã bỏ ghim bài viết" : "Đã ghim bài viết");
      setShowMenu(false);
    } catch (error) {
      toast.error("Thao tác thất bại: " + error);
    }
  }, [postData?.groupId, postData?.id, postData?.isPinned]);

  // Update
  const handleUpdate = useCallback(
    async (postId, updatedData) => {
      if (onUpdate) {
        await onUpdate(postId, updatedData);
      }
      setIsEditing(false);
    },
    [onUpdate]
  );

  // Delete
  const handleDelete = useCallback(() => {
    if (onDelete && postData?.id) {
      onDelete(postData.id);
    }
    setShowMenu(false);
  }, [onDelete, postData?.id]);

  // Report submission
  const handleReportSubmit = useCallback(async (reportData) => {
    try {
      await reportService.createReport(reportData);
      toast.success("Báo cáo đã được gửi. Cảm ơn bạn đã đóng góp!");
      setShowReportModal(false);
    } catch (error) {
      toast.error("Gửi báo cáo thất bại. Vui lòng thử lại sau.");
      console.error("Report error:", error);
    }
  }, []);

  return {
    // Menu & Editing
    showMenu,
    setShowMenu,
    isEditing,
    setIsEditing,
    handleUpdate,
    handleDelete,
    handleTogglePin,

    // Reactions & Counters
    localReaction,
    localReactCount,
    localCommentCount,
    localShareCount,
    handleReact,

    // Comments
    showComments,
    setShowComments,
    toggleComments: () => setShowComments((prev) => !prev),

    // Share Modal
    showShareModal,
    setShowShareModal,
    openShareModal: () => setShowShareModal(true),
    closeShareModal: () => setShowShareModal(false),

    // Report Modal
    showReportModal,
    setShowReportModal,
    openReportModal: () => setShowReportModal(true),
    closeReportModal: () => setShowReportModal(false),
    handleReportSubmit,

    // Lightbox & Video
    lightboxIndex,
    openLightbox: (index) => setLightboxIndex(index),
    closeLightbox: () => setLightboxIndex(-1),
    videoPaused,
    setVideoPaused,
  };
}

export default usePostActions;
