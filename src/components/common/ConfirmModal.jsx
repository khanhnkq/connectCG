import { AlertCircle, AlertTriangle, HelpCircle } from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";

const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onClose,
  type = "danger",
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  const themes = {
    danger: {
      icon: <AlertCircle size={40} />,
      iconBg: "bg-red-500/10 text-red-500",
      button: "bg-red-500 shadow-red-500/20 hover:bg-red-600",
    },
    warning: {
      icon: <AlertTriangle size={40} />,
      iconBg: "bg-orange-500/10 text-orange-400",
      button: "bg-orange-500 shadow-orange-500/20 hover:bg-orange-600",
    },
    info: {
      icon: <HelpCircle size={40} />,
      iconBg: "bg-primary/10 text-primary",
      button: "bg-primary shadow-primary/20 hover:brightness-110",
    },
  };

  const theme = themes[type] || themes.danger;

  // Use createPortal to render modal outside of parent containers (e.g. Dropdowns with transforms)
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-surface-main w-full max-w-md rounded-3xl border border-border-main shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 text-center space-y-6">
          <div
            className={`size-20 rounded-full mx-auto flex items-center justify-center ${theme.iconBg}`}
          >
            {theme.icon}
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-black text-text-main">{title}</h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              {message}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              onClick={onClose}
              className="py-3.5 rounded-xl border border-border-main text-text-secondary font-bold hover:bg-background-main hover:text-text-main transition-all"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`py-3.5 rounded-xl text-white font-black shadow-lg transition-all ${theme.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmModal;
