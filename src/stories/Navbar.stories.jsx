import React from "react";
import { Navbar } from "../components/layout/Navbar";
import { MockAppProviders } from "./mocks/MockAppProviders";

export default {
  title: "Layout/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "**Modern Flat Unified Navbar:**\n- Hợp nhất dùng chung cho cả User & Admin (phân biệt qua `variant='user' | 'admin'`).\n- Cố định trên cùng (sticky top-0).\n- Phẳng 100% (0px shadow, 0px blur, viền 1px crisp border).\n- Tuân thủ quy chuẩn: Các nút bấm icon-only không có chữ, nút có chữ không có icon.",
      },
    },
  },
  decorators: [
    (Story) => (
      <MockAppProviders initialEntries={["/dashboard/feed"]}>
        <div className="w-full min-h-[160px] bg-background-main border-0 shadow-lg rounded-2xl overflow-hidden">
          <Story />
        </div>
      </MockAppProviders>
    ),
  ],
};

export const UserNavbarStory = {
  name: "User Navbar (Bảng tin người dùng)",
  args: {
    variant: "user",
    brandName: "Connect",
  },
};

export const AdminNavbarStory = {
  name: "Admin Navbar (Cổng quản trị)",
  args: {
    variant: "admin",
    title: "Quản lý nhóm cộng đồng",
    brandName: "Connect Admin",
  },
};
