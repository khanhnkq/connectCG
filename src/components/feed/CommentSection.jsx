import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import commentService from "../../services/CommentService";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";

export default function CommentSection({
  postId,
  onCommentAdded,
  onCommentDeleted,
}) {
  const { user: authUser } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.user);

  // Ưu tiên dùng thông tin từ profile (realtime) hơn là auth state (lưu lúc login)
  const user = profile
    ? {
        ...authUser,
        ...profile,
        id: profile.userId,
        avatar: profile.currentAvatarUrl,
      }
    : authUser;

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  // Fetch comments
  useEffect(() => {
    fetchComments();
  }, [postId]); // fetchComments is stable via useCallback

  // Listen for realtime comment events (only from OTHER users)
  useEffect(() => {
    const handleCommentEvent = (e) => {
      const { postId: eventPostId, action, comment, commentId } = e.detail;

      // Only process if this event is for our post (loose equality for string/number match)
      if (eventPostId != postId) return;

      if (action === "CREATED" && comment) {
        setComments((prevComments) => {
          // 1. Check duplicate (avoid double show)
          const exists = findComment(prevComments, comment.id);
          if (exists) return prevComments;

          // 2. Insert comment
          if (!comment.parentId) {
            // Root comment: Add to bottom
            return [...prevComments, comment];
          } else {
            // Reply: Find parent and add
            return addReplyToComment(prevComments, comment.parentId, comment);
          }
        });
      } else if (action === "DELETED" && commentId) {
        setComments((prevComments) =>
          removeCommentById(prevComments, commentId),
        );
      }
    };
    window.addEventListener("commentEvent", handleCommentEvent);
    return () => window.removeEventListener("commentEvent", handleCommentEvent);
  }, [postId]);

  const fetchComments = useCallback(
    async (isBackground = false) => {
      try {
        if (!isBackground) setLoading(true);
        const res = await commentService.getComments(postId);
        setComments(res.data || res);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        if (!isBackground) setLoading(false);
      }
    },
    [postId],
  );

  const handleSubmit = async (content) => {
    try {
      const res = await commentService.createComment(postId, content);
      // Add new comment to state immediately (optimistic)
      if (res.data || res) {
        setComments((prev) => [...prev, res.data || res]);
      }
      if (onCommentAdded) onCommentAdded();
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  // Reply - add optimistically
  const handleReply = async (content, parentId) => {
    try {
      await commentService.createComment(postId, content, parentId);
      fetchComments(true); // Reply structure is complex, just refetch in background
      if (onCommentAdded) onCommentAdded();
    } catch (error) {
      console.error("Error replying:", error);
    }
  };

  // Delete - remove optimistically
  const handleDelete = async (commentId) => {
    try {
      // Optimistic delete
      setComments((prev) => removeCommentById(prev, commentId));
      await commentService.deleteComment(postId, commentId);
      if (onCommentDeleted) onCommentDeleted();
    } catch (error) {
      console.error("Error deleting comment:", error);
      fetchComments(); // Revert on error
    }
  };

  return (
    <div className="px-4 py-3 border-t border-border-main">
      {/* Input comment mới */}
      <div className="flex gap-3 mb-6">
        <div
          className="w-8 h-8 rounded-full bg-cover bg-center flex-shrink-0 shadow-sm border border-border-main"
          style={{
            backgroundImage: `url("${
              user?.currentAvatarUrl ||
              user?.avatar ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }")`,
          }}
        />
        <CommentInput
          onSubmit={handleSubmit}
          placeholder="Viết bình luận..."
          className="shadow-sm"
        />
      </div>

      {/* Danh sách comment */}
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-text-secondary text-sm py-4 italic">
          Chưa có bình luận nào. Hãy là người đầu tiên!
        </p>
      ) : (
        <div className="max-h-70 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-border-main scrollbar-track-transparent">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
