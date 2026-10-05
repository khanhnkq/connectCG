import React, { useState } from "react";

/**
 * Extract 1 or 2 letter initials from full name
 * e.g. "Quốc Khánh" -> "QK", "Admin" -> "A"
 */
function getInitials(name) {
  if (!name || typeof name !== "string") return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Harmonized gray and orange color palette for initials background
 */
function getInitialsBg(name) {
  if (!name) return "bg-surface-subtle text-text-secondary border-border-main";
  const colors = [
    "bg-surface-subtle text-text-main border-border-main",
    "bg-primary/10 text-primary border-primary/20",
    "bg-surface-subtle text-text-secondary border-border-main",
    "bg-primary/10 text-primary border-primary/20",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Modern Flat Avatar Primitive
 * - Zero drop shadow, zero blur
 * - Fallback to initials with auto-contrasting background
 * - Online / Offline status badge
 * - Sizes: xs (24px), sm (32px), md (40px), lg (48px), xl (64px), 2xl (96px)
 */
export function Avatar({
  src,
  alt = "",
  name = "",
  size = "md",
  status,
  className = "",
  onClick,
}) {
  const [hasError, setHasError] = useState(false);

  const sizeStyles = {
    xs: "size-6 text-[10px]",
    sm: "size-8 text-xs",
    md: "size-10 text-sm",
    lg: "size-12 text-base",
    xl: "size-16 text-lg",
    "2xl": "size-24 text-2xl font-black",
  };

  const statusSizeStyles = {
    xs: "size-2 -bottom-0.5 -right-0.5 border",
    sm: "size-2.5 bottom-0 right-0 border",
    md: "size-3 bottom-0 right-0 border-2",
    lg: "size-3.5 bottom-0.5 right-0.5 border-2",
    xl: "size-4 bottom-1 right-1 border-2",
    "2xl": "size-5 bottom-1.5 right-1.5 border-2",
  };

  const statusColorStyles = {
    online: "bg-emerald-500",
    offline: "bg-zinc-400",
    busy: "bg-red-500",
  };

  const appliedSize = sizeStyles[size] || sizeStyles.md;
  const appliedStatusSize = statusSizeStyles[size] || statusSizeStyles.md;

  const showImage = src && !hasError;
  const initials = getInitials(name || alt);
  const initialsStyle = getInitialsBg(name || alt);

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex shrink-0 select-none ${
        onClick ? "cursor-pointer hover:opacity-90 transition-opacity" : ""
      } ${className}`}>
      <div
        className={`${appliedSize} rounded-full overflow-hidden border border-border-main flex items-center justify-center font-bold ${
          showImage ? "bg-surface-subtle" : initialsStyle
        }`}>
        {showImage ? (
          <img
            src={src}
            alt={alt || name || "Avatar"}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {status && statusColorStyles[status] && (
        <span
          className={`absolute rounded-full border-surface-main ${appliedStatusSize} ${statusColorStyles[status]}`}
          aria-label={`Trạng thái: ${status}`}
        />
      )}
    </div>
  );
}

export function AvatarGroup({ children, max = 4, className = "" }) {
  const childrenArray = React.Children.toArray(children);
  const visibleAvatars = childrenArray.slice(0, max);
  const remainingCount = childrenArray.length - max;

  return (
    <div className={`inline-flex items-center -space-x-2 ${className}`}>
      {visibleAvatars.map((avatar, idx) => (
        <div key={idx} className="ring-2 ring-surface-main rounded-full">
          {avatar}
        </div>
      ))}
      {remainingCount > 0 && (
        <div className="size-10 rounded-full bg-surface-subtle border border-border-main ring-2 ring-surface-main flex items-center justify-center text-xs font-bold text-text-secondary select-none">
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

export default Avatar;
