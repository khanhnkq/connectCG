import React from "react";
import { ConfirmDialog } from "../../../components/ui/modal/ConfirmDialog";

/**
 * Modern Flat DeleteGroupModal Component
 * Wraps ConfirmDialog with standard deletion warning.
 */
export function DeleteGroupModal({
  isOpen,
  onClose,
  onConfirm,
  groupName,
  isLoading = false,
}) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      type="danger"
      title="Xác nhận xóa nhóm"
      message={`Hành động này không thể hoàn tác. Bạn có thực sự muốn xóa nhóm "${groupName}" vĩnh viễn không?`}
      confirmText="Xác nhận xóa"
      cancelText="Hủy bỏ"
      isLoading={isLoading}
    >
      <div className="p-3 rounded-xl bg-surface-subtle border border-border-main text-xs text-danger font-semibold">
        Tất cả dữ liệu, bài viết và danh sách thành viên trong nhóm sẽ bị xóa vĩnh viễn.
      </div>
    </ConfirmDialog>
  );
}

export default DeleteGroupModal;
