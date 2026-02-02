import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import commentService from "../../services/CommentService";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";

export default function CommentSection({ postId }) {
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
  }, [postId]);
  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await commentService.getComments(postId);
      setComments(res.data || res);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };
  // Tạo comment mới
  // Tạo comment mới
  const handleSubmit = async (content) => {
    try {
      await commentService.createComment(postId, content);
      fetchComments(); // Refresh list
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };
  // Reply
  const handleReply = async (content, parentId) => {
    try {
      await commentService.createComment(postId, content, parentId);
      fetchComments();
    } catch (error) {
      console.error("Error replying:", error);
    }
  };
  // Delete
  const handleDelete = async (commentId) => {
    try {
      await commentService.deleteComment(postId, commentId);
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
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
        <div className="space-y-1">
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
