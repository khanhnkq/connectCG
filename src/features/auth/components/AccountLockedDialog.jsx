import React from "react";
import { Lock } from "@phosphor-icons/react";
import { Modal } from "../../../components/ui/modal/Modal";
import { Button } from "../../../components/ui/button/Button";

/**
 * Hộp thoại thông báo tài khoản bị khóa
 * - Dùng Modal compound chuẩn Modern Flat
 * - 0px blur, 0px drop shadow, viền 1px
 * - Nút bấm Text-only
 */
export default function AccountLockedDialog({ isOpen, message, onClose }) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <Modal.Body className="p-6 text-center space-y-4">
        <div className="size-14 rounded-2xl bg-danger/10 border-0 flex items-center justify-center mx-auto text-danger">
          <Lock size={28} />
        </div>

        <div>
          <h3 className="text-lg font-bold text-text-main mb-1.5">
            Tài khoản bị khóa
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            {message ||
              "Tài khoản của bạn đã bị khóa hoặc tạm ngưng do vi phạm tiêu chuẩn cộng đồng."}
          </p>
          <p className="text-text-muted text-xs mt-2">
            Vui lòng liên hệ bộ phận hỗ trợ hoặc quản trị viên để được hỗ trợ.
          </p>
        </div>
      </Modal.Body>

      <Modal.Footer className="p-4 bg-surface-subtle border-0 flex justify-end">
        <Button
          variant="danger"
          size="md"
          className="w-full"
          onClick={onClose}
        >
          Đã hiểu
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
