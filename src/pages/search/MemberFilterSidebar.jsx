import React from "react";
import CitySelect from "../../components/common/CitySelect";
import { Search, Filter, RefreshCw } from "lucide-react";

const MemberFilterSidebar = ({
  keyword,
  setKeyword,
  cityCode,
  setCityCode,
  maritalStatus,
  setMaritalStatus,
  lookingFor,
  setLookingFor,
  onReset,
  className = "",
}) => {
  return (
    <aside
      className={`w-full lg:w-[280px] flex-shrink-0 space-y-6 ${className}`}
    >
      <div className="bg-surface-main rounded-2xl border border-border-main p-5 shadow-sm sticky top-20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-text-main flex items-center gap-2">
            <Filter size={18} className="text-primary" />
            Bộ lọc
          </h3>
          <button
            onClick={onReset}
            className="text-xs font-medium text-text-secondary hover:text-primary flex items-center gap-1 transition-colors"
          >
            <RefreshCw size={12} />
            Đặt lại
          </button>
        </div>

        <div className="space-y-4">
          {/* Keyword */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-secondary">
              Từ khóa
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary h-4 w-4" />
              <input
                className="w-full h-10 bg-background-main border border-border-main rounded-lg pl-9 pr-3 text-sm text-text-main placeholder-text-secondary/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                placeholder="Tên"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-secondary">
              Thành phố
            </label>
            <CitySelect
              label=""
              value={cityCode ? { code: cityCode, name: "" } : null}
              onChange={(city) => setCityCode(city.code)}
              error={null}
              className="text-sm"
            />
          </div>

          {/* Marital Status */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-secondary">
              Tình trạng hôn nhân
            </label>
            <select
              value={maritalStatus}
              onChange={(e) => setMaritalStatus(e.target.value)}
              className="w-full h-10 bg-background-main border border-border-main rounded-lg px-3 text-sm text-text-main focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 cursor-pointer"
            >
              <option value="">Tất cả</option>
              <option value="SINGLE">Độc thân</option>
              <option value="MARRIED">Đã kết hôn</option>
              <option value="DIVORCED">Đã ly hôn</option>
              <option value="WIDOWED">Góa</option>
            </select>
          </div>

          {/* Looking For */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-secondary">
              Mục đích
            </label>
            <select
              value={lookingFor}
              onChange={(e) => setLookingFor(e.target.value)}
              className="w-full h-10 bg-background-main border border-border-main rounded-lg px-3 text-sm text-text-main focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 cursor-pointer"
            >
              <option value="">Tất cả</option>
              <option value="love">Tìm tình yêu</option>
              <option value="friends">Kết bạn</option>
              <option value="networking">Kết nối</option>
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default MemberFilterSidebar;
