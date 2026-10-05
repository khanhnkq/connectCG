import React, { useState } from "react";
import { Modal } from "../components/ui/modal/Modal";
import { ConfirmDialog } from "../components/ui/modal/ConfirmDialog";
import { Button } from "../components/ui/button/Button";
import { Input } from "../components/ui/input/Input";

export default {
  title: "Design System/Modal & Dialog",
  component: Modal,
  tags: ["autodocs"],
};

export const StandardModal = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Mở Modal Chỉnh sửa</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="md">
          <Modal.Header
            title="Chỉnh sửa thông tin cá nhân"
            description="Cập nhật tiểu sử và thông tin công khai của bạn"
            onClose={() => setIsOpen(false)}
          />
          <Modal.Body className="space-y-4">
            <Input label="Họ và tên" defaultValue="Nguyễn Kim Quốc Khánh" />
            <Input label="Nghề nghiệp" defaultValue="Kỹ sư phần mềm" />
            <Input label="Tỉnh / Thành phố" defaultValue="Đà Nẵng" />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Hủy bỏ
            </Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Lưu thay đổi
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  },
};

export const DangerConfirm = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <Button variant="danger" onClick={() => setIsOpen(true)}>
          Xóa bài viết
        </Button>
        <ConfirmDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => {
            alert("Đã xóa bài viết thành công!");
            setIsOpen(false);
          }}
          type="danger"
          title="Xóa bài viết này?"
          message="Bài viết này sẽ bị xóa vĩnh viễn khỏi trang cá nhân và bảng tin cộng đồng. Hành động này không thể hoàn tác."
          confirmText="Xóa vĩnh viễn"
          cancelText="Hủy"
        />
      </div>
    );
  },
};
