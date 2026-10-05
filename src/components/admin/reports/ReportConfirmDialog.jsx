import React from "react";
import ConfirmDialog from "../../ui/modal/ConfirmDialog";

/**
 * Modern Flat Report Confirm Dialog
 * Delegates to standard ConfirmDialog primitive
 */
const ReportConfirmDialog = ({
  isOpen,
  title = "Xác nhận hành động",
  message = "Bạn có chắc chắn muốn thực hiện thao tác này?",
  onConfirm,
  onClose,
  type = "danger",
  confirmText = "Xác nhận",
  cancelText = "Hủy bỏ",
}) => {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      message={message}
      type={type}
      confirmText={confirmText}
      cancelText={cancelText}
    />
  );
};

export default ReportConfirmDialog;
