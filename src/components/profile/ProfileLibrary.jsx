import React, { useState } from "react";
import {
  Images,
  Film,
  LayoutGrid,
  ZoomIn,
  Play,
  ChevronDown,
} from "lucide-react";
import ImageLightbox from "../common/ImageLightBox";
import { motion, AnimatePresence } from "framer-motion";

const ProfileLibrary = ({ profile, isOwner }) => {
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'image', 'video'
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [visibleCount, setVisibleCount] = useState(4);

  // Lọc media theo type
  const filteredMedia =
    profile?.gallery?.filter((media) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "image") return media.type === "IMAGE";
      if (activeFilter === "video") return media.type === "VIDEO";
      return true;
    }) || [];

  const visibleMedia = filteredMedia.slice(0, visibleCount);
  const hasMore = visibleCount < filteredMedia.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const filterTabs = [
    { key: "all", label: "Tất cả", icon: LayoutGrid },
    { key: "image", label: "Ảnh", icon: Images },
    { key: "video", label: "Video", icon: Film },
  ];

  const handleMediaClick = (index) => {
    setLightboxIndex(index);
  };

  // Helper to determine spans for Bento Grid effect
  // Responsive: Mobile (1 col), Tablet (2 cols), Desktop (4 cols)
  const getSpanClasses = (index) => {
    // Pattern loop every 10 items to create variety
    const patternIndex = index % 10;

    // Default: col-span-1 row-span-1
    let spans = "col-span-1 row-span-1";

    // Customize based on pattern index for larger screens
    // We only apply these complex spans on md (desktop) screens where grid-cols-4 is active
    switch (patternIndex) {
      case 0: // Big square start
        spans = "md:col-span-2 md:row-span-2";
        break;
      case 5: // Wide rectangle
        spans = "md:col-span-2 md:row-span-1";
        break;
      case 6: // Tall rectangle
        spans = "md:col-span-1 md:row-span-2";
        break;
      default:
        break;
    }
    return spans;
  };

  return (
    <div className="bg-surface-main rounded-2xl border border-border-main p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-text-main font-bold text-xl flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Images className="text-primary" size={20} />
          </div>
          {isOwner ? "Thư viện của bạn" : "Thư viện media"}
        </h3>

        {/* Filter Tabs */}
        <div className="flex bg-background-main rounded-xl p-1 gap-1 border border-border-main">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveFilter(tab.key);
                setVisibleCount(9); // Reset pagination on filter change
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeFilter === tab.key
                  ? "bg-primary text-[#231810] shadow-sm"
                  : "text-text-secondary hover:text-text-main hover:bg-surface-main"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      {visibleMedia.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[150px] md:auto-rows-[200px]">
            <AnimatePresence mode="popLayout">
              {visibleMedia.map((media, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={media.id || index}
                  className={`group relative cursor-pointer rounded-2xl overflow-hidden border border-border-main/50 shadow-sm hover:shadow-lg transition-all duration-300 ${getSpanClasses(
                    index,
                  )}`}
                  onClick={() => handleMediaClick(index)}
                >
                  <div className="w-full h-full bg-background-main skeleton-loader">
                    {media.type === "VIDEO" ? (
                      <>
                        <video
                          src={media.url}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          muted
                          playsInline
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30 group-hover:scale-110 transition-transform">
                            <Play className="text-white fill-white" size={24} />
                          </div>
                        </div>
                      </>
                    ) : (
                      <img
                        src={media.thumbnailUrl || media.url}
                        alt={`Gallery ${index}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    )}
                  </div>

                  {/* Hover overlay with Glassmorphism */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="bg-white/10 p-3 rounded-full backdrop-blur-md border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <ZoomIn className="text-white" size={24} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                className="flex items-center gap-2 px-6 py-3 bg-surface-main hover:bg-background-main border border-border-main hover:border-primary/50 text-text-main font-bold rounded-xl transition-all shadow-sm group"
              >
                <span>Xem thêm</span>
                <ChevronDown
                  size={18}
                  className="group-hover:translate-y-1 transition-transform"
                />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 flex flex-col items-center justify-center bg-background-main/50 rounded-2xl border border-dashed border-border-main">
          <div className="p-4 bg-surface-main rounded-full mb-4 shadow-sm">
            <Images className="text-text-secondary/50" size={32} />
          </div>
          <p className="text-text-secondary font-medium">
            {activeFilter === "all"
              ? isOwner
                ? "Thư viện của bạn đang trống."
                : "Người dùng này chưa có media nào."
              : activeFilter === "image"
              ? "Không tìm thấy ảnh nào."
              : "Không tìm thấy video nào."}
          </p>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex >= 0 && (
        <ImageLightbox
          mediaItems={filteredMedia}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(-1)}
        />
      )}
    </div>
  );
};

export default ProfileLibrary;
