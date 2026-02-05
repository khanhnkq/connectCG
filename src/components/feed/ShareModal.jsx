import React from "react";
import {
  X,
  Copy,
  Share2,
  Link as LinkIcon,
  Facebook,
  Twitter,
  MessageCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function ShareModal({ isOpen, onClose, postId }) {
  const shareUrl = `${window.location.origin}/dashboard/post/${postId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Đã sao chép liên kết vào bộ nhớ tạm!");
    onClose();
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
    {
      name: "Twitter",
      icon: <Twitter size={20} />,
      color: "bg-sky-50 text-sky-500",
      action: () =>
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            shareUrl,
          )}`,
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

            {/* Content */}
            <div className="p-6">
              <p className="text-sm text-text-secondary mb-4">
                Chọn kênh bạn muốn chia sẻ:
              </p>

              <div className="grid grid-cols-1 gap-3">
                {shareOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={option.action}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-background-main transition-all group border border-transparent hover:border-border-main/50"
                  >
                    <div
                      className={`size-10 rounded-xl flex items-center justify-center ${option.color} group-hover:scale-110 transition-transform`}
                    >
                      {option.icon}
                    </div>
                    <span className="font-semibold text-text-main">
                      {option.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* URL Preview */}
              <div className="mt-6 p-3 bg-background-main rounded-xl flex items-center gap-3 border border-border-main/30">
                <span className="text-xs text-text-secondary truncate flex-1 uppercase tracking-tight">
                  {shareUrl}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 bg-surface-main border border-border-main rounded-lg text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  Copy
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
