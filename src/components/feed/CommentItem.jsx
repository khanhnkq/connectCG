import { useState } from "react";
import { useSelector } from "react-redux";
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
  const [showReplies, setShowReplies] = useState(true);

  const handleSubmitReply = async (content) => {
    await onReply(content, comment.id);
    setIsReplying(false);
  };

  const canReply = depth < 2; // Chỉ cho reply đến cấp 3

  return (
    <div className={`relative flex gap-3 ${depth > 0 ? "mt-4" : "mb-6"}`}>
      {/* Thread Line cho Level 1+ */}
      {depth > 0 && (
        <div className="absolute -left-[26px] -top-5 w-6 h-8 border-l-2 border-b-2 border-border-main rounded-bl-2xl"></div>
      )}

      {/* Avatar */}
      <div className="relative z-10">
        <div
          className="w-8 h-8 rounded-full bg-cover bg-center flex-shrink-0 shadow-sm border border-border-main"
          style={{ backgroundImage: `url("${comment.authorAvatar}")` }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="group relative">
          {/* Nội dung comment */}
          <div className="bg-background-secondary/50 hover:bg-background-secondary transition-colors rounded-2xl px-4 py-2 inline-block max-w-full">
            <p className="font-semibold text-sm text-text-main">
              {comment.authorName}
            </p>
            <p className="text-[15px] text-text-main break-words leading-relaxed">
              {comment.content}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-1 ml-2 text-xs font-medium text-text-secondary">
            <span>{formatTime(comment.createdAt)}</span>

            {canReply && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="hover:text-text-main transition-colors cursor-pointer"
              >
                Trả lời
              </button>
            )}

            {user?.id === comment.authorId && (
              <button
                onClick={() => onDelete(comment.id)}
                className="hover:text-red-500 transition-colors cursor-pointer"
              >
                Xóa
              </button>
            )}
          </div>
        </div>

        {/* Reply Input */}
        {isReplying && (
          <div className="mt-3 flex gap-3 items-start animate-fade-in-down">
            <div
              className="w-6 h-6 rounded-full bg-cover bg-center flex-shrink-0 shadow-sm opacity-80 border border-border-main"
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
              className="max-w-full"
            />
          </div>
        )}

        {/* Replies (Đệ quy) */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 text-sm">
            {showReplies ? (
              <div className="relative">
                {/* Vertical Line nối các reply */}
                <div className="absolute left-[-22px] top-0 bottom-4 w-0.5 bg-border-main/50"></div>

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
            ) : (
              <div className="flex items-center gap-2 mt-2">
                <div className="w-8 border-t border-border-main"></div>
                <button
                  onClick={() => setShowReplies(true)}
                  className="text-xs font-medium text-text-secondary hover:text-text-main transition-colors"
                >
                  Xem {comment.replies.length} phản hồi
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
