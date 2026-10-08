import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import { IconButton } from "../../../components/ui/button/Button";

const DEFAULT_HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDNcX_OkXziFr_DLXg1rNkbJ3wS9r2bvbi2h7-4klRlJeBSya1D4N4wo0Wo3duWWyiffzU6pC-bpTYad3yDlJusQLY3mGR5BrnFYwKkG1kckD6DKkpsjRcmjbL2k95yvQLmGtXotc-X-5YDks3CJW31a747NjvKC2jjBjTkL4lY4Wy6hv2d6-sLwGzHpT25KwBm12U_PzECna1eM0R8KR4wyFWEBCPdyO_gH_N4Jww7lIv99BG12Ho_k4vT0pmblJ949OOiPXscn98";

/**
 * Modern Flat Auth Split Layout (50/50)
 * Dùng chung cho: Login, ForgotPassword, ResetPassword, Step1
 * - Zero drop shadow, zero blur
 * - Crisp 1px borders
 * - Cột trái: Ảnh minh họa + Brand + Slogan
 * - Cột phải: Form trung tâm với mobile header
 */
export default function AuthSplitLayout({
  title,
  subtitle,
  heroTitle = "Tìm kiếm những kết nối ý nghĩa dành riêng cho bạn.",
  heroSubtitle = "Tham gia cộng đồng hàng triệu người đã tìm thấy một nửa hoàn hảo của mình. Bắt đầu hành trình của bạn ngay hôm nay.",
  heroImage = DEFAULT_HERO_IMAGE,
  backTo,
  children,
}) {
  return (
    <div className="min-h-screen flex w-full bg-background-main transition-colors duration-200">
      {/* Cột trái: Ảnh bìa + Brand thông điệp (chỉ hiện trên màn hình lớn) */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-end p-12 overflow-hidden border-0 select-none">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${heroImage}")` }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        <div className="relative z-20 max-w-lg">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <img
              src="/logo.png"
              alt="Connect Logo"
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="text-2xl font-black tracking-tight text-white">
              Connect<span className="text-primary">.</span>
            </span>
          </Link>
          <h2 className="text-4xl font-extrabold leading-tight mb-4 tracking-tight text-white">
            {heroTitle}
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-md">
            {heroSubtitle}
          </p>
        </div>
      </div>

      {/* Cột phải: Khung biểu mẫu xác thực */}
      <div className="w-full lg:w-1/2 flex flex-col min-h-screen lg:h-screen overflow-y-auto bg-background-main relative">
        {/* Mobile Header */}
        <div className="w-full p-6 flex justify-between items-center lg:hidden border-0">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Connect Logo"
              className="h-8 w-auto object-contain"
            />
            <span className="text-lg font-bold text-text-main">
              Connect<span className="text-primary">.</span>
            </span>
          </Link>
          {backTo && (
            <Link
              to={backTo}
              className="text-text-muted hover:text-text-main text-sm font-semibold transition-colors"
            >
              Quay lại
            </Link>
          )}
        </div>

        {/* Nội dung form */}
        <div className="flex-1 flex flex-col justify-center py-10 px-6 sm:px-12 md:px-16 lg:px-20">
          <div className="max-w-[480px] w-full mx-auto">
            {backTo && (
              <div className="hidden lg:block mb-6">
                <Link
                  to={backTo}
                  className="inline-flex items-center gap-2 text-xs font-bold text-text-muted hover:text-primary transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span>Quay lại</span>
                </Link>
              </div>
            )}

            {title && (
              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight mb-2 text-text-main">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-text-secondary text-sm sm:text-base mb-8">
                {subtitle}
              </p>
            )}

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
