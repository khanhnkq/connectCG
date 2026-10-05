import React, { useState } from "react";

/**
 * PostContent: Render post text content with smart expand/collapse for long texts.
 * Single Responsibility: Displaying text body of the post.
 */
export default function PostContent({ content, initialExpanded = false }) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  if (!content) return null;

  const isLong = content.length > 150;
  const displayText = !isLong || isExpanded ? content : `${content.substring(0, 150)}...`;

  return (
    <div className="px-5 md:px-8 pb-4 md:pb-5">
      <p className="text-text-main whitespace-pre-wrap text-[16px] leading-relaxed break-words font-normal">
        {displayText}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="text-primary hover:underline font-bold text-xs mt-1 cursor-pointer select-none"
        >
          {isExpanded ? "Ẩn bớt" : "Xem thêm"}
        </button>
      )}
    </div>
  );
}
