import React, { useState } from "react";
import { Heart, ThumbsUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Danh sách các cảm xúc
export const REACTION_TYPES = [
  { id: "LIKE", label: "Like", icon: "👍", color: "text-blue-500" },
  { id: "LOVE", label: "Love", icon: "❤️", color: "text-red-500" },
  { id: "HAHA", label: "Haha", icon: "😂", color: "text-yellow-500" },
  { id: "WOW", label: "Wow", icon: "😮", color: "text-orange-500" },
  { id: "SAD", label: "Sad", icon: "😢", color: "text-blue-400" },
  { id: "ANGRY", label: "Angry", icon: "😡", color: "text-red-600" },
];

const ReactionButton = ({ currentReaction, onReact }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [closeTimeout, setCloseTimeout] = useState(null);

  // Xử lý khi hover vào nút
  const handleMouseEnter = () => {
    // Nếu đang chờ đóng (user lướt ra rồi quay lại nhanh), thì hủy đóng
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }

    if (!isHovering) {
      const timeout = setTimeout(() => {
        setIsHovering(true);
      }, 200); // Delay 200ms để hiện popup (tránh hiện khi lướt qua nhanh)
      setHoverTimeout(timeout);
    }
  };

  // Xử lý khi rời chuột
  const handleMouseLeave = () => {
    // Nếu chưa kịp hiện popup mà đã rời chuột -> hủy hiện
    if (hoverTimeout) clearTimeout(hoverTimeout);

    // Thêm thời gian chờ (grace period) trước khi đóng
    const timeout = setTimeout(() => {
      setIsHovering(false);
    }, 300); // 300ms grace period
    setCloseTimeout(timeout);
  };

  // Xử lý click nút chính
  const handleClick = () => {
    if (currentReaction) {
      onReact(null); // Bỏ reaction nếu đã có
    } else {
      onReact("LIKE"); // Mặc định là LIKE nếu chưa có
    }
    setIsHovering(false);
  };

  // Render icon chính
  const getMainIcon = () => {
    if (!currentReaction) {
      return (
        <div className="flex items-center gap-2 text-text-secondary group-hover:text-blue-500 transition-colors">
          <ThumbsUp size={20} />
          <span className="text-sm font-medium">Like</span>
        </div>
      );
    }

    const reaction = REACTION_TYPES.find((r) => r.id === currentReaction);
    if (!reaction) return null;

    return (
      <div
        className={`flex items-center gap-2 ${reaction.color} font-bold transition-colors`}
      >
        <span className="text-xl">{reaction.icon}</span>
        <span className="text-sm">{reaction.label}</span>
      </div>
    );
  };

  return (
    <div
      className="relative flex-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Nút chính */}
      <button
        onClick={handleClick}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-background-main transition-colors group"
      >
        {getMainIcon()}
      </button>

      {/* Popup chọn cảm xúc */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 1 }}
            transition={{ duration: 0.2 }}
            // Padding bottom tạo cầu nối an toàn khi rê chuột từ nút lên menu
            className="absolute left-1/2 -translate-x-1/2 bottom-full pb-4 flex items-center justify-center z-50"
          >
            <div className="flex items-center gap-2 bg-surface-main border border-border-main p-2 rounded-full shadow-2xl">
              {REACTION_TYPES.map((reaction) => (
                <motion.button
                  key={reaction.id}
                  whileHover={{ scale: 1.3, y: -5 }}
                  whileTap={{ scale: 1 }}
                  onClick={() => {
                    onReact(reaction.id);
                    setIsHovering(false);
                  }}
                  className="text-2xl hover:drop-shadow-lg transition-all px-1"
                  title={reaction.label}
                >
                  {reaction.icon}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReactionButton;
