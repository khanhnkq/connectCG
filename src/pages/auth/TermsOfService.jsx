import React from "react";
import { ArrowLeft } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { Card } from "../../components/ui/card/Card";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background-main text-text-main py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex justify-between items-center pb-6 border-b border-border-main">
          <Link
            to="/registration/step-1"
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Quay lại</span>
          </Link>
          <div className="flex items-center gap-2 select-none">
            <img
              src="/logo.png"
              alt="Connect Logo"
              className="h-8 w-auto object-contain"
            />
            <span className="text-xl font-black text-text-main">
              Connect<span className="text-primary">.</span>
            </span>
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 text-text-main">
            Điều khoản sử dụng
          </h1>
          <p className="text-text-muted text-xs sm:text-sm">
            Cập nhật lần cuối: 29/01/2026 • Phiên bản 2.0
          </p>
        </div>

        {/* Content Card */}
        <Card className="p-6 sm:p-8 space-y-6">
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-primary">
              1. Chấp nhận điều khoản
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed text-justify">
              Bằng việc tạo tài khoản và sử dụng dịch vụ trên nền tảng Connect, bạn đồng ý
              tuân thủ toàn bộ các quy định và điều khoản được nêu tại tài liệu này. Nếu bạn
              không đồng ý với bất kỳ phần nào, vui lòng ngừng sử dụng dịch vụ của chúng tôi.
            </p>
          </section>

          <div className="border-t border-border-main" />

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-primary">
              2. Quyền và Trách nhiệm của Người dùng
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed text-justify">
              Bạn cam kết cung cấp thông tin trung thực, chính xác và chịu trách nhiệm bảo
              mật tuyệt đối thông tin đăng nhập của mình. Bạn không được phép sử dụng Connect
              cho bất kỳ hành vi lừa đảo, giả mạo danh tính, quấy rối hoặc mục đích vi phạm pháp luật.
            </p>
          </section>

          <div className="border-t border-border-main" />

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-primary">
              3. Quy tắc Văn hóa Cộng đồng
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed text-justify">
              Connect hướng đến việc xây dựng môi trường kết nối văn minh, an toàn và chân thực.
              Mọi hành vi phát tán nội dung đồi trụy, thù địch, spam hoặc xâm phạm bản quyền sẽ
              bị xử lý nghiêm khắc, bao gồm đình chỉ hoặc xóa tài khoản vĩnh viễn không cần báo trước.
            </p>
          </section>

          <div className="border-t border-border-main" />

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-primary">
              4. Quyền hạn của Connect
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed text-justify">
              Chúng tôi bảo lưu quyền cập nhật, điều chỉnh hoặc tạm ngưng các tính năng của nền
              tảng để nâng cao chất lượng và độ an toàn. Mọi thay đổi quan trọng trong điều khoản
              sẽ được thông báo công khai trên website hoặc qua email đăng ký của bạn.
            </p>
          </section>
        </Card>

        {/* Footer */}
        <footer className="pt-6 border-t border-border-main text-center text-text-muted text-xs">
          <p>© 2026 Connect Social Team. Bảo lưu mọi quyền.</p>
        </footer>
      </div>
    </div>
  );
}
