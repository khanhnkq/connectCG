import React from "react";
import { Link } from "react-router-dom";
import {
  Star,
  MagnifyingGlass,
  Sparkle,
  Gift,
  Lock,
  Globe,
  Envelope,
  ChatCircle,
} from "@phosphor-icons/react";
import { Button } from "../components/ui/button/Button";
import { Card } from "../components/ui/card/Card";
import { Badge } from "../components/ui/badge/Badge";

const COMMUNITY_TEASERS = [
  {
    name: "Minh Anh",
    role: "UX Designer",
    city: "Hà Nội",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA61rF2qJA_61d08hoKQD1vgLttk99SWH-2mhQvPCoH57mhr0UjI8L7ybrsEWnI2oLFtMUesiVK-j9CGmOjLqaDBSP4VGvvtSiwItxsARYkGe8mEsW7qwBkWXGsCjQLKe10vZ7AQv05zjKn0dsPLE5BUEJCjrwzv9TUcPhyKj43H7MuKHeGmqxrZrq5_s7ODalnsrwBejsIxD4NsrZetKdfuu5WRkwVCT304dnvOmT15inm4rJUGChESlWiT5jnp5f3NqPpm8kKCv0",
  },
  {
    name: "Quốc Bảo",
    role: "Lập trình viên",
    city: "Đà Nẵng",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBdoLrCwAT83JCL6U8m7TnDC0oM8kn4OVr5XeeYADi_UYRinmq2C0fIwzychqDESZvGWD0nS5EqD_0hTACwjoHHIUqj1bI5Ic1EQZ75Oef8FoxX0B7g4dp_lmTjf44WtIpjrF_Ygs2b0iQ90dlQzFyapA7Oh2Pm1-peCNesZBogBZhUpUCXOnp5_KqLP9H-cm69o1uTTt-sGGAzw11HFpXZ7pvgNJkIjC9OPnhWLCMwXKlgZz2nKU2pguarVqXSrrVwTiSrRLt4h5g",
  },
  {
    name: "Thùy Trang",
    role: "Nhiếp ảnh gia",
    city: "TP. Hồ Chí Minh",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCA2lYtnTFCA75HFG_52JszPx-az718WMOboPAn-G1i24N852_c8WMA84zaSIjPhM2bLmVoY8itXvafnzxb5VjPbzRUZp6AXCKTfAEXa9jysG_6eND1TYZ0D1OFOXHtOKIWA2x0OJxEozgg2vR_FVWQLKzKDMrEuV3ZX9MEa8yOLevyaZjSYY0z7uQTwuSXWp4HBjjqAcBcZLqU4iAoqv71JyHkK1TW8TD9Rt3KVz3qa5jC8Xq-idWXHr3qpktV4H962cWYDM__P1Y",
  },
  {
    name: "Hoàng Nam",
    role: "Kiến trúc sư",
    city: "Hải Phòng",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCfCl1X2bsOD2anKofpFDzckD9z_a3CDOQqg1A1-nnzE0ALZhx8h2sNsn_PdV7-P6oEpg0XRttDsHUQJwA2Aa3MdUW6FIzwdzYDOxxjZFF7_x9QBl_cJ0NvpSwm_LFGlB5Yi4n9ksqFEjuIaIuQTyLOghyL8b2P7JdZiE9YN9aMocc7VfC_uvu-UaLuLtbGD9_5Kropk3H3Na2Of1n_kfzDW9PvINieVznAqTbyDeohff0qGU0J5IQTasq56bubbiAsxjbHlaBRaZ4",
  },
  {
    name: "Khánh Linh",
    role: "Biên tập viên",
    city: "Cần Thơ",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDJPlnDjBjXuixfttGBOr0_Jx2ZLTctMTrGw14hx9On0XfJumO9xm9cOekOU2h2N4DYnbdA2kJqNkj1La7ogr0YwtHbWZbBTN2f4jz2tMaZ4MysYtOwrJh9nwBn3ooj5LQfIAwf-a0pq9vR24ScthQGYkC_nY1vIxbb6OW1ySd-C8q1C-EFoeCLGB47y8OGHnKoiwdLpB3Jgft_uYAPe6-xAq52AMh9kmGduf6uAp8MOpDKV3ZUqpAElRvG46XdK09BKNQRomKVHFo",
  },
  {
    name: "Tuấn Anh",
    role: "Giáo viên",
    city: "Huế",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC5XMIpiqrD96rbcu3BjxqHOkpiTb_uUr6zVOzb3_EuEuyT7BKqTEpoqxuP4Q5_KQvP60A_2VSvikFgb-T6dHDeoW_JBguXbEb2aBZWpYU2ZHqnq9-UbMsPrpz9nuSS5PoGtucwsXXNpETlS5qomt4Lt5QiBEH-IIExc6OiETtXvtpKy0BwNQlgjk1GYSXjtSmGV42SJAbFmDxmcSZYbOTUNXQk7EwH1M2sDDKY33EOblUP98AmvedKaka_lnog0uPtQE6vFnDMUuk",
  },
];

/**
 * LandingPage: Trang chủ giới thiệu ConnectCG
 * - Chuẩn hóa Modern Flat 2026: 0px blur, 0px drop shadow, viền 1px crisp
 * - Tuân thủ nghiêm ngặt Mutual Exclusivity: nút có chữ không kẹp icon
 * - Tương thích hoàn hảo Light Mode & Dark Mode
 */
export default function LandingPage() {
  return (
    <div className="bg-background-main text-text-main font-sans antialiased w-full overflow-x-hidden transition-colors duration-200">
      {/* 1. Header Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background-main border-b border-border-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="Connect Logo"
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="text-xl font-black tracking-tight text-text-main">
              Connect<span className="text-primary">.</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-text-secondary">
            <a href="#features" className="hover:text-primary transition-colors">
              Tính năng
            </a>
            <a href="#community" className="hover:text-primary transition-colors">
              Cộng đồng
            </a>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Điều khoản
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Đăng nhập
              </Button>
            </Link>
            <Link to="/registration/step-1">
              <Button variant="primary" size="sm">
                Tham gia ngay
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 border-b border-border-main bg-background-main overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-start space-y-6">
            <Badge variant="subtle" size="md">
              Mạng xã hội kết nối thế hệ mới
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-text-main">
              Kết Nối Chân Thực,
              <span className="text-primary block mt-1">Tìm Người Cùng Tần Số</span>
            </h1>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl">
              Trải nghiệm phong cách mạng xã hội phẳng hiện đại. Khám phá những
              người bạn cùng sở thích, bắt đầu cuộc trò chuyện ý nghĩa trong không gian
              an toàn và văn minh.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 w-full sm:w-auto">
              <Link to="/registration/step-1">
                <Button variant="primary" size="lg">
                  Tạo tài khoản miễn phí
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Đăng nhập tài khoản
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="pt-6 border-t border-border-main flex items-center gap-4 w-full">
              <div className="flex -space-x-2.5">
                {COMMUNITY_TEASERS.slice(0, 3).map((item, idx) => (
                  <img
                    key={idx}
                    src={item.image}
                    alt={item.name}
                    className="size-10 rounded-full border-2 border-background-main object-cover"
                  />
                ))}
                <div className="size-10 rounded-full border-2 border-background-main bg-surface-subtle flex items-center justify-center text-[11px] font-bold text-text-main">
                  +10k
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-warning mb-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={13} weight="fill" />
                  ))}
                </div>
                <p className="text-xs font-medium text-text-secondary">
                  Hàng ngàn thành viên mới tham gia mỗi tuần
                </p>
              </div>
            </div>
          </div>

          {/* Right Hero Banner Card */}
          <div className="relative">
            <Card className="p-2 overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhcShxtS0XBI7jv54oz8BZHYnYJHTux8aUkOpW2U1TcMj77P1Zk7CfS0xkdspYSsaFMEIHlz7XfA_bNAzViKVPgpAvEnxYOXH6uBKwPaXvisQj-qzxZ0kEh4uvH_nXlKY02OoRAN8PtRB7-rUPoFMJRdcUuPkHkHHuBUvoUAb3ySmdNj7Tgq_LJwGk2s63fXg_g2aazlaj2KhkB8JkcpRh7OewTypUwnWJyqOdhFQGXDv8ZfgpP_74nO8k0KbW4mjhNz82gGN1nPQ"
                alt="Connect Community"
                className="w-full h-80 sm:h-96 object-cover rounded-xl"
              />
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-text-main">
                    Cộng đồng Connect
                  </h4>
                  <p className="text-xs text-text-muted mt-0.5">
                    Hơn 63 tỉnh thành • Đa dạng sở thích
                  </p>
                </div>
                <Link to="/registration/step-1">
                  <Button variant="primary" size="sm">
                    Khám phá ngay
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="py-20 bg-background-main border-b border-border-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <Badge variant="subtle" size="md">
              Tính năng nổi bật
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-text-main">
              Mọi công cụ bạn cần để <span className="text-primary">kết nối</span>
            </h2>
            <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
              Thiết kế tinh gọn, tập trung vào giá trị cốt lõi: giúp bạn thể hiện
              bản thân và tìm đúng bạn bè mà không bị làm phiền.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: MagnifyingGlass,
                title: "Ghép Đôi Thông Minh",
                description:
                  "Lọc đối tượng theo sở thích, vị trí và mục đích kết nối. Thuật toán hỗ trợ gợi ý những người bạn phù hợp nhất.",
              },
              {
                icon: Sparkle,
                title: "Hồ Sơ Đa Tầng",
                description:
                  "Tạo hồ sơ ấn tượng với danh mục sở thích, hình ảnh cá nhân và nhật ký suy nghĩ. Tự do thể hiện cá tính riêng.",
              },
              {
                icon: Gift,
                title: "Tương Tác Trực Quan",
                description:
                  "Phá băng dễ dàng với tin nhắn tức thì, thả cảm xúc bài viết và chia sẻ câu chuyện hàng ngày với bạn bè.",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 sm:p-8 space-y-4 hover:border-primary transition-colors">
                  <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Icon size={24} weight="bold" />
                  </div>
                  <h3 className="text-lg font-bold text-text-main">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Community Preview Section */}
      <section id="community" className="py-20 bg-background-main border-b border-border-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <Badge variant="subtle" size="sm" className="mb-2">
                Thành viên mới
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-black text-text-main tracking-tight">
                Gặp gỡ những người bạn mới
              </h2>
            </div>
            <Link to="/registration/step-1">
              <Button variant="outline" size="sm">
                Đăng ký để xem tất cả
              </Button>
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 relative">
            {COMMUNITY_TEASERS.map((member, index) => (
              <Card key={index} className="p-3 text-center space-y-2.5">
                <img
                  src={member.image}
                  alt={member.name}
                  className="size-16 rounded-full mx-auto object-cover border border-border-main"
                />
                <div>
                  <h4 className="text-xs font-bold text-text-main truncate">
                    {member.name}
                  </h4>
                  <p className="text-[10px] text-text-muted truncate">
                    {member.role}
                  </p>
                  <p className="text-[10px] text-primary font-semibold mt-0.5">
                    {member.city}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* CTA Box */}
          <Card className="mt-8 p-8 text-center max-w-xl mx-auto space-y-4 border-primary/30">
            <div className="size-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
              <Lock size={22} weight="bold" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-main">
                Tham gia để kết nối cùng mọi người
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-md mx-auto">
                Tạo tài khoản miễn phí chỉ trong 1 phút để khám phá đầy đủ hồ sơ,
                nhắn tin và chia sẻ khoảnh khắc.
              </p>
            </div>
            <div className="pt-2">
              <Link to="/registration/step-1" className="inline-block w-full sm:w-auto">
                <Button variant="primary" size="md" className="w-full sm:w-auto px-8">
                  Tạo tài khoản ngay
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="bg-surface-main py-12 text-text-secondary border-t border-border-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 sm:col-span-1 space-y-3">
              <Link to="/" className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="Connect Logo"
                  className="h-8 w-auto object-contain"
                />
                <span className="text-lg font-black text-text-main">
                  Connect<span className="text-primary">.</span>
                </span>
              </Link>
              <p className="text-xs text-text-muted leading-relaxed">
                Mạng xã hội phẳng hiện đại dành cho những kết nối ý nghĩa và chân thực.
              </p>
              <div className="flex gap-2 pt-1 text-text-muted">
                <a
                  href="#"
                  aria-label="Website"
                  className="size-8 rounded-lg border border-border-main flex items-center justify-center hover:text-primary hover:border-primary transition-colors"
                >
                  <Globe size={16} />
                </a>
                <a
                  href="#"
                  aria-label="Email"
                  className="size-8 rounded-lg border border-border-main flex items-center justify-center hover:text-primary hover:border-primary transition-colors"
                >
                  <Envelope size={16} />
                </a>
                <a
                  href="#"
                  aria-label="Chat"
                  className="size-8 rounded-lg border border-border-main flex items-center justify-center hover:text-primary hover:border-primary transition-colors"
                >
                  <ChatCircle size={16} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-text-main uppercase tracking-wider mb-3">
                Sản phẩm
              </h4>
              <ul className="space-y-2 text-xs text-text-muted">
                <li>
                  <a href="#features" className="hover:text-primary transition-colors">
                    Tính năng
                  </a>
                </li>
                <li>
                  <a href="#community" className="hover:text-primary transition-colors">
                    Cộng đồng
                  </a>
                </li>
                <li>
                  <Link to="/registration/step-1" className="hover:text-primary transition-colors">
                    Tạo tài khoản
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-text-main uppercase tracking-wider mb-3">
                Tài nguyên
              </h4>
              <ul className="space-y-2 text-xs text-text-muted">
                <li>
                  <Link to="/terms" className="hover:text-primary transition-colors">
                    Mẹo an toàn
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-primary transition-colors">
                    Quy tắc cộng đồng
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-primary transition-colors">
                    Hỗ trợ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-text-main uppercase tracking-wider mb-3">
                Pháp lý
              </h4>
              <ul className="space-y-2 text-xs text-text-muted">
                <li>
                  <Link to="/terms" className="hover:text-primary transition-colors">
                    Điều khoản sử dụng
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-primary transition-colors">
                    Chính sách bảo mật
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-primary transition-colors">
                    Chính sách cookie
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-border-main flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
            <p>© 2026 Connect Social Inc. Bảo lưu mọi quyền.</p>
            <div className="flex gap-4">
              <span>Tiếng Việt</span>
              <span>•</span>
              <Link to="/terms" className="hover:underline">
                Chính sách
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
