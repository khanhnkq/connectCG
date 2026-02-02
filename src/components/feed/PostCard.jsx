import { useState, useRef, useEffect } from "react";
import {
  CheckCircle2,
  Users,
  Globe,
  MoreHorizontal,
  AlertTriangle,
  Heart,
  MessageSquare,
  Share2,
  CheckCircle,
  Trash,
  Pencil,
  Image as ImageIcon,
  X,
  Lock,
  ChevronDown,
  ThumbsUp,
} from "lucide-react";
import { useSelector } from "react-redux";
import ImageLightbox from "../common/ImageLightBox";
import PostUpdate from "./PostUpdate";
import postService from "../../services/PostService";
import CommentSection from "./CommentSection";
import ReportModal from "../report/ReportModal";
import reportService from "../../services/ReportService";
import toast from "react-hot-toast";

// --- HELPER 1: Format thời gian ---
const formatTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // giây

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString("vi-VN", { day: "numeric", month: "short" });
};

// --- HELPER MỚI CHUẨN ---
const MediaGallery = ({ mediaItems, onMediaClick }) => {
  if (!mediaItems || mediaItems.length === 0) return null;

  // Hàm render 1 media item
  const renderItem = (
    item,
    index,
    className,
    showOverlay = false,
    overlayCount = 0,
  ) => {
    const isVideo =
      item.type === "VIDEO" ||
      (item.url && item.url.match(/\.(mp4|webm|mov)$/i));

    return (
      <div
        key={index} // Quan trọng: phải có key
        className={`relative overflow-hidden bg-black cursor-pointer group w-full h-full ${className}`}
        onClick={() => onMediaClick(index)}
      >
        {isVideo ? (
          <video
            src={item.url}
            className="w-full h-full object-cover pointer-events-none"
          />
        ) : (
          <img
            src={item.url}
            alt="Content"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Overlay hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

        {/* Overlay số lượng ảnh thừa (+2, +3...) */}
        {showOverlay && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
            <span className="text-white text-3xl font-bold">
              +{overlayCount}
            </span>
          </div>
        )}

        {/* Nút Play nếu là video */}
        {isVideo && !showOverlay && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/40 backdrop-blur-sm p-3 rounded-full border border-white/20 shadow-lg">
              <svg
                className="w-6 h-6 text-white fill-white"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>
    );
  };

  const count = mediaItems.length;

  return (
    <div className="w-full overflow-hidden">
      {/* TRƯỜNG HỢP 1 ẢNH */}
      {count === 1 && (
        <div className="w-full flex justify-center max-h-[600px]">
          {renderItem(mediaItems[0], 0, "")}
        </div>
      )}

      {/* TRƯỜNG HỢP 2 ẢNH */}
      {count === 2 && (
        <div className="grid grid-cols-2 gap-1 h-[300px] sm:h-[400px]">
          {renderItem(mediaItems[0], 0)}
          {renderItem(mediaItems[1], 1)}
        </div>
      )}

      {/* TRƯỜNG HỢP 3 ẢNH */}
      {count === 3 && (
        <div className="grid grid-cols-2 grid-rows-2 gap-1 h-[300px] sm:h-[400px]">
          <div className="row-span-2 relative">
            {renderItem(mediaItems[0], 0, "absolute inset-0 w-full h-full")}
          </div>
          <div className="relative">
            {renderItem(mediaItems[1], 1, "absolute inset-0 w-full h-full")}
          </div>
          <div className="relative">
            {renderItem(mediaItems[2], 2, "absolute inset-0 w-full h-full")}
          </div>
        </div>
      )}

      {/* TRƯỜNG HỢP 4+ ẢNH */}
      {count >= 4 && (
        <div className="grid grid-cols-2 grid-rows-2 gap-1 h-[300px] sm:h-[400px]">
          <div className="relative">
            {renderItem(mediaItems[0], 0, "absolute inset-0 w-full h-full")}
          </div>
          <div className="relative">
            {renderItem(mediaItems[1], 1, "absolute inset-0 w-full h-full")}
          </div>
          <div className="relative">
            {renderItem(mediaItems[2], 2, "absolute inset-0 w-full h-full")}
          </div>
          <div className="relative">
            {renderItem(
              mediaItems[3],
              3,
              "absolute inset-0 w-full h-full",
              count > 4,
              count - 4,
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// --- COMPONENT CHÍNH ---
import ReactionButton from "./ReactionButton";

export default function PostCard({
  post, // DTO prop
  // Fallback props
  id,
  author,
  time,
  content,
  image,
  type = "feed",
  onUpdate,
  onDelete,
}) {
  const [showComments, setShowComments] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [showMenu, setShowMenu] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(-1); // Index ảnh đang xem (-1 là đóng)
  const menuRef = useRef(null);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const reportReasons = [
    "Spam hoặc lừa đảo",
    "Nội dung khiêu dâm",
    "Bạo lực hoặc nguy hiểm",
    "Quấy rối hoặc bắt nạt",
    "Thông tin sai lệch",
    "Vi phạm quyền sở hữu trí tuệ",
    "Khác"
  ];

  const handleReportSubmit = async (reportData) => {
    try {
      await reportService.createReport(reportData);
      toast.success("Báo cáo đã được gửi. Cảm ơn bạn đã đóng góp!");
      setShowReportModal(false);
    } catch (error) {
      toast.error("Gửi báo cáo thất bại. Vui lòng thử lại sau.");
      console.error("Report error:", error);
    }
  };

  // Chuẩn hóa dữ liệu logic
  let data = {};
  if (post) {
    // Ưu tiên dùng media (có type), fallback sang images (list string) nếu media rỗng
    let mediaList = [];
    if (post.media && post.media.length > 0) {
      mediaList = post.media;
    } else if (post.images && post.images.length > 0) {
      mediaList = post.images.map((url) => ({ url, type: "IMAGE" }));
    }

    data = {
      id: post.id,
      content: post.content,
      author: {
        name: post.authorFullName || post.authorName,
        avatar: post.authorAvatar,
        id: post.authorId,
        isSystem: post.isSystem,
      },
      timeDisplay: formatTime(post.createdAt),
      mediaItems: mediaList,
      visibility: post.visibility,
      aiStatus: post.aiStatus,
      approvedBy: post.approvedByFullName,
      currentUserReaction: post.currentUserReaction,
      reactCount: post.reactCount || 0,
      commentCount: post.commentCount || 0,
    };
  } else {
    data = {
      id,
      content,
      author,
      timeDisplay: time,
      mediaItems: image ? [{ url: image, type: "IMAGE" }] : [],
    };
  }

  // Local state for optimistic updates
  const [localReaction, setLocalReaction] = useState(data.currentUserReaction);

  // Sync prop changes to local state
  useEffect(() => {
    setLocalReaction(data.currentUserReaction);
  }, [data.currentUserReaction]);

  const handleReactWrapper = async (type) => {
    // 1. Optimistic Update
    const previousReaction = localReaction;
    setLocalReaction(type); // Update UI immediately

    try {
      if (type === null) {
        // Un-react
        await postService.unreactToPost(data.id);
      } else {
        // React/Update
        await postService.reactToPost(data.id, type);
      }
    } catch (error) {
      console.error("Reaction failed:", error);
      // Revert if failed
      setLocalReaction(previousReaction);
    }
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle saving edit from child component
  const handleUpdateWrapper = async (postId, updatedData) => {
    if (onUpdate) {
      await onUpdate(postId, updatedData);
    }
    setIsEditing(false);
  };

  return (
    <article
      className={`bg-surface-main rounded-2xl border border-border-main shadow-sm transition-colors duration-300 mb-4 ${type === "dashboard" ? "shadow-lg" : ""
        }`}
    >
      {/* HEADER */}
      <div className="p-4 flex justify-between items-start">
        <div className="flex gap-3">
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full size-10 cursor-pointer ring-1 ring-border-main hover:ring-primary transition-all"
            style={{ backgroundImage: `url("${data.author.avatar}")` }}
          ></div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <h3 className="text-text-main font-bold text-sm sm:text-base hover:text-primary cursor-pointer transition-colors">
                {data.author.name}
              </h3>
              {data.author.isSystem && (
                <span className="bg-primary/20 text-primary text-[9px] font-black px-1.5 py-0.5 rounded border border-primary/30 tracking-tighter uppercase flex items-center gap-0.5">
                  <CheckCircle2 size={10} />
                  Official
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-text-secondary text-xs">
              <span>{data.timeDisplay}</span>
              <span>•</span>
              {data.visibility === "FRIENDS" ? (
                <Users size={12} />
              ) : data.visibility === "PRIVATE" ? (
                <div className="flex items-center gap-1">
                  <i className="lucide-lock w-3 h-3" />
                  Private
                </div>
              ) : (
                <Globe size={12} />
              )}

              {data.aiStatus && data.aiStatus !== "Clean" && (
                <span className="ml-2 px-2 py-0.5 bg-yellow-500/10 text-yellow-600 rounded-full text-[10px] font-bold border border-yellow-500/20 flex items-center gap-1">
                  <AlertTriangle size={10} /> AI Flagged
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ACTION MENU */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="size-8 flex items-center justify-center rounded-full text-text-secondary hover:bg-background-main transition-all"
          >
            <MoreHorizontal size={20} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-surface-main rounded-lg shadow-xl border border-border-main z-10 overflow-hidden py-1">
              {user.id === data.author.id && (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(true); // Bật chế độ sửa
                      setShowMenu(false); // Đóng menu
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-text-main hover:bg-background-main flex items-center gap-2"
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      onDelete(data.id); // Gọi hàm xóa từ cha
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-text-main hover:bg-background-main flex items-center gap-2"
                  >
                    <Trash size={16} /> Delete
                  </button>
                </>
              )}
              <button className="w-full text-left px-4 py-2.5 text-sm text-text-main hover:bg-background-main flex items-center gap-2">
                <Share2 size={16} /> Share
              </button>
              <button
                onClick={() => {
                  setShowReportModal(true);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center gap-2"
              >
                <AlertTriangle size={16} /> Report
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT TEXT OR EDIT FORM */}
      <div className="px-4 pb-3">
        {isEditing ? (
          <PostUpdate
            post={data}
            onUpdate={handleUpdateWrapper}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          data.content && (
            <p className="text-text-main whitespace-pre-wrap text-[15px] leading-relaxed break-words">
              {data.content}
            </p>
          )
        )}
      </div>

      {/* MEDIA GALLERY */}
      {/* Hide media when editing because PostUpdate handles preview */}
      {!isEditing && data.mediaItems.length > 0 && (
        <div className="w-full border-t border-b border-border-main/50">
          <MediaGallery
            mediaItems={data.mediaItems}
            onMediaClick={(index) => setLightboxIndex(index)}
          />
        </div>
      )}

      {(data.reactCount > 0 || data.commentCount > 0) && (
        <div className="px-5 py-2 flex items-center justify-between text-[13px] text-text-secondary">
          <div className="flex items-center gap-1.5 cursor-pointer hover:underline decoration-text-secondary/50 transition-all">
            {data.reactCount > 0 && (
              <>
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/10">
                  <ThumbsUp size={12} className="text-blue-600 fill-blue-600" />
                </div>
                <span className="font-medium">{data.reactCount}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {data.commentCount > 0 && (
              <button
                onClick={() => setShowComments(!showComments)}
                className="hover:text-text-main transition-colors"
              >
                {data.commentCount} comments
              </button>
            )}
            {/* Placeholder for share count if future-proofed */}
            {/* <span>2 shares</span> */}
          </div>
        </div>
      )}

      {/* FOOTER ACTIONS */}
      <div className="px-2 py-1">
        <div className="flex items-center justify-between border-t border-border-main mx-2 pt-1">
          <ReactionButton
            currentReaction={localReaction}
            onReact={handleReactWrapper}
          />

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-background-main text-text-secondary hover:text-blue-500 transition-colors"
          >
            <MessageSquare size={20} />
            <span className="text-sm font-medium">Comment</span>
          </button>

          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-background-main text-text-secondary hover:text-green-500 transition-colors">
            <Share2 size={20} />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>

      {/* LIGHTBOX COMPONENT */}
      {lightboxIndex >= 0 && (
        <ImageLightbox
          mediaItems={data.mediaItems}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(-1)}
        />
      )}
      {showComments && <CommentSection postId={data.id} />}

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReportSubmit}
        title="Báo cáo bài viết"
        subtitle="Hãy giúp chúng tôi hiểu vấn đề với bài viết này"
        reasons={reportReasons}
        targetPayload={{
          targetType: "POST",
          targetId: data.id,
        }}
        user={data.author}
      />
    </article>
  );
}
