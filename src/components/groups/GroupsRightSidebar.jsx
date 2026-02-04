import React from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function GroupsRightSidebar({
  searchQuery,
  setSearchQuery,
  activeTab,
  displayedGroupsLength,
}) {
  return (
    <aside className="w-80 hidden xl:flex flex-col border-l border-border-main bg-background-main p-6 h-[calc(100vh-64px)] sticky top-0 shrink-0 z-40 transition-colors duration-300">
      <div className="mb-8 group">
        <label className="text-sm font-bold text-text-secondary mb-2 block uppercase tracking-wider">
          Tìm kiếm nhóm
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search
              className="text-text-secondary group-focus-within:text-primary transition-colors"
              size={20}
            />
          </div>
          <input
            className="block w-full pl-12 pr-4 py-3.5 border border-border-main rounded-2xl leading-5 bg-surface-main text-text-main placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-main/90 transition-all sm:text-sm font-medium"
            placeholder={
              activeTab === "my"
                ? "Tìm kiếm nhóm của bạn..."
                : activeTab === "discover"
                ? "Khám phá nhóm mới..."
                : "Tìm lời mời..."
            }
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-text-main font-bold text-base tracking-wide">
            Thống kê
          </h3>
        </div>
        <div className="bg-surface-main rounded-2xl p-4 border border-border-main">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-sm font-medium">
              Đang hiển thị
            </span>
            <span className="text-text-main font-bold">
              {displayedGroupsLength} nhóm
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-secondary text-sm font-medium">
              Chế độ
            </span>
            <span className="text-primary font-bold uppercase text-xs">
              {activeTab === "my"
                ? "Của tôi"
                : activeTab === "discover"
                ? "Khám phá"
                : "Lời mời"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
          <h4 className="font-bold text-primary mb-2">Tạo cộng đồng mới</h4>
          <p className="text-xs text-text-secondary mb-4">
            Kết nối với mọi người có cùng sở thích ngay hôm nay.
          </p>
          <Link
            to="/dashboard/groups/create"
            className="block w-full py-2.5 rounded-xl bg-primary text-text-main font-black text-xs uppercase tracking-widest text-center shadow-lg shadow-primary/20 hover:bg-orange-600 transition-all active:scale-95"
          >
            Tạo nhóm ngay
          </Link>
        </div>
      </div>
    </aside>
  );
}
