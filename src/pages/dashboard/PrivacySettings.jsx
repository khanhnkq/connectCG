import React, { useState } from "react";
import { Shield, Lock, Eye, UserPlus, ChatCircle as MessageCircle, Trash as Trash2, DeviceMobile as Smartphone, CaretRight as ChevronRight, ShieldCheck, Lightning as Zap, Clock, LockOpen as Unlock, EyeSlash as EyeOff, UserCheck, WarningCircle as AlertCircle, Pulse as Activity, UserMinus as UserX } from "@phosphor-icons/react";
import { motion as Motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logoutAll } from "../../redux/slices/authSlice";

const SettingToggle = ({
  icon,
  title,
  description,
  enabled,
  onToggle,
  disabled = false,
  badge = null,
}) => (
  <Motion.div
    whileHover={disabled ? {} : { y: -2 }}
    className={`flex items-center justify-between p-5 bg-surface-main rounded-[1.5rem] shadow-sm border border-border-main/5 transition-all group ${
      disabled ? "opacity-60 cursor-not-allowed" : "hover:shadow-md"
    }`}
  >
    <div className="flex gap-5">
      <div
        className={`p-4 rounded-2xl transition-all duration-300 ${
          enabled && !disabled
            ? "bg-primary/10 text-primary shadow-inner shadow-primary/5"
            : "bg-gray-500/5 text-text-secondary/60"
        }`}
      >
        {React.createElement(icon, { size: 24, strokeWidth: enabled && !disabled ? 2.5 : 2 })}
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <h4 className="font-extrabold text-text-main text-lg leading-tight">
            {title}
          </h4>
          {badge && (
            <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-[10px] font-black uppercase tracking-wider rounded-md border border-yellow-500/20">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-text-secondary font-medium opacity-70 mt-0.5">
          {description}
        </p>
      </div>
    </div>
    <button
      onClick={disabled ? undefined : onToggle}
      disabled={disabled}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-500 focus:outline-none ${
        disabled
          ? "bg-text-secondary/10 cursor-not-allowed"
          : enabled
          ? "bg-primary shadow-lg shadow-primary/20"
          : "bg-text-secondary/20"
      }`}
    >
      <Motion.span
        animate={{ x: enabled && !disabled ? 22 : 4 }}
        className="inline-block h-5 w-5 rounded-full bg-white shadow-md"
      />
    </button>
  </Motion.div>
);

const SectionHeader = ({ icon, title, description }) => (
  <div className="flex items-center gap-4 mb-8">
    <div className="p-3 bg-primary text-[#231810] rounded-[1.2rem] shadow-lg shadow-primary/10">
      {React.createElement(icon, { size: 22, strokeWidth: 2.5 })}
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

const QuickAction = ({ icon, title, status, color, onClick, disabled = false }) => (
  <button
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    className={`w-full flex items-center justify-between p-5 rounded-[1.8rem] bg-surface-main transition-all duration-300 group shadow-sm border border-border-main/5 ${
      disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-background-main hover:shadow-md"
    }`}
  >
    <div className="flex items-center gap-4">
      <div
        className={`p-3 rounded-2xl bg-background-main group-hover:bg-surface-main transition-colors ${color}`}
      >
        {React.createElement(icon, { size: 20 })}
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth?.user);

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

  const handleLogoutAll = async () => {
    try {
      await dispatch(logoutAll()).unwrap();
      toast.success("Đã đăng xuất khỏi tất cả thiết bị.");
      navigate("/login", { replace: true });
    } catch {
      toast.error("Không thể thu hồi các phiên đăng nhập. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-background-main/30">
      <Motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-10 max-w-[75rem] mx-auto pb-32"
      >
        {/* HERO SECTION - PRIVACY STATUS */}
        <div className="mb-16 flex flex-col md:flex-row items-center gap-10 bg-surface-main p-10 rounded-[3rem] shadow-xl border border-border-main/10 relative overflow-hidden group">
          {/* Background Highlight */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px] transition-all duration-1000 group-hover:scale-150" />

          <div className="relative shrink-0 flex items-center justify-center">
            <div className="size-36 rounded-full border-[6px] border-primary/20 bg-primary/5 relative flex items-center justify-center">
              <ShieldCheck size={56} className="text-primary" />
            </div>
            {/* Status Badge */}
            <div className="absolute -bottom-2 -right-2 p-2.5 bg-green-500 text-white rounded-2xl shadow-lg border-4 border-surface-main">
              <Shield size={20} />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
              <span className="px-3 py-1 bg-primary/10 text-primary text-[11px] font-black uppercase tracking-widest rounded-full border border-primary/20">
                Trung tâm bảo mật
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-text-main tracking-tighter mb-4 leading-none uppercase">
              XIN CHÀO, {currentUser?.fullName || currentUser?.name || "BẠN"}! <br />
              <span className="text-text-secondary opacity-50 text-2xl md:text-3xl">
                BẢO MẬT & QUYỀN RIÊNG TƯ
              </span>
            </h2>
            <p className="text-base text-text-secondary font-medium max-w-xl">
              Một số tùy chọn bảo mật đang trong quá trình phát triển và hoàn thiện.
              Bạn có thể quản lý các phiên đăng nhập đang hoạt động của mình ngay bên dưới.
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
                  disabled={true}
                  badge="Sắp có"
                />
                <SettingToggle
                  icon={Activity}
                  title="Trạng thái hoạt động"
                  description="Hiển thị chấm xanh khi bạn đang trực tuyến trên Connect."
                  enabled={settings.activityStatus}
                  onToggle={() => toggleSetting("activityStatus")}
                  disabled={true}
                  badge="Sắp có"
                />
                <SettingToggle
                  icon={MessageCircle}
                  title="Thông báo đã đọc"
                  description="Cho người khác biết khi bạn đã xem tin nhắn."
                  enabled={settings.showReadReceipts}
                  onToggle={() => toggleSetting("showReadReceipts")}
                  disabled={true}
                  badge="Sắp có"
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
                  description="Tự động kiểm duyệt và gắn cờ các bài viết vi phạm chuẩn mực cộng đồng."
                  enabled={settings.aiFiltering}
                  onToggle={() => toggleSetting("aiFiltering")}
                  disabled={true}
                  badge="Hệ thống tự động"
                />
                <SettingToggle
                  icon={UserCheck}
                  title="Tự động duyệt bạn bè"
                  description="Sử dụng AI để gợi ý và duyệt những người quen biết thật sự."
                  enabled={settings.allowTagging}
                  onToggle={() => toggleSetting("allowTagging")}
                  disabled={true}
                  badge="Sắp có"
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
                  status="Sắp có"
                  color="text-orange-500"
                  disabled={true}
                />
                <QuickAction
                  icon={Smartphone}
                  title="Đăng xuất mọi thiết bị"
                  status="Thu hồi tất cả phiên đăng nhập"
                  color="text-blue-500"
                  onClick={handleLogoutAll}
                />
                <QuickAction
                  icon={UserX}
                  title="Chặn người dùng"
                  status="—"
                  color="text-text-secondary"
                  disabled={true}
                />
                <QuickAction
                  icon={Trash2}
                  title="Quản lý dữ liệu"
                  status="Sắp có"
                  color="text-red-500"
                  disabled={true}
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
      </Motion.div>
    </div>
  );
}
