import React from "react";

/**
 * Modern Flat 2026 Page Loading Fallback
 * Lightweight, zero-dependency suspense placeholder.
 * Strictly 0px blur, 0px drop shadow, 1px crisp borders.
 *
 * @param {Object} props
 * @param {string} [props.message="Đang tải dữ liệu..."] - Loading description
 * @param {boolean} [props.fullScreen=true] - Whether to occupy full viewport
 */
export default function PageLoadingFallback({
  message = "Đang tải dữ liệu...",
  fullScreen = true,
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`grid place-items-center bg-background-main text-text-secondary select-none ${
        fullScreen ? "min-h-screen w-full" : "h-64 w-full"
      }`}
    >
      <div className="flex flex-col items-center gap-3 p-6 rounded-2xl border-0 bg-surface-main shadow-sm">
        {/* Crisp Flat Spinner */}
        <div
          className="size-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin"
          aria-hidden="true"
        />
        <p className="text-xs font-semibold tracking-wide text-text-secondary">
          {message}
        </p>
      </div>
    </div>
  );
}
