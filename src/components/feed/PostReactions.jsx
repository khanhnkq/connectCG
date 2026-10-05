import React from "react";
import { REACTION_ASSETS } from "./ReactionButton";

/**
 * PostReactions: Reaction counters stack, comment count, and share count display.
 * Single Responsibility: Displaying engagement statistics.
 */
export default function PostReactions({
  reactCount = 0,
  commentCount = 0,
  shareCount = 0,
  onToggleComments,
  onShareClick,
}) {
  if (reactCount <= 0 && commentCount <= 0 && shareCount <= 0) {
    return null;
  }

  return (
    <div className="px-5 md:px-6 py-2 flex items-center justify-between text-xs text-text-muted select-none">
      <div className="flex items-center gap-1.5">
        {reactCount > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex flex-row-reverse justify-end pl-1">
              <img
                src={REACTION_ASSETS.LIKE}
                alt="Thích"
                className="size-4.5 border border-surface-main rounded-full bg-surface-main relative z-30 object-cover shrink-0"
              />
              {reactCount > 1 && (
                <img
                  src={REACTION_ASSETS.LOVE}
                  alt="Yêu thích"
                  className="size-4.5 -mr-1.5 border border-surface-main rounded-full bg-surface-main relative z-20 object-cover shrink-0"
                />
              )}
              {reactCount > 5 && (
                <img
                  src={REACTION_ASSETS.HAHA}
                  alt="Haha"
                  className="size-4.5 -mr-1.5 border border-surface-main rounded-full bg-surface-main relative z-10 object-cover shrink-0"
                />
              )}
            </div>
            <span className="font-semibold text-text-main ml-1">{reactCount}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {commentCount > 0 && (
          <button
            type="button"
            onClick={onToggleComments}
            className="hover:text-text-main transition-colors cursor-pointer"
          >
            {commentCount} bình luận
          </button>
        )}
        {shareCount > 0 && (
          <span
            onClick={onShareClick}
            className="hover:text-text-main transition-colors cursor-pointer"
          >
            {shareCount} chia sẻ
          </span>
        )}
      </div>
    </div>
  );
}
