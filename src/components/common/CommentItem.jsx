export const CommentItem = ({ comment, onReply }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(true); // Toggle replies
  return (
    <div className="flex gap-3 mb-4">
      <Avatar src={comment.authorAvatar} />

      <div className="flex-1">
        {/* Nội dung comment */}
        <div className="bg-gray-100 p-3 rounded-2xl">
          <h4 className="font-bold">{comment.authorName}</h4>
          <p>{comment.content}</p>
        </div>

        {/* Actions row */}
        <div className="flex gap-4 text-xs mt-1 ml-2 text-gray-500">
          <button onClick={() => setIsReplying(!isReplying)}>Reply</button>
          <span>{comment.createdAt}</span>
        </div>
        {/* Input Reply (Conditional) */}
        {isReplying && (
          <div className="mt-2">
            <CommentInput
              parentId={comment.id}
              onSubmit={(text) => onReply(text, comment.id)}
            />
          </div>
        )}
        {/* RECURSIVE RENDER: Hiển thị reply của comment này */}
        {comment.replies && comment.replies.length > 0 && showReplies && (
          <div className="mt-3 pl-4 border-l-2 border-gray-200">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} onReply={onReply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
