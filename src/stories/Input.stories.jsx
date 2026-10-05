import React from "react";
import { Input, Textarea } from "../components/ui/input/Input";
import { MagnifyingGlass, Envelope, Lock } from "@phosphor-icons/react";

export default {
  title: "Design System/Input",
  component: Input,
  tags: ["autodocs"],
};

export const Basic = {
  args: {
    label: "Họ và tên",
    placeholder: "Nhập họ và tên của bạn...",
  },
};

export const WithIcons = {
  render: () => (
    <div className="max-w-sm space-y-4">
      <Input
        label="Tìm kiếm thành viên"
        placeholder="Nhập tên hoặc email..."
        leftIcon={MagnifyingGlass}
      />
      <Input
        label="Địa chỉ Email"
        type="email"
        placeholder="name@example.com"
        leftIcon={Envelope}
      />
      <Input
        label="Mật khẩu"
        type="password"
        placeholder="••••••••"
        leftIcon={Lock}
      />
    </div>
  ),
};

export const ErrorState = {
  args: {
    label: "Email",
    defaultValue: "invalid-email@",
    error: "Địa chỉ email không hợp lệ. Vui lòng kiểm tra lại.",
    leftIcon: Envelope,
  },
};

export const TextareaField = {
  render: () => (
    <div className="max-w-md">
      <Textarea
        label="Nội dung bài viết"
        placeholder="Bạn đang nghĩ gì thế? Chia sẻ cùng cộng đồng..."
        rows={4}
        helperText="Tối đa 5000 ký tự"
      />
    </div>
  ),
};
