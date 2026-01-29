import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background-dark text-white p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-10">
          <Link
            to="/registration/step-1"
            className="text-primary hover:underline font-medium flex items-center gap-2"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Connect Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold">Connect</span>
          </div>
        </div>

        <h1 className="text-4xl font-bold border-b border-border-dark pb-4">
          Điều khoản sử dụng
        </h1>
        <p className="text-text-secondary italic">
          Cập nhật lần cuối: 29/01/2026
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary">
            1. Chấp nhận điều khoản
          </h2>
          <p className="text-text-secondary leading-relaxed text-justify">
            Bằng việc tạo tài khoản trên Connect, bạn đồng ý tuân thủ các điều
            khoản và điều kiện được nêu tại đây. Nếu bạn không đồng ý với bất kỳ
            phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của
            chúng tôi.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary">
            2. Quyền và Trách nhiệm của Người dùng
          </h2>
          <p className="text-text-secondary leading-relaxed text-justify">
            Bạn cam kết cung cấp thông tin chính xác và chịu trách nhiệm bảo mật
            thông tin đăng nhập của mình. Bạn không được sử dụng Connect cho bất
            kỳ mục đích phi pháp hoặc quấy rối người khác.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary">
            3. Quy tắc Cộng đồng
          </h2>
          <p className="text-text-secondary leading-relaxed text-justify">
            Chúng tôi khuyến khích sự kết nối chân thành. Mọi hành vi chia sẻ
            nội dung độc hại, lừa đảo, hoặc vi phạm bản quyền sẽ bị xử lý nghiêm
            khắc, bao gồm cả việc khóa tài khoản vĩnh viễn.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary">
            4. Quyền của Connect
          </h2>
          <p className="text-text-secondary leading-relaxed text-justify">
            Chúng tôi có quyền thay đổi hoặc ngừng cung cấp dịch vụ bất cứ lúc
            nào. Các điều khoản này cũng có thể được cập nhật định kỳ để phù hợp
            với sự phát triển của nền tảng.
          </p>
        </section>

        <footer className="pt-12 border-t border-border-dark text-center text-text-secondary text-sm">
          <p>&copy; 2026 Connect Team. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
