import React from "react";

/**
 * Modern Flat Badge Primitive (Harmonized Gray / Orange Theme)
 * - Zero drop shadow, zero blur
 * - Balanced rounded-md / rounded-lg
 * - Unified neutral gray / warm orange palette (Chống rối mắt, loại bỏ màu cầu vồng)
 */
export function Badge({
  children,
  variant = "default",
  size = "md",
  icon: Icon,
  className = "",
  ...props
}) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] font-semibold gap-1 rounded-md",
    md: "px-2.5 py-1 text-xs font-semibold gap-1.5 rounded-lg",
  };

  // Hệ màu quy chuẩn theo tôn xám / cam hài hòa, thuận mắt
  const variantStyles = {
    default:
      "bg-surface-subtle text-text-secondary border border-border-main",
    primary:
      "bg-primary/10 text-primary border border-primary/20 font-bold",
    success:
      "bg-surface-subtle text-text-main border border-border-main",
    warning:
      "bg-primary/10 text-primary border border-primary/20",
    danger:
      "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
    info:
      "bg-surface-subtle text-text-main border border-border-main",
  };

  const appliedSize = sizeStyles[size] || sizeStyles.md;
  const appliedVariant = variantStyles[variant] || variantStyles.default;

  return (
    <span
      className={`inline-flex items-center select-none leading-none ${appliedSize} ${appliedVariant} ${className}`}
      {...props}
    >
      {Icon && <Icon className="size-3.5 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}

export default Badge;
