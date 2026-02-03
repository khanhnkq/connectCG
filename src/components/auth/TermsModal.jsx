import { X } from "lucide-react";

const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-main border border-border-main w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl scale-100 animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-main">
          <div>
            <h2 className="text-xl font-bold text-text-main">
              Điều khoản sử dụng
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Cập nhật lần cuối: 29/01/2026
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-border-main rounded-full text-text-secondary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 text-text-main">
          <section className="space-y-2">
            <h3 className="text-lg font-semibold text-primary">
              1. Chấp nhận điều khoản
            </h3>
            <p className="text-text-secondary leading-relaxed text-sm">
              Bằng việc tạo tài khoản trên Connect, bạn đồng ý tuân thủ các điều
              khoản và điều kiện được nêu tại đây. Nếu bạn không đồng ý với bất
              kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ
              của chúng tôi.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-semibold text-primary">
              2. Quyền và Trách nhiệm của Người dùng
            </h3>
            <p className="text-text-secondary leading-relaxed text-sm">
              Bạn cam kết cung cấp thông tin chính xác và chịu trách nhiệm bảo
              mật thông tin đăng nhập của mình. Bạn không được sử dụng Connect
              cho bất kỳ mục đích phi pháp hoặc quấy rối người khác.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-semibold text-primary">
              3. Quy tắc Cộng đồng
            </h3>
            <p className="text-text-secondary leading-relaxed text-sm">
              Chúng tôi khuyến khích sự kết nối chân thành. Mọi hành vi chia sẻ
              nội dung độc hại, lừa đảo, hoặc vi phạm bản quyền sẽ bị xử lý
              nghiêm khắc, bao gồm cả việc khóa tài khoản vĩnh viễn.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-semibold text-primary">
              4. Quyền của Connect
            </h3>
            <p className="text-text-secondary leading-relaxed text-sm">
              Chúng tôi có quyền thay đổi hoặc ngừng cung cấp dịch vụ bất cứ lúc
              nào. Các điều khoản này cũng có thể được cập nhật định kỳ để phù
              hợp với sự phát triển của nền tảng.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border-main flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-colors"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
