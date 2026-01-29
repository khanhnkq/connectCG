import { Trash2, AlertTriangle } from "lucide-react";
import React from "react";

export default function DeleteGroupModal({
  isOpen,
  onClose,
  onConfirm,
  groupName,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-main border border-red-500/20 rounded-[2.5rem] p-10 max-w-md w-full text-center space-y-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="size-24 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto transform hover:scale-110 transition-transform">
          <Trash2 size={48} />
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-black text-text-main tracking-tight">
            Xác nhận xóa nhóm
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed px-4">
            Hành động này{" "}
            <span className="text-red-400 font-bold uppercase">
              không thể hoàn tác
            </span>
            . Bạn có thực sự muốn xóa nhóm{" "}
            <span className="text-text-main font-black italic">
              "{groupName}"
            </span>{" "}
            vĩnh viễn không?
          </p>
        </div>

        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 mx-2">
          <p className="text-[10px] text-red-400/80 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            <AlertTriangle size={14} />
            Tất cả dữ liệu, bài viết và thành viên sẽ bị mất
          </p>
        </div>

        <div className="flex gap-4 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-background-main hover:bg-surface-main text-text-main font-bold rounded-2xl transition-all text-xs uppercase tracking-[0.2em] active:scale-95"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-text-main font-black rounded-2xl transition-all shadow-xl shadow-red-500/20 text-xs uppercase tracking-[0.2em] active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Xác nhận xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
}
