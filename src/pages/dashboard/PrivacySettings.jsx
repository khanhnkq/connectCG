import React, { useState } from "react";
import {
  Shield,
  Lock,
  Eye,
  UserPlus,
  MessageCircle,
  Trash2,
  Smartphone,
  ChevronRight,
  ShieldCheck,
  Zap,
  Clock,
  Unlock,
  EyeOff,
  UserCheck,
  AlertCircle,
  Activity,
  UserX,
} from "lucide-react";
import { motion } from "framer-motion";

const SettingToggle = ({
  icon: Icon,
  title,
  description,
  enabled,
  onToggle,
}) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="flex items-center justify-between p-5 bg-surface-main rounded-[1.5rem] shadow-sm border border-border-main/5 hover:shadow-md transition-all group"
  >
    <div className="flex gap-5">
      <div
        className={`p-4 rounded-2xl transition-all duration-300 ${
          enabled
            ? "bg-primary/10 text-primary shadow-inner shadow-primary/5"
            : "bg-gray-500/5 text-text-secondary/60"
        }`}
      >
        <Icon size={24} strokeWidth={enabled ? 2.5 : 2} />
      </div>
      <div className="flex flex-col justify-center">
        <h4 className="font-extrabold text-text-main text-lg group-hover:text-primary transition-colors leading-tight">
          {title}
        </h4>
        <p className="text-sm text-text-secondary font-medium opacity-70 mt-0.5">
          {description}
        </p>
      </div>
    </div>
    <button
      onClick={onToggle}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-500 focus:outline-none ${
        enabled
          ? "bg-primary shadow-lg shadow-primary/20"
          : "bg-text-secondary/20"
      }`}
    >
      <motion.span
        animate={{ x: enabled ? 22 : 4 }}
        className="inline-block h-5 w-5 rounded-full bg-white shadow-md"
      />
    </button>
  </motion.div>
);

const SectionHeader = ({ icon: Icon, title, description }) => (
  <div className="flex items-center gap-4 mb-8">
    <div className="p-3 bg-primary text-[#231810] rounded-[1.2rem] shadow-lg shadow-primary/10">
      <Icon size={22} strokeWidth={2.5} />
    </div>
    <div>
      <h3 className="text-xl font-black text-text-main uppercase tracking-tighter">
        {title}
      </h3>
      <p className="text-sm text-text-secondary font-bold opacity-50 uppercase tracking-widest">
        {description}
      </p>
    </div>
  </div>
);

const QuickAction = ({ icon: Icon, title, status, color }) => (
  <button className="w-full flex items-center justify-between p-5 rounded-[1.8rem] bg-surface-main hover:bg-background-main transition-all duration-300 group shadow-sm hover:shadow-md border border-border-main/5">
    <div className="flex items-center gap-4">
      <div
        className={`p-3 rounded-2xl bg-background-main group-hover:bg-surface-main transition-colors ${color}`}
      >
        <Icon size={20} />
      </div>
      <div className="text-left">
        <p className="text-base font-black text-text-main leading-none mb-1">
          {title}
        </p>
        <p className="text-[11px] text-text-secondary font-black uppercase tracking-widest opacity-60">
          {status}
        </p>
      </div>
    </div>
    <div className="p-2 rounded-xl bg-background-main group-hover:bg-primary/10 group-hover:text-primary transition-all">
      <ChevronRight
        size={18}
        className="transition-transform group-hover:translate-x-1"
      />
    </div>
  </button>
);

export default function PrivacySettings() {
  const [settings, setSettings] = useState({
    privateAccount: false,
    activityStatus: true,
    allowTagging: true,
    showReadReceipts: true,
    twoFactorAuth: false,
    aiFiltering: true,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-background-main/30">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-10 max-w-[75rem] mx-auto pb-32"
      >
        {/* HERO SECTION - PRIVACY SCORE */}
        <div className="mb-16 flex flex-col md:flex-row items-center gap-10 bg-surface-main p-10 rounded-[3rem] shadow-xl border border-border-main/10 relative overflow-hidden group">
          {/* Background Highlight */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px] transition-all duration-1000 group-hover:scale-150" />

          <div className="relative shrink-0 flex items-center justify-center">
            {/* Circular Progress Placeholder Effect */}
            <div className="size-40 rounded-full border-[10px] border-background-main relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[10px] border-primary border-t-transparent animate-spin-slow" />
              <div className="flex flex-col items-center">
                <span className="text-4xl font-black text-text-main">85</span>
                <span className="text-[10px] font-black uppercase tracking-tighter opacity-50">
                  Score
                </span>
              </div>
            </div>
            {/* Shield Badge */}
            <div className="absolute -bottom-2 -right-2 p-3 bg-green-500 text-white rounded-2xl shadow-lg border-4 border-surface-main">
              <ShieldCheck size={24} />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
              <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[11px] font-black uppercase tracking-widest rounded-full border border-green-500/20">
                Excellent Privacy
              </span>
              <span className="px-3 py-1 bg-primary/10 text-primary text-[11px] font-black uppercase tracking-widest rounded-full border border-primary/20">
                v2.4
              </span>
            </div>
            <h2 className="text-5xl font-black text-text-main tracking-tighter mb-4 leading-none">
              HI, KHÁNH! <br />
              <span className="text-text-secondary opacity-50">
                YOUR PRIVACY IS SECURED.
              </span>
            </h2>
            <p className="text-lg text-text-secondary font-medium max-w-xl">
              Cài đặt quyền riêng tư của bạn đang được tối ưu hóa. Hãy xem lại
              các thiết lập bên dưới để duy trì sự an toàn cho tài khoản.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* MAIN SETTINGS - 8 COLS */}
          <div className="lg:col-span-8 space-y-16">
            <section>
              <SectionHeader
                icon={Lock}
                title="Privacy Preferences"
                description="Control your visibility and reach"
              />
              <div className="grid grid-cols-1 gap-5">
                <SettingToggle
                  icon={Lock}
                  title="Tài khoản riêng tư"
                  description="Khi bật, chỉ những người bạn phê duyệt mới có thể xem nội dung."
                  enabled={settings.privateAccount}
                  onToggle={() => toggleSetting("privateAccount")}
                />
                <SettingToggle
                  icon={Activity}
                  title="Trạng thái hoạt động"
                  description="Hiển thị chấm xanh khi bạn đang trực tuyến trên Connect."
                  enabled={settings.activityStatus}
                  onToggle={() => toggleSetting("activityStatus")}
                />
                <SettingToggle
                  icon={MessageCircle}
                  title="Thông báo đã đọc"
                  description="Cho người khác biết khi bạn đã xem tin nhắn."
                  enabled={settings.showReadReceipts}
                  onToggle={() => toggleSetting("showReadReceipts")}
                />
              </div>
            </section>

            <section>
              <SectionHeader
                icon={Zap}
                title="AI & Automation"
                description="Enhanced protection powered by AI"
              />
              <div className="grid grid-cols-1 gap-5">
                <SettingToggle
                  icon={Shield}
                  title="Lọc nội dung Toxic bằng AI"
                  description="Tự động ẩn các bình luận hoặc bài viết có nội dung xúc phạm."
                  enabled={settings.aiFiltering}
                  onToggle={() => toggleSetting("aiFiltering")}
                />
                <SettingToggle
                  icon={UserCheck}
                  title="Tự động duyệt bạn bè"
                  description="Sử dụng AI để gợi ý và duyệt những người quen biết thật sự."
                  enabled={settings.allowTagging}
                  onToggle={() => toggleSetting("allowTagging")}
                />
              </div>
            </section>
          </div>

          {/* SIDEBAR ACTIONS - 4 COLS */}
          <div className="lg:col-span-4 space-y-10">
            <div className="space-y-6">
              <h3 className="text-sm font-black text-text-main uppercase tracking-widest pl-2 opacity-40">
                Account Security
              </h3>
              <div className="space-y-3">
                <QuickAction
                  icon={Unlock}
                  title="Xác thực 2 yếu tố"
                  status="Đang tắt"
                  color="text-orange-500"
                />
                <QuickAction
                  icon={Smartphone}
                  title="Thiết bị đăng nhập"
                  status="3 thiết bị"
                  color="text-blue-500"
                />
                <QuickAction
                  icon={UserX}
                  title="Chặn người dùng"
                  status="12 người"
                  color="text-text-secondary"
                />
                <QuickAction
                  icon={Trash2}
                  title="Quản lý dữ liệu"
                  status="Tải về ngay"
                  color="text-red-500"
                />
              </div>
            </div>

            {/* TIP CARD */}
            <div className="bg-primary p-8 rounded-[2.5rem] text-[#231810] relative overflow-hidden group shadow-2xl shadow-primary/30 mt-12">
              <div className="relative z-10">
                <div className="bg-[#231810]/10 w-fit p-3 rounded-2xl mb-6 backdrop-blur-md">
                  <AlertCircle size={32} strokeWidth={2.5} />
                </div>
                <h4 className="text-3xl font-black tracking-tighter leading-none mb-4 uppercase">
                  Protect Your <br /> Profile!
                </h4>
                <p className="text-base font-bold opacity-70 leading-snug mb-8">
                  Thay đổi mật khẩu định kỳ 3 tháng một lần để đảm bảo tài khoản
                  luôn ở trạng thái an toàn nhất.
                </p>
                <button className="w-full py-4 bg-[#231810] text-white rounded-[1.2rem] text-sm font-black uppercase tracking-widest hover:scale-[1.05] active:scale-[0.95] transition-all shadow-xl shadow-black/20">
                  Update Now
                </button>
              </div>
              {/* Decorative Blur */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-[50px] -mr-10 -mt-10 animate-pulse" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
