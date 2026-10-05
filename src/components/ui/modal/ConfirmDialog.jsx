import React from "react";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import Modal from "./Modal";
import Button from "../button/Button";

/**
 * Modern Flat ConfirmDialog
 * Replaces old ConfirmModal with standardized Flat design
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận hành động",
  message = "Bạn có chắc chắn muốn thực hiện thao tác này?",
  type = "danger",
  confirmText = "Xác nhận",
  cancelText = "Hủy bỏ",
  isLoading = false,
  children,
}) {
  const themes = {
    danger: {
      icon: <AlertCircle className="size-6 text-danger" />,
      iconBg: "bg-red-500/10 border-red-500/20",
      buttonVariant: "danger",
    },
    warning: {
      icon: <AlertTriangle className="size-6 text-warning" />,
      iconBg: "bg-amber-500/10 border-amber-500/20",
      buttonVariant: "primary",
    },
    info: {
      icon: <Info className="size-6 text-info" />,
      iconBg: "bg-blue-500/10 border-blue-500/20",
      buttonVariant: "primary",
    },
  };

  const theme = themes[type] || themes.danger;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-6 text-center space-y-4">
        <div
          className={`size-14 rounded-2xl mx-auto flex items-center justify-center border ${theme.iconBg}`}
        >
          {theme.icon}
        </div>
        <div>
          <h4 className="text-lg font-bold text-text-main">{title}</h4>
          <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
            {message}
          </p>
        </div>

        {children}

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="w-full"
          >
            {cancelText}
          </Button>
          <Button
            variant={theme.buttonVariant}
            onClick={onConfirm}
            isLoading={isLoading}
            className="w-full"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
