import React, { useState } from "react";
import { AiOutlineLike } from "react-icons/ai"; // Like mặc định (chưa thả tim)
import { motion, AnimatePresence } from "framer-motion";
import { FacebookSelector } from "@charkour/react-reactions";

// Assets từ thư mục public/assets/reactions (Local)
export const REACTION_ASSETS = {
  LIKE: "/assets/reactions/Like Icon from Reactions.png",
  LOVE: "/assets/reactions/Love Icon from Reactions.png",
  HAHA: "/assets/reactions/Haha from Reactions.png",
  WOW: "/assets/reactions/Wow image from Reactions.png",
  SAD: "/assets/reactions/Sad Reaction Image.png",
  ANGRY: "/assets/reactions/Angry Reaction.png",
};

// Danh sách các cảm xúc (Dùng để hiển thị kết quả đã chọn trên nút)
export const REACTION_TYPES = [
  {
    id: "LIKE",
    label: "Like",
    icon: <img src={REACTION_ASSETS.LIKE} alt="Like" className="w-6 h-6" />,
    color: "text-blue-500",
  },
  {
    id: "LOVE",
    label: "Love",
    icon: <img src={REACTION_ASSETS.LOVE} alt="Love" className="w-6 h-6" />,
    color: "text-red-500",
  },
  {
    id: "HAHA",
    label: "Haha",
    icon: <img src={REACTION_ASSETS.HAHA} alt="Haha" className="w-6 h-6" />,
    color: "text-yellow-500",
  },
  {
    id: "WOW",
    label: "Wow",
    icon: <img src={REACTION_ASSETS.WOW} alt="Wow" className="w-6 h-6" />,
    color: "text-orange-500",
  },
  {
    id: "SAD",
    label: "Sad",
    icon: <img src={REACTION_ASSETS.SAD} alt="Sad" className="w-6 h-6" />,
    color: "text-blue-400",
  },
  {
    id: "ANGRY",
    label: "Angry",
    icon: <img src={REACTION_ASSETS.ANGRY} alt="Angry" className="w-6 h-6" />,
    color: "text-red-600",
  },
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
      }, 300); // Tăng delay lên 300ms tránh hiện khi lướt nhanh
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
    }, 500); // Grace period dài hơn chút để dễ chọn
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
          <AiOutlineLike size={20} />
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
        <div className="transform scale-125">{reaction.icon}</div>
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

      {/* Popup chọn cảm xúc Facebook Style */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -10, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-full z-50 mb-2"
          >
            <div className="shadow-2xl rounded-full bg-white p-1">
              <FacebookSelector
                onSelect={(key) => {
                  // Key trả về thường là 'like', 'love'... -> convert to UPPERCASE
                  onReact(key.toUpperCase());
                  setIsHovering(false);
                }}
                iconSize={40} // Kích thước icon động
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReactionButton;
