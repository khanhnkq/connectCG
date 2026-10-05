import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { IconButton } from "../button/Button";

/**
 * Modern Flat Modal Primitive
 * - Zero drop shadow, zero blur
 * - Rounded-2xl (16px)
 * - Portal to document.body
 * - Escape key listener & Backdrop click
 * - Compound components: Modal, Modal.Header, Modal.Body, Modal.Footer
 */
export function Modal({
  isOpen,
  onClose,
  children,
  size = "md",
  closeOnOverlayClick = true,
  className = "",
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Prevent background scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    full: "max-w-4xl",
  };

  const appliedSize = sizeStyles[size] || sizeStyles.md;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-150"
      onClick={(e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        className={`w-full ${appliedSize} bg-surface-main border border-border-main rounded-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col ${className}`}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

Modal.Header = function ModalHeader({
  title,
  description,
  onClose,
  children,
  className = "",
}) {
  return (
    <div
      className={`px-6 py-4 border-b border-border-main flex items-center justify-between gap-4 shrink-0 bg-surface-main ${className}`}
    >
      <div>
        {title && (
          <h3 className="text-lg font-bold text-text-main leading-snug">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-xs text-text-muted mt-0.5">{description}</p>
        )}
        {children}
      </div>
      {onClose && (
        <IconButton
          icon={X}
          size="sm"
          variant="ghost"
          onClick={onClose}
          aria-label="Đóng"
        />
      )}
    </div>
  );
};

Modal.Body = function ModalBody({ children, className = "" }) {
  return (
    <div className={`p-6 overflow-y-auto max-h-[calc(85vh-120px)] ${className}`}>
      {children}
    </div>
  );
};

Modal.Footer = function ModalFooter({ children, className = "" }) {
  return (
    <div
      className={`px-6 py-3.5 border-t border-border-main bg-surface-subtle/50 flex items-center justify-end gap-3 shrink-0 ${className}`}
    >
      {children}
    </div>
  );
};

export default Modal;
