import React from "react";

const ReportConfirmDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-background/90 backdrop-blur-md p-4 animate-in zoom-in-95 duration-200">
      <div className="bg-surface w-full max-w-sm rounded-2xl border border-border shadow-2xl p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4 text-2xl">
          !
        </div>
        <h3 className="text-xl font-black text-text-main mb-2">{title}</h3>
        <p className="text-text-muted text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-background hover:bg-border/50 text-text-main text-sm font-bold transition-all border border-border"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold shadow-lg shadow-red-500/20 transition-all"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportConfirmDialog;
