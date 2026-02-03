import React, { useState } from "react";
import { Images, Film, LayoutGrid, ZoomIn, Play } from "lucide-react";
import ImageLightbox from "../common/ImageLightBox";

const ProfileLibrary = ({ profile, isOwner }) => {
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'image', 'video'
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  // Lọc media theo type
  const filteredMedia =
    profile?.gallery?.filter((media) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "image") return media.type === "IMAGE";
      if (activeFilter === "video") return media.type === "VIDEO";
      return true;
    }) || [];

  const filterTabs = [
    { key: "all", label: "Tất cả", icon: LayoutGrid },
    { key: "image", label: "Ảnh", icon: Images },
    { key: "video", label: "Video", icon: Film },
  ];

  const handleMediaClick = (index) => {
    setLightboxIndex(index);
  };

  return (
    <div className="bg-surface-main rounded-2xl border border-border-main p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-text-main font-bold text-xl flex items-center gap-2">
          <Images className="text-primary" size={20} />
          {isOwner ? "Thư viện của bạn" : "Thư viện media"}
        </h3>

        {/* Filter Tabs */}
        <div className="flex bg-background-main rounded-lg p-1 gap-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeFilter === tab.key
                  ? "bg-primary text-[#231810]"
                  : "text-text-secondary hover:text-text-main hover:bg-surface-main"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredMedia.map((media, index) => (
            <div
              key={media.id || index}
              className="aspect-square rounded-xl overflow-hidden group relative cursor-pointer shadow-lg"
              onClick={() => handleMediaClick(index)}
            >
              {media.type === "VIDEO" ? (
                <>
                  <video
                    src={media.url}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                  {/* Video play indicator */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/50 backdrop-blur-sm p-3 rounded-full border border-white/20">
                      <Play className="text-white fill-white" size={20} />
                    </div>
                  </div>
                </>
              ) : (
                <img
                  src={media.thumbnailUrl || media.url}
                  alt={`Gallery ${index}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ZoomIn className="text-white" size={24} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 flex flex-col items-center justify-center">
          <Images className="text-text-secondary/20 mb-3" size={48} />
          <p className="text-text-secondary italic">
            {activeFilter === "all"
              ? isOwner
                ? "Bạn chưa tải lên media nào."
                : "Người dùng này chưa có media nào trong thư viện."
              : activeFilter === "image"
              ? "Không có ảnh nào."
              : "Không có video nào."}
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
