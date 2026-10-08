import React from "react";
import { ChatText, ShareNetwork } from "@phosphor-icons/react";
import ReactionButton from "./ReactionButton";

/**
 * PostFooterAction: Bottom action bar with Like reaction, Comment toggle, and Share triggers.
 * Single Responsibility: Interactive action buttons bar.
 */
export default function PostFooterAction({
  currentReaction,
  onReact,
  onToggleComments,
  onShareClick,
}) {
  return (
    <div className="px-3 py-1">
      <div className="flex items-center justify-between pt-1">
        <ReactionButton
          currentReaction={currentReaction}
          onReact={onReact}
        />

        <button
          type="button"
          onClick={onToggleComments}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-surface-subtle text-text-secondary hover:text-primary transition-colors cursor-pointer select-none"
        >
          <ChatText size={18} />
          <span className="text-sm font-semibold">Bình luận</span>
        </button>

        <button
          type="button"
          onClick={onShareClick}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-surface-subtle text-text-secondary hover:text-primary transition-colors cursor-pointer select-none"
        >
          <ShareNetwork size={18} />
          <span className="text-sm font-semibold">Chia sẻ</span>
        </button>
      </div>
    </div>
  );
}
