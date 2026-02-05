import { useState } from "react";
import { useSelector } from "react-redux";
import { ChevronDown, ChevronRight } from "lucide-react";
import CommentInput from "./CommentInput";

const formatTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "Vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ`;
  return `${Math.floor(diff / 86400)} ngày`;
};

export default function CommentItem({ comment, onReply, onDelete, depth = 0 }) {
  const { user: authUser } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.user);

  const user = profile
    ? {
        ...authUser,
        ...profile,
        id: profile.userId,
        avatar: profile.currentAvatarUrl,
      }
    : authUser;
  const [isReplying, setIsReplying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSubmitReply = async (content, imageUrl = null) => {
    await onReply(content, comment.id, imageUrl);
    setIsReplying(false);
  };

  const canReply = depth < 2;
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className="relative mb-3">
      {/* Main Comment */}
      <div className="flex gap-2">
        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full bg-cover bg-center flex-shrink-0 border border-border-main"
          style={{ backgroundImage: `url("${comment.authorAvatar}")` }}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Bubble */}
          <div className="inline-block bg-background-main rounded-2xl px-3 py-2 max-w-full">
            <p className="font-semibold text-[13px] text-text-main leading-tight">
              {comment.authorName}
            </p>
            <p className="text-[15px] text-text-main break-words leading-snug mt-0.5">
              {comment.content}
            </p>
            {comment.imageUrl && (
              <div className="mt-2 rounded-lg overflow-hidden border border-border-main max-w-[250px]">
                <img
                  src={comment.imageUrl}
                  alt="comment attachment"
                  className="w-full h-auto object-cover cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => window.open(comment.imageUrl, "_blank")}
                />
              </div>
            )}
          </div>

          {/* Actions Row */}
          <div className="flex items-center gap-4 mt-1 ml-3 text-xs font-medium text-text-secondary">
            <span>{formatTime(comment.createdAt)}</span>

            {canReply && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="hover:text-text-main hover:underline transition-colors"
              >
                Trả lời
              </button>
            )}

            {user?.id === comment.authorId && (
              <button
                onClick={() => onDelete(comment.id)}
                className="hover:text-red-500 hover:underline transition-colors"
              >
                Xóa
              </button>
            )}
          </div>

          {/* Reply Input */}
          {isReplying && (
            <div className="mt-2 flex gap-2 items-center">
              <div
                className="w-6 h-6 rounded-full bg-cover bg-center flex-shrink-0 border border-border-main"
                style={{
                  backgroundImage: `url("${
                    user?.currentAvatarUrl ||
                    user?.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }")`,
                }}
              />
              <CommentInput
                onSubmit={handleSubmitReply}
                placeholder={`Phản hồi ${comment.authorName}...`}
                autoFocus
                className="flex-1"
              />
            </div>
          )}

          {/* Replies */}
          {hasReplies && (
            <div className="mt-2">
              {!isExpanded ? (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-text-main transition-colors"
                >
                  <ChevronRight className="w-3 h-3" />
                  Xem {comment.replies.length} phản hồi
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-text-main transition-colors mb-2"
                  >
                    <ChevronDown className="w-3 h-3" />
                    Ẩn phản hồi
                  </button>
                  <div className="space-y-0">
                    {comment.replies.map((reply) => (
                      <CommentItem
                        key={reply.id}
                        comment={reply}
                        onReply={onReply}
                        onDelete={onDelete}
                        depth={depth + 1}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
