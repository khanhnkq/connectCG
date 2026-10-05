import React from "react";
import { Button, IconButton } from "../components/ui/button/Button";
import { Plus, Trash2, Send, MoreHorizontal, Heart, Search, Bell, Settings } from "lucide-react";

export default {
  title: "Design System/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Quy chuẩn Hệ thống (System Rule):**\n- **Nút có chữ thì KHÔNG có icon** (Text-Only Button).\n- **Nút có icon thì KHÔNG có chữ** (Icon-Only Button với `aria-label`).",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    isLoading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

// 1. TEXT-ONLY BUTTONS (Chỉ có chữ)
export const TextOnlyPrimary = {
  name: "Text-Only: Primary (Cam)",
  args: {
    children: "Tạo bài viết",
    variant: "primary",
    size: "md",
  },
};

export const TextOnlySecondary = {
  name: "Text-Only: Secondary",
  args: {
    children: "Chỉnh sửa thông tin",
    variant: "secondary",
    size: "md",
  },
};

export const TextOnlyDanger = {
  name: "Text-Only: Danger",
  args: {
    children: "Xóa bài viết",
    variant: "danger",
    size: "md",
  },
};

export const TextOnlyLoading = {
  name: "Text-Only: Đang xử lý",
  args: {
    children: "Lưu thay đổi",
    variant: "primary",
    isLoading: true,
    loadingText: "Đang lưu...",
  },
};

// 2. ICON-ONLY BUTTONS (Chỉ có icon, không có chữ)
export const IconOnlyButtons = {
  name: "Icon-Only Buttons (Chuẩn hình khối bo tròn)",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {/* Primary Icon Button */}
      <IconButton icon={Plus} variant="primary" aria-label="Thêm bài viết" />

      {/* Secondary Search Icon Button */}
      <IconButton icon={Search} variant="secondary" aria-label="Tìm kiếm" />

      {/* Ghost More Icon Button */}
      <IconButton icon={MoreHorizontal} variant="ghost" aria-label="Tùy chọn khác" />

      {/* Danger Trash Icon Button */}
      <IconButton icon={Trash2} variant="danger" aria-label="Xóa" />

      {/* Outline Settings Icon Button */}
      <IconButton icon={Settings} variant="outline" aria-label="Cài đặt" />

      {/* Ghost Notification Icon Button */}
      <IconButton icon={Bell} variant="ghost" aria-label="Thông báo" />

      {/* Loading Icon Button */}
      <IconButton icon={Send} variant="primary" isLoading aria-label="Đang gửi" />
    </div>
  ),
};

export const IconSizes = {
  name: "Icon-Only: Các kích thước (sm / md / lg)",
  render: () => (
    <div className="flex items-center gap-3">
      <IconButton icon={Plus} size="sm" variant="primary" aria-label="Thêm nhỏ" />
      <IconButton icon={Plus} size="md" variant="primary" aria-label="Thêm vừa" />
      <IconButton icon={Plus} size="lg" variant="primary" aria-label="Thêm lớn" />
    </div>
  ),
};
