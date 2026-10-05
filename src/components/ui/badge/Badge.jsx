import React from "react";

/**
 * Modern Flat Badge Primitive (Border-free & Full-opacity Solid Theme)
 * - KHÔNG viền (border-free)
 * - Nền 100% đậm nguyên bản, KHÔNG giảm opacity (no /10, no /20)
 * - Nền xám (default) và nền cam (primary) đậm nét, tương phản cao, thuận mắt
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
    sm: "px-2.5 py-0.5 text-[11px] font-semibold gap-1 rounded-md",
    md: "px-3 py-1 text-xs font-semibold gap-1.5 rounded-lg",
  };

  // Hệ màu 100% Solid, không viền, không giảm opacity
  const variantStyles = {
    default:
      "bg-surface-subtle text-text-main",
    primary:
      "bg-primary text-white font-bold",
    success:
      "bg-surface-subtle text-text-main",
    warning:
      "bg-primary text-white font-bold",
    danger:
      "bg-red-600 text-white font-bold",
    info:
      "bg-surface-subtle text-text-main",
  };

  const appliedSize = sizeStyles[size] || sizeStyles.md;
  const appliedVariant = variantStyles[variant] || variantStyles.default;

  return (
    <span
      className={`inline-flex items-center select-none leading-none border-0 ${appliedSize} ${appliedVariant} ${className}`}
      {...props}
    >
      {Icon && <Icon className="size-3.5 shrink-0" />}
      {children}
    </span>
  );
}

export default Badge;
