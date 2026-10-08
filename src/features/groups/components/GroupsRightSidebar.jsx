import React from "react";
import { MagnifyingGlass as Search } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { Card } from "../../../components/ui/card/Card";
import { Input } from "../../../components/ui/input/Input";
import { Badge } from "../../../components/ui/badge/Badge";
import { Button } from "../../../components/ui/button/Button";

/**
 * Modern Flat GroupsRightSidebar Component
 * Provides clean search, quick stats, and create group CTA
 */
export function GroupsRightSidebar({
  searchQuery,
  setSearchQuery,
  activeTab,
  displayedGroupsLength,
}) {
  const getTabLabel = () => {
    switch (activeTab) {
      case "my":
        return "Của tôi";
      case "discover":
        return "Khám phá";
      case "invites":
        return "Lời mời";
      default:
        return "Tất cả";
    }
  };

  const getPlaceholder = () => {
    switch (activeTab) {
      case "my":
        return "Tìm nhóm của bạn...";
      case "discover":
        return "Khám phá nhóm mới...";
      case "invites":
        return "Tìm lời mời...";
      default:
        return "Tìm kiếm nhóm...";
    }
  };

  return (
    <aside className="w-80 hidden xl:flex flex-col bg-background-main p-6 h-[calc(100vh-64px)] sticky top-0 shrink-0 z-40 transition-colors select-none">
      {/* Search Widget */}
      <div className="mb-6">
        <Input
          id="groups-sidebar-search"
          label="Tìm kiếm nhóm"
          leftIcon={Search}
          placeholder={getPlaceholder()}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Stats Widget */}
      <div className="mb-6">
        <h3 className="text-text-main font-bold text-xs uppercase tracking-wider mb-3">
          Thống kê
        </h3>
        <Card className="rounded-2xl p-4 border-0 bg-surface-main space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary font-medium">Đang hiển thị</span>
            <span className="text-text-main font-bold">{displayedGroupsLength} nhóm</span>
          </div>
          <div className="h-px bg-surface-subtle" />
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary font-medium">Chế độ xem</span>
            <Badge variant="primary" size="sm" className="rounded-md font-bold">
              {getTabLabel()}
            </Badge>
          </div>
        </Card>
      </div>

      {/* CTA Box */}
      <div className="mt-auto">
        <Card className="p-4 rounded-2xl bg-surface-main border-0 space-y-3 shadow-sm">
          <div>
            <h4 className="font-bold text-sm text-text-main">Tạo cộng đồng mới</h4>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
              Kết nối với mọi người có cùng đam mê và chuyên môn ngay hôm nay.
            </p>
          </div>
          <Link to="/dashboard/groups/create" className="block w-full">
            <Button variant="primary" size="md" className="w-full rounded-xl">
              Tạo nhóm ngay
            </Button>
          </Link>
        </Card>
      </div>
    </aside>
  );
}

export default GroupsRightSidebar;
