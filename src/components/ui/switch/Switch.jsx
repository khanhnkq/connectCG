import React from "react";

/**
 * Modern Flat Switch Primitive
 * - Zero drop shadow, zero blur
 * - 1px crisp border
 * - Accessible switch role with aria-checked
 * - Fully controlled or uncontrolled
 */
export function Switch({
  checked = false,
  onChange,
  disabled = false,
  size = "md",
  className = "",
  "aria-label": ariaLabel,
  ...props
}) {
  const isSm = size === "sm";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => {
        if (!disabled && onChange) {
          onChange(!checked);
        }
      }}
      className={`
        relative inline-flex shrink-0 items-center rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20
        ${isSm ? "h-5 w-9 p-0.5" : "h-6 w-11 p-0.5"}
        ${
          disabled
            ? "cursor-not-allowed opacity-50 bg-surface-subtle"
            : checked
            ? "cursor-pointer bg-primary"
            : "cursor-pointer bg-surface-subtle hover:bg-surface-subtle/80"
        }
        ${className}
      `}
      {...props}
    >
      <span
        className={`
          pointer-events-none inline-block rounded-full bg-white transition-transform duration-150
          ${isSm ? "size-3.5" : "size-4.5"}
          ${
            checked
              ? isSm
                ? "translate-x-4"
                : "translate-x-5"
              : "translate-x-0"
          }
        `}
      />
    </button>
  );
}

export default Switch;
