import React from "react";
import AutoplayVideo from "../common/AutoplayVideo";

/**
 * PostMediaGrid: Dynamic 1, 2, 3, 4+ grid layout for images and videos with overlay counter.
 * Single Responsibility: Media display and click-to-preview triggers.
 */
export default function PostMediaGrid({
  mediaItems = [],
  onMediaClick,
  isPaused = false,
  setIsPaused,
}) {
  if (!mediaItems || mediaItems.length === 0) return null;

  const renderItem = (item, index, className = "", showOverlay = false, overlayCount = 0) => {
    const isVideo = item.type === "VIDEO" || (item.url && item.url.match(/\.(mp4|webm|mov)$/i));

    return (
      <div
        key={index}
        className={`relative overflow-hidden bg-black cursor-pointer group w-full h-full ${className}`}
        onClick={() => onMediaClick?.(index)}
      >
        {isVideo ? (
          <AutoplayVideo
            src={item.url}
            className="w-full h-full"
            onClick={() => onMediaClick?.(index)}
            manuallyPaused={isPaused}
            setManuallyPaused={setIsPaused}
          />
        ) : (
          <img
            src={item.url}
            alt="Nội dung đính kèm"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
        {showOverlay && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
            <span className="text-white text-3xl font-bold">+{overlayCount}</span>
          </div>
        )}
      </div>
    );
  };

  const count = mediaItems.length;

  return (
    <div className="w-full overflow-hidden border-t border-b border-border-main/40">
      {count === 1 && (
        <div className="w-full h-full aspect-[3/2]">
          {renderItem(mediaItems[0], 0, "w-full h-full")}
        </div>
      )}
      {count === 2 && (
        <div className="grid grid-cols-2 gap-1 aspect-[3/2]">
          {renderItem(mediaItems[0], 0)}
          {renderItem(mediaItems[1], 1)}
        </div>
      )}
      {count === 3 && (
        <div className="grid grid-cols-2 grid-rows-2 gap-1 aspect-[3/2]">
          <div className="row-span-2 relative">{renderItem(mediaItems[0], 0, "absolute inset-0 w-full h-full")}</div>
          <div className="relative">{renderItem(mediaItems[1], 1, "absolute inset-0 w-full h-full")}</div>
          <div className="relative">{renderItem(mediaItems[2], 2, "absolute inset-0 w-full h-full")}</div>
        </div>
      )}
      {count >= 4 && (
        <div className="grid grid-cols-2 grid-rows-2 gap-1 aspect-[3/2]">
          <div className="relative">{renderItem(mediaItems[0], 0, "absolute inset-0 w-full h-full")}</div>
          <div className="relative">{renderItem(mediaItems[1], 1, "absolute inset-0 w-full h-full")}</div>
          <div className="relative">{renderItem(mediaItems[2], 2, "absolute inset-0 w-full h-full")}</div>
          <div className="relative">
            {renderItem(mediaItems[3], 3, "absolute inset-0 w-full h-full", count > 4, count - 4)}
          </div>
        </div>
      )}
    </div>
  );
}
