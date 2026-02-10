import React, { useEffect } from 'react';
import { X, Download } from 'lucide-react';

const ImageLightbox = ({ media, imageUrl, onClose }) => {
    // Support both media object {url, type} and legacy imageUrl prop
    const url = media?.url || imageUrl;
    const type = media?.type || (url?.match(/\.(mp4|webm|ogg|mov)$/i) ? 'video' : 'image');

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!url) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center animate-in fade-in duration-200">
            {/* Toolbar */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
                <div className="text-white/80 text-sm font-medium px-2">
                    {type === 'video' ? 'Video' : 'Hình ảnh'}
                </div>
                <div className="flex items-center gap-4">
                    <a
                        href={url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        title="Tải xuống"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Download size={24} />
                    </a>
                    <button
                        onClick={onClose}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={28} />
                    </button>
                </div>
            </div>

            {/* Content Container */}
            <div
                className="w-full h-full p-4 md:p-10 flex items-center justify-center"
                onClick={onClose}
            >
                {type === 'video' ? (
                    <video
                        src={url}
                        controls
                        autoPlay
                        className="max-w-full max-h-full rounded-lg shadow-2xl animate-in zoom-in-95 duration-200 outline-none"
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <img
                        src={url}
                        alt="Full view"
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    />
                )}
            </div>
        </div>
    );
};

export default ImageLightbox;
