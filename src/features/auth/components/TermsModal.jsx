import React from "react";
import { Modal } from "../../../components/ui/modal/Modal";
import { Button } from "../../../components/ui/button/Button";

/**
 * Hộp thoại Điều khoản dịch vụ
 * - Sử dụng Modal chuẩn Design System (PR #16)
 * - 0px blur, 0px shadow, viền 1px
 * - Nút đóng góc phải icon-only, footer text-only
 */
export default function TermsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <Modal.Header onClose={onClose} className="p-6 border-b border-border-main">
        <div>
          <h2 className="text-xl font-bold text-text-main">
            Điều khoản sử dụng
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Cập nhật lần cuối: 29/01/2026
          </p>
        </div>
      </Modal.Header>

      <Modal.Body className="p-6 max-h-[60vh] overflow-y-auto space-y-6 text-text-main">
        <section className="space-y-1.5">
          <h3 className="text-sm font-bold text-primary">
            1. Chấp nhận điều khoản
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed text-justify">
            Bằng việc tạo tài khoản trên Connect, bạn đồng ý tuân thủ các điều
            khoản và điều kiện được nêu tại đây. Nếu bạn không đồng ý với bất
            kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ
            của chúng tôi.
          </p>
        </section>

        <section className="space-y-1.5">
          <h3 className="text-sm font-bold text-primary">
            2. Quyền và Trách nhiệm của Người dùng
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed text-justify">
            Bạn cam kết cung cấp thông tin chính xác và chịu trách nhiệm bảo
            mật thông tin đăng nhập của mình. Bạn không được sử dụng Connect
            cho bất kỳ mục đích phi pháp hoặc quấy rối người khác.
          </p>
        </section>

        <section className="space-y-1.5">
          <h3 className="text-sm font-bold text-primary">
            3. Quy tắc Cộng đồng
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed text-justify">
            Chúng tôi khuyến khích sự kết nối chân thành. Mọi hành vi chia sẻ
            nội dung độc hại, lừa đảo, hoặc vi phạm bản quyền sẽ bị xử lý
            nghiêm khắc, bao gồm cả việc khóa tài khoản vĩnh viễn.
          </p>
        </section>

        <section className="space-y-1.5">
          <h3 className="text-sm font-bold text-primary">
            4. Quyền của Connect
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed text-justify">
            Chúng tôi có quyền thay đổi hoặc ngừng cung cấp dịch vụ bất cứ lúc
            nào. Các điều khoản này cũng có thể được cập nhật định kỳ để phù
            hợp với sự phát triển của nền tảng.
          </p>
        </section>
      </Modal.Body>

      <Modal.Footer className="p-4 bg-surface-subtle border-t border-border-main flex justify-end">
        <Button variant="primary" size="md" onClick={onClose}>
          Đã hiểu
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
