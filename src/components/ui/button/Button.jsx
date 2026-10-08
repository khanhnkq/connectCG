import React, { forwardRef } from "react";
import { CircleNotch } from "@phosphor-icons/react";

/**
 * Modern Flat Button Primitive
 * SYSTEM RULE:
 * - Có icon thì KHÔNG có chữ (Icon-only Button).
 * - Có chữ thì KHÔNG có icon (Text-only Button).
 * 
 * - Zero drop shadow, zero blur
 * - Rounded-xl (12px) cho controls
 * - 1px crisp border
 */
export const Button = forwardRef(
  (
    {
      children,
      icon: Icon,
      variant = "primary",
      size = "md",
      rounded = "default",
      isLoading = false,
      disabled = false,
      loadingText = "Đang xử lý...",
      className = "",
      type = "button",
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    // Tự động nhận diện nút là Icon-only hay Text-only
    const isIconButton = Boolean(Icon) || size === "icon" || size === "iconSm";
    const isFullRounded = rounded === "full" || className.includes("rounded-full");

    const baseStyles =
      "inline-flex items-center justify-center font-semibold transition-colors duration-150 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shrink-0";

    // Kích thước chuẩn cho nút chỉ có chữ (Text-only)
    const textSizeStyles = {
      sm: `h-8 px-3 text-xs ${isFullRounded ? "rounded-full" : "rounded-lg"}`,
      md: `h-10 px-4 text-sm ${isFullRounded ? "rounded-full" : "rounded-xl"}`,
      lg: `h-12 px-6 text-base ${isFullRounded ? "rounded-full" : "rounded-xl"}`,
    };

    // Kích thước chuẩn cho nút chỉ có icon (Icon-only: hình vuông bo góc hoặc hình tròn)
    const iconSizeStyles = {
      sm: `size-8 p-0 ${isFullRounded ? "rounded-full" : "rounded-lg"}`,
      iconSm: `size-8 p-0 ${isFullRounded ? "rounded-full" : "rounded-lg"}`,
      md: `size-10 p-0 ${isFullRounded ? "rounded-full" : "rounded-xl"}`,
      icon: `size-10 p-0 ${isFullRounded ? "rounded-full" : "rounded-xl"}`,
      lg: `size-12 p-0 ${isFullRounded ? "rounded-full" : "rounded-xl"}`,
    };

    const iconGlyphSizes = {
      sm: "size-4",
      iconSm: "size-4",
      md: "size-5",
      icon: "size-5",
      lg: "size-6",
    };

    const iconPixelSizes = {
      sm: 16,
      iconSm: 16,
      md: 20,
      icon: 20,
      lg: 24,
    };

    const variantStyles = {
      primary:
        "bg-primary text-white hover:bg-primary-hover active:bg-primary-active border-0",
      secondary:
        "bg-surface-subtle text-text-main hover:bg-surface-subtle/80 active:bg-surface-subtle/60 border-0",
      outline:
        "bg-surface-subtle/60 text-text-main hover:bg-surface-subtle active:bg-surface-subtle/80 border-0",
      ghost:
        "bg-transparent text-text-secondary hover:text-text-main hover:bg-surface-subtle active:bg-surface-subtle/60 border-0",
      danger:
        "bg-danger text-white hover:bg-red-600 active:bg-red-700 border-0",
    };

    const appliedVariant = variantStyles[variant] || variantStyles.primary;
    const appliedSize = isIconButton
      ? iconSizeStyles[size] || iconSizeStyles.md
      : textSizeStyles[size] || textSizeStyles.md;

    // RULE 1: Nút có icon thì KHÔNG có chữ
    if (isIconButton) {
      const glyphSize = iconGlyphSizes[size] || "size-5";
      const iconToRender = Icon || children;

      return (
        <button
          ref={ref}
          type={type}
          disabled={disabled || isLoading}
          aria-label={ariaLabel || (typeof children === "string" ? children : "Nút")}
          className={`${baseStyles} ${appliedSize} ${appliedVariant} ${className}`}
          {...props}
        >
          {isLoading ? (
            <CircleNotch className={`animate-spin ${glyphSize}`} />
          ) : React.isValidElement(iconToRender) ? (
            iconToRender
          ) : iconToRender && (typeof iconToRender === "function" || typeof iconToRender === "object") ? (
            React.createElement(iconToRender, {
              className: glyphSize,
              size: iconPixelSizes[size] || 20,
            })
          ) : null}
        </button>
      );
    }

    // RULE 2: Nút có chữ thì KHÔNG có icon
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-label={ariaLabel}
        className={`${baseStyles} ${appliedSize} ${appliedVariant} ${className}`}
        {...props}
      >
        <span>{isLoading ? loadingText : children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";

/**
 * Dedicated IconButton Primitive (Chỉ render Icon, không chữ)
 */
export const IconButton = forwardRef(({ icon, ...props }, ref) => {
  return <Button ref={ref} icon={icon} {...props} />;
});

IconButton.displayName = "IconButton";

export default Button;
