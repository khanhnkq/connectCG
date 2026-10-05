import React from "react";
import { Badge } from "../components/ui/badge/Badge";
import { CheckCircle2, AlertTriangle, ShieldCheck, Clock } from "lucide-react";

export default {
  title: "Design System/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "success", "warning", "danger", "info"],
    },
    size: {
      control: "select",
      options: ["sm", "md"],
    },
  },
};

export const AllVariants = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="default">Mặc định</Badge>
      <Badge variant="primary" icon={ShieldCheck}>Admin</Badge>
      <Badge variant="success" icon={CheckCircle2}>Đã duyệt</Badge>
      <Badge variant="warning" icon={Clock}>Chờ duyệt</Badge>
      <Badge variant="danger">Đã khóa</Badge>
      <Badge variant="info">Công khai</Badge>
    </div>
  ),
};
