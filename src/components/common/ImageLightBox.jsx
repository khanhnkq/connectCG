// src/components/common/ImageLightbox.jsx
import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageLightbox({ mediaItems, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Khóa cuộn trang khi mở lightbox
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const currentItem = mediaItems[currentIndex];
  const isVideo = currentItem.type === 'VIDEO' || currentItem.url.match(/\.(mp4|webm|mov)$/i);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center backdrop-blur-sm"
      onClick={onClose} // Click ra ngoài thì đóng
    >
      {/* Nút Đóng */}
      <button 
        className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-all z-50"
        onClick={onClose}
      >
        <X size={32} />
      </button>

      {/* Nút Prev (chỉ hiện nếu > 1 ảnh) */}
      {mediaItems.length > 1 && (
        <button 
           className="absolute left-4 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-all z-50"
           onClick={handlePrev}
        >
          <ChevronLeft size={32} />
        </button>
      )}

      {/* Nội dung ảnh/video */}
      <div 
        className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()} // Chặn click đóng khi bấm vào ảnh
      >
        {isVideo ? (
          <video 
            src={currentItem.url} 
            controls 
            autoPlay 
            className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
          />
        ) : (
          <img 
            src={currentItem.url} 
            alt="Full view" 
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          />
        )}
        
        {/* Chỉ số index */}
        {mediaItems.length > 1 && (
           <div className="absolute -bottom-10 text-white font-medium bg-black/50 px-3 py-1 rounded-full text-sm">
             {currentIndex + 1} / {mediaItems.length}
           </div>
        )}
      </div>

      {/* Nút Next */}
      {mediaItems.length > 1 && (
        <button 
           className="absolute right-4 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-all z-50"
           onClick={handleNext}
        >
          <ChevronRight size={32} />
        </button>
      )}
    </div>
  );
}