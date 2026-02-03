import React, { useRef, useEffect, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";

/**
 * A video component that autoplays when it enters the viewport and pauses when it leaves.
 * Includes manual play/pause, mute controls, and expand option.
 */
const AutoplayVideo = ({
  src,
  className,
  onClick,
  manuallyPaused,
  setManuallyPaused,
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showStatusIndicator, setShowStatusIndicator] = useState(false);

  useEffect(() => {
    const videoNode = videoRef.current;
    if (!videoNode) return;

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.6,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !manuallyPaused) {
          videoNode.play().catch((error) => {
            console.warn("Autoplay failed:", error);
          });
          setIsPlaying(true);
        } else {
          videoNode.pause();
          setIsPlaying(false);
        }
      });
    }, options);

    observer.observe(videoNode);

    // Sync state if manuallyPaused changes while in view
    if (manuallyPaused && isPlaying) {
      videoNode.pause();
      setIsPlaying(false);
    }

    return () => {
      observer.unobserve(videoNode);
    };
  }, [src, manuallyPaused, isPlaying]);

  // Handle manual play/pause toggle
  const togglePlay = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      setManuallyPaused(true);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
      setManuallyPaused(false);
    }

    // Show brief feedback in the center
    setShowStatusIndicator(true);
    setTimeout(() => setShowStatusIndicator(false), 1000);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleContainerClick = (e) => {
    // Primary action: Open LightBox
    if (onClick) onClick();
  };

  return (
    <div
      className={`relative w-full h-full group bg-black flex items-center justify-center cursor-pointer ${className}`}
      onClick={handleContainerClick}
    >
      <video
        ref={videoRef}
        src={src}
        className="max-w-full max-h-full object-contain"
        muted={isMuted}
        loop
        playsInline
      />

      {/* Dynamic Status Indicator Overlay (Centralized Feedback) */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 transform
          ${
            showStatusIndicator
              ? "opacity-100 scale-100"
              : "opacity-0 scale-150"
          }`}
      >
        <div className="bg-black/40 backdrop-blur-md p-5 rounded-full border border-white/20 shadow-2xl">
          {isPlaying ? (
            <Pause size={32} className="text-white fill-white" />
          ) : (
            <Play size={32} className="text-white fill-white" />
          )}
        </div>
      </div>

      {/* Persistent Button Overlay (Always on hover or when paused) */}
      <div
        className={`absolute inset-0 bg-black/10 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
          !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Action Buttons - higher z-index to stay above everything */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2 z-30">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="p-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-black/70 transition-all flex items-center justify-center"
          title={isPlaying ? "Dừng" : "Phát"}
        >
          {isPlaying ? (
            <Pause size={16} fill="currentColor" />
          ) : (
            <Play size={16} fill="currentColor" />
          )}
        </button>

        {/* Mute Toggle Button */}
        <button
          onClick={toggleMute}
          className="p-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-black/70 transition-all flex items-center justify-center"
          title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {/* Expand (Full View) Button */}
        <button
          onClick={handleContainerClick}
          className="p-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-black/70 transition-all flex items-center justify-center"
          title="Xem toàn màn hình"
        >
          <Maximize2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default AutoplayVideo;
