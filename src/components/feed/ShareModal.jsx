import React, { useState } from "react";
import {
  Link as LinkIcon,
  FacebookLogo as Facebook,
  ChatCircle as MessageCircle,
} from "@phosphor-icons/react";
import toast from "react-hot-toast";
import postService from "../../services/PostService";
import { Modal } from "../ui/modal/Modal";
import { Button } from "../ui/button/Button";

/**
 * ShareModal: Standardized share dialog powered by the Design System Modal primitive.
 * Solves backdrop clipping and adheres to Modern Flat tokens.
 */
export default function ShareModal({ isOpen, onClose, postId }) {
  const shareUrl = `${window.location.origin}/dashboard/post/${postId}`;
  const [caption, setCaption] = useState("");
  const [isSharing, setIsSharing] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Đã sao chép liên kết vào bộ nhớ tạm!");
    onClose?.();
  };

  const handleShareToFeed = async () => {
    if (!caption.trim() || isSharing) return;
    setIsSharing(true);
    try {
      await postService.sharePost(postId, {
        content: caption,
        visibility: "PUBLIC",
      });
      toast.success("Đã chia sẻ bài viết thành công!");
      setCaption("");
      onClose?.();
    } catch (err) {
      toast.error(
        "Lỗi khi chia sẻ: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setIsSharing(false);
    }
  };

  const shareOptions = [
    {
      name: "Sao chép liên kết",
      icon: <LinkIcon size={18} />,
      color: "bg-surface-subtle text-text-main border border-border-main",
      action: handleCopyLink,
    },
    {
      name: "Facebook",
      icon: <Facebook size={18} weight="fill" />,
      color: "bg-blue-500/10 text-blue-600 border border-blue-500/20",
      action: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl
          )}`,
          "_blank"
        ),
    },
    {
      name: "Messenger",
      icon: <MessageCircle size={18} weight="fill" />,
      color: "bg-sky-500/10 text-sky-600 border border-sky-500/20",
      action: () =>
        window.open(
          `fb-messenger://share/?link=${encodeURIComponent(shareUrl)}`,
          "_blank"
        ),
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <Modal.Header title="Chia sẻ bài viết" onClose={onClose} />
      <Modal.Body className="space-y-4">
        {/* Caption Input */}
        <div>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Hãy nói gì đó về bài viết này..."
            disabled={isSharing}
            rows={3}
            className="w-full p-3 bg-surface-subtle rounded-xl border border-border-main focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none text-sm text-text-main transition-colors disabled:opacity-50"
          />
          <div className="flex justify-end mt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleShareToFeed}
              isLoading={isSharing}
              disabled={!caption.trim() || isSharing}
              loadingText="Đang chia sẻ..."
            >
              Chia sẻ ngay
            </Button>
          </div>
        </div>

        <div className="relative flex items-center py-1">
          <div className="grow border-t border-border-main"></div>
          <span className="shrink-0 mx-3 text-text-muted text-xs font-medium">
            Hoặc chia sẻ qua
          </span>
          <div className="grow border-t border-border-main"></div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {shareOptions.map((option) => (
            <button
              key={option.name}
              type="button"
              onClick={option.action}
              disabled={isSharing}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-subtle transition-colors group border border-transparent hover:border-border-main cursor-pointer select-none text-left"
            >
              <div
                className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${option.color}`}
              >
                {option.icon}
              </div>
              <span className="font-semibold text-text-main text-sm">
                {option.name}
              </span>
            </button>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
}
