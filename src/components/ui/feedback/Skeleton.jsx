import React from "react";
import Button from "../button/Button";

/**
 * Modern Flat Skeleton Primitive
 * Flat pulsing placeholder for loading states
 */
export function Skeleton({ className = "", rounded = "xl", ...props }) {
  const roundedStyles = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  };

  const appliedRounded = roundedStyles[rounded] || roundedStyles.xl;

  return (
    <div
      className={`animate-pulse bg-surface-subtle border border-border-main/50 ${appliedRounded} ${className}`}
      {...props}
    />
  );
}

/**
 * Modern Flat EmptyState Primitive
 * Zero shadow, zero blur, friendly guidance
 */
export function EmptyState({
  icon: Icon,
  title = "Chưa có dữ liệu",
  description = "Hiện tại chưa có nội dung nào để hiển thị.",
  actionText,
  onAction,
  action,
  className = "",
}) {
  return (
    <div
      className={`w-full py-12 px-6 bg-surface-main border border-border-main rounded-2xl text-center flex flex-col items-center justify-center gap-4 ${className}`}
    >
      {Icon && (
        <div className="size-14 rounded-2xl bg-surface-subtle border border-border-main flex items-center justify-center text-text-muted">
          <Icon className="size-7" />
        </div>
      )}
      <div className="max-w-xs space-y-1">
        <h4 className="text-base font-bold text-text-main">{title}</h4>
        {description && (
          <p className="text-xs text-text-muted leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action ? (
        action
      ) : actionText && onAction ? (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      ) : null}
    </div>
  );
}

export default Skeleton;
