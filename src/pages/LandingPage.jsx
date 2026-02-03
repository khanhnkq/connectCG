import {
  ArrowRight,
  LogIn,
  Star,
  Search,
  Sparkles,
  Gift,
  Lock,
  Globe,
  Mail,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="bg-background-main text-text-main font-display antialiased w-full overflow-x-hidden transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background-main/90 backdrop-blur-md border-b border-border-main transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Connect Logo"
              className="h-10 w-auto object-contain"
            />
            <span className="text-xl font-extrabold tracking-tight">
              Connect<span className="text-primary">.</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              className="text-sm font-bold text-text-secondary hover:text-text-main transition-colors"
              href="#"
            >
              Câu Chuyện
            </a>
            <a
              className="text-sm font-bold text-text-secondary hover:text-text-main transition-colors"
              href="#"
            >
              Cộng Đồng
            </a>
            <a
              className="text-sm font-bold text-text-secondary hover:text-text-main transition-colors"
              href="#"
            >
              An Toàn
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:block text-text-main hover:text-primary font-bold px-5 py-2.5 transition-colors text-sm border border-primary/30 hover:border-primary rounded-full"
            >
              Đăng Nhập
            </Link>
            <Link
              to="/registration/step-1"
              className="bg-primary hover:bg-primary-hover text-white font-bold px-6 py-2.5 rounded-full transition-all shadow-lg shadow-primary/20 text-sm hover:scale-105 active:scale-95"
            >
              Tham Gia Ngay
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Group of diverse people connecting"
            className="w-full h-full object-cover object-center opacity-70"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhcShxtS0XBI7jv54oz8BZHYnYJHTux8aUkOpW2U1TcMj77P1Zk7CfS0xkdspYSsaFMEIHlz7XfA_bNAzViKVPgpAvEnxYOXH6uBKwPaXvisQj-qzxZ0kEh4uvH_nXlKY02OoRAN8PtRB7-rUPoFMJRdcUuPkHkHHuBUvoUAb3ySmdNj7Tgq_LJwGk2s63fXg_g2aazlaj2KhkB8JkcpRh7OewTypUwnWJyqOdhFQGXDv8ZfgpP_74nO8k0KbW4mjhNz82gGN1nPQ"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background-main via-background-main/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background-main via-transparent to-transparent z-10" />
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-6 w-full grid lg:grid-cols-2 gap-12">
          <div className="flex flex-col justify-center items-start pt-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Đã Có Mặt Toàn Cầu
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 drop-shadow-lg">
              Kết Nối, Chia Sẻ và
              <span className="text-primary block mt-2">Tìm Bạn Bè</span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-xl leading-relaxed font-medium drop-shadow-md">
              Trải nghiệm phong cách mạng xã hội mới. Kết nối với hàng ngàn
              người cùng chí hướng trong môi trường an toàn, cao cấp giúp xây
              dựng những mối quan hệ chân thực.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                to="/registration/step-1"
                className="bg-primary hover:bg-primary-hover text-white text-base font-bold px-8 py-4 rounded-full transition-all transform hover:-translate-y-1 shadow-xl shadow-primary/25 flex items-center justify-center gap-2"
              >
                Tham Gia Cộng Đồng
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/login"
                className="bg-black/20 backdrop-blur-sm border border-primary/50 hover:border-primary text-primary hover:bg-primary/10 text-base font-bold px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2"
              >
                <LogIn size={20} />
                Đăng Nhập
              </Link>
            </div>
            <div className="mt-12 flex items-center gap-4 p-4 rounded-2xl bg-surface-main/5 border border-border-main backdrop-blur-sm">
              <div className="flex -space-x-4">
                <div
                  className="size-12 rounded-full border-2 border-[#1A120B] bg-cover bg-center"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAUO2YNLAxc1Nl_nCWaGx0Dwt8BIkrV0WsFtsI9ePfpuH2QDYaR2IL1U-BCix40iXmHOlV6rzlHb2YzzlKUEpD183YkjDBCAQtHPFoSaXz638Vjta7H-NlTtKESwQOh_CcHQs-rhd6cbbiyxlQVatQS90HHg710X2WFSTAS7LkytHfywWdbhdy-IVBZk0wtKYnjblM6Vy6IA3R_7kOjPY04ZFIVnhosSED60xtTRmy2ylVAGG80CffMYIEPaZ6iQHq6uonwSSfKBJw")',
                  }}
                />
                <div
                  className="size-12 rounded-full border-2 border-[#1A120B] bg-cover bg-center"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAFnbIOg359_IruqeJZR2XF_Z9o0ttAo63JvDFovmYNSKdvPDsjabpqB7jFC2UUE6tzEncOSivvm1W5vNt9KxVCVPm7pn8OrwN7RLmHA4OMIo36hL-88I-wXa9YN61Vi-X20nAg7gI-1QfF28jrI8oV5TGX_X32VjN7POtm_CtBB9DkdWcNvsqgkBEwNZFhOLngZBuNQA5Z5pU-fGIhAf3z355mdR5RIij1VsmKLkaqcqcd87735upuE6OE5UqM8bI3FCXkrTk4agw")',
                  }}
                />
                <div
                  className="size-12 rounded-full border-2 border-[#1A120B] bg-cover bg-center"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBuHYpNqBoJZ6H3wxyG6OtCnMMVU4FTUngw6LYZy4SgjA0mY2sYsDcePdMS10ev3_M8tw950TFDzIey60zy_0YaYchnCYNkI1EFXtTTC7THk5zGBor8yBtMr-aAf8sbShLZVQv8CQzSm5kNH7EvWmKXyi1RIv1DxZa3HFHT34tseJeUcKe6h6lFC6Ar26xYdz8DghOGsPL3pKrXSb5Jj3_uULvl0M_QzCz6myNZnocquEnyZkGrndeht0XMB4Yrsu9Is2B6nJ3Mi9M")',
                  }}
                />
                <div className="size-12 rounded-full border-2 border-background-main bg-surface-main flex items-center justify-center text-xs font-bold text-text-main">
                  +5k
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-yellow-500 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm font-medium text-gray-300">
                  <span className="text-white font-bold">10k+</span> thành viên
                  mới tuần này
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background-main relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight text-white">
              Mọi thứ bạn cần để <span className="text-primary">kết nối</span>
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              Nền tảng của chúng tôi cung cấp các công cụ cao cấp giúp bạn thể
              hiện bản thân, khám phá bạn bè mới và xây dựng những mối quan hệ
              bền vững.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                iconPath: <Search className="text-primary" size={32} />,
                title: "Ghép Đôi Thông Minh",
                description:
                  "Lọc đối tượng theo sở thích, vị trí và lối sống. Thuật toán của chúng tôi giúp bạn tìm đúng người bạn cần mà không bị nhiễu.",
              },
              {
                iconPath: <Sparkles className="text-primary" size={32} />,
                title: "Thể Hiện Bản Thân",
                description:
                  "Tạo hồ sơ ấn tượng với thư viện ảnh và nhật ký cá nhân. Cập nhật trạng thái, chia sẻ khoảnh khắc và để cá tính của bạn tỏa sáng.",
              },
              {
                iconPath: <Gift className="text-primary" size={32} />,
                title: "Quà Tặng Ảo",
                description:
                  "Phá băng ngay lập tức. Gửi quà tặng ảo ý nghĩa để thể hiện sự cảm mến và bắt đầu cuộc trò chuyện đầy thiện cảm.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-surface-main p-8 rounded-[2rem] border border-border-main hover:border-primary/30 transition-all duration-300 group hover:-translate-y-2 shadow-xl hover:shadow-primary/5"
              >
                <div className="size-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ring-1 ring-border-main">
                  {feature.iconPath}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-text-main">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-background-main to-background-main/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
                Thành Viên Mới
              </h2>
              <p className="text-text-secondary">
                Tham gia cùng hàng ngàn người đang hoạt động. Kết nối ngay lập
                tức.
              </p>
            </div>
            <button className="text-primary font-bold hover:text-white transition-colors flex items-center gap-1 group">
              Xem tất cả thành viên{" "}
              <ArrowRight
                className="group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </button>
          </div>
          <div className="relative">
            {/* Blurred member cards grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 opacity-50 select-none pointer-events-none">
              {[
                "https://lh3.googleusercontent.com/aida-public/AB6AXuA61rF2qJA_61d08hoKQD1vgLttk99SWH-2mhQvPCoH57mhr0UjI8L7ybrsEWnI2oLFtMUesiVK-j9CGmOjLqaDBSP4VGvvtSiwItxsARYkGe8mEsW7qwBkWXGsCjQLKe10vZ7AQv05zjKn0dsPLE5BUEJCjrwzv9TUcPhyKj43H7MuKHeGmqxrZrq5_s7ODalnsrwBejsIxD4NsrZetKdfuu5WRkwVCT304dnvOmT15inm4rJUGChESlWiT5jnp5f3NqPpm8kKCv0",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBdoLrCwAT83JCL6U8m7TnDC0oM8kn4OVr5XeeYADi_UYRinmq2C0fIwzychqDESZvGWD0nS5EqD_0hTACwjoHHIUqj1bI5Ic1EQZ75Oef8FoxX0B7g4dp_lmTjf44WtIpjrF_Ygs2b0iQ90dlQzFyapA7Oh2Pm1-peCNesZBogBZhUpUCXOnp5_KqLP9H-cm69o1uTTt-sGGAzw11HFpXZ7pvgNJkIjC9OPnhWLCMwXKlgZz2nKU2pguarVqXSrrVwTiSrRLt4h5g",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCA2lYtnTFCA75HFG_52JszPx-az718WMOboPAn-G1i24N852_c8WMA84zaSIjPhM2bLmVoY8itXvafnzxb5VjPbzRUZp6AXCKTfAEXa9jysG_6eND1TYZ0D1OFOXHtOKIWA2x0OJxEozgg2vR_FVWQLKzKDMrEuV3ZX9MEa8yOLevyaZjSYY0z7uQTwuSXWp4HBjjqAcBcZLqU4iAoqv71JyHkK1TW8TD9Rt3KVz3qa5jC8Xq-idWXHr3qpktV4H962cWYDM__P1Y",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCfCl1X2bsOD2anKofpFDzckD9z_a3CDOQqg1A1-nnzE0ALZhx8h2sNsn_PdV7-P6oEpg0XRttDsHUQJwA2Aa3MdUW6FIzwdzYDOxxjZFF7_x9QBl_cJ0NvpSwm_LFGlB5Yi4n9ksqFEjuIaIuQTyLOghyL8b2P7JdZiE9YN9aMocc7VfC_uvu-UaLuLtbGD9_5Kropk3H3Na2Of1n_kfzDW9PvINieVznAqTbyDeohff0qGU0J5IQTasq56bubbiAsxjbHlaBRaZ4",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDJPlnDjBjXuixfttGBOr0_Jx2ZLTctMTrGw14hx9On0XfJumO9xm9cOekOU2h2N4DYnbdA2kJqNkj1La7ogr0YwtHbWZbBTN2f4jz2tMaZ4MysYtOwrJh9nwBn3ooj5LQfIAwf-a0pq9vR24ScthQGYkC_nY1vIxbb6OW1ySd-C8q1C-EFoeCLGB47y8OGHnKoiwdLpB3Jgft_uYAPe6-xAq52AMh9kmGduf6uAp8MOpDKV3ZUqpAElRvG46XdK09BKNQRomKVHFo",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuC5XMIpiqrD96rbcu3BjxqHOkpiTb_uUr6zVOzb3_EuEuyT7BKqTEpoqxuP4Q5_KQvP60A_2VSvikFgb-T6dHDeoW_JBguXbEb2aBZWpYU2ZHqnq9-UbMsPrpz9nuSS5PoGtucwsXXNpETlS5qomt4Lt5QiBEH-IIExc6OiETtXvtpKy0BwNQlgjk1GYSXjtSmGV42SJAbFmDxmcSZYbOTUNXQk7EwH1M2sDDKY33EOblUP98AmvedKaka_lnog0uPtQE6vFnDMUuk",
              ].map((imgUrl, index) => (
                <div
                  key={index}
                  className="bg-surface-main p-4 rounded-2xl border border-border-main flex flex-col items-center gap-3 grayscale-[50%]"
                >
                  <div
                    className="size-20 rounded-full bg-cover bg-center blur-[6px]"
                    style={{ backgroundImage: `url("${imgUrl}")` }}
                  />
                  <div className="h-4 w-20 bg-white/10 rounded-full" />
                  <div className="h-3 w-12 bg-white/5 rounded-full" />
                </div>
              ))}
            </div>
            {/* CTA overlay */}
            <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
              <div className="bg-surface-main/80 backdrop-blur-xl border border-primary/20 p-8 rounded-[2rem] shadow-2xl text-center max-w-sm w-full transform transition-all hover:scale-105 duration-500 group">
                <div className="size-4 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-5 group-hover:bg-primary group-hover:text-[#1A120B] transition-colors">
                  <Lock size={32} />
                </div>
                <h3 className="text-2xl font-bold text-text-main mb-2">
                  Tham gia để xem hồ sơ
                </h3>
                <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                  Đăng ký miễn phí để xem đầy đủ hồ sơ, hình ảnh và kết nối với
                  thành viên gần bạn.
                </p>
                <Link
                  to="/registration/step-1"
                  className="block w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-full transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
                >
                  Tạo Tài Khoản Miễn Phí
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-main border-t border-border-main pt-16 pb-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-6">
                <img
                  src="/logo.png"
                  alt="Connect Logo"
                  className="h-8 w-auto object-contain"
                />
                <span className="text-xl font-extrabold tracking-tight text-text-main">
                  Connect<span className="text-primary">.</span>
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Mạng xã hội cao cấp dành cho những kết nối ý nghĩa và tình bạn
                chân thực. Tham gia cuộc trò chuyện ngay hôm nay.
              </p>
              <div className="flex gap-3">
                <a
                  className="size-10 rounded-full bg-background-main hover:bg-primary hover:text-white flex items-center justify-center transition-all text-text-secondary"
                  href="#"
                >
                  <Globe size={18} />
                </a>
                <a
                  className="size-10 rounded-full bg-background-main hover:bg-primary hover:text-white flex items-center justify-center transition-all text-text-secondary"
                  href="#"
                >
                  <Mail size={18} />
                </a>
                <a
                  className="size-10 rounded-full bg-background-main hover:bg-primary hover:text-white flex items-center justify-center transition-all text-text-secondary"
                  href="#"
                >
                  <MessageCircle size={18} />
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-20">
              <div>
                <h4 className="text-text-main font-bold mb-6 text-sm uppercase tracking-wider">
                  Công Ty
                </h4>
                <ul className="flex flex-col gap-3 text-sm text-gray-400">
                  <li>
                    <a
                      className="hover:text-primary transition-colors"
                      href="#"
                    >
                      Về Chúng Tôi
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-primary transition-colors"
                      href="#"
                    >
                      Tuyển Dụng
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-primary transition-colors"
                      href="#"
                    >
                      Báo Chí
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-primary transition-colors"
                      href="#"
                    >
                      Liên Hệ
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-text-main font-bold mb-6 text-sm uppercase tracking-wider">
                  Tài Nguyên
                </h4>
                <ul className="flex flex-col gap-3 text-sm text-gray-400">
                  <li>
                    <a
                      className="hover:text-primary transition-colors"
                      href="#"
                    >
                      Mẹo An Toàn
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-primary transition-colors"
                      href="#"
                    >
                      Quy Tắc Cộng Đồng
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-primary transition-colors"
                      href="#"
                    >
                      Câu Chuyện Thành Công
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-primary transition-colors"
                      href="#"
                    >
                      Trung Tâm Trợ Giúp
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-text-main font-bold mb-6 text-sm uppercase tracking-wider">
                  Pháp Lý
                </h4>
                <ul className="flex flex-col gap-3 text-sm text-gray-400">
                  <li>
                    <a
                      className="hover:text-primary transition-colors"
                      href="#"
                    >
                      Chính Sách Riêng Tư
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-primary transition-colors"
                      href="#"
                    >
                      Điều Khoản Dịch Vụ
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-primary transition-colors"
                      href="#"
                    >
                      Chính Sách Cookie
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-border-main pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-text-muted font-medium">
            <p>© 2023 Connect Social Inc. Bảo lưu mọi quyền.</p>
            <div className="flex gap-6">
              <a className="hover:text-gray-400 transition-colors" href="#">
                English (US)
              </a>
              <a className="hover:text-gray-400 transition-colors" href="#">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
