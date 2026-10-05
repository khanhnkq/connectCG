import React, { useEffect, useState, useRef } from "react";
import { CaretDown, Check, MagnifyingGlass } from "@phosphor-icons/react";
import CityService from "../../../services/CityService";

/**
 * CityCombobox: Chọn Tỉnh / Thành phố phẳng Modern Flat
 * - 0px blur, 0px drop shadow, viền 1px crisp
 * - Tìm kiếm nhanh theo từ khóa
 */
export default function CityCombobox({
  value,
  onChange,
  error,
  disabled = false,
  label = "Tỉnh / Thành phố",
}) {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCities = async () => {
      try {
        const data = await CityService.getAllCities();
        if (isMounted) {
          const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
          setCities(sorted);
        }
      } catch (err) {
        console.error("Failed to load cities", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchCities();
    return () => {
      isMounted = false;
    };
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCityName = value?.name || "";

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (city) => {
    onChange?.({ code: city.code, name: city.name });
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="w-full space-y-1.5 relative">
      {label && (
        <label className="block text-xs font-bold text-text-main select-none">
          {label} <span className="text-danger">*</span>
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          disabled={disabled || loading}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-10 px-3.5 bg-surface-main text-sm rounded-xl border flex items-center justify-between text-left transition-colors select-none ${
            error
              ? "border-danger focus:ring-1 focus:ring-danger"
              : isOpen
              ? "border-primary ring-1 ring-primary"
              : "border-border-main hover:border-border-strong"
          } disabled:bg-surface-subtle disabled:cursor-not-allowed`}
        >
          <span
            className={`truncate ${
              selectedCityName ? "text-text-main font-medium" : "text-text-muted"
            }`}
          >
            {loading
              ? "Đang tải danh sách..."
              : selectedCityName || "Chọn tỉnh/thành phố..."}
          </span>
          <CaretDown
            size={16}
            className={`text-text-muted transition-transform shrink-0 ${
              isOpen ? "rotate-180 text-primary" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-surface-main border border-border-main rounded-xl p-1.5 shadow-none max-h-60 flex flex-col animate-in fade-in duration-100">
            {/* Search Input trong Dropdown */}
            <div className="relative p-1 border-b border-border-main mb-1">
              <MagnifyingGlass
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tên tỉnh/thành..."
                autoFocus
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface-subtle text-text-main rounded-lg outline-none placeholder:text-text-muted"
              />
            </div>

            <div className="overflow-y-auto space-y-0.5 max-h-44 custom-scrollbar">
              {filteredCities.length > 0 ? (
                filteredCities.map((city) => {
                  const isSelected = value?.code === city.code;
                  return (
                    <button
                      key={city.code}
                      type="button"
                      onClick={() => handleSelect(city)}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors text-left cursor-pointer ${
                        isSelected
                          ? "bg-primary/10 text-primary font-bold"
                          : "text-text-secondary hover:bg-surface-subtle hover:text-text-main"
                      }`}
                    >
                      <span className="truncate">{city.name}</span>
                      {isSelected && (
                        <Check size={14} className="text-primary shrink-0" />
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="p-3 text-center text-xs text-text-muted">
                  Không tìm thấy "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-danger font-medium leading-none">{error}</p>
      )}
    </div>
  );
}
