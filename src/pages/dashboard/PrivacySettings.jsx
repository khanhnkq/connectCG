import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Shield,
  Lock,
  Pulse as Activity,
  ChatCircle,
  Lightning,
  UserCheck,
  LockOpen,
  DeviceMobile,
  UserMinus,
  Trash,
  WarningCircle,
  CaretRight,
} from "@phosphor-icons/react";
import toast from "react-hot-toast";
import { logoutAll } from "../../redux/slices/authSlice";
import { Card, Badge, Button, Switch, ConfirmDialog } from "../../components/ui";

/**
 * Section Header Primitive for Settings
 */
function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-center gap-3.5 mb-5">
      <div className="size-10 rounded-xl bg-surface-subtle border-0 flex items-center justify-center shrink-0 text-text-main">
        <Icon size={20} weight="bold" />
      </div>
      <div>
        <h3 className="text-base font-bold text-text-main leading-tight">
          {title}
        </h3>
        <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

/**
 * Modern Flat Setting Toggle Row
 */
function SettingToggleItem({
  icon: Icon,
  title,
  description,
  enabled,
  onToggle,
  disabled = false,
  badge = null,
  badgeVariant = "default",
}) {
  return (
    <div
      className={`flex items-start sm:items-center justify-between gap-4 p-4 rounded-xl border-0 bg-surface-subtle/50 transition-colors ${
        disabled ? "opacity-75" : "hover:bg-surface-subtle"
      }`}
    >
      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
        <div
          className={`size-10 rounded-xl border-0 flex items-center justify-center shrink-0 ${
            enabled && !disabled
              ? "bg-primary/10 text-primary"
              : "bg-surface-main text-text-muted"
          }`}
        >
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-text-main">{title}</h4>
            {badge && (
              <Badge size="sm" variant={badgeVariant}>
                {badge}
              </Badge>
            )}
          </div>
          <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <div className="shrink-0 pt-1 sm:pt-0">
        <Switch
          checked={enabled}
          onChange={onToggle}
          disabled={disabled}
          aria-label={title}
        />
      </div>
    </div>
  );
}

/**
 * Modern Flat Quick Action Row
 */
function SecurityActionItem({
  icon: Icon,
  title,
  status,
  onClick,
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-between p-3.5 rounded-xl border-0 bg-surface-subtle/50 transition-colors text-left group ${
        disabled
          ? "opacity-60 cursor-not-allowed"
          : "hover:bg-surface-subtle cursor-pointer"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="size-9 rounded-lg bg-surface-main border-0 flex items-center justify-center shrink-0 text-text-muted group-hover:text-text-main transition-colors">
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text-main truncate leading-tight">
            {title}
          </p>
          <p className="text-xs text-text-muted mt-0.5 leading-none">
            {status}
          </p>
        </div>
      </div>
      <div className="shrink-0 text-text-muted group-hover:text-text-main transition-colors pl-2">
        <CaretRight size={16} />
      </div>
    </button>
  );
}

export default function PrivacySettings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth?.user);

  const [settings, setSettings] = useState({
    privateAccount: false,
    activityStatus: true,
    showReadReceipts: true,
    aiFiltering: true,
    allowTagging: true,
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogoutAll = async () => {
    try {
      setIsLoggingOut(true);
      await dispatch(logoutAll()).unwrap();
      toast.success("Đã đăng xuất khỏi tất cả thiết bị.");
      setShowLogoutModal(false);
      navigate("/login", { replace: true });
    } catch {
      toast.error("Không thể thu hồi các phiên đăng nhập. Vui lòng thử lại.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const userName =
    currentUser?.fullName || currentUser?.name || currentUser?.username || "bạn";

  return (
    <div className="min-h-screen bg-background-main pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* HERO STATUS CARD */}
        <Card className="p-6 sm:p-8 bg-surface-main border-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
            <div className="size-16 rounded-2xl bg-primary/10 border-0 flex items-center justify-center shrink-0 text-primary">
              <ShieldCheck size={36} weight="bold" />
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Trung tâm bảo mật
                </span>
                <Badge variant="primary" size="sm">
                  Đang kích hoạt
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main tracking-tight">
                Cài đặt quyền riêng tư & bảo mật
              </h1>
              <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
                Xin chào, <span className="font-semibold text-text-main">{userName}</span>!
                Kiểm soát ai có thể nhìn thấy nội dung của bạn, tùy chỉnh tính năng trí tuệ nhân tạo và quản lý các phiên đăng nhập an toàn.
              </p>
            </div>
          </div>
        </Card>

        {/* TWO-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* MAIN SETTINGS COLUMN (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. PRIVACY PREFERENCES */}
            <Card className="p-6 bg-surface-main border-0 space-y-4">
              <SectionHeader
                icon={Lock}
                title="Quyền riêng tư cá nhân"
                description="Thiết lập phạm vi hiển thị và quyền tương tác của người dùng khác"
              />
              <div className="space-y-3">
                <SettingToggleItem
                  icon={Lock}
                  title="Tài khoản riêng tư"
                  description="Khi bật, chỉ những người bạn phê duyệt mới có thể xem nội dung bài viết và trang cá nhân."
                  enabled={settings.privateAccount}
                  onToggle={() => toggleSetting("privateAccount")}
                  disabled={true}
                  badge="Sắp có"
                  badgeVariant="default"
                />
                <SettingToggleItem
                  icon={Activity}
                  title="Trạng thái hoạt động"
                  description="Hiển thị dấu hiệu trực tuyến khi bạn đang hoạt động trên ConnectCG."
                  enabled={settings.activityStatus}
                  onToggle={() => toggleSetting("activityStatus")}
                  disabled={true}
                  badge="Sắp có"
                  badgeVariant="default"
                />
                <SettingToggleItem
                  icon={ChatCircle}
                  title="Thông báo đã đọc tin nhắn"
                  description="Cho người khác biết thời điểm bạn đã đọc tin nhắn trong cuộc hội thoại."
                  enabled={settings.showReadReceipts}
                  onToggle={() => toggleSetting("showReadReceipts")}
                  disabled={true}
                  badge="Sắp có"
                  badgeVariant="default"
                />
              </div>
            </Card>

            {/* 2. AI & AUTOMATION */}
            <Card className="p-6 bg-surface-main border-0 space-y-4">
              <SectionHeader
                icon={Lightning}
                title="Trí tuệ nhân tạo & Kiểm duyệt"
                description="Bảo vệ tự động và cá nhân hóa trải nghiệm với ConnectCG AI"
              />
              <div className="space-y-3">
                <SettingToggleItem
                  icon={Shield}
                  title="Lọc nội dung độc hại bằng AI"
                  description="Hệ thống AI tự động phân tích và gắn cờ nội dung vi phạm chuẩn mực văn minh cộng đồng."
                  enabled={settings.aiFiltering}
                  onToggle={() => toggleSetting("aiFiltering")}
                  disabled={true}
                  badge="Hệ thống tự động"
                  badgeVariant="default"
                />
                <SettingToggleItem
                  icon={UserCheck}
                  title="Tự động gợi ý bạn bè thông minh"
                  description="Sử dụng mô hình phân tích ngữ nghĩa để đề xuất những kết nối học tập và công việc phù hợp."
                  enabled={settings.allowTagging}
                  onToggle={() => toggleSetting("allowTagging")}
                  disabled={true}
                  badge="Sắp có"
                  badgeVariant="default"
                />
              </div>
            </Card>

            {/* 3. ACTIVE SESSIONS & DANGER ZONE */}
            <Card className="p-6 bg-surface-main border-0 space-y-4">
              <SectionHeader
                icon={DeviceMobile}
                title="Quản lý phiên đăng nhập"
                description="Bảo vệ tài khoản bằng cách chấm dứt các phiên đăng nhập từ xa khi phát hiện bất thường"
              />
              <div className="p-4 rounded-xl border-0 bg-red-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-text-main">
                    Đăng xuất khỏi tất cả thiết bị
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Hủy tất cả các phiên đăng nhập hiện tại trên máy tính, điện thoại hoặc trình duyệt khác.
                  </p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowLogoutModal(true)}
                  className="shrink-0"
                >
                  Đăng xuất tất cả
                </Button>
              </div>
            </Card>
          </div>

          {/* SIDEBAR COLUMN (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* ACCOUNT SECURITY SHORTCUTS */}
            <Card className="p-5 bg-surface-main border-0 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Bảo mật tài khoản
              </h3>
              <div className="space-y-2">
                <SecurityActionItem
                  icon={LockOpen}
                  title="Xác thực 2 yếu tố (2FA)"
                  status="Sắp có"
                  disabled={true}
                />
                <SecurityActionItem
                  icon={UserMinus}
                  title="Danh sách người dùng đã chặn"
                  status="Chưa có người dùng nào"
                  disabled={true}
                />
                <SecurityActionItem
                  icon={Trash}
                  title="Quản lý & Tải xuống dữ liệu"
                  status="Sắp có"
                  disabled={true}
                />
              </div>
            </Card>

            {/* SECURITY TIP CARD */}
            <Card className="p-5 bg-surface-subtle/50 border-0 space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-primary/10 border-0 flex items-center justify-center shrink-0 text-primary">
                  <WarningCircle size={20} weight="bold" />
                </div>
                <h4 className="text-sm font-bold text-text-main">
                  Lời khuyên bảo mật
                </h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                ConnectCG khuyến nghị thay đổi mật khẩu định kỳ 3 tháng một lần và không chia sẻ mật khẩu của bạn với bất kỳ ai để đảm bảo an toàn tối đa.
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => navigate("/dashboard/settings")}
              >
                Cài đặt tài khoản
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* CONFIRM LOGOUT ALL DIALOG */}
      <ConfirmDialog
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutAll}
        isLoading={isLoggingOut}
        title="Đăng xuất khỏi tất cả thiết bị?"
        message="Thao tác này sẽ hủy tất cả các phiên đăng nhập khác của bạn trên mọi thiết bị và trình duyệt. Bạn sẽ cần phải đăng nhập lại."
        confirmText="Đăng xuất tất cả"
        cancelText="Hủy bỏ"
        type="danger"
      />
    </div>
  );
}
