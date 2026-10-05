import React from "react";

/**
 * Modern Flat Badge Primitive
 * - Zero drop shadow, zero blur
 * - Rounded-full pill shape
 * - Variants: default, primary, success, warning, danger, info
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
    sm: "px-2 py-0.5 text-[11px] font-semibold gap-1",
    md: "px-2.5 py-1 text-xs font-bold gap-1.5",
  };

  const variantStyles = {
    default:
      "bg-surface-subtle text-text-secondary border border-border-main",
    primary:
      "bg-primary/10 text-primary border border-primary/20",
    success:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    warning:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    danger:
      "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
    info:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
  };

  const appliedSize = sizeStyles[size] || sizeStyles.md;
  const appliedVariant = variantStyles[variant] || variantStyles.default;

  return (
    <span
      className={`inline-flex items-center rounded-full select-none leading-none ${appliedSize} ${appliedVariant} ${className}`}
      {...props}
    >
      {Icon && <Icon className="size-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}

export default Badge;
