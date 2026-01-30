import { useState, useRef, useEffect } from "react";
import {
  CheckCircle2,
  Users,
  Globe,
  MoreHorizontal,
  Pencil,
  AlertTriangle,
  ThumbsUp,
  Heart,
  MessageSquare,
  Share2,
  Gift,
  CheckCircle,
  XCircle,
} from "lucide-react";
import ReportModal from "../../components/report/ReportModal";
import reportService from "../../services/ReportService";
import toast from "react-hot-toast";

export default function PostCard({
  id,
  author,
  time,
  content,
  image,
  stats = { likes: 0, comments: 0, shares: 0 },
  type = "feed",
  children,
}) {
  // type: 'feed' (Newsfeed/Timeline), 'dashboard' (NewsfeedDashboard1), or 'admin' (Admin moderation view)
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <article
      className={`bg-surface-main rounded-2xl border border-border-main overflow-hidden shadow-sm transition-colors duration-300 ${
        type === "dashboard" ? "shadow-lg" : ""
      }`}
    >
      <div className="p-5 flex justify-between items-start">
        <div className="flex gap-3">
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full size-11 cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all"
            style={{ backgroundImage: `url("${author.avatar}")` }}
          ></div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <h3 className="text-text-main font-bold text-base hover:text-primary cursor-pointer transition-colors">
                {author.name}
              </h3>
              {author.isSystem && (
                <span className="bg-primary/20 text-primary text-[9px] font-black px-1.5 py-0.5 rounded border border-primary/30 tracking-tighter uppercase flex items-center gap-0.5">
                  <CheckCircle2 size={10} />
                  Official
                </span>
              )}
            </div>
            <p className="text-text-secondary text-[11px] mt-0.5 flex items-center gap-1 font-medium italic">
              {time} •
              {author.originGroup ? (
                <span className="flex items-center gap-1 hover:text-primary cursor-pointer transition-all">
                  <Users size={14} />
                  in {author.originGroup}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-orange-400">
                  <Globe size={14} />
                  Global Broadcast
                </span>
              )}
            </p>
          </div>
        </div>
        {/* MENU 3 CHẤM */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="
      size-9
      flex items-center justify-center
      rounded-full
      text-text-secondary
      hover:text-primary
      hover:bg-background-main
      transition-all
      active:scale-95
    "
          >
            <MoreHorizontal size={20} />
          </button>

          {showMenu && (
            <div
              className="
        absolute right-0 mt-2 w-52
        bg-surface-main
        border border-border-main
        rounded-2xl
        shadow-xl
        z-50
        overflow-hidden
      "
            >
              {/* EDIT */}
              <button
                onClick={() => setShowMenu(false)}
                className="
          w-full px-4 py-3
          flex items-center gap-2
          text-sm font-medium
          text-text-main
          hover:bg-background-main
          transition-colors
        "
              >
                <Pencil size={18} className="text-text-secondary" />
                Chỉnh sửa bài viết
              </button>

              <button
                onClick={() => {
                  setShowMenu(false);
                  setShowReportModal(true);
                }}
                className="
    w-full px-4 py-3
    flex items-center gap-2
    text-sm font-medium
    text-red-400
    hover:bg-[#2A1D15]
    transition-colors
  "
              >
                <AlertTriangle size={18} />
                Báo cáo bài viết
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="px-5 pb-4">
        {children ? (
          children
        ) : (
          <div
            className="text-text-main text-base font-normal leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        )}
      </div>
      {image && (
        <div
          className={`w-full bg-surface-main bg-cover bg-center cursor-pointer relative group ${
            type === "dashboard" ? "h-80" : "aspect-[4/3] sm:aspect-video"
          }`}
          style={{ backgroundImage: `url("${image}")` }}
        >
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
        </div>
      )}
      <div className="px-5 py-3 border-b border-border-main flex items-center justify-between text-text-secondary text-sm">
        <div className="flex items-center gap-1.5 hover:text-primary cursor-pointer transition-colors">
          <div className="size-5 rounded-full bg-primary flex items-center justify-center text-white shadow-sm">
            <ThumbsUp size={10} strokeWidth={3} />
          </div>
          <span className="font-medium">{stats.likes} likes</span>
        </div>
        <div className="flex gap-4">
          <span className="hover:text-white cursor-pointer transition-colors font-medium">
            {stats.comments} comments
          </span>
          {stats.shares > 0 && (
            <span className="hover:text-white cursor-pointer transition-colors font-medium">
              {stats.shares} shares
            </span>
          )}
        </div>
      </div>
      {type !== "admin" ? (
        <div className="p-2 px-3 flex items-center justify-between">
          <div className="flex gap-1 flex-1">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-full hover:bg-background-main text-text-secondary hover:text-red-500 transition-colors group">
              <Heart
                size={20}
                className="group-hover:text-red-500 group-active:scale-90 transition-all"
              />
              <span className="text-sm font-bold">Like</span>
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-full hover:bg-background-main text-text-secondary hover:text-blue-400 transition-colors group">
              <MessageSquare
                size={20}
                className="group-active:scale-90 transition-all"
              />
              <span className="text-sm font-bold">Comment</span>
            </button>
            <button className="hidden sm:flex items-center justify-center gap-2 px-4 py-2.5 rounded-full hover:bg-background-main text-text-secondary hover:text-green-400 transition-colors group">
              <Share2
                size={20}
                className="group-active:scale-90 transition-all"
              />
              <span className="text-sm font-bold">Share</span>
            </button>
          </div>
          <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary hover:to-orange-500 text-primary hover:text-[#231810] transition-all border border-primary/30 hover:border-transparent group shadow-sm shadow-orange-900/20">
            <Gift size={20} />
            <span className="text-sm font-bold">Gift</span>
          </button>
        </div>
      ) : (
        <div className="p-3 px-5 flex items-center justify-between bg-black/20">
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all font-black text-xs uppercase tracking-widest border border-green-500/20">
              <CheckCircle size={18} />
              Approve
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all font-black text-xs uppercase tracking-widest border border-red-500/20">
              <XCircle size={18} />
              Reject
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-text-muted hover:text-orange-400 transition-all font-bold text-xs">
            <AlertTriangle size={18} />
            View Report
          </button>
        </div>
      )}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={async (payload) => {
          const toastId = toast.loading("Đang gửi báo cáo...", {
            style: {
              background: "#1A120B",
              color: "#FFD8B0",
            },
          });
          try {
            await reportService.createReport(payload);
            toast.success("Báo cáo thành công!", {
              id: toastId,
              style: {
                background: "#1A120B",
                color: "#FF8A2A",
                border: "1px solid #FF8A2A",
                fontWeight: "700",
              },
            });
            setShowReportModal(false);
          } catch (error) {
            console.error(error);
            toast.error("Gửi báo cáo thất bại!", {
              id: toastId,
              style: {
                background: "#1A120B",
                color: "#FF6A00",
              },
            });
          }
        }}
        title="Báo cáo bài viết"
        subtitle={`Bài viết của ${author.name}`}
        question="Vì sao bạn muốn báo cáo bài viết này?"
        reasons={[
          "Nội dung không phù hợp",
          "Spam hoặc lừa đảo",
          "Ngôn từ thù ghét",
          "Thông tin sai sự thật",
          "Khác",
        ]}
        targetPayload={{
          targetType: "POST",
          targetId: id,
        }}
      />
    </article>
  );
}
