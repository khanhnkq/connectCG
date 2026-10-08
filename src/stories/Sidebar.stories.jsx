import React from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { MockAppProviders } from "./mocks/MockAppProviders";

export default {
  title: "Layout/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Modern Flat Unified Sidebar:**\n- Hợp nhất dùng chung cho cả User & Admin (phân biệt qua `variant='user' | 'admin'`).\n- Hỗ trợ chế độ Mở rộng (256px) và Thu gọn (80px icon-only) qua nút bấm toggle phẳng.\n- Phẳng 100% (0px shadow, 0px blur, 1px crisp border).\n- Khối người dùng chân trang với Avatar tự động fallback initials.",
      },
    },
  },
  decorators: [
    (Story) => (
      <MockAppProviders initialEntries={["/dashboard/feed"]}>
        <div className="h-[640px] flex bg-background-main border-0 shadow-lg rounded-2xl overflow-hidden p-2">
          <Story />
          <div className="flex-1 p-6 text-text-muted flex items-center justify-center text-sm font-medium">
            Khu vực nội dung trang chính (Main Content Area)
          </div>
        </div>
      </MockAppProviders>
    ),
  ],
};

export const UserSidebarExpanded = {
  name: "User Sidebar: Mở rộng (Expanded 256px)",
  args: {
    variant: "user",
    defaultCollapsed: false,
  },
};

export const UserSidebarCollapsed = {
  name: "User Sidebar: Thu gọn (Collapsed 80px)",
  args: {
    variant: "user",
    defaultCollapsed: true,
  },
};

export const AdminSidebarExpanded = {
  name: "Admin Sidebar: Mở rộng (Expanded 256px)",
  args: {
    variant: "admin",
    defaultCollapsed: false,
  },
};

export const AdminSidebarCollapsed = {
  name: "Admin Sidebar: Thu gọn (Collapsed 80px)",
  args: {
    variant: "admin",
    defaultCollapsed: true,
  },
};
