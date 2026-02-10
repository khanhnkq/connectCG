import React from "react";
import {
  X,
  Copy,
  Share2,
  Link as LinkIcon,
  Facebook,
  Twitter,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import postService from "../../services/PostService";

export default function ShareModal({ isOpen, onClose, postId }) {
  const shareUrl = `${window.location.origin}/dashboard/post/${postId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Đã sao chép liên kết vào bộ nhớ tạm!");
    onClose();
  };
  const [caption, setCaption] = useState("");
  const [isSharing, setIsSharing] = useState(false);

  const handleShareToFeed = async () => {
    if (!caption.trim() || isSharing) return;
    setIsSharing(true);
    try {
      await postService.sharePost(postId, {
        content: caption,
        visibility: "PUBLIC",
      });
      toast.success("Đã chia sẻ thành công!");
      onClose();
    } catch (err) {
      toast.error(
        "Lỗi khi chia sẻ: " + (err.response?.data?.message || err.message),
      );
    } finally {
      setIsSharing(false);
    }
  };

  const shareOptions = [
    {
      name: "Sao chép liên kết",
      icon: <LinkIcon size={20} />,
      color: "bg-gray-100 text-gray-700",
      action: handleCopyLink,
    },
    // {
    //   name: "Chia sẻ lên Newsfeed",
    //   icon: <Share2 size={20} />,
    //   color: "bg-primary/10 text-primary",
    //   action: () => toast.success("Tính năng này sắp ra mắt!"),
    // },
    {
      name: "Facebook",
      icon: <Facebook size={20} />,
      color: "bg-blue-100 text-blue-600",
      action: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl,
          )}`,
          "_blank",
        ),
    },
    {
      name: "Messenger",
      icon: <MessageCircle size={20} />,
      color: "bg-blue-50 text-blue-500",
      action: () =>
        window.open(
          `fb-messenger://share/?link=${encodeURIComponent(shareUrl)}`,
          "_blank",
        ),
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-surface-main rounded-[2rem] border border-border-main shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-main/50">
              <h3 className="text-lg font-bold text-text-main">
                Chia sẻ bài viết
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-background-main text-text-secondary transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Caption Input */}
              <div>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Hãy nói gì đó về bài viết này..."
                  disabled={isSharing}
                  className={`w-full p-3 bg-background-main rounded-md border border-border-main focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none h-24 text-sm transition-all ${
                    isSharing
                      ? "opacity-50 cursor-not-allowed pointer-events-none"
                      : ""
                  }`}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleShareToFeed}
                    disabled={!caption.trim() || isSharing}
                    className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-primary/20 min-w-[120px] justify-center"
                  >
                    {isSharing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Đang chia sẻ...
                      </>
                    ) : (
                      <>
                        <Share2 size={16} />
                        Chia sẻ ngay
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-border-main/50"></div>
                <span className="flex-shrink-0 mx-4 text-text-secondary text-xs font-medium">
                  Hoặc chia sẻ qua
                </span>
                <div className="flex-grow border-t border-border-main/50"></div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {shareOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={option.action}
                    disabled={isSharing}
                    className={`flex items-center gap-4 p-3 rounded-2xl transition-all group border border-transparent ${
                      isSharing
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-background-main hover:border-border-main/50"
                    }`}
                  >
                    <div
                      className={`size-8 rounded-xl flex items-center justify-center ${option.color} group-hover:scale-110 transition-transform`}
                    >
                      {option.icon}
                    </div>
                    <span className="font-semibold text-text-main text-sm">
                      {option.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
